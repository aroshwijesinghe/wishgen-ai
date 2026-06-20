export default function AIMessagePanel({ aiPlan, isLoading, onRegenerate }) {
  if (!aiPlan) {
    return (
      <section className="ai-panel empty-panel">
        <span>AI text will appear after generation.</span>
      </section>
    );
  }

  return (
    <section className="ai-panel">
      <div className="section-heading-row">
        <span>AI message plan</span>
        <button type="button" className="small-button" onClick={onRegenerate} disabled={isLoading}>
          {isLoading ? "Regenerating..." : "Regenerate AI Text"}
        </button>
      </div>
      <p className="wish-copy">{aiPlan.main_wish}</p>
      <p className="tagline-copy">{aiPlan.short_tagline}</p>
      <div className="mini-list">
        {(aiPlan.decorative_words || []).map((word) => (
          <span key={word}>{word}</span>
        ))}
      </div>
      <div className="object-text-list">
        {Object.entries(aiPlan.object_texts || {}).map(([objectId, text]) => (
          <p key={objectId}>
            <strong>{objectId.replace("_", " ")}:</strong> {text}
          </p>
        ))}
      </div>
    </section>
  );
}
