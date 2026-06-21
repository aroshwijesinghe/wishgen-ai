from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel, Field

from app.services.wish_service import generate_birthday_wish, analyze_image

router = APIRouter()

TEMPLATE_IDS = {"modern_dark", "floral_elegance", "cute_pastel", "luxury_gold", "fun_party"}

class WishRequest(BaseModel):
    name: str = Field(..., min_length=1)
    age: int = Field(..., ge=1, le=120)
    relationship: str = "friend"
    personality: str = ""
    interesting_thing: str = ""
    sender_name: str = ""
    template: str = "modern_dark"

@router.post("/api/generate-wish")
async def generate_wish(payload: WishRequest):
    template = payload.template if payload.template in TEMPLATE_IDS else "modern_dark"
    wish = generate_birthday_wish({**payload.model_dump(), "template": template})
    return {"success": True, **wish}

@router.post("/api/analyze-image")
async def handle_analyze_image(file: UploadFile = File(...)):
    contents = await file.read()
    mime_type = file.content_type or "image/jpeg"
    recommendations = analyze_image(contents, mime_type)
    return {"success": True, "recommendations": recommendations}
