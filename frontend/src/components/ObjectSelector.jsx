import { CARD_OBJECTS } from "../data/cardObjects.js";

export default function ObjectSelector({ selectedObjects, onChange, limitMessage }) {
  const toggleObject = (objectId) => {
    if (selectedObjects.includes(objectId)) {
      onChange(selectedObjects.filter((id) => id !== objectId), "");
      return;
    }

    if (selectedObjects.length >= 2) {
      onChange(selectedObjects, "Select one or two objects only.");
      return;
    }

    onChange([...selectedObjects, objectId], "");
  };

  return (
    <section className="object-selector">
      <div className="section-heading-row">
        <span>Birthday objects</span>
        <small>{selectedObjects.length}/2 selected</small>
      </div>
      <div className="object-grid">
        {CARD_OBJECTS.map((object) => {
          const selected = selectedObjects.includes(object.id);
          return (
            <button
              key={object.id}
              type="button"
              className={`object-chip ${selected ? "selected" : ""}`}
              onClick={() => toggleObject(object.id)}
            >
              <span>{object.icon}</span>
              {object.label}
            </button>
          );
        })}
      </div>
      {limitMessage ? <p className="hint-message">{limitMessage}</p> : null}
    </section>
  );
}
