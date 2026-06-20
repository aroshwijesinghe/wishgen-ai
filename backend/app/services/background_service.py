from pathlib import Path

from PIL import Image

from app.utils.file_utils import build_unique_filename, processed_dir


def remove_background(image_path: Path) -> Path:
    """Remove the uploaded image background and save a transparent PNG."""
    try:
        from rembg import remove
    except ImportError as exc:
        raise RuntimeError("rembg is not installed. Run pip install -r requirements.txt.") from exc

    source = Image.open(image_path).convert("RGBA")
    result = remove(source)
    output_path = processed_dir() / build_unique_filename(f"{image_path.stem}-background-removed.png")
    result.save(output_path, format="PNG")
    return output_path
