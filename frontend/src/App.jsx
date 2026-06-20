import { useState } from "react";
import BirthdayForm from "./components/BirthdayForm.jsx";
import CardPreview from "./components/CardPreview.jsx";
import ImageUpload from "./components/ImageUpload.jsx";

const API_BASE_URL = "http://localhost:8000";

const initialForm = {
  name: "",
  age: "",
  relationship: "friend",
  language: "English",
  theme: "auto"
};

export default function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [generatedCard, setGeneratedCard] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (file) => {
    setImageFile(file);
    setGeneratedCard(null);
    setError("");

    if (!file) {
      setImagePreview("");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const handleFormChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleGenerateCard = async (event) => {
    event.preventDefault();
    setError("");
    setGeneratedCard(null);

    if (!imageFile) {
      setError("Please upload a birthday photo first.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter the person's name.");
      return;
    }

    const payload = new FormData();
    payload.append("image", imageFile);
    payload.append("name", formData.name);
    payload.append("age", formData.age || "0");
    payload.append("relationship", formData.relationship);
    payload.append("language", formData.language);
    payload.append("theme", formData.theme);

    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-card`, {
        method: "POST",
        body: payload
      });

      if (!response.ok) {
        throw new Error("Card generation failed. Please check the backend server.");
      }

      const result = await response.json();
      setGeneratedCard({
        ...result,
        cardUrl: `${API_BASE_URL}${result.card_url}`
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="editor-panel">
          <div className="title-block">
            <p className="eyebrow">WishGen AI</p>
            <h1>Create a personalized birthday card</h1>
          </div>

          <form onSubmit={handleGenerateCard} className="card-form">
            <ImageUpload
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
            />
            <BirthdayForm formData={formData} onChange={handleFormChange} />

            {error ? <p className="error-message">{error}</p> : null}

            <button className="primary-button" type="submit" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Birthday Card"}
            </button>
          </form>
        </div>

        <CardPreview
          generatedCard={generatedCard}
          imagePreview={imagePreview}
          formData={formData}
          isGenerating={isGenerating}
        />
      </section>
    </main>
  );
}
