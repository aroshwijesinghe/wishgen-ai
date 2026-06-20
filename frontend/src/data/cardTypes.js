export const CARD_TYPES = {
  "Modern Dark": {
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
      headline: 58,
      name: 76,
      wish: 30,
      object: 24,
      tagline: 24,
      badge: 18
    },
    objectStyleNotes: "gold, glossy, confetti, cake, code accents"
  },
  Floral: {
    label: "Floral",
    background: "cream/pastel",
    colors: {
      background: "#fff8ee",
      backgroundAlt: "#f5dfd6",
      primary: "#6f8f72",
      secondary: "#b68b2d",
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
      headline: 54,
      name: 74,
      wish: 29,
      object: 23,
      tagline: 24,
      badge: 18
    },
    objectStyleNotes: "flowers, ribbons, soft cake, elegant borders"
  },
  Cute: {
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
      headline: 56,
      name: 72,
      wish: 30,
      object: 24,
      tagline: 24,
      badge: 18
    },
    objectStyleNotes: "balloons, stars, hearts, gift box, cute cake"
  },
  Luxury: {
    label: "Luxury",
    background: "black/ivory/gold",
    colors: {
      background: "#0d0b08",
      backgroundAlt: "#f7efd8",
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
      headline: 54,
      name: 78,
      wish: 29,
      object: 23,
      tagline: 24,
      badge: 18
    },
    objectStyleNotes: "crown, ribbon, premium cake, fireworks, gold lines"
  }
};

export const CARD_TYPE_OPTIONS = Object.keys(CARD_TYPES);
