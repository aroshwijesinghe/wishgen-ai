from pathlib import Path
from uuid import uuid4

PROJECT_ROOT = Path(__file__).resolve().parents[3]
ASSETS_DIR = PROJECT_ROOT / "assets"
UPLOADS_DIR = ASSETS_DIR / "uploads"
GENERATED_CARDS_DIR = ASSETS_DIR / "generated-cards"
TEMPLATES_DIR = ASSETS_DIR / "templates"


def ensure_asset_dirs() -> None:
    """Create runtime asset directories if they do not exist yet."""
    for directory in (UPLOADS_DIR, GENERATED_CARDS_DIR, TEMPLATES_DIR):
        directory.mkdir(parents=True, exist_ok=True)


def upload_dir() -> Path:
    ensure_asset_dirs()
    return UPLOADS_DIR


def generated_cards_dir() -> Path:
    ensure_asset_dirs()
    return GENERATED_CARDS_DIR


def build_unique_filename(original_name: str) -> str:
    suffix = Path(original_name).suffix.lower() or ".png"
    stem = Path(original_name).stem.replace(" ", "-").lower() or "file"
    return f"{stem}-{uuid4().hex[:10]}{suffix}"
