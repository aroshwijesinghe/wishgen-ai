export default function ImageUpload({ imagePreview, onImageChange }) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    onImageChange(file);
  };

  return (
    <section className="form-section">
      <label className="field-label" htmlFor="birthday-image">
        Birthday photo
      </label>
      <label className="upload-box" htmlFor="birthday-image">
        {imagePreview ? (
          <img src={imagePreview} alt="Uploaded birthday preview" />
        ) : (
          <span>Choose an image</span>
        )}
      </label>
      <input
        id="birthday-image"
        className="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </section>
  );
}
