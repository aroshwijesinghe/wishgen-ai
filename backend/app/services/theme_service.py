def select_theme(age: int, relationship: str, requested_theme: str) -> str:
    """Pick a lightweight theme now; later this can use AI recommendations."""
    requested = requested_theme.strip().lower()

    if requested and requested != "auto":
        return requested

    if age and age < 13:
        return "colorful"

    if age and age <= 25:
        return "vibrant"

    if age and age > 25:
        return "classic"

    return "fun"
