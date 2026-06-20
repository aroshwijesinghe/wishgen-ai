# WishGen AI

WishGen AI is an AI-ready personalized birthday card generator. Users can upload a human image, enter birthday details, choose a style, and generate a birthday wish card.

The first version is a clean MVP with rule-based message generation and Pillow-based card rendering. It does not require paid APIs.

## Features

- Upload a birthday person's image
- Enter name, age, relationship, language, and preferred style
- Generate a personalized birthday message with simple rules
- Create a basic birthday card image using Pillow
- Preview the generated card in the React frontend
- Backend service layout prepared for future AI modules

## Tech Stack

- Frontend: React + Vite
- Backend: Python FastAPI
- Image processing: Pillow, OpenCV
- Future AI modules: rembg, DeepFace, MediaPipe, LLM APIs

## Project Structure

```text
wishgen-ai/
├── README.md
├── .gitignore
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       └── components/
│           ├── ImageUpload.jsx
│           ├── BirthdayForm.jsx
│           └── CardPreview.jsx
├── backend/
│   ├── requirements.txt
│   ├── main.py
│   └── app/
│       ├── __init__.py
│       ├── routes/
│       │   ├── __init__.py
│       │   └── card_routes.py
│       ├── services/
│       │   ├── __init__.py
│       │   ├── image_service.py
│       │   ├── message_service.py
│       │   ├── theme_service.py
│       │   └── card_service.py
│       └── utils/
│           ├── __init__.py
│           └── file_utils.py
├── docs/
│   ├── project-plan.md
│   └── architecture.md
└── assets/
    ├── uploads/
    ├── generated-cards/
    └── templates/
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at the Vite URL shown in your terminal, usually `http://localhost:5173`.

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

On macOS or Linux, activate the virtual environment with:

```bash
source venv/bin/activate
```

The backend runs at `http://localhost:8000`.

## API Endpoints

- `GET /` - health check
- `POST /api/generate-card` - accepts an image and birthday details, then returns generated card metadata
- `GET /api/generated-cards/{filename}` - serves generated card images for preview

## Future Improvements

- Add background removal with `rembg`
- Add face detection and emotion detection with DeepFace or MediaPipe
- Recommend themes based on image analysis and birthday details
- Replace rule-based messages with an LLM-powered message generator
- Add user accounts and saved card history
- Add downloadable card templates and social sharing options

## Author

Created by the WishGen AI project author.
