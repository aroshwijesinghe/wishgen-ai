# WishGen AI

WishGen AI is a customizable birthday card editor powered by AI.

## Features

- **5 Unique Templates**: Choose from Modern Dark, Floral Elegance, Cute Pastel, Luxury Gold, and Fun Party.
- **Circular Photo Frame**: Upload a photo of the birthday person and manually adjust it (drag and zoom) to perfectly fit inside the template's circular frame.
- **Customizable Design**: Adjust card background color, circle border size, radius, border color, and all typography (font family, size, color).
- **AI-Generated Wishes**: Enter some details about the birthday person, and the Groq LLM will generate a warm, personalized birthday wish.
- **High-Quality Export**: Download the final, personalized birthday card as PNG, JPEG, or PDF.

## Tech Stack

- **Frontend**: React, Vite, React-Konva, jsPDF
- **Backend**: FastAPI, Python, Groq LLM

## Getting Started

### Backend Setup
1. `cd backend`
2. Create and activate a virtual environment.
3. Install dependencies: `pip install -r requirements.txt`
4. Set your Groq API key in the `.env` file (copy from `.env.example`).
5. Run the server: `uvicorn app.main:app --reload`
   - Backend will run on http://localhost:8000

### Frontend Setup
1. `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
   - Frontend will run on http://localhost:5173

## Testing the Flow
1. Start both servers.
2. Fill in the birthday person's details and upload their photo.
3. Select a template and adjust the colors and fonts in the Design Toolbar.
4. Click "Generate Wish" to get a personalized message.
5. Click "Edit Photo Position" to open the modal, adjust your image inside the circle, and confirm.
6. Review the live card preview.
7. Click the PNG, JPEG, or PDF button to download the result!
