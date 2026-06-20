import json
import os
from typing import Any

ALLOWED_OBJECTS = {
    "cake",
    "balloons",
    "flowers",
    "gift_box",
    "candles",
    "crown",
    "confetti",
    "ribbon",
    "stars",
    "heart",
    "fireworks",
    "music_notes",
    "guitar",
    "book",
    "laptop",
    "code_symbol",
    "cricket_bat",
    "coffee_cup",
    "rocket",
    "trophy",
}

DEFAULT_MODEL = "llama-3.3-70b-versatile"

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass


def generate_ai_card_plan(details: dict[str, Any]) -> dict:
    """Generate a concise card text plan with Groq, falling back to local rules."""
    api_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("GROQ_MODEL", DEFAULT_MODEL)

    if not api_key:
        return _fallback_plan(details)

    try:
        from groq import Groq

        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": _system_prompt()},
                {"role": "user", "content": json.dumps(details, ensure_ascii=True)},
            ],
            temperature=0.8,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content or "{}"
        return _normalize_plan(json.loads(content), details)
    except Exception:
        return _fallback_plan(details)


def _system_prompt() -> str:
    return """
Return only valid JSON.
Write only in English.
The JSON keys must be: headline, name_text, main_wish, object_texts, short_tagline, decorative_words, tone.
Main wish must be 1 or 2 short sentences.
Main wish must be personalized using name, relationship, interesting thing, card type, and selected objects.
Do not directly print occupation. Use occupation only to infer creative phrases.
Object text must be 3 to 7 words.
Object text must feel natural, not artificial.
Object text should usually use the interesting thing when relevant.
Match card_type:
Modern Dark: cool, stylish, bold, slightly premium.
Floral: warm, graceful, soft, elegant.
Cute: playful, sweet, fun.
Luxury: classy, premium, polished.
Avoid cringe, robotic, generic phrases, long paragraphs, and emojis.
""".strip()


def _normalize_plan(plan: dict[str, Any], details: dict[str, Any]) -> dict:
    fallback = _fallback_plan(details)
    selected_objects = details.get("selected_objects") or []
    occupation = str(details.get("occupation") or "").strip()

    object_texts = plan.get("object_texts")
    if not isinstance(object_texts, dict):
        object_texts = {}

    clean_object_texts = {
        object_name: _short_text(str(object_texts.get(object_name) or fallback["object_texts"][object_name]))
        for object_name in selected_objects
    }

    decorative_words = plan.get("decorative_words")
    if not isinstance(decorative_words, list):
        decorative_words = fallback["decorative_words"]

    return {
        "headline": _remove_occupation(str(plan.get("headline") or fallback["headline"]), occupation),
        "name_text": _remove_occupation(str(plan.get("name_text") or fallback["name_text"]), occupation),
        "main_wish": _remove_occupation(str(plan.get("main_wish") or fallback["main_wish"]), occupation),
        "object_texts": {
            key: _remove_occupation(value, occupation) for key, value in clean_object_texts.items()
        },
        "short_tagline": _remove_occupation(str(plan.get("short_tagline") or fallback["short_tagline"]), occupation),
        "decorative_words": [_remove_occupation(str(word), occupation) for word in decorative_words[:3]],
        "tone": str(plan.get("tone") or fallback["tone"]),
    }


def _fallback_plan(details: dict[str, Any]) -> dict:
    name = str(details.get("name") or "Friend").strip().title()
    age = int(details.get("age") or 1)
    relationship = str(details.get("relationship") or "friend").strip().lower()
    card_type = str(details.get("card_type") or "Modern Dark")
    interesting = str(details.get("interesting_thing") or "making every moment brighter").strip()
    selected_objects = details.get("selected_objects") or ["cake"]
    interest_phrase = _interest_phrase(interesting)

    tone_map = {
        "Modern Dark": "cool, friendly, and inspiring",
        "Floral": "warm, graceful, and elegant",
        "Cute": "playful, sweet, and fun",
        "Luxury": "classy, premium, and polished",
    }
    object_texts = {object_name: _fallback_object_text(object_name, name, interesting) for object_name in selected_objects}

    return {
        "headline": "Happy Birthday",
        "name_text": f"{name}!",
        "main_wish": (
            f"Happy Birthday, {name}! May {age} bring bold little wins, bright memories, "
            f"and more of that {interest_phrase} spark your {relationship} circle loves."
        ),
        "object_texts": object_texts,
        "short_tagline": _fallback_tagline(card_type, selected_objects),
        "decorative_words": ["Dreamer", "Keep Shining", "Bright Wins"],
        "tone": tone_map.get(card_type, tone_map["Modern Dark"]),
    }


def _fallback_object_text(object_name: str, name: str, interesting: str) -> str:
    interesting_lower = interesting.lower()

    if "python" in interesting_lower and object_name in {"cake", "code_symbol", "laptop"}:
        if object_name == "cake":
            return f"{name}, the Python guy"
        if object_name == "code_symbol":
            return "Dreams loading in Python"
        return "Python ideas, bright wins"
    if object_name == "book":
        return "Stories worth celebrating"
    if object_name == "trophy":
        return "Wins keep coming"
    if object_name == "coffee_cup":
        return "Fueled for bright days"
    if object_name == "rocket":
        return "Next year launching"
    if object_name == "guitar":
        return "Good vibes only"
    return f"{name}'s bright day"


def _interest_phrase(interesting: str) -> str:
    value = interesting.strip()
    if not value:
        return "one-of-a-kind"

    lowered = value.lower()
    if lowered.startswith("loves "):
        return value[6:].strip() + "-loving"
    if lowered.startswith("likes "):
        return value[6:].strip() + "-loving"
    return value


def _fallback_tagline(card_type: str, selected_objects: list[str]) -> str:
    object_words = ", ".join(object_name.replace("_", " ") for object_name in selected_objects)
    if card_type == "Luxury":
        return f"Celebration with {object_words}."
    if card_type == "Cute":
        return f"Sweet moments and {object_words}!"
    if card_type == "Floral":
        return f"Warm wishes with {object_words}."
    return f"Style, smiles, and {object_words}!"


def _short_text(text: str) -> str:
    words = text.split()
    if len(words) < 3:
        return f"{text} shines today"
    if len(words) <= 7:
        return text
    return " ".join(words[:7])


def _remove_occupation(text: str, occupation: str) -> str:
    if not occupation:
        return text

    return text.replace(occupation, "").replace(occupation.title(), "").strip()
