import json
from pathlib import Path
from typing import Any

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile

from app.services.ai_card_planner_service import ALLOWED_OBJECTS, generate_ai_card_plan
from app.services.background_service import remove_background
from app.services.card_service import create_birthday_card
from app.services.image_service import save_uploaded_image
from app.services.portrait_service import create_upper_body_portrait
from app.services.theme_plan_service import CARD_TYPES, CARD_TYPE_LABELS, get_theme_plan
from app.utils.file_utils import static_url

router = APIRouter()

LEGACY_THEME_TO_CARD_TYPE = {
    "classic": "luxury",
    "colorful": "cute",
    "elegant": "floral",
    "fun": "cute",
    "kids": "cute",
    "modern": "modern_dark",
    "modern dark": "modern_dark",
    "romantic": "floral",
    "vibrant": "modern_dark",
    "auto": "modern_dark",
}


@router.post("/api/process-image")
async def process_image(request: Request, image: UploadFile = File(...)):
    original_path = await save_uploaded_image(image)
    background_removed_path = _remove_background_or_fail(original_path)
    portrait_path = create_upper_body_portrait(background_removed_path)

    return {
        "success": True,
        "original_url": _absolute_static_url(request, original_path),
        "background_removed_url": _absolute_static_url(request, background_removed_path),
        "portrait_url": _absolute_static_url(request, portrait_path),
    }


@router.post("/api/plan-card")
async def plan_card(request: Request):
    data = await _read_plan_payload(request)
    plan_input = _validate_plan_input(data)

    return {
        "success": True,
        "ai_plan": generate_ai_card_plan(plan_input),
        "theme_plan": get_theme_plan(plan_input["card_type"]),
    }


@router.post("/api/generate-card")
async def generate_card(
    request: Request,
    image: UploadFile = File(...),
    name: str = Form(...),
    age: int = Form(..., ge=1, le=120),
    relationship: str = Form("friend"),
    occupation: str = Form(""),
    interesting_thing: str = Form(""),
    card_type: str = Form("modern_dark"),
    selected_objects: str = Form("cake"),
    theme: str = Form(""),
):
    resolved_card_type = _resolve_card_type(card_type, theme)
    plan_input = _validate_plan_input(
        {
            "name": name,
            "age": age,
            "relationship": relationship,
            "occupation": occupation,
            "interesting_thing": interesting_thing,
            "card_type": resolved_card_type,
            "selected_objects": selected_objects,
        }
    )

    original_path = await save_uploaded_image(image)
    background_removed_path = _remove_background_or_fail(original_path)
    portrait_path = create_upper_body_portrait(background_removed_path)
    ai_plan = generate_ai_card_plan(plan_input)
    theme_plan = get_theme_plan(plan_input["card_type"])
    card_path = create_birthday_card(
        image_path=portrait_path,
        name=plan_input["name"],
        message=ai_plan["main_wish"],
        theme=_theme_key_from_card_type(plan_input["card_type"]),
    )

    return {
        "success": True,
        "name": plan_input["name"],
        "age": plan_input["age"],
        "relationship": plan_input["relationship"],
        "card_type": plan_input["card_type"],
        "selected_objects": plan_input["selected_objects"],
        "original_url": _absolute_static_url(request, original_path),
        "background_removed_url": _absolute_static_url(request, background_removed_path),
        "portrait_url": _absolute_static_url(request, portrait_path),
        "card_url": static_url(card_path),
        "card_full_url": _absolute_static_url(request, card_path),
        "ai_plan": ai_plan,
        "theme_plan": theme_plan,
        "message": ai_plan["main_wish"],
        "selected_theme": plan_input["card_type"],
    }


async def _read_plan_payload(request: Request) -> dict[str, Any]:
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        return await request.json()

    form = await request.form()
    data = dict(form)
    repeated_objects = form.getlist("selected_objects")
    if len(repeated_objects) > 1:
        data["selected_objects"] = repeated_objects
    return data


def _validate_plan_input(data: dict[str, Any]) -> dict[str, Any]:
    name = str(data.get("name") or "").strip()
    if not name:
        raise HTTPException(status_code=422, detail="Name is required.")

    try:
        age = int(data.get("age"))
    except (TypeError, ValueError):
        raise HTTPException(status_code=422, detail="Age must be a positive whole number.")

    if age < 1 or age > 120:
        raise HTTPException(status_code=422, detail="Age must be between 1 and 120.")

    card_type = _normalize_card_type(str(data.get("card_type") or "modern_dark").strip())
    if card_type not in CARD_TYPES:
        raise HTTPException(status_code=422, detail=f"card_type must be one of: {', '.join(sorted(CARD_TYPES))}.")

    selected_objects = _parse_selected_objects(data.get("selected_objects"))
    if len(selected_objects) > 2:
        raise HTTPException(status_code=422, detail="Select a maximum of two objects.")

    invalid_objects = [object_name for object_name in selected_objects if object_name not in ALLOWED_OBJECTS]
    if invalid_objects:
        raise HTTPException(status_code=422, detail=f"Invalid selected object: {', '.join(invalid_objects)}.")

    if not selected_objects:
        selected_objects = ["cake"]

    return {
        "name": name,
        "age": age,
        "relationship": str(data.get("relationship") or "friend").strip(),
        "occupation": str(data.get("occupation") or "").strip(),
        "interesting_thing": str(data.get("interesting_thing") or "").strip(),
        "card_type": card_type,
        "selected_objects": selected_objects,
    }


def _parse_selected_objects(raw_value: Any) -> list[str]:
    if raw_value is None:
        return ["cake"]

    if isinstance(raw_value, list):
        return [str(item).strip() for item in raw_value if str(item).strip()]

    value = str(raw_value).strip()
    if not value:
        return ["cake"]

    if value.startswith("["):
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return [str(item).strip() for item in parsed if str(item).strip()]
        except json.JSONDecodeError:
            pass

    return [item.strip() for item in value.split(",") if item.strip()]


def _resolve_card_type(card_type: str, legacy_theme: str) -> str:
    normalized = _normalize_card_type(card_type)
    if normalized in CARD_TYPES:
        return normalized

    legacy_key = str(legacy_theme or card_type or "auto").strip().lower()
    return LEGACY_THEME_TO_CARD_TYPE.get(legacy_key, "modern_dark")


def _normalize_card_type(card_type: str) -> str:
    value = str(card_type or "").strip()
    if value in CARD_TYPES:
        return value

    by_label = {label.lower(): key for key, label in CARD_TYPE_LABELS.items()}
    return by_label.get(value.lower(), value)


def _theme_key_from_card_type(card_type: str) -> str:
    return {
        "modern_dark": "modern",
        "floral": "elegant",
        "cute": "fun",
        "luxury": "classic",
    }.get(card_type, "modern")


def _remove_background_or_fail(image_path: Path) -> Path:
    return remove_background(image_path)


def _absolute_static_url(request: Request, path: Path) -> str:
    return str(request.base_url).rstrip("/") + static_url(path)
