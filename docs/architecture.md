# WishGen AI Architecture

## System Workflow

1. The user opens the React frontend.
2. The user uploads a photo and enters birthday details.
3. The frontend sends a `multipart/form-data` request to the FastAPI backend.
4. The backend validates and saves the uploaded image in `assets/uploads`.
5. The backend generates a rule-based birthday message.
6. The backend selects a theme using rule-based logic.
7. Pillow creates the final birthday card image.
8. The generated card is saved in `assets/generated-cards`.
9. The API returns the message, selected theme, and card URL.
10. The frontend displays the card preview and download button.

## Frontend And Backend Communication

The frontend calls:

```text
POST http://localhost:8000/api/generate-card
```

Request fields:

- `image`
- `name`
- `age`
- `relationship`
- `theme`

Response fields:

- `success`
- `message`
- `selected_theme`
- `card_url`
- `generated_card_path`

## Module Explanation

- `frontend/src/App.jsx` manages form state, upload state, API calls, loading state, errors, and generated results.
- `frontend/src/components/ImageUpload.jsx` handles image selection and preview.
- `frontend/src/components/BirthdayForm.jsx` renders birthday detail inputs.
- `frontend/src/components/CardPreview.jsx` displays the generated message, theme, image preview, and download button.
- `backend/main.py` creates the FastAPI app, configures CORS, serves generated cards, and includes routes.
- `backend/app/routes/card_routes.py` defines the card generation API endpoint.
- `backend/app/services/image_service.py` validates and saves uploaded images.
- `backend/app/services/message_service.py` generates MVP birthday messages.
- `backend/app/services/theme_service.py` selects the card theme.
- `backend/app/services/card_service.py` renders the final card image with Pillow.
- `backend/app/utils/file_utils.py` manages asset directories and unique filenames.
