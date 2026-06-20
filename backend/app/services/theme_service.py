def select_theme(age: int, relationship: str, requested_theme: str) -> str:
    """Pick a lightweight theme now; later this can use AI recommendations."""
    requested = requested_theme.strip().lower()

    if requested and requested != "auto":
        return requested

    relationship_key = relationship.strip().lower()

    if age and age <= 12:
        return "kids"

    if relationship_key == "partner":
        return "romantic"

    if relationship_key in {"mother", "father"}:
        return "elegant"

    if relationship_key == "colleague":
        return "classic"

    return "fun"
