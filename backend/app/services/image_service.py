from fastapi import UploadFile

from app.utils.file_utils import build_unique_filename, ensure_asset_dirs, upload_dir


async def save_uploaded_image(image: UploadFile):
    """Save the uploaded photo and return its local path."""
    ensure_asset_dirs()
    filename = build_unique_filename(image.filename or "birthday-photo.jpg")
    destination = upload_dir() / filename

    content = await image.read()
    destination.write_bytes(content)

    return destination
