# WishGen AI

WishGen AI is a customizable birthday card editor powered by AI.

## Features

- **Intelligent Templates**: Start with beautiful templates like Modern Dark, Floral Elegance, or Luxury Gold.
- **Custom Drawn Shapes**: Draw your own custom shape loops over photos to perfectly crop out subjects!
- **Interactive Canvas Editor**: Pan, zoom, and fit the canvas using a seamless drag-and-drop workspace powered by React-Konva.
- **Dynamic Styling**: Adjust border styles, inset positioning, colors, rounded corners, and custom Google Fonts on the fly.
- **AI-Generated Wishes**: Provide a few details about the birthday person and let the Groq LLM generate a heartfelt, personalized message instantly.
- **High-Quality Export**: Download your final masterpiece as a PNG, JPEG, or PDF.
- **Premium Aesthetics**: Enjoy a modern, sleek interface with micro-animations, glassmorphism, and a beautiful creative loading screen.

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
