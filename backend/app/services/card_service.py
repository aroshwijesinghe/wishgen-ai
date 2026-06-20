from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont

from app.utils.file_utils import build_unique_filename, ensure_asset_dirs, generated_cards_dir

THEME_COLORS = {
    "classic": {"background": "#f7f2e8", "accent": "#2f5d62", "text": "#1f2933"},
    "fun": {"background": "#fff1f2", "accent": "#db2777", "text": "#2d1b2f"},
    "elegant": {"background": "#f4f1ff", "accent": "#5b21b6", "text": "#20134a"},
    "kids": {"background": "#ecfeff", "accent": "#0891b2", "text": "#164e63"},
    "romantic": {"background": "#fff7ed", "accent": "#c2410c", "text": "#431407"},
}


def create_birthday_card(image_path: Path, name: str, message: str, theme: str) -> Path:
    """Create a simple birthday card image with Pillow."""
    ensure_asset_dirs()
    colors = THEME_COLORS.get(theme, THEME_COLORS["fun"])
    card_width, card_height = 1200, 800

    card = Image.new("RGB", (card_width, card_height), colors["background"])
    draw = ImageDraw.Draw(card)

    title_font = _load_font(size=64, bold=True)
    message_font = _load_font(size=34, bold=False)
    small_font = _load_font(size=26, bold=False)

    draw.rectangle((0, 0, card_width, 92), fill=colors["accent"])
    draw.text((52, 22), "WishGen AI", fill="#ffffff", font=small_font)

    photo = _prepare_photo(image_path)
    card.paste(photo, (64, 150))

    draw.text((590, 170), f"Happy Birthday, {name.strip().title()}!", fill=colors["accent"], font=title_font)

    y_position = 280
    for line in wrap(message, width=32):
        draw.text((594, y_position), line, fill=colors["text"], font=message_font)
        y_position += 48

    draw.rounded_rectangle((594, 612, 1090, 690), radius=28, fill=colors["accent"])
    draw.text((630, 632), "Made with love", fill="#ffffff", font=small_font)

    output_name = build_unique_filename(f"{name or 'birthday'}-card.png")
    output_path = generated_cards_dir() / output_name
    card.save(output_path, format="PNG")

    return output_path


def _prepare_photo(image_path: Path) -> Image.Image:
    photo = Image.open(image_path).convert("RGB")
    photo.thumbnail((430, 520))

    frame = Image.new("RGB", (450, 540), "#ffffff")
    x = (frame.width - photo.width) // 2
    y = (frame.height - photo.height) // 2
    frame.paste(photo, (x, y))

    return frame


def _load_font(size: int, bold: bool) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    font_names = ["arialbd.ttf", "Arial Bold.ttf"] if bold else ["arial.ttf", "Arial.ttf"]

    for font_name in font_names:
        try:
            return ImageFont.truetype(font_name, size=size)
        except OSError:
            continue

    return ImageFont.load_default()
