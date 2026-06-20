import { useEffect, useRef, useState } from "react";
import DesignToolbar from "./components/DesignToolbar.jsx";
import BirthdayForm from "./components/BirthdayForm.jsx";
import CardPreview from "./components/CardPreview.jsx";
import DownloadOptions from "./components/DownloadOptions.jsx";
import ImageUpload from "./components/ImageUpload.jsx";
import PhotoAdjustModal from "./components/PhotoAdjustModal.jsx";
import TemplateSelector from "./components/TemplateSelector.jsx";
import { templates } from "./data/templates.js";
import { generateWish, analyzeImage } from "./services/api.js";

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

const TEMPLATE_BY_ID = templates.reduce((acc, t) => {
  acc[t.id] = t;
  return acc;
}, {});

const initialPhotoTransform = { x: 0, y: 0, scale: 1 };

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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  
  const template = TEMPLATE_BY_ID[formData.template] || TEMPLATE_BY_ID.modern_dark;

  const [designSettings, setDesignSettings] = useState({});
  const [elementPositions, setElementPositions] = useState({});
  const [glowPoint, setGlowPoint] = useState(null); // {x, y}
  const [emojis, setEmojis] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    // Seed design settings from the selected template (only if not already set, or you can allow full override)
    // To make sure we don't wipe out AI recommendations when template changes, we merge.
    setDesignSettings(current => ({
      frameShape: current.frameShape || "circle",
      frameStyle: current.frameStyle || "classic",
      cardBackgroundColor: current.cardBackgroundColor || template.colors.background,
      glowColor: current.glowColor || "transparent",
      circleBorderColor: current.circleBorderColor || template.imageFrame.borderColor,
      circleBorderWidth: current.circleBorderWidth !== undefined ? current.circleBorderWidth : template.imageFrame.borderWidth,
      circleRadius: current.circleRadius || template.imageFrame.radius,
      titleFontFamily: current.titleFontFamily || template.fonts.title,
      titleFontSize: current.titleFontSize || 50,
      titleFontColor: current.titleFontColor || template.colors.primary,
      nameFontFamily: current.nameFontFamily || template.fonts.name,
      nameFontSize: current.nameFontSize || 40,
      nameFontColor: current.nameFontColor || template.colors.secondary,
      wishFontFamily: current.wishFontFamily || template.fonts.wish,
      wishFontSize: current.wishFontSize || 24,
      wishFontColor: current.wishFontColor || template.colors.primary,
    }));

    setElementPositions(current => ({
      title: current.title || { x: 0, y: template.positions.title.y },
      name: current.name || { x: 0, y: template.positions.name.y },
      wish: current.wish || { x: template.width * 0.1, y: template.positions.wish.y },
      signature: current.signature || { x: template.width * 0.1, y: template.positions.signature.y },
      frame: current.frame || { x: template.imageFrame.x, y: template.imageFrame.y },
    }));
  }, [formData.template, template]);

  const handleFormChange = (field, value) => {
    if (field === "age") {
      setFormData((current) => ({ ...current, age: value.replace(/\D/g, "") }));
      return;
    }
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = async (file) => {
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

    // AI Analysis
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(file);
      if (result.recommendations) {
        setDesignSettings(current => ({
          ...current,
          ...result.recommendations
        }));
      }
    } catch (requestError) {
      // Don't fail the whole app if vision analysis fails, just show a temporary error or ignore
      console.error(requestError);
      // setError("Could not fetch AI design recommendations. You can still design manually.");
    } finally {
      setIsAnalyzing(false);
    }
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

  const handleDesignChange = (field, value) => {
    setDesignSettings((current) => ({ ...current, [field]: value }));
  };

  const handleElementDrag = (id, pos) => {
    setElementPositions(current => ({ ...current, [id]: pos }));
  };

  const handleAddEmoji = (emojiChar) => {
    const newEmoji = {
      id: Date.now().toString(),
      char: emojiChar,
      x: template.width / 2,
      y: template.height / 2,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    };
    setEmojis([...emojis, newEmoji]);
    setSelectedId(newEmoji.id);
  };

  const handleEmojiChange = (id, newProps) => {
    setEmojis((current) =>
      current.map((emoji) => (emoji.id === id ? { ...emoji, ...newProps } : emoji))
    );
  };

  const bringForward = () => {
    if (!selectedId) return;
    const index = emojis.findIndex((e) => e.id === selectedId);
    if (index === -1 || index === emojis.length - 1) return;
    const newEmojis = [...emojis];
    const [item] = newEmojis.splice(index, 1);
    newEmojis.splice(index + 1, 0, item);
    setEmojis(newEmojis);
  };

  const sendBackward = () => {
    if (!selectedId) return;
    const index = emojis.findIndex((e) => e.id === selectedId);
    if (index <= 0) return;
    const newEmojis = [...emojis];
    const [item] = newEmojis.splice(index, 1);
    newEmojis.splice(index - 1, 0, item);
    setEmojis(newEmojis);
  };

  const canDownload = Boolean(wishData && imagePreview && isPhotoConfirmed);

  return (
    <main className="app-shell">
      <section className="designer-workspace">
        <aside className="control-panel">
          <div className="title-block">
            <p className="eyebrow">WishGen AI</p>
            <h1>Birthday Card Editor</h1>
          </div>

          <BirthdayForm formData={formData} onChange={handleFormChange} onGenerate={handleGenerateWish} isLoading={isGenerating} />
          <ImageUpload imagePreview={imagePreview} onImageChange={handleImageChange} />
          {isAnalyzing && <p style={{ color: "#0f766e", fontWeight: "bold" }}>✨ AI is analyzing image for design recommendations...</p>}
          <TemplateSelector selectedTemplate={formData.template} onSelect={(templateId) => handleFormChange("template", templateId)} />
          <DesignToolbar 
            designSettings={designSettings} 
            onChange={handleDesignChange} 
            onAddEmoji={handleAddEmoji}
            hasSelection={!!selectedId}
            onBringForward={bringForward}
            onSendBackward={sendBackward}
            onDeleteSelected={() => {
              if (selectedId) {
                setEmojis(emojis.filter(e => e.id !== selectedId));
                setSelectedId(null);
              }
            }}
          />

          {error ? <p className="error-message">{error}</p> : null}

          <div className="photo-actions">
            <button type="button" className="secondary-button" onClick={openPhotoModal}>
              Edit Photo Inside Frame
            </button>
            <span>{isPhotoConfirmed ? "Photo confirmed" : "Photo not confirmed yet"}</span>
          </div>

          <DownloadOptions stageRef={stageRef} name={formData.name} disabled={!canDownload} />
        </aside>

        <section className="preview-panel">
          <div className="preview-heading">
            <p className="eyebrow">Final Preview</p>
            <h2>{template.name}</h2>
            <small>Drag any text or the photo frame to reposition it.</small>
          </div>
          <div className="canvas-wrap">
            <CardPreview 
              ref={stageRef} 
              template={template} 
              imageUrl={imagePreview} 
              photoTransform={photoTransform} 
              wishData={wishData} 
              formData={formData} 
              designSettings={designSettings} 
              elementPositions={elementPositions}
              onElementDrag={handleElementDrag}
              glowPoint={glowPoint}
              onSetGlowPoint={setGlowPoint}
              emojis={emojis}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              onChangeEmoji={handleEmojiChange}
            />
          </div>
        </section>
      </section>

      <PhotoAdjustModal
        isOpen={isPhotoModalOpen}
        template={template}
        imageUrl={imagePreview}
        transform={draftPhotoTransform}
        designSettings={designSettings}
        onChange={setDraftPhotoTransform}
        onConfirm={confirmPhoto}
        onCancel={() => setIsPhotoModalOpen(false)}
      />
    </main>
  );
}
