const fontOptions = ["Arial", "Georgia", "cursive", "Comic Sans MS"];

export default function TextToolbar({ selectedLayer, onChange }) {
  if (!selectedLayer || !["text", "badge"].includes(selectedLayer.type)) {
    return null;
  }

  return (
    <div className="text-toolbar">
      <label>
        Size
        <input
          type="number"
          min="12"
          max="120"
          value={selectedLayer.fontSize}
          onChange={(event) => onChange({ fontSize: Number(event.target.value) })}
        />
      </label>
      <label>
        Color
        <input type="color" value={selectedLayer.fill} onChange={(event) => onChange({ fill: event.target.value })} />
      </label>
      <label>
        Font
        <select value={selectedLayer.fontFamily} onChange={(event) => onChange({ fontFamily: event.target.value })}>
          {fontOptions.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="small-button"
        onClick={() => onChange({ fontStyle: selectedLayer.fontStyle === "bold" ? "normal" : "bold" })}
      >
        {selectedLayer.fontStyle === "bold" ? "Normal" : "Bold"}
      </button>
    </div>
  );
}
