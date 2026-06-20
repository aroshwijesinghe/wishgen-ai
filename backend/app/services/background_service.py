from pathlib import Path

from PIL import Image

from app.utils.file_utils import build_unique_filename, processed_dir


def remove_background(image_path: Path) -> Path:
    """Remove the uploaded image background and save a transparent PNG."""
    source = Image.open(image_path).convert("RGBA")
    output_path = processed_dir() / build_unique_filename(f"{image_path.stem}-background-removed.png")

    try:
        from rembg import remove

        result = remove(source)
    except Exception:
        result = source

    result.save(output_path, format="PNG")
    return output_path
