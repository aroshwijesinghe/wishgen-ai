import { useRef, useState } from "react";
import BorderStyleControls from "./components/BorderStyleControls.jsx";
import BirthdayForm from "./components/BirthdayForm.jsx";
import CardPreview from "./components/CardPreview.jsx";
import DownloadOptions from "./components/DownloadOptions.jsx";
import ImageUpload from "./components/ImageUpload.jsx";
import PhotoAdjustModal from "./components/PhotoAdjustModal.jsx";
import TemplateSelector from "./components/TemplateSelector.jsx";
import { TEMPLATE_BY_ID } from "./data/templates.js";
import { generateWish } from "./services/api.js";

const MIN_AGE = 1;
const MAX_AGE = 120;

const initialForm = {
  name: "",
  age: "",
  relationship: "friend",
  personality: "",
  interestingThing: "",
  senderName: "",
  template: "modern_dark"
};

const initialPhotoTransform = { x: 0, y: 0, scale: 1 };
const initialBorderSettings = {
  cardBorderStyle: "solid",
  cardBorderColor: "#6F8F72",
  circleBorderColor: "#6F8F72"
};

export default function App() {
  const stageRef = useRef(null);
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [wishData, setWishData] = useState(null);
  const [photoTransform, setPhotoTransform] = useState(initialPhotoTransform);
  const [draftPhotoTransform, setDraftPhotoTransform] = useState(initialPhotoTransform);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isPhotoConfirmed, setIsPhotoConfirmed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [borderSettings, setBorderSettings] = useState(initialBorderSettings);

  const template = TEMPLATE_BY_ID[formData.template] || TEMPLATE_BY_ID.modern_dark;

  const handleFormChange = (field, value) => {
    if (field === "age") {
      setFormData((current) => ({ ...current, age: value.replace(/\D/g, "") }));
      return;
    }

    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (file) => {
    setImageFile(file);
    setIsPhotoConfirmed(false);
    setPhotoTransform(initialPhotoTransform);
    setDraftPhotoTransform(initialPhotoTransform);
    setError("");

    if (!file) {
      setImagePreview("");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const validateDetails = () => {
    if (!formData.name.trim()) return "Please enter the birthday person's name.";

    const age = Number(formData.age);
    if (!Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) {
      return `Please enter a whole number age from ${MIN_AGE} to ${MAX_AGE}.`;
    }

    if (!formData.personality.trim()) return "Please add a personality or vibe.";
    if (!formData.interestingThing.trim()) return "Please add an interesting thing or hobby.";
    return "";
  };

  const handleGenerateWish = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateWish(formData);
      setWishData({
        wish: result.wish,
        short_title: result.short_title,
        signature_line: result.signature_line
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const openPhotoModal = () => {
    if (!imagePreview) {
      setError("Please upload a photo first.");
      return;
    }

    setDraftPhotoTransform(photoTransform);
    setIsPhotoModalOpen(true);
  };

  const confirmPhoto = () => {
    setPhotoTransform(draftPhotoTransform);
    setIsPhotoConfirmed(true);
    setIsPhotoModalOpen(false);
  };

  const handleBorderChange = (field, value) => {
    setBorderSettings((current) => ({ ...current, [field]: value }));
  };

  const canDownload = Boolean(wishData && imagePreview && isPhotoConfirmed);

  return (
    <main className="app-shell">
      <section className="designer-workspace">
        <aside className="control-panel">
          <div className="title-block">
            <p className="eyebrow">WishGen AI</p>
            <h1>Template birthday card generator</h1>
          </div>

          <BirthdayForm formData={formData} onChange={handleFormChange} onGenerate={handleGenerateWish} isLoading={isGenerating} />
          <ImageUpload imagePreview={imagePreview} onImageChange={handleImageChange} />
          <TemplateSelector selectedTemplate={formData.template} onSelect={(templateId) => handleFormChange("template", templateId)} />
          <BorderStyleControls borderSettings={borderSettings} onChange={handleBorderChange} />

          {error ? <p className="error-message">{error}</p> : null}

          <div className="photo-actions">
            <button type="button" className="secondary-button" onClick={openPhotoModal}>
              Edit Photo Position
            </button>
            <span>{isPhotoConfirmed ? "Photo confirmed" : "Photo not confirmed yet"}</span>
          </div>

          <DownloadOptions stageRef={stageRef} name={formData.name} disabled={!canDownload} />
        </aside>

        <section className="preview-panel">
          <div className="preview-heading">
            <p className="eyebrow">Final Preview</p>
            <h2>{template.name}</h2>
          </div>
          <div className="canvas-wrap">
            <CardPreview ref={stageRef} template={template} imageUrl={imagePreview} photoTransform={photoTransform} wishData={wishData} formData={formData} borderSettings={borderSettings} />
          </div>
        </section>
      </section>

      <PhotoAdjustModal
        isOpen={isPhotoModalOpen}
        template={template}
        imageUrl={imagePreview}
        transform={draftPhotoTransform}
        borderSettings={borderSettings}
        onChange={setDraftPhotoTransform}
        onConfirm={confirmPhoto}
        onCancel={() => setIsPhotoModalOpen(false)}
      />
    </main>
  );
}
