# WishGen AI Project Plan

## Problem Statement

People want personalized birthday cards that look polished without spending time in design software. WishGen AI provides a simple flow: enter birthday details, generate a meaningful wish, place a photo into a circular template frame, and download a finished card.

## Objectives

- Keep the product English-only.
- Provide 5 visually different birthday card templates.
- Use AI only for personalized birthday wish generation.
- Let users manually position the uploaded photo inside a circular frame.
- Preserve the original uploaded photo and only adjust its display transform.
- Support PNG, JPEG, and PDF download.

## User Inputs

- Birthday person name
- Age
- Relationship
- Personality or vibe
- Interesting thing / hobby
- Optional sender name
- Template selection
- Image upload

## AI Birthday Wish

The backend exposes `POST /api/generate-wish`. It accepts birthday details and returns:

- `wish`
- `short_title`
- `signature_line`

Groq Llama 3.3 is used when `GROQ_API_KEY` is available. The generated wish should be 1 or 2 short English sentences, personalized, meaningful, and card-friendly. If Groq is unavailable, the backend uses a local fallback generator.

## Templates

The frontend defines these templates in `frontend/src/data/templates.js`:

- Modern Dark
- Floral Elegance
- Cute Pastel
- Luxury Gold
- Fun Party

Each template defines canvas size, colors, font choices, decorative style, text positions, and a circular image frame.

## Manual Photo Positioning

The uploaded photo is rendered in a circular clipped area using React Konva. A modal lets the user drag the image, zoom in, zoom out, reset, cancel, or confirm. No background removal or automatic crop is performed.

## Card Preview And Export

The final card is rendered with React Konva. The browser exports the canvas as PNG or JPEG. PDF export uses jsPDF to place the card image on a PDF page.

## Future Scope

- Add more templates.
- Add editable text layer controls.
- Add print-ready sizing.
- Add persistent project storage.
- Add share links or gallery history.
