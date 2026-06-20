const borderStyles = [
  { id: "solid", label: "Solid" },
  { id: "dashed", label: "Dashed" },
  { id: "double", label: "Double" }
];

export default function BorderStyleControls({ borderSettings, onChange }) {
  return (
    <section className="border-controls">
      <div className="section-heading-row">
        <span>Border styles</span>
        <small>Card & circle</small>
      </div>

      <label className="field">
        <span>Card border style</span>
        <select value={borderSettings.cardBorderStyle} onChange={(event) => onChange("cardBorderStyle", event.target.value)}>
          {borderStyles.map((style) => (
            <option key={style.id} value={style.id}>
              {style.label}
            </option>
          ))}
        </select>
      </label>

      <div className="color-grid">
        <label className="field color-field">
          <span>Card border color</span>
          <input type="color" value={borderSettings.cardBorderColor} onChange={(event) => onChange("cardBorderColor", event.target.value)} />
        </label>

        <label className="field color-field">
          <span>Circle border color</span>
          <input type="color" value={borderSettings.circleBorderColor} onChange={(event) => onChange("circleBorderColor", event.target.value)} />
        </label>
      </div>
    </section>
  );
}
