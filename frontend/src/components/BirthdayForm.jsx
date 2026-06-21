const relationships = ["Friend", "Brother", "Sister", "Mother", "Father", "Teacher", "Partner", "Classmate", "Other"];

export default function BirthdayForm({ formData, onChange, onGenerate, isLoading }) {
  return (
    <form className="card-form" onSubmit={onGenerate}>
      <section className="form-grid">
        <label className="field">
          <span>Birthday person name</span>
          <input value={formData.name} placeholder="E.g. Kalindu" onChange={(event) => onChange("name", event.target.value)} />
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
            {relationships.map((relationship) => (
              <option key={relationship} value={relationship.toLowerCase()}>
                {relationship}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Optional sender name</span>
          <input value={formData.senderName} placeholder="E.g. Arosh" onChange={(event) => onChange("senderName", event.target.value)} />
        </label>

        <label className="field full-width">
          <span>Personality or vibe</span>
          <input value={formData.personality} placeholder="E.g. creative and funny" onChange={(event) => onChange("personality", event.target.value)} />
        </label>

        <label className="field full-width">
          <span>Interesting thing / hobby</span>
          <input value={formData.interestingThing} placeholder="E.g. loves Python and guitar" onChange={(event) => onChange("interestingThing", event.target.value)} />
        </label>
      </section>

      <button className="primary-button" type="submit" disabled={isLoading}>
        {isLoading ? "Generating Wish..." : "Generate Wish"}
      </button>
    </form>
  );
}
