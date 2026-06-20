# WishGen AI Architecture

## Overall Workflow

1. User enters birthday details in the React frontend.
2. User uploads a photo.
3. User selects one of 5 templates.
4. Frontend calls `POST /api/generate-wish`.
5. Backend returns an AI-generated wish JSON response.
6. User opens the photo adjustment modal.
7. React Konva clips the photo inside the template's circular frame.
8. User drags/zooms the photo and confirms the transform.
9. Final preview renders the selected template, photo, title, name, wish, and signature.
10. User downloads PNG, JPEG, or PDF.

## Frontend/Backend Communication

Endpoint:

```text
POST http://localhost:8000/api/generate-wish
```

Request JSON:

```json
{
  "name": "Kalindu",
  "age": 22,
  "relationship": "friend",
  "personality": "creative and funny",
  "interesting_thing": "loves Python and guitar",
  "sender_name": "Arosh",
  "template": "modern_dark"
}
```

Response JSON:

```json
{
  "success": true,
  "wish": "Happy Birthday, Kalindu! May your creativity keep turning simple ideas into unforgettable moments.",
  "short_title": "Happy Birthday",
  "signature_line": "With warm wishes, Arosh"
}
```

## Backend Services

- `main.py`: creates the FastAPI app, enables CORS, includes API routes.
- `routes/card_routes.py`: defines health-adjacent card API routes, currently `/api/generate-wish`.
- `services/wish_service.py`: calls Groq Llama 3.3 and falls back to a local generator.

## Frontend Modules

- `data/templates.js`: 5 template definitions, including circular frame geometry and text positions.
- `services/api.js`: frontend API helper for wish generation.
- `components/BirthdayForm.jsx`: birthday detail form.
- `components/ImageUpload.jsx`: local image upload and preview.
- `components/TemplateSelector.jsx`: visual template picker.
- `components/CardPreview.jsx`: React Konva final card renderer.
- `components/PhotoAdjustModal.jsx`: drag/zoom circular-frame photo positioning.
- `components/DownloadOptions.jsx`: PNG, JPEG, and PDF export buttons.
- `utils/exportCard.js`: Konva/jsPDF export helpers.

## Card Rendering Flow

The frontend keeps the image transform in state:

```json
{
  "x": 0,
  "y": 0,
  "scale": 1
}
```

The transform is applied only to how the image is displayed inside the circular frame. The original image file remains unchanged.
