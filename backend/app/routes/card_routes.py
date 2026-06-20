from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.wish_service import generate_birthday_wish

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
