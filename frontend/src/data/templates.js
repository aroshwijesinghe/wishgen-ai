export const TEMPLATES = [
  {
    id: "modern_dark",
    name: "Modern Dark",
    description: "Dark premium card with gold accents",
    width: 800,
    height: 1000,
    imageFrame: { x: 400, y: 286, radius: 182 },
    colors: {
      background: "#071C1C",
      backgroundAlt: "#123733",
      primary: "#F6C85F",
      secondary: "#FFFFFF",
      accent: "#0EA5A3",
      body: "#EAF7F5"
    },
    fonts: { title: "Georgia", name: "cursive", wish: "Arial" },
    text: {
      title: { x: 90, y: 520, width: 620, size: 54 },
      name: { x: 100, y: 590, width: 600, size: 66 },
      wish: { x: 98, y: 690, width: 604, size: 28 },
      signature: { x: 140, y: 842, width: 520, size: 24 }
    },
    decorativeStyle: "confetti"
  },
  {
    id: "floral_elegance",
    name: "Floral Elegance",
    description: "Cream and sage design with soft floral shapes",
    width: 800,
    height: 1000,
    imageFrame: { x: 400, y: 296, radius: 184 },
    colors: {
      background: "#FFF7EB",
      backgroundAlt: "#F5D8D6",
      primary: "#6F8F72",
      secondary: "#A07A2F",
      accent: "#D9899E",
      body: "#40513F"
    },
    fonts: { title: "Georgia", name: "cursive", wish: "Arial" },
    text: {
      title: { x: 90, y: 530, width: 620, size: 50 },
      name: { x: 105, y: 598, width: 590, size: 64 },
      wish: { x: 105, y: 700, width: 590, size: 27 },
      signature: { x: 140, y: 850, width: 520, size: 23 }
    },
    decorativeStyle: "floral"
  },
  {
    id: "cute_pastel",
    name: "Cute Pastel",
    description: "Sweet pink card with playful shapes",
    width: 800,
    height: 1000,
    imageFrame: { x: 400, y: 282, radius: 180 },
    colors: {
      background: "#FFE5EF",
      backgroundAlt: "#E9DDFF",
      primary: "#F45F7F",
      secondary: "#6D4BC3",
      accent: "#FFD447",
      body: "#54305F"
    },
    fonts: { title: "Arial", name: "cursive", wish: "Arial" },
    text: {
      title: { x: 86, y: 520, width: 628, size: 52 },
      name: { x: 100, y: 586, width: 600, size: 62 },
      wish: { x: 94, y: 684, width: 612, size: 28 },
      signature: { x: 138, y: 842, width: 524, size: 23 }
    },
    decorativeStyle: "cute"
  },
  {
    id: "luxury_gold",
    name: "Luxury Gold",
    description: "Black and ivory card with refined gold details",
    width: 800,
    height: 1000,
    imageFrame: { x: 400, y: 294, radius: 182 },
    colors: {
      background: "#0D0B08",
      backgroundAlt: "#2B2114",
      primary: "#D9B45F",
      secondary: "#FFF7DF",
      accent: "#C8A45B",
      body: "#F8EDCF"
    },
    fonts: { title: "Georgia", name: "cursive", wish: "Arial" },
    text: {
      title: { x: 88, y: 530, width: 624, size: 50 },
      name: { x: 98, y: 600, width: 604, size: 68 },
      wish: { x: 110, y: 704, width: 580, size: 26 },
      signature: { x: 145, y: 850, width: 510, size: 23 }
    },
    decorativeStyle: "luxury"
  },
  {
    id: "fun_party",
    name: "Fun Party",
    description: "Bright colorful card with streamers and confetti",
    width: 800,
    height: 1000,
    imageFrame: { x: 400, y: 282, radius: 180 },
    colors: {
      background: "#0EA5E9",
      backgroundAlt: "#F97316",
      primary: "#FFF7A8",
      secondary: "#FFFFFF",
      accent: "#EC4899",
      body: "#FFFFFF"
    },
    fonts: { title: "Arial", name: "cursive", wish: "Arial" },
    text: {
      title: { x: 78, y: 518, width: 644, size: 54 },
      name: { x: 94, y: 586, width: 612, size: 64 },
      wish: { x: 96, y: 688, width: 608, size: 28 },
      signature: { x: 136, y: 842, width: 528, size: 23 }
    },
    decorativeStyle: "party"
  }
];

export const TEMPLATE_BY_ID = TEMPLATES.reduce((templates, template) => {
  templates[template.id] = template;
  return templates;
}, {});
