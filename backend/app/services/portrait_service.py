from pathlib import Path

import numpy as np
from PIL import Image

from app.utils.file_utils import build_unique_filename, processed_dir


def create_upper_body_portrait(image_path: Path) -> Path:
    """Crop a transparent upper-body portrait using the alpha mask bounds."""
    image = Image.open(image_path).convert("RGBA")
    alpha = np.array(image.getchannel("A"))
    visible_pixels = np.argwhere(alpha > 0)

    if visible_pixels.size == 0:
        output_path = processed_dir() / build_unique_filename(f"{image_path.stem}-portrait.png")
        image.save(output_path, format="PNG")
        return output_path

    y_values = visible_pixels[:, 0]
    x_values = visible_pixels[:, 1]
    mask_top = int(y_values.min())
    mask_bottom = int(y_values.max())
    mask_left = int(x_values.min())
    mask_right = int(x_values.max())

    mask_height = max(1, mask_bottom - mask_top)
    mask_width = max(1, mask_right - mask_left)
    image_width, image_height = image.size

    top_padding = int(mask_height * 0.12)
    side_padding = int(mask_width * 0.08)

    top = max(0, mask_top - top_padding)
    left = max(0, mask_left - side_padding)
    right = min(image_width, mask_right + side_padding)
    bottom = int(mask_top + (mask_height * 0.62))

    if bottom - top < mask_height * 0.35:
        bottom = int(mask_top + (mask_height * 0.70))

    bottom = min(image_height, max(bottom, top + 1))
    crop = image.crop((left, top, right, bottom))
    crop = _add_transparent_padding(crop)

    output_path = processed_dir() / build_unique_filename(f"{image_path.stem}-portrait.png")
    crop.save(output_path, format="PNG")
    return output_path


def _add_transparent_padding(image: Image.Image) -> Image.Image:
    width, height = image.size
    pad_x = max(16, int(width * 0.08))
    pad_top = max(20, int(height * 0.10))
    pad_bottom = max(12, int(height * 0.04))

    padded = Image.new("RGBA", (width + (pad_x * 2), height + pad_top + pad_bottom), (0, 0, 0, 0))
    padded.paste(image, (pad_x, pad_top), image)
    return padded
