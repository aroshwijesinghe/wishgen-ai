export const CARD_TYPES = {
  modern_dark: {
    id: "modern_dark",
    label: "Modern Dark",
    background: "dark teal/black gradient",
    colors: {
      background: "#071312",
      backgroundAlt: "#12312f",
      primary: "#d6b35a",
      secondary: "#ffffff",
      accent: "#18a999",
      body: "#e8f3f1"
    },
    fonts: {
      headline: "Georgia",
      name: "cursive",
      body: "Arial",
      object: "Arial"
    },
    layout: "bold editorial portrait layout",
    textSizes: {
      headline: 54,
      name: 70,
      wish: 28,
      object: 22,
      tagline: 23,
      badge: 17
    },
    objectStyleNotes: "gold, glossy, confetti, cake, code accents"
  },
  floral: {
    id: "floral",
    label: "Floral",
    background: "cream/pastel",
    colors: {
      background: "#fff8ee",
      backgroundAlt: "#f5dfd6",
      primary: "#6f8f72",
      secondary: "#9a7427",
      accent: "#d9899e",
      body: "#40513f"
    },
    fonts: {
      headline: "Georgia",
      name: "cursive",
      body: "Arial",
      object: "Georgia"
    },
    layout: "soft framed floral greeting layout",
    textSizes: {
      headline: 52,
      name: 70,
      wish: 27,
      object: 22,
      tagline: 23,
      badge: 17
    },
    objectStyleNotes: "flowers, ribbons, soft cake, elegant borders"
  },
  cute: {
    id: "cute",
    label: "Cute",
    background: "pink/pastel",
    colors: {
      background: "#ffe5ef",
      backgroundAlt: "#fff0bd",
      primary: "#f45f7f",
      secondary: "#6d4bc3",
      accent: "#ffd447",
      body: "#54305f"
    },
    fonts: {
      headline: "Arial",
      name: "cursive",
      body: "Arial",
      object: "Comic Sans MS"
    },
    layout: "playful rounded celebration layout",
    textSizes: {
      headline: 54,
      name: 68,
      wish: 28,
      object: 22,
      tagline: 23,
      badge: 17
    },
    objectStyleNotes: "balloons, stars, hearts, gift box, cute cake"
  },
  luxury: {
    id: "luxury",
    label: "Luxury",
    background: "black/ivory/gold",
    colors: {
      background: "#0d0b08",
      backgroundAlt: "#2b2114",
      primary: "#d9b45f",
      secondary: "#fff7df",
      accent: "#caa65a",
      body: "#f8edcf"
    },
    fonts: {
      headline: "Georgia",
      name: "cursive",
      body: "Arial",
      object: "Georgia"
    },
    layout: "premium centered portrait layout",
    textSizes: {
      headline: 52,
      name: 72,
      wish: 27,
      object: 22,
      tagline: 23,
      badge: 17
    },
    objectStyleNotes: "crown, ribbon, premium cake, fireworks, gold lines"
  }
};

export const CARD_TYPE_OPTIONS = Object.values(CARD_TYPES).map(({ id, label }) => ({ id, label }));
