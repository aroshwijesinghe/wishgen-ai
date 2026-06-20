from pathlib import Path
from uuid import uuid4

PROJECT_ROOT = Path(__file__).resolve().parents[3]
ASSETS_DIR = PROJECT_ROOT / "assets"
UPLOADS_DIR = ASSETS_DIR / "uploads"
GENERATED_CARDS_DIR = ASSETS_DIR / "generated-cards"
TEMPLATES_DIR = ASSETS_DIR / "templates"
BACKEND_DIR = PROJECT_ROOT / "backend"
STATIC_DIR = BACKEND_DIR / "static"
STATIC_UPLOADS_DIR = STATIC_DIR / "uploads"
STATIC_PROCESSED_DIR = STATIC_DIR / "processed"
STATIC_CARDS_DIR = STATIC_DIR / "cards"


def ensure_asset_dirs() -> None:
    """Create runtime asset directories if they do not exist yet."""
    for directory in (
        UPLOADS_DIR,
        GENERATED_CARDS_DIR,
        TEMPLATES_DIR,
        STATIC_UPLOADS_DIR,
        STATIC_PROCESSED_DIR,
        STATIC_CARDS_DIR,
    ):
        directory.mkdir(parents=True, exist_ok=True)


def upload_dir() -> Path:
    ensure_asset_dirs()
    return UPLOADS_DIR


def generated_cards_dir() -> Path:
    ensure_asset_dirs()
    return STATIC_CARDS_DIR


def static_dir() -> Path:
    ensure_asset_dirs()
    return STATIC_DIR


def static_upload_dir() -> Path:
    ensure_asset_dirs()
    return STATIC_UPLOADS_DIR


def processed_dir() -> Path:
    ensure_asset_dirs()
    return STATIC_PROCESSED_DIR


def static_url(path: Path) -> str:
    ensure_asset_dirs()
    return f"/static/{path.resolve().relative_to(STATIC_DIR.resolve()).as_posix()}"


def build_unique_filename(original_name: str) -> str:
    suffix = Path(original_name).suffix.lower() or ".png"
    stem = Path(original_name).stem.replace(" ", "-").lower() or "file"
    return f"{stem}-{uuid4().hex[:10]}{suffix}"
