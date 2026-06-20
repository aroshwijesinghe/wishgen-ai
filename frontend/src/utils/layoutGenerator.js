import { CARD_TYPES } from "../data/cardTypes.js";
import { CARD_OBJECT_BY_ID } from "../data/cardObjects.js";

export const CARD_WIDTH = 800;
export const CARD_HEIGHT = 1000;

export function generateInitialLayers({ cardType, selectedObjects, aiPlan, portraitUrl }) {
  const theme = CARD_TYPES[cardType] || CARD_TYPES["Modern Dark"];
  const layers = [
    {
      id: "background",
      type: "background",
      fill: theme.colors.background,
      accentFill: theme.colors.backgroundAlt
    },
    {
      id: "portrait",
      type: "portrait",
      imageUrl: portraitUrl,
      x: 270,
      y: 260,
      width: 270,
      height: 360,
      draggable: true
    },
    textLayer("headline", aiPlan?.headline || "Happy Birthday", 72, 82, theme.textSizes.headline, theme.fonts.headline, theme.colors.primary, 656, "center", true),
    textLayer("name_text", aiPlan?.name_text || "Your Name!", 90, 150, theme.textSizes.name, theme.fonts.name, theme.colors.secondary, 620, "center", true),
    textLayer("main_wish", aiPlan?.main_wish || "A warm birthday wish will appear here.", 80, 650, theme.textSizes.wish, theme.fonts.body, theme.colors.body, 640, "center", false),
    textLayer("short_tagline", aiPlan?.short_tagline || "", 150, 845, theme.textSizes.tagline, theme.fonts.body, theme.colors.primary, 500, "center", true)
  ];

  selectedObjects.forEach((objectId, index) => {
    const meta = CARD_OBJECT_BY_ID[objectId];
    if (!meta) return;

    const position = getObjectPosition(meta.group, index);
    layers.push({
      id: `object_${objectId}`,
      type: "object",
      objectType: objectId,
      icon: meta.icon,
      x: position.x,
      y: position.y,
      size: meta.defaultSize,
      fill: theme.colors.primary,
      accentFill: theme.colors.accent,
      draggable: true
    });

    const objectText = aiPlan?.object_texts?.[objectId];
    if (meta.supportsText && objectText) {
      layers.push(textLayer(`object_text_${objectId}`, objectText, position.x - 35, position.y + meta.defaultSize + 8, theme.textSizes.object, theme.fonts.object, theme.colors.secondary, 220, "center", true));
    }
  });

  (aiPlan?.decorative_words || []).slice(0, 3).forEach((word, index) => {
    layers.push({
      ...textLayer(`badge_${index}`, word, 72 + index * 218, 905, theme.textSizes.badge, theme.fonts.body, theme.colors.background, 180, "center", true),
      type: "badge",
      badgeFill: theme.colors.primary
    });
  });

  return layers;
}

function textLayer(id, text, x, y, fontSize, fontFamily, fill, width, align, bold) {
  return {
    id,
    type: "text",
    text,
    x,
    y,
    fontSize,
    fontFamily,
    fontStyle: bold ? "bold" : "normal",
    fill,
    width,
    align,
    draggable: true
  };
}

function getObjectPosition(group, index) {
  const positions = {
    top: [
      { x: 92, y: 248 },
      { x: 610, y: 230 }
    ],
    side: [
      { x: 76, y: 472 },
      { x: 625, y: 465 }
    ],
    bottom: [
      { x: 120, y: 720 },
      { x: 560, y: 720 }
    ]
  };

  return positions[group]?.[index] || positions.bottom[index] || positions.bottom[0];
}
