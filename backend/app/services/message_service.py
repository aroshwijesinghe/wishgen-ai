def generate_birthday_message(name: str, age: int, relationship: str, language: str) -> str:
    """Generate a simple rule-based birthday message without paid APIs."""
    clean_name = name.strip().title() or "You"
    clean_relationship = relationship.strip().lower() or "friend"
    language_key = language.strip().lower()

    if language_key == "sinhala":
        return f"Suba upandinayak wewa, {clean_name}! Obata sathuta, saubhagya, saha adaraya pirunu awuruddak wewa."

    if language_key == "tamil":
        return f"Iniya pirantha naal vazhthukkal, {clean_name}! Sandhoshamum anbum niraintha aandaga irukkattum."

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

    return f"Happy Birthday, {clean_name}! {age_line} {relationship_line}"
