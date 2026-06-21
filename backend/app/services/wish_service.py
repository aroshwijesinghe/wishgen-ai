import json
import os
import re
import base64
from typing import Any

DEFAULT_MODEL = "llama-3.3-70b-versatile"
VISION_MODEL = "llama-3.2-11b-vision-preview"

TEMPLATE_TONES = {
    "modern_dark": "stylish, confident, cool, inspiring",
    "floral_elegance": "warm, graceful, soft, heartfelt",
    "cute_pastel": "playful, sweet, cheerful",
    "luxury_gold": "classy, polished, premium, elegant",
    "fun_party": "energetic, joyful, fun",
}

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass


def generate_birthday_wish(details: dict[str, Any]) -> dict[str, str]:
    api_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("GROQ_MODEL", DEFAULT_MODEL)

    if not api_key:
        return _fallback_wish(details)

    try:
        from groq import Groq

        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": _system_prompt()},
                {"role": "user", "content": json.dumps(_prompt_payload(details), ensure_ascii=True)},
            ],
            temperature=0.75,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content or "{}"
        return _normalize_wish(_parse_json_content(content), details)
    except Exception:
        return _fallback_wish(details)

def analyze_image(contents: bytes, mime_type: str) -> dict[str, Any]:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return _fallback_recommendations()

    base64_image = base64.b64encode(contents).decode("utf-8")
    data_url = f"data:{mime_type};base64,{base64_image}"

    try:
        from groq import Groq
        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model=VISION_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyze this image and recommend a birthday card design. Return JSON with exactly these keys: cardBackgroundColor (hex color), circleBorderColor (hex color), frameShape (one of: circle, square, rounded_rect, star, heart), titleFontFamily, titleFontColor (hex), nameFontFamily, nameFontColor (hex), wishFontFamily, wishFontColor (hex). Keep colors harmonious with the image. Font families should be from: Arial, Georgia, Times New Roman, Verdana, Courier New, cursive, fantasy, monospace."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url
                            }
                        }
                    ]
                }
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content or "{}"
        return _parse_json_content(content)
    except Exception:
        return _fallback_recommendations()

def _fallback_recommendations() -> dict[str, Any]:
    return {
        "cardBackgroundColor": "#111111",
        "circleBorderColor": "#D4AF37",
        "frameShape": "circle",
        "titleFontFamily": "Georgia",
        "titleFontColor": "#D4AF37",
        "nameFontFamily": "Arial",
        "nameFontColor": "#FFFFFF",
        "wishFontFamily": "Verdana",
        "wishFontColor": "#CCCCCC"
    }

def _system_prompt() -> str:
    return """
Return only valid JSON with keys: wish, short_title, signature_line.
Write only in English.
The wish must be 1 or 2 short sentences.
Make it personalized using name, age, relationship, personality, interesting thing, and template tone.
Keep it meaningful, warm, card-friendly, and concise.
Avoid generic template wording, cringe, and overly dramatic language.
If sender_name is empty, signature_line must be an empty string.
""".strip()


def _prompt_payload(details: dict[str, Any]) -> dict[str, Any]:
    template = details.get("template") or "modern_dark"
    return {
        **details,
        "template_tone": TEMPLATE_TONES.get(template, TEMPLATE_TONES["modern_dark"]),
    }


def _normalize_wish(plan: dict[str, Any], details: dict[str, Any]) -> dict[str, str]:
    fallback = _fallback_wish(details)
    sender_name = str(details.get("sender_name") or "").strip()
    signature = str(plan.get("signature_line") or fallback["signature_line"]).strip()

    if not sender_name:
        signature = ""

    return {
        "wish": _limit_sentences(str(plan.get("wish") or fallback["wish"]).strip()),
        "short_title": str(plan.get("short_title") or fallback["short_title"]).strip() or "Happy Birthday",
        "signature_line": signature,
    }


def _fallback_wish(details: dict[str, Any]) -> dict[str, str]:
    name = str(details.get("name") or "Friend").strip().title()
    age = int(details.get("age") or 1)
    relationship = str(details.get("relationship") or "friend").strip().lower()
    personality = str(details.get("personality") or "wonderful").strip().lower()
    interesting = str(details.get("interesting_thing") or "making ordinary moments brighter").strip()
    interest_phrase = _interest_phrase(interesting)
    sender_name = str(details.get("sender_name") or "").strip()
    template = str(details.get("template") or "modern_dark")
    tone = TEMPLATE_TONES.get(template, TEMPLATE_TONES["modern_dark"]).split(",")[0]

    wish = (
        f"Happy Birthday, {name}! May {age} bring more {tone} moments, bright wins, "
        f"and plenty of joy for the {personality} {interest_phrase} spirit that makes you such a special {relationship}."
    )

    return {
        "wish": _limit_sentences(wish),
        "short_title": "Happy Birthday",
        "signature_line": f"With warm wishes, {sender_name}" if sender_name else "",
    }


def _limit_sentences(text: str) -> str:
    sentences = re.findall(r"[^.!?]+[.!?]?", text.strip())
    return "".join(sentences[:2]).strip() or text


def _interest_phrase(interesting: str) -> str:
    value = interesting.strip()
    lowered = value.lower()

    if lowered.startswith("loves "):
        return value[6:].strip()
    if lowered.startswith("likes "):
        return value[6:].strip()
    return value


def _parse_json_content(content: str) -> dict[str, Any]:
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", content, flags=re.DOTALL)
        if not match:
            raise
        return json.loads(match.group(0))
