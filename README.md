# WishGen AI

WishGen AI is an AI-powered personalized birthday card generator. Users upload a human photo, enter birthday details, and generate a birthday wish card with a personalized message.

The current version is a clean local MVP. It uses rule-based logic and Pillow image generation, so it can run without paid APIs while keeping the code modular for future AI features.

## Features

- Upload a birthday person's image
- Enter name, age, relationship, and theme/style
- Generate a rule-based personalized birthday message
- Select a theme automatically or from user input
- Create a simple birthday card image with Pillow
- Preview and download the generated card

## AI Components

Current MVP:

- Rule-based message generation
- Rule-based theme selection
- Pillow-based card rendering
- English-only birthday message generation

Future modules:

- Face detection
- Background removal
- Emotion detection
- Age group estimation
- LLM-based message generation
- Theme recommendation

## Tech Stack

- Frontend: React + Vite
- Styling: CSS
- Backend: Python FastAPI
- Image generation: Pillow

## Folder Structure

```text
wishgen-ai/
|-- README.md
|-- .gitignore
|-- frontend/
|   |-- package.json
|   |-- index.html
|   |-- vite.config.js
|   `-- src/
|       |-- App.jsx
|       |-- main.jsx
|       |-- styles.css
|       `-- components/
|           |-- ImageUpload.jsx
|           |-- BirthdayForm.jsx
|           `-- CardPreview.jsx
|-- backend/
|   |-- requirements.txt
|   |-- main.py
|   `-- app/
|       |-- __init__.py
|       |-- routes/
|       |   |-- __init__.py
|       |   `-- card_routes.py
|       |-- services/
|       |   |-- __init__.py
|       |   |-- image_service.py
|       |   |-- message_service.py
|       |   |-- theme_service.py
|       |   `-- card_service.py
|       `-- utils/
|           |-- __init__.py
|           `-- file_utils.py
|-- docs/
|   |-- project-plan.md
|   `-- architecture.md
`-- assets/
    |-- uploads/
    |-- generated-cards/
    `-- templates/
```

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend runs at `http://localhost:8000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at the Vite URL shown in the terminal, usually `http://localhost:5173`.

## API Endpoints

- `GET /` - health check
- `POST /api/generate-card` - accepts image and birthday details, then returns generated message, selected theme, and card URL
- `GET /api/generated-cards/{filename}` - serves generated card images

## Future Improvements

- Add stronger image validation and optional face detection
- Add background removal before card rendering
- Add reusable card templates
- Add LLM-powered message generation
- Add AI theme recommendations
- Add saved card history and sharing options

## Author

Created as an individual AI undergraduate project.
