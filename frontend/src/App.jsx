import { useState } from "react";
import AIMessagePanel from "./components/AIMessagePanel.jsx";
import BirthdayDetailsForm from "./components/BirthdayDetailsForm.jsx";
import CardCanvas from "./components/CardCanvas.jsx";
import ImageUpload from "./components/ImageUpload.jsx";
import ObjectSelector from "./components/ObjectSelector.jsx";
import { generateCard, planCard } from "./services/api.js";
import { generateInitialLayers } from "./utils/layoutGenerator.js";

const MIN_AGE = 1;
const MAX_AGE = 120;

const initialForm = {
  name: "",
  age: "",
  relationship: "friend",
  occupation: "",
  interestingThing: "",
  cardType: "Modern Dark",
  selectedObjects: ["cake"]
};

export default function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [aiPlan, setAiPlan] = useState(null);
  const [themePlan, setThemePlan] = useState(null);
  const [portraitUrl, setPortraitUrl] = useState("");
  const [layers, setLayers] = useState([]);
  const [initialLayers, setInitialLayers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState("");
  const [objectMessage, setObjectMessage] = useState("");

  const handleImageChange = (file) => {
    setImageFile(file);
    setAiPlan(null);
    setThemePlan(null);
    setPortraitUrl("");
    setLayers([]);
    setInitialLayers([]);
    setError("");

    if (!file) {
      setImagePreview("");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const handleFormChange = (field, value) => {
    if (field === "age") {
      setFormData((current) => ({ ...current, age: value.replace(/\D/g, "") }));
      return;
    }

    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleObjectsChange = (selectedObjects, message) => {
    setFormData((current) => ({ ...current, selectedObjects }));
    setObjectMessage(message);
  };

  const validateForm = ({ requireImage }) => {
    if (requireImage && !imageFile) {
      return "Please upload a birthday photo first.";
    }

    if (!formData.name.trim()) {
      return "Please enter the person's name.";
    }

    const ageNumber = Number(formData.age);
    if (!Number.isInteger(ageNumber) || ageNumber < MIN_AGE || ageNumber > MAX_AGE) {
      return `Please enter a whole number age from ${MIN_AGE} to ${MAX_AGE}.`;
    }

    if (formData.selectedObjects.length < 1) {
      return "Please select at least one birthday object.";
    }

    if (formData.selectedObjects.length > 2) {
      return "Please select no more than two birthday objects.";
    }

    return "";
  };

  const applyGeneratedPlan = (result) => {
    const nextPortraitUrl = result.portrait_url || portraitUrl;
    const nextAiPlan = result.ai_plan;
    const nextLayers = generateInitialLayers({
      cardType: formData.cardType,
      selectedObjects: formData.selectedObjects,
      aiPlan: nextAiPlan,
      portraitUrl: nextPortraitUrl
    });

    setAiPlan(nextAiPlan);
    setThemePlan(result.theme_plan);
    setPortraitUrl(nextPortraitUrl);
    setLayers(nextLayers);
    setInitialLayers(nextLayers);
  };

  const handleGenerateCard = async (event) => {
    event.preventDefault();
    setError("");
    setObjectMessage("");

    const validationError = validateForm({ requireImage: true });
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateCard(formData, imageFile);
      applyGeneratedPlan(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateText = async () => {
    setError("");

    const validationError = validateForm({ requireImage: false });
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsRegenerating(true);

    try {
      const result = await planCard(formData);
      const nextAiPlan = result.ai_plan;
      setAiPlan(nextAiPlan);
      setThemePlan(result.theme_plan);
      setLayers((current) => syncTextLayers(current, nextAiPlan));
      setInitialLayers((current) => syncTextLayers(current, nextAiPlan));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="designer-workspace">
        <aside className="control-panel">
          <div className="title-block">
            <p className="eyebrow">WishGen AI</p>
            <h1>Interactive birthday card designer</h1>
          </div>

          <form onSubmit={handleGenerateCard} className="card-form">
            <ImageUpload imagePreview={imagePreview} portraitUrl={portraitUrl} onImageChange={handleImageChange} />
            <BirthdayDetailsForm formData={formData} onChange={handleFormChange} />
            <ObjectSelector selectedObjects={formData.selectedObjects} onChange={handleObjectsChange} limitMessage={objectMessage} />

            {error ? <p className="error-message">{error}</p> : null}

            <button className="primary-button" type="submit" disabled={isGenerating}>
              {isGenerating ? "Generating AI Card..." : "Generate AI Card"}
            </button>
          </form>

          <AIMessagePanel aiPlan={aiPlan} isLoading={isRegenerating} onRegenerate={handleRegenerateText} />
        </aside>

        <CardCanvas
          layers={layers}
          setLayers={setLayers}
          initialLayers={initialLayers}
          formData={formData}
          aiPlan={aiPlan}
          themePlan={themePlan}
        />
      </section>
    </main>
  );
}

function syncTextLayers(layers, aiPlan) {
  return layers.map((layer) => {
    if (layer.id === "headline") return { ...layer, text: aiPlan.headline };
    if (layer.id === "name_text") return { ...layer, text: aiPlan.name_text };
    if (layer.id === "main_wish") return { ...layer, text: aiPlan.main_wish };
    if (layer.id === "short_tagline") return { ...layer, text: aiPlan.short_tagline };
    if (layer.id.startsWith("object_text_")) {
      const objectId = layer.id.replace("object_text_", "");
      return { ...layer, text: aiPlan.object_texts?.[objectId] || layer.text };
    }
    if (layer.id.startsWith("badge_")) {
      const index = Number(layer.id.replace("badge_", ""));
      return { ...layer, text: aiPlan.decorative_words?.[index] || layer.text };
    }
    return layer;
  });
}
