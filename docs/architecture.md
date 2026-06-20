# WishGen AI Architecture

WishGen AI is split into a React frontend and a FastAPI backend.

## Frontend

The frontend collects user input, sends a multipart request to the backend, and displays the generated card image returned by the API.

Main files:

- `src/App.jsx` coordinates form state and API calls.
- `src/components/ImageUpload.jsx` handles local image selection.
- `src/components/BirthdayForm.jsx` contains birthday detail fields.
- `src/components/CardPreview.jsx` displays the generated result.

## Backend

The backend exposes a small API and keeps business logic separated into services.

Main layers:

- `routes/card_routes.py` defines HTTP endpoints.
- `services/image_service.py` saves uploaded images.
- `services/message_service.py` generates rule-based wishes.
- `services/theme_service.py` selects a card theme.
- `services/card_service.py` renders the card image with Pillow.
- `utils/file_utils.py` centralizes asset paths and filename helpers.

## Future AI Integration

The service layout is intentionally modular. Later AI capabilities can be added without changing the public API shape:

- Background removal can extend `image_service.py`.
- Face and emotion detection can be added as new services.
- Theme recommendation can replace or extend `theme_service.py`.
- LLM-generated messages can replace the implementation inside `message_service.py`.
