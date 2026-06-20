# WishGen AI

WishGen AI is an AI-powered interactive birthday card designer. Users upload a portrait, enter birthday details, choose a card type and one or two birthday objects, then generate an editable birthday card with AI-planned text and a background-removed upper-body portrait.

The application is English-only. Occupation is used only as hidden AI context and must not be printed directly on the card.

## Features

- Upload JPG, PNG, or WebP portraits.
- Remove image background and create a transparent upper-half portrait crop.
- Generate personalized English birthday wishes with Groq Llama 3.3 when configured.
- Use a local fallback planner when no Groq key is available.
- Choose one card type: Modern Dark, Floral, Cute, or Luxury.
- Select one or two birthday objects from a 20-object list.
- Render selected objects and object-specific AI text on the card.
- Edit, drag, and restyle text/object layers in a React Konva canvas.
- Download the final card as a PNG.

## AI Features

- Background removal using `rembg`.
- Alpha-mask portrait crop that preserves head/hair padding.
- AI card planner for headline, name text, main wish, object text, tagline, decorative words, and tone.
- Theme-aware design planning for each card type.
- Fallback rule-based planner if Groq is unavailable or returns invalid output.

## Tech Stack

- Frontend: React, Vite, React Konva, Konva, CSS
- Backend: FastAPI, Python, Pillow, OpenCV, NumPy, rembg, onnxruntime
- AI text: Groq SDK with `llama-3.3-70b-versatile`
- Environment: python-dotenv

## Folder Structure

```text
wishgen-ai/
|-- README.md
|-- .gitignore
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
|-- backend/
|   |-- .env.example
|   |-- requirements.txt
|   |-- main.py
|   |-- static/
|   |   |-- uploads/
|   |   |-- processed/
|   |   `-- cards/
|   `-- app/
|       |-- routes/
|       |-- services/
|       `-- utils/
`-- docs/
    |-- project-plan.md
    `-- architecture.md
```

## Backend Environment

Create `backend/.env` from `backend/.env.example`:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

`GROQ_API_KEY` is optional for local testing. If it is missing, the app uses the fallback planner.

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

## Using Groq Llama 3.3

1. Add your Groq key to `backend/.env`.
2. Keep `GROQ_MODEL=llama-3.3-70b-versatile` or replace it with another compatible Groq model.
3. Restart the FastAPI server.

The backend asks Groq for valid JSON only. If the API call fails or returns invalid JSON, WishGen AI falls back to local rule-based text generation.

## Current Limitations

- The frontend uses simple Konva shapes/text/emoji fallbacks for birthday objects.
- The Pillow compatibility card is simple compared with the interactive frontend canvas.
- The first `rembg` run may download the U2Net model and take longer.
- Advanced face detection and template asset packs are not included yet.

## Future Improvements

- Replace object fallbacks with custom designed transparent assets.
- Add more card layouts per theme.
- Add face-aware portrait placement.
- Add saved card history and sharing.
- Add deployment instructions for production hosting.

## Author

Created as an individual AI undergraduate project.
