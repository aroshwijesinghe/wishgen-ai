# WishGen AI

WishGen AI is an AI-powered birthday card generator built around 5 professionally designed templates. Each template has a circular photo window where the user manually positions the birthday person's image with drag and zoom controls before exporting the final card.

The current AI feature is English-only personalized birthday wish generation using Groq Llama 3.3, with a local fallback when no API key is configured.

## Features

- Birthday details form for name, age, relationship, vibe, hobby, and optional sender name.
- Upload a birthday person's photo without modifying the original file.
- Choose from 5 templates: Modern Dark, Floral Elegance, Cute Pastel, Luxury Gold, and Fun Party.
- Generate a short personalized birthday wish with an LLM.
- Manually drag and zoom the uploaded image inside a circular frame.
- Preview the final card in a React Konva canvas.
- Download the card as PNG, JPEG, or PDF.

## AI Features

- Groq Llama 3.3 generates the birthday wish.
- The prompt uses name, age, relationship, personality/vibe, hobby, sender name, and template tone.
- The backend returns structured JSON: `wish`, `short_title`, and `signature_line`.
- If Groq is unavailable or returns invalid JSON, the backend uses a rule-based fallback.

## Tech Stack

- Frontend: React, Vite, React Konva, Konva, jsPDF, CSS
- Backend: FastAPI, Python, Groq SDK, python-dotenv

## Folder Structure

```text
wishgen-ai/
|-- README.md
|-- .gitignore
|-- backend/
|   |-- .env.example
|   |-- requirements.txt
|   |-- main.py
|   `-- app/
|       |-- routes/
|       `-- services/
|-- frontend/
|   |-- .env.example
|   |-- package.json
|   |-- index.html
|   `-- src/
|       |-- App.jsx
|       |-- styles.css
|       |-- components/
|       |-- data/
|       |-- services/
|       `-- utils/
`-- docs/
    |-- project-plan.md
    `-- architecture.md
```

## Backend Env Variables

Create `backend/.env` from `backend/.env.example`:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

`GROQ_API_KEY` is optional for local testing. Without it, the backend uses fallback wish generation.

## Run Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend URL: `http://localhost:8000`

## Run Frontend

Create `frontend/.env` from `frontend/.env.example` if needed:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Then run:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL: usually `http://localhost:5173`

## How To Use

1. Enter birthday details.
2. Upload a photo.
3. Select one of the 5 templates.
4. Click `Generate Wish`.
5. Click `Edit Photo Position`.
6. Drag and zoom the photo inside the circular frame.
7. Confirm the photo position.
8. Download the card as PNG, JPEG, or PDF.

## Current Limitations

- Templates use canvas/CSS-style shapes instead of external artwork.
- The card is exported from the browser canvas.
- PDF export uses the canvas image placed into a PDF page.
- The app is English-only.

## Future Improvements

- Add more professional template packs.
- Add editable text positions and font controls.
- Add saved projects.
- Add print-ready export sizing.
- Add deployment instructions.

## Author

Created as an individual AI undergraduate project.
