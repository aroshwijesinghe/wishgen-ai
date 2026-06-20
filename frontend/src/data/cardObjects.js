export const CARD_OBJECTS = [
  { id: "cake", label: "Cake", icon: "🎂", supportsText: true, defaultSize: 150, group: "bottom" },
  { id: "balloons", label: "Balloons", icon: "🎈", supportsText: false, defaultSize: 130, group: "top" },
  { id: "flowers", label: "Flowers", icon: "🌸", supportsText: true, defaultSize: 120, group: "side" },
  { id: "gift_box", label: "Gift Box", icon: "🎁", supportsText: true, defaultSize: 120, group: "bottom" },
  { id: "candles", label: "Candles", icon: "🕯️", supportsText: true, defaultSize: 110, group: "bottom" },
  { id: "crown", label: "Crown", icon: "👑", supportsText: true, defaultSize: 110, group: "top" },
  { id: "confetti", label: "Confetti", icon: "✦", supportsText: false, defaultSize: 120, group: "top" },
  { id: "ribbon", label: "Ribbon", icon: "🎀", supportsText: true, defaultSize: 120, group: "side" },
  { id: "stars", label: "Stars", icon: "⭐", supportsText: false, defaultSize: 110, group: "top" },
  { id: "heart", label: "Heart", icon: "♥", supportsText: true, defaultSize: 110, group: "side" },
  { id: "fireworks", label: "Fireworks", icon: "✹", supportsText: false, defaultSize: 125, group: "top" },
  { id: "music_notes", label: "Music Notes", icon: "♫", supportsText: true, defaultSize: 110, group: "side" },
  { id: "guitar", label: "Guitar", icon: "🎸", supportsText: true, defaultSize: 120, group: "bottom" },
  { id: "book", label: "Book", icon: "📚", supportsText: true, defaultSize: 120, group: "bottom" },
  { id: "laptop", label: "Laptop", icon: "💻", supportsText: true, defaultSize: 130, group: "bottom" },
  { id: "code_symbol", label: "Code Symbol", icon: "</>", supportsText: true, defaultSize: 120, group: "side" },
  { id: "cricket_bat", label: "Cricket Bat", icon: "🏏", supportsText: true, defaultSize: 125, group: "bottom" },
  { id: "coffee_cup", label: "Coffee Cup", icon: "☕", supportsText: true, defaultSize: 110, group: "bottom" },
  { id: "rocket", label: "Rocket", icon: "🚀", supportsText: true, defaultSize: 120, group: "top" },
  { id: "trophy", label: "Trophy", icon: "🏆", supportsText: true, defaultSize: 120, group: "bottom" }
];

export const CARD_OBJECT_BY_ID = CARD_OBJECTS.reduce((items, object) => {
  items[object.id] = object;
  return items;
}, {});
