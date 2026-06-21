import React, { useEffect, useRef, useState } from "react";
import DesignToolbar from "./components/DesignToolbar.jsx";
import BirthdayForm from "./components/BirthdayForm.jsx";
import CardPreview from "./components/CardPreview.jsx";
import DownloadOptions from "./components/DownloadOptions.jsx";
import ImageUpload from "./components/ImageUpload.jsx";
import PhotoAdjustModal from "./components/PhotoAdjustModal.jsx";
import DrawShapeModal from "./components/DrawShapeModal.jsx";
import PropertiesPanel from "./components/PropertiesPanel.jsx";
import { templates } from "./data/templates.js";
import { generateWish, analyzeImage } from "./services/api.js";
import SplashScreen from "./components/SplashScreen.jsx";

const MIN_AGE = 1;
const MAX_AGE = 120;

const initialForm = {
  name: "",
  age: "",
  relationship: "friend",
  personality: "",
  interestingThing: "",
  senderName: ""
};

const TEMPLATE_BY_ID = templates.reduce((acc, t) => {
  acc[t.id] = t;
  return acc;
}, {});

const defaultTemplate = TEMPLATE_BY_ID.modern_dark;

const initialPhotoTransform = { x: 0, y: 0, scale: 1 };

export default function App() {
  const stageRef = useRef(null);
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [wishData, setWishData] = useState({
    title: "",
    name: "",
    wish: "",
    signature: ""
  });
  const [photoTransform, setPhotoTransform] = useState(initialPhotoTransform);
  const [draftPhotoTransform, setDraftPhotoTransform] = useState(initialPhotoTransform);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isPhotoConfirmed, setIsPhotoConfirmed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  
  const template = defaultTemplate;

  const [designSettings, setDesignSettings] = useState({ cardAspectRatio: "4:5" });
  const [elementPositions, setElementPositions] = useState({});
  const [colorPoints, setColorPoints] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  const [isDrawShapeModalOpen, setIsDrawShapeModalOpen] = useState(false);
  const [customShapePath, setCustomShapePath] = useState(null);
  
  const [zoomScale, setZoomScale] = useState(0.5); // Default start scale
  const wrapRef = useRef(null);
  const [isPanMode, setIsPanMode] = useState(false);
  const [isDraggingWrap, setIsDraggingWrap] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const [showSplash, setShowSplash] = useState(true);

  const getCardDimensions = () => {
    const ar = designSettings.cardAspectRatio || "4:5";
    if (ar === "16:9") return { w: 1920, h: 1080 };
    if (ar === "9:16") return { w: 1080, h: 1920 };
    if (ar === "4:3") return { w: 1440, h: 1080 };
    if (ar === "3:4") return { w: 1080, h: 1440 };
    if (ar === "1:1") return { w: 1080, h: 1080 };
    return { w: 1080, h: 1350 };
  };

  const handleFitZoom = () => {
    if (!wrapRef.current) return;
    const wrap = wrapRef.current;
    const { w, h } = getCardDimensions();
    // Accounting for 100px padding on all sides (200px total) plus buffer
    const scaleX = (wrap.clientWidth - 240) / w;
    const scaleY = (wrap.clientHeight - 240) / h;
    setZoomScale(Math.min(scaleX, scaleY, 1.5));
  };

  const { w: cardW, h: cardH } = getCardDimensions();
  const dynTemplate = { ...template, width: cardW, height: cardH };

  useEffect(() => {
    handleFitZoom();
  }, [designSettings.cardAspectRatio]);

  useEffect(() => {
    // Seed design settings from the selected template (only if not already set, or you can allow full override)
    // To make sure we don't wipe out AI recommendations when template changes, we merge.
    // Randomize initial background color
    const randomColors = ["#0f172a", "#1e1b4b", "#171717", "#052e16", "#3b0764", "#0f766e", "#831843"];
    const randomBg = randomColors[Math.floor(Math.random() * randomColors.length)];

    setDesignSettings(current => ({
      frameShape: current.frameShape || "circle",
      frameStyle: current.frameStyle || "classic",
      cardAspectRatio: current.cardAspectRatio || "4:5",
      cardBackgroundColor: current.cardBackgroundColor || randomBg,
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
  }, []);

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
      console.error(requestError);
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
      setDesignSettings((prev) => ({
        ...prev,
        titleText: undefined,
        nameText: undefined,
        wishText: undefined,
        signatureText: undefined
      }));
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
    if (field === "addColorPoint") {
      const newPoint = {
        id: "color-" + Date.now(),
        type: "colorPoint",
        x: template.width / 2,
        y: template.height / 2,
        color: "#" + Math.floor(Math.random()*16777215).toString(16),
        radius: 300,
      };
      setColorPoints([...colorPoints, newPoint]);
      setSelectedId(newPoint.id);
      return;
    }
    
    // If a color point is selected and the user changes color in the UI, we could apply it, 
    // but the UI currently doesn't have a color point color picker. We'll add it in CardPreview or rely on random.
    setDesignSettings((current) => ({ ...current, [field]: value }));
  };

  const handleElementDrag = (id, pos) => {
    setElementPositions(current => ({ ...current, [id]: pos }));
  };

  const handleAddEmoji = (emojiChar) => {
    const newEmoji = {
      id: "emoji-" + Date.now().toString(),
      type: "emoji",
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
  
  const handleColorPointChange = (id, newProps) => {
    setColorPoints((current) => 
      current.map((pt) => (pt.id === id ? { ...pt, ...newProps } : pt))
    );
  };

  const bringForward = () => {
    if (!selectedId) return;
    if (selectedId.startsWith("emoji-")) {
      const index = emojis.findIndex((e) => e.id === selectedId);
      if (index === -1 || index === emojis.length - 1) return;
      const newEmojis = [...emojis];
      const [item] = newEmojis.splice(index, 1);
      newEmojis.splice(index + 1, 0, item);
      setEmojis(newEmojis);
    }
  };

  const sendBackward = () => {
    if (!selectedId) return;
    if (selectedId.startsWith("emoji-")) {
      const index = emojis.findIndex((e) => e.id === selectedId);
      if (index <= 0) return;
      const newEmojis = [...emojis];
      const [item] = newEmojis.splice(index, 1);
      newEmojis.splice(index - 1, 0, item);
      setEmojis(newEmojis);
    }
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    if (selectedId.startsWith("emoji-")) {
      setEmojis(emojis.filter(e => e.id !== selectedId));
    } else if (selectedId.startsWith("color-")) {
      setColorPoints(colorPoints.filter(p => p.id !== selectedId));
    }
    setSelectedId(null);
  };

  const canDownload = Boolean(wishData && imagePreview && isPhotoConfirmed);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div className="top-header">
        <div className="logo-area">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
          <span className="logo-text">Wishgen AI</span>
        </div>
      </div>
      <main className={`app-shell ${showSplash ? 'hidden-content' : ''}`}>
        <div className="ambient-bg-glow glow-primary"></div>
        <div className="ambient-bg-glow glow-secondary"></div>
        
        <section className="designer-workspace">
          <aside className="control-panel">
            <div className="title-block">
              <h1>Birthday Card Editor</h1>
            </div>

          <BirthdayForm formData={formData} onChange={handleFormChange} onGenerate={handleGenerateWish} isLoading={isGenerating} />
          <ImageUpload imagePreview={imagePreview} onImageChange={handleImageChange} />
          {isAnalyzing && <p style={{ color: "#0f766e", fontWeight: "bold" }}>✨ AI is analyzing image for design recommendations...</p>}
          <DesignToolbar 
            designSettings={designSettings} 
            onChange={handleDesignChange} 
            onAddEmoji={handleAddEmoji}
            hasSelection={!!selectedId}
            onBringForward={bringForward}
            onSendBackward={sendBackward}
            onDeleteSelected={handleDeleteSelected}
            onOpenDrawModal={() => {
              if (!imagePreview) {
                setError("Please upload an image first to draw a shape over it.");
                return;
              }
              setIsDrawShapeModalOpen(true);
            }}
          />

          {error ? <p className="error-message">{error}</p> : null}

          <div className="photo-actions">
            <button 
              type="button" 
              className="secondary-button" 
              onClick={openPhotoModal}
              disabled={designSettings.frameShape === "custom"}
              title={designSettings.frameShape === "custom" ? "Not available for custom drawn shapes" : ""}
            >
              Edit Photo Inside Frame
            </button>
            <span>{isPhotoConfirmed ? "Photo confirmed" : "Photo not confirmed yet"}</span>
          </div>

          <DownloadOptions stageRef={stageRef} name={formData.name} disabled={!canDownload} />
        </aside>

        <section className="preview-panel">
          <div className="preview-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p className="eyebrow">Final Preview</p>
              <small>Drag any text or the photo frame to reposition it.</small>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="secondary-button" onClick={() => setZoomScale(z => Math.max(0.1, z - 0.1))}>Zoom Out</button>
              <button className="secondary-button" onClick={handleFitZoom}>Fit</button>
              <button className="secondary-button" onClick={() => setZoomScale(z => Math.min(3, z + 0.1))}>Zoom In</button>
              <button className={`secondary-button ${isPanMode ? 'active' : ''}`} onClick={() => setIsPanMode(!isPanMode)} style={{ background: isPanMode ? '#3b82f6' : '', color: isPanMode ? '#fff' : '' }}>
                {isPanMode ? 'Stop Panning' : 'Pan Mode'}
              </button>
            </div>
          </div>
          <div 
            className="canvas-wrap" 
            ref={wrapRef} 
            style={{ 
              overflow: "auto", 
              cursor: isPanMode ? (isDraggingWrap ? "grabbing" : "grab") : "default" 
            }}
            onMouseDownCapture={(e) => {
              if (!isPanMode) return;
              e.stopPropagation();
              e.preventDefault();
              setIsDraggingWrap(true);
              dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                scrollLeft: wrapRef.current.scrollLeft,
                scrollTop: wrapRef.current.scrollTop
              };
            }}
            onMouseMoveCapture={(e) => {
              if (!isPanMode) return;
              e.stopPropagation();
              e.preventDefault();
              if (!isDraggingWrap) return;
              const dx = e.clientX - dragStart.current.x;
              const dy = e.clientY - dragStart.current.y;
              if (wrapRef.current) {
                wrapRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
                wrapRef.current.scrollTop = dragStart.current.scrollTop - dy;
              }
            }}
            onMouseUpCapture={(e) => {
              if (!isPanMode) return;
              e.stopPropagation();
              e.preventDefault();
              setIsDraggingWrap(false);
            }}
            onMouseLeave={() => {
              if (isPanMode) setIsDraggingWrap(false);
            }}
          >
            <div style={{ minWidth: "100%", minHeight: "100%", display: "flex", padding: "100px", boxSizing: "border-box" }}>
              <div style={{ margin: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}>
                <CardPreview 
                  ref={stageRef} 
                  scale={zoomScale}
                  template={dynTemplate} 
                  imageUrl={imagePreview} 
                  photoTransform={photoTransform} 
                  wishData={wishData} 
                  formData={formData} 
                  designSettings={designSettings} 
                  elementPositions={elementPositions}
                  onElementDrag={handleElementDrag}
                  colorPoints={colorPoints}
                  onColorPointChange={handleColorPointChange}
                  emojis={emojis}
                  selectedId={selectedId}
                  onSelectId={setSelectedId}
                  onChangeEmoji={handleEmojiChange}
                  customShapePath={customShapePath}
                />
              </div>
            </div>
          </div>
        </section>

        <PropertiesPanel
          selectedId={selectedId}
          designSettings={designSettings}
          onChangeDesign={handleDesignChange}
          colorPoints={colorPoints}
          onChangeColorPoint={handleColorPointChange}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
          onDeleteSelected={handleDeleteSelected}
          onOpenDrawModal={() => {
            setIsDrawShapeModalOpen(true);
          }}
        />
      </section>

      <PhotoAdjustModal
        isOpen={isPhotoModalOpen}
        template={dynTemplate}
        imageUrl={imagePreview}
        transform={draftPhotoTransform}
        designSettings={designSettings}
        onChange={setDraftPhotoTransform}
        onConfirm={confirmPhoto}
        onCancel={() => setIsPhotoModalOpen(false)}
      />

      <DrawShapeModal
        isOpen={isDrawShapeModalOpen}
        imageUrl={imagePreview}
        onSave={(path) => {
          setCustomShapePath(path);
          setDesignSettings(current => ({ ...current, frameShape: "custom" }));
          setIsDrawShapeModalOpen(false);
        }}
        onCancel={() => {
          setIsDrawShapeModalOpen(false);
          if (!customShapePath) setDesignSettings(current => ({ ...current, frameShape: "circle" }));
        }}
      />
    </main>
    </>
  );
}
