# WishGen AI Architecture

## Overall Workflow

1. User opens the React frontend.
2. User uploads a portrait and enters birthday details.
3. User selects one card type and one or two birthday objects.
4. Frontend sends a multipart request to `POST /api/generate-card`.
5. Backend validates the input and saves the uploaded image.
6. Backend removes the background and saves a transparent PNG.
7. Backend crops an upper-body portrait using the alpha mask.
8. Backend generates an AI card plan and theme plan.
9. Backend returns static URLs and JSON plans.
10. Frontend builds editable Konva layers from the response.
11. User edits the card and downloads the final PNG from the canvas.

## Frontend/Backend Communication

Primary endpoint:

```text
POST http://localhost:8000/api/generate-card
```

Multipart fields:

- `image`
- `name`
- `age`
- `relationship`
- `occupation`
- `interesting_thing`
- `card_type`
- `selected_objects`

`selected_objects` is sent as a JSON string for multipart requests, for example:

```json
["cake", "code_symbol"]
```

Card type internal IDs:

- `modern_dark`
- `floral`
- `cute`
- `luxury`

Additional endpoints:

- `POST /api/process-image`
- `POST /api/plan-card`
- `GET /static/...`

## Backend Services

- `image_service.py`: validates JPG, PNG, and WebP uploads and saves originals.
- `background_service.py`: removes background with `rembg` and falls back to an RGBA copy if needed.
- `portrait_service.py`: alpha-mask upper-body crop with top and side padding.
- `ai_card_planner_service.py`: Groq-backed planner with safe JSON parsing and fallback generation.
- `theme_plan_service.py`: card type color/font/layout guidance.
- `card_service.py`: simple Pillow card generation for compatibility.
- `file_utils.py`: static directory and URL helpers.

## AI Planner Output JSON

```json
{
  "headline": "Happy Birthday",
  "name_text": "Kalindu!",
  "main_wish": "Happy Birthday, Kalindu! May your ideas keep turning into bright wins.",
  "object_texts": {
    "cake": "Kalindu, the Python guy",
    "code_symbol": "Dreams loading in Python"
  },
  "short_tagline": "Code, cake, and celebration!",
  "decorative_words": ["Dreamer", "Problem Solver", "Keep Shining"],
  "tone": "cool, friendly, and inspiring"
}
```

The planner must not print occupation directly. Occupation is context only.

## Card Rendering Flow

The frontend receives `portrait_url`, `ai_plan`, and `theme_plan`. `layoutGenerator.js` converts those into Konva layers for the canvas. The user can drag the portrait, text, and selected objects, edit text content, adjust text styling, reset the layout, and export the canvas with `stage.toDataURL()`.
