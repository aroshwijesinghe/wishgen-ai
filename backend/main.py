from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes.card_routes import router as card_router
from app.utils.file_utils import generated_cards_dir

app = FastAPI(title="WishGen AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/api/generated-cards", StaticFiles(directory=generated_cards_dir()), name="generated-cards")
app.include_router(card_router)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "WishGen AI backend is running"}
