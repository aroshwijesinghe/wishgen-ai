import { TEMPLATES } from "../data/templates.js";

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  return (
    <section className="template-selector">
      <div className="section-heading-row">
        <span>Card template</span>
        <small>Choose one</small>
      </div>
      <div className="template-grid">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`template-card ${selectedTemplate === template.id ? "selected" : ""}`}
            onClick={() => onSelect(template.id)}
          >
            <span className="template-swatch" style={{ background: `linear-gradient(135deg, ${template.colors.background}, ${template.colors.backgroundAlt})` }} />
            <strong>{template.name}</strong>
            <small>{template.description}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
