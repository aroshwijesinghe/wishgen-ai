# WishGen AI Project Plan

## Problem Statement

Generic birthday card tools often produce repetitive greetings and static templates. WishGen AI solves this by combining user details, a portrait, birthday objects, AI-planned text, and an editable card canvas into one personalized workflow.

## Objectives

- Keep the application English-only.
- Generate short, warm, personalized birthday wishes.
- Use occupation only as context, never as direct card text.
- Let the user choose exactly one card type: `modern_dark`, `floral`, `cute`, or `luxury`.
- Let the user choose one or two birthday objects from the fixed 20-object list.
- Process the uploaded image into a transparent upper-body portrait without cutting hair.
- Provide an interactive editor where text, portrait, and objects can be adjusted before download.

## User Inputs

- `image`
- `name`
- `age`
- `relationship`
- `occupation`
- `interesting_thing`
- `card_type`
- `selected_objects`

## AI Card Planner

The backend planner accepts the birthday details and returns JSON with:

- `headline`
- `name_text`
- `main_wish`
- `object_texts`
- `short_tagline`
- `decorative_words`
- `tone`

Groq Llama 3.3 is used when `GROQ_API_KEY` is configured. If the key is missing, the API fails, or invalid JSON is returned, the backend falls back to a local rule-based planner. The fallback still uses the user's name, age, relationship, interesting thing, selected objects, and card type.

## Background Removal

The backend uses `rembg` to remove the uploaded image background and saves a transparent PNG under `backend/static/processed`. If background removal fails, the backend saves an RGBA copy so the rest of the card flow can continue.

## Portrait Crop

The portrait service loads the background-removed PNG as RGBA and uses the alpha channel to find visible person pixels. It crops the upper body using the alpha mask bounds, adds top padding to protect hair, adds side padding, and saves a transparent portrait PNG.

## Interactive Card Editor

The frontend uses React Konva to render a 4:5 card canvas. It creates layers for:

- background
- portrait
- headline text
- name text
- main wish
- selected objects
- object text
- tagline
- decorative badges

Users can drag layers, select text, adjust font size, color, font family, bold/normal styling, edit text, reset the layout, and download the final card as a PNG.

## Future Scope

- Add custom object asset packs.
- Add multiple layouts for each card type.
- Add more robust face-aware portrait placement.
- Add saved projects and card history.
- Add production deployment and storage.
