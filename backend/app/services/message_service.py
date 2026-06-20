def generate_birthday_message(name: str, age: int, relationship: str, theme: str) -> str:
    """Generate a simple English birthday message without paid APIs."""
    clean_name = name.strip().title() or "You"
    clean_relationship = relationship.strip().lower() or "friend"
    clean_theme = theme.strip().lower() or "birthday"

    relationship_lines = {
        "mother": "Your love makes every day brighter.",
        "father": "Your strength and kindness inspire everyone around you.",
        "sister": "Life is more joyful with your laughter in it.",
        "brother": "Your energy and heart make every celebration better.",
        "partner": "You make life sweeter, warmer, and full of meaning.",
        "colleague": "Wishing you success, joy, and a brilliant year ahead.",
        "friend": "Your friendship is a gift worth celebrating."
    }

    age_line = f"Cheers to {age} wonderful years." if age > 0 else "Cheers to another wonderful year."
    relationship_line = relationship_lines.get(clean_relationship, relationship_lines["friend"])
    theme_line = f"May your day feel {clean_theme}, bright, and unforgettable."

    return f"Happy Birthday, {clean_name}! {age_line} {relationship_line} {theme_line}"
