export default function CardPreview({ generatedCard, imagePreview, formData, isGenerating }) {
  return (
    <aside className="preview-panel">
      <div className="preview-heading">
        <p className="eyebrow">Preview</p>
        <h2>Generated card</h2>
      </div>

      <div className="card-preview">
        {generatedCard ? (
          <img src={generatedCard.cardUrl} alt="Generated birthday card" />
        ) : (
          <div className="mock-card">
            {imagePreview ? (
              <img src={imagePreview} alt="Birthday person preview" />
            ) : (
              <div className="photo-placeholder">Photo</div>
            )}
            <div>
              <p className="mock-title">
                Happy Birthday{formData.name ? `, ${formData.name}` : ""}!
              </p>
              <p className="mock-copy">
                {isGenerating
                  ? "Creating your card..."
                  : "Your generated card will appear here."}
              </p>
            </div>
          </div>
        )}
      </div>

      {generatedCard ? (
        <div className="result-details">
          <p>{generatedCard.message}</p>
          <span>Theme: {generatedCard.selectedTheme}</span>
          <a className="download-button" href={generatedCard.cardUrl} download>
            Download card
          </a>
        </div>
      ) : null}
    </aside>
  );
}
