const fonts = [
  "Arial",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Courier New",
  "cursive",
  "fantasy",
  "monospace",
];

const shapes = [
  { id: "circle", label: "Circle" },
  { id: "square", label: "Square" },
  { id: "rounded_rect", label: "Rounded Rectangle" },
  { id: "star", label: "Star" },
  { id: "heart", label: "Heart" },
];

const frameStyles = [
  { id: "classic", label: "Classic Solid" },
  { id: "dashed", label: "Playful Dashed" },
  { id: "double", label: "Elegant Double Line" },
  { id: "neon", label: "Neon Glow" },
  { id: "hiphop", label: "Hip-Hop Graffiti" },
];

const partyEmojis = ["🎂", "🎈", "🎉", "🎁", "🥳", "👑", "✨", "💖", "🍾", "🥂", "🎶", "🌟"];

export default function DesignToolbar({ 
  designSettings, 
  onChange, 
  onAddEmoji,
  hasSelection,
  onBringForward,
  onSendBackward,
  onDeleteSelected
}) {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <section className="border-controls">
      <div className="section-heading-row">
        <span>Design Settings</span>
        <small>Colors, Fonts, Frame, and Stickers</small>
      </div>

      <div className="color-grid">
        <label className="field color-field">
          <span>Card Background Color</span>
          <input
            type="color"
            value={designSettings.cardBackgroundColor || "#ffffff"}
            onChange={(e) => handleChange("cardBackgroundColor", e.target.value)}
          />
        </label>

        <label className="field color-field">
          <span>Glow Color (Click card to place)</span>
          <input
            type="color"
            value={designSettings.glowColor || "#ffffff"}
            onChange={(e) => handleChange("glowColor", e.target.value)}
          />
        </label>
      </div>

      <div className="form-grid">
        <label className="field full-width">
          <span>Photo Frame Shape</span>
          <select
            value={designSettings.frameShape || "circle"}
            onChange={(e) => handleChange("frameShape", e.target.value)}
          >
            {shapes.map((shape) => (
              <option key={shape.id} value={shape.id}>
                {shape.label}
              </option>
            ))}
          </select>
        </label>
        
        <label className="field full-width">
          <span>Frame Border Style</span>
          <select
            value={designSettings.frameStyle || "classic"}
            onChange={(e) => handleChange("frameStyle", e.target.value)}
          >
            {frameStyles.map((style) => (
              <option key={style.id} value={style.id}>
                {style.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Frame Border Width</span>
          <input
            type="number"
            min="0"
            max="50"
            value={designSettings.circleBorderWidth !== undefined ? designSettings.circleBorderWidth : 8}
            onChange={(e) => handleChange("circleBorderWidth", Number(e.target.value))}
          />
        </label>

        <label className="field color-field">
          <span>Frame Border Color</span>
          <input
            type="color"
            value={designSettings.circleBorderColor || "#000000"}
            onChange={(e) => handleChange("circleBorderColor", e.target.value)}
          />
        </label>
      </div>

      <div className="section-heading-row" style={{ marginTop: "1.5rem" }}>
        <span>Stickers & Emojis</span>
      </div>
      <div className="emoji-grid" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1rem" }}>
        {partyEmojis.map((emoji) => (
          <button 
            key={emoji} 
            type="button" 
            onClick={() => onAddEmoji(emoji)}
            style={{ fontSize: "1.5rem", padding: "0.25rem", background: "none", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
            title={`Add ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      
      {hasSelection && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
          <button type="button" className="secondary-button" style={{ flex: 1, padding: "0.25rem" }} onClick={onBringForward}>Bring Forward</button>
          <button type="button" className="secondary-button" style={{ flex: 1, padding: "0.25rem" }} onClick={onSendBackward}>Send Backward</button>
          <button type="button" className="secondary-button" style={{ flex: 1, padding: "0.25rem", color: "red" }} onClick={onDeleteSelected}>Delete</button>
        </div>
      )}

      {["title", "name", "wish"].map((type) => (
        <div key={type} className="form-grid" style={{ marginTop: "1rem" }}>
          <label className="field full-width">
            <span>{type.charAt(0).toUpperCase() + type.slice(1)} Font Family</span>
            <select
              value={designSettings[`${type}FontFamily`] || "Arial"}
              onChange={(e) => handleChange(`${type}FontFamily`, e.target.value)}
            >
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Size</span>
            <input
              type="number"
              min="10"
              max="150"
              value={designSettings[`${type}FontSize`] || 20}
              onChange={(e) => handleChange(`${type}FontSize`, Number(e.target.value))}
            />
          </label>
          <label className="field color-field">
            <span>Color</span>
            <input
              type="color"
              value={designSettings[`${type}FontColor`] || "#000000"}
              onChange={(e) => handleChange(`${type}FontColor`, e.target.value)}
            />
          </label>
        </div>
      ))}
    </section>
  );
}
