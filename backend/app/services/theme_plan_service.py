CARD_TYPES = {"modern_dark", "floral", "cute", "luxury"}

CARD_TYPE_LABELS = {
    "modern_dark": "Modern Dark",
    "floral": "Floral",
    "cute": "Cute",
    "luxury": "Luxury",
}

THEME_PLANS = {
    "modern_dark": {
        "colors": {
            "background": "dark teal to black gradient",
            "primary": "gold",
            "secondary": "white",
            "accent": "teal",
        },
        "fonts": {
            "headline": "Playfair Display / Georgia fallback",
            "name": "Great Vibes / cursive fallback",
            "body": "Inter / Arial fallback",
        },
        "layout": "bold editorial layout with a strong portrait focus and compact decorative object placement",
        "style_notes": "gold glossy details, confetti, cake, code accents, and premium contrast",
    },
    "floral": {
        "colors": {
            "background": "cream and pastel wash",
            "primary": "sage green",
            "secondary": "gold",
            "accent": "blush",
        },
        "fonts": {
            "headline": "Cormorant Garamond / Georgia fallback",
            "name": "Great Vibes / cursive fallback",
            "body": "Inter / Arial fallback",
        },
        "layout": "soft centered greeting-card layout with graceful framing around the portrait",
        "style_notes": "flowers, ribbons, soft cake, elegant borders, and gentle spacing",
    },
    "cute": {
        "colors": {
            "background": "pink and pastel gradient",
            "primary": "coral",
            "secondary": "purple",
            "accent": "yellow",
        },
        "fonts": {
            "headline": "Baloo 2 / rounded fallback",
            "name": "Pacifico / cursive fallback",
            "body": "Nunito / Arial fallback",
        },
        "layout": "playful layout with rounded shapes, cheerful object clusters, and room for short labels",
        "style_notes": "balloons, stars, hearts, gift box, cute cake, and light celebration details",
    },
    "luxury": {
        "colors": {
            "background": "black and cream",
            "primary": "gold",
            "secondary": "ivory",
            "accent": "champagne",
        },
        "fonts": {
            "headline": "Cinzel / Georgia fallback",
            "name": "Great Vibes / cursive fallback",
            "body": "Montserrat / Arial fallback",
        },
        "layout": "polished premium layout with generous spacing and refined object placement",
        "style_notes": "crown, ribbon, premium cake, fireworks, gold lines, and understated shine",
    },
}


def get_theme_plan(card_type: str) -> dict:
    selected = card_type if card_type in CARD_TYPES else "modern_dark"
    return {
        "card_type": selected,
        "label": CARD_TYPE_LABELS[selected],
        **THEME_PLANS[selected],
    }
