import { CARD_TYPE_OPTIONS } from "../data/cardTypes.js";

const relationshipOptions = ["Friend", "Brother", "Sister", "Mother", "Father", "Teacher", "Partner", "Classmate", "Other"];

export default function BirthdayDetailsForm({ formData, onChange }) {
  return (
    <section className="form-grid">
      <label className="field">
        <span>Name</span>
        <input
          type="text"
          value={formData.name}
          placeholder="E.g. Kalindu"
          onChange={(event) => onChange("name", event.target.value)}
        />
      </label>

      <label className="field">
        <span>Age</span>
        <input
          type="number"
          min="1"
          max="120"
          step="1"
          inputMode="numeric"
          value={formData.age}
          placeholder="E.g. 22"
          onChange={(event) => onChange("age", event.target.value)}
        />
      </label>

      <label className="field">
        <span>Relationship</span>
        <select value={formData.relationship} onChange={(event) => onChange("relationship", event.target.value)}>
          {relationshipOptions.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Card type</span>
        <select value={formData.cardType} onChange={(event) => onChange("cardType", event.target.value)}>
          {CARD_TYPE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="field full-width">
        <span>Occupation</span>
        <input
          type="text"
          value={formData.occupation}
          placeholder="Used only as AI context"
          onChange={(event) => onChange("occupation", event.target.value)}
        />
      </label>

      <label className="field full-width">
        <span>Interesting thing</span>
        <input
          type="text"
          value={formData.interestingThing}
          placeholder="E.g. Loves Python, plays guitar, reads fantasy novels"
          onChange={(event) => onChange("interestingThing", event.target.value)}
        />
      </label>
    </section>
  );
}
