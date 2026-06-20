const relationshipOptions = ["friend", "mother", "father", "sister", "brother", "partner", "colleague"];
const languageOptions = ["English", "Sinhala", "Tamil"];
const themeOptions = ["auto", "classic", "fun", "elegant", "kids", "romantic"];

export default function BirthdayForm({ formData, onChange }) {
  return (
    <section className="form-grid">
      <label className="field">
        <span>Person name</span>
        <input
          type="text"
          value={formData.name}
          placeholder="E.g. Aanya"
          onChange={(event) => onChange("name", event.target.value)}
        />
      </label>

      <label className="field">
        <span>Age</span>
        <input
          type="number"
          min="0"
          value={formData.age}
          placeholder="E.g. 25"
          onChange={(event) => onChange("age", event.target.value)}
        />
      </label>

      <label className="field">
        <span>Relationship</span>
        <select
          value={formData.relationship}
          onChange={(event) => onChange("relationship", event.target.value)}
        >
          {relationshipOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Language</span>
        <select
          value={formData.language}
          onChange={(event) => onChange("language", event.target.value)}
        >
          {languageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="field full-width">
        <span>Card style/theme</span>
        <select
          value={formData.theme}
          onChange={(event) => onChange("theme", event.target.value)}
        >
          {themeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
