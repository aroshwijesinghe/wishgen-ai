from io import BytesIO

from fastapi import HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from app.utils.file_utils import build_unique_filename, ensure_asset_dirs, static_upload_dir

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


async def validate_uploaded_image(image: UploadFile) -> bytes:
    """Validate that the upload is a readable image and return its bytes."""
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Please upload a JPG, PNG, or WebP image.")

    content = await image.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded image is empty.")

    try:
        Image.open(BytesIO(content)).verify()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.")

    return content


async def save_uploaded_image(image: UploadFile):
    """Save the uploaded photo and return its local path."""
    ensure_asset_dirs()
    content = await validate_uploaded_image(image)
    filename = build_unique_filename(image.filename or "birthday-photo.jpg")
    destination = static_upload_dir() / filename

    destination.write_bytes(content)

    return destination
