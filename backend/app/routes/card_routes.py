from fastapi import APIRouter, File, Form, UploadFile

from app.services.card_service import create_birthday_card
from app.services.image_service import save_uploaded_image
from app.services.message_service import generate_birthday_message
from app.services.theme_service import select_theme

router = APIRouter()


@router.post("/api/generate-card")
async def generate_card(
    image: UploadFile = File(...),
    name: str = Form(...),
    age: int = Form(0),
    relationship: str = Form("friend"),
    language: str = Form("English"),
    theme: str = Form("auto"),
):
    saved_image_path = await save_uploaded_image(image)
    selected_theme = select_theme(age=age, relationship=relationship, requested_theme=theme)
    message = generate_birthday_message(
        name=name,
        age=age,
        relationship=relationship,
        language=language,
    )
    card_path = create_birthday_card(
        image_path=saved_image_path,
        name=name,
        message=message,
        theme=selected_theme,
    )

    return {
        "status": "success",
        "name": name,
        "age": age,
        "relationship": relationship,
        "language": language,
        "theme": selected_theme,
        "message": message,
        "card_url": f"/api/generated-cards/{card_path.name}",
    }
