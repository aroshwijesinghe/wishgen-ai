import React, { useState } from "react";
import CustomSelect from "./CustomSelect.jsx";

const fonts = [
  "Playfair Display", "Lora", "Merriweather", // Serif
  "Montserrat", "Inter", "Poppins", "Outfit", "Roboto", // Sans-Serif
  "Great Vibes", "Pacifico", "Dancing Script", "Brush Script MT", "Caveat", // Handwriting/Script
  "Lobster", "Righteous", "Bebas Neue", "Shadows Into Light", "Amatic SC", // Display/Creative
  "Courier New", "Consolas" // Monospace
];

const shapes = [
  { id: "circle", label: "Circle" },
  { id: "square", label: "Square" },
  { id: "rounded_rect", label: "Rounded Rectangle" },
  { id: "star", label: "Star" },
  { id: "heart", label: "Heart" },
  { id: "polygon", label: "Polygon" },
  { id: "cloud", label: "Cloud" },
  { id: "line", label: "Line" },
  { id: "custom", label: "Custom (Draw)" },
];

const borderStyles = [
  { id: "solid", label: "Solid" },
  { id: "dashed", label: "Dashed" },
  { id: "dotted", label: "Dotted" },
  { id: "double", label: "Double" },
];

const frameStyles = [
  { id: "classic", label: "Classic Solid" },
  { id: "dashed", label: "Playful Dashed" },
  { id: "double", label: "Elegant Double Line" },
  { id: "neon", label: "Neon Glow" },
  { id: "hiphop", label: "Hip-Hop Graffiti" },
];

const aspectRatios = [
  { id: "4:5", label: "Portrait (4:5)" },
  { id: "3:4", label: "Portrait (3:4)" },
  { id: "9:16", label: "Story (9:16)" },
  { id: "1:1", label: "Square (1:1)" },
  { id: "4:3", label: "Landscape (4:3)" },
  { id: "16:9", label: "Landscape (16:9)" },
];

export default function PropertiesPanel({
  selectedId,
  designSettings,
  onChangeDesign,
  colorPoints,
  onChangeColorPoint,
  onBringForward,
  onSendBackward,
  onDeleteSelected,
  onOpenDrawModal,
}) {
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const isTextNode = ["title", "name", "wish", "signature"].includes(selectedId);
  const isColorBlob = selectedId && selectedId.startsWith("color-");
  const isEmoji = selectedId && selectedId.startsWith("emoji-");
  const isFrame = selectedId === "frame";

  if (!selectedId) {
    return (
      <aside className="properties-panel">
        <div className="title-block">
          <p className="eyebrow">Card Settings</p>
          <h2>Main Configuration</h2>
        </div>
        <div className="form-grid" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          <label className="field full-width">
            <span>Aspect Ratio</span>
            <CustomSelect
              value={designSettings.cardAspectRatio || "4:5"}
              onChange={(val) => onChangeDesign("cardAspectRatio", val)}
              options={aspectRatios.map(ar => ({ value: ar.id, label: ar.label }))}
            />
          </label>

          <label className="field color-field full-width">
            <span>Card Background Color</span>
            <input
              type="color"
              value={designSettings.cardBackgroundColor || "#ffffff"}
              onChange={(e) => onChangeDesign("cardBackgroundColor", e.target.value)}
            />
          </label>
          
          <hr style={{ border: "0", borderTop: "1px solid var(--panel-border)", margin: "14px 0" }} />
          <span className="field-label">Main Card Border</span>
          
          <label className="field full-width">
            <span>Border Style</span>
            <CustomSelect
              value={designSettings.cardBorderStyle || "solid"}
              onChange={(val) => onChangeDesign("cardBorderStyle", val)}
              options={borderStyles.map(bs => ({ value: bs.id, label: bs.label }))}
            />
          </label>

          <label className="field color-field full-width">
            <span>Border Color</span>
            <input
              type="color"
              value={designSettings.cardBorderColor || "#000000"}
              onChange={(e) => onChangeDesign("cardBorderColor", e.target.value)}
            />
          </label>

          <label className="field">
            <span>Border Width</span>
            <input
              type="number" min="0" max="100"
              value={designSettings.cardBorderWidth !== undefined ? designSettings.cardBorderWidth : 3}
              onChange={(e) => onChangeDesign("cardBorderWidth", Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span>Border Radius</span>
            <input
              type="number" min="0" max="200"
              value={designSettings.cardBorderRadius || 0}
              onChange={(e) => onChangeDesign("cardBorderRadius", Number(e.target.value))}
            />
          </label>

          <label className="field full-width">
            <span>Border Position (Inset)</span>
            <input
              type="range" min="0" max="200"
              value={designSettings.cardBorderInset !== undefined ? designSettings.cardBorderInset : 34}
              onChange={(e) => onChangeDesign("cardBorderInset", Number(e.target.value))}
            />
            <small>{designSettings.cardBorderInset !== undefined ? designSettings.cardBorderInset : 34}px from edge</small>
          </label>

        </div>
      </aside>
    );
  }

  return (
    <aside className="properties-panel">
      <div className="title-block" style={{ marginBottom: "1rem" }}>
        <p className="eyebrow">Properties</p>
        <h2 style={{ textTransform: "capitalize" }}>
          {isTextNode ? selectedId + " Text" : isColorBlob ? "Color Blob" : isFrame ? "Photo Frame" : "Sticker"}
        </h2>
      </div>

      <div className="form-grid" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        
        {/* TEXT EDITOR */}
        {isTextNode && (
          <>
            <label className="field full-width">
              <span>Text Content</span>
              <textarea
                rows={selectedId === "wish" ? 4 : 2}
                value={designSettings[`${selectedId}Text`] !== undefined ? designSettings[`${selectedId}Text`] : ""}
                placeholder="Type here to override the generated text..."
                onChange={(e) => onChangeDesign(`${selectedId}Text`, e.target.value)}
                style={{ resize: "vertical" }}
              />
            </label>
            <label className="field full-width">
              <span>Font Family</span>
              <div style={{ position: "relative" }}>
                <div 
                  onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                  style={{ padding: "10px 14px", border: "1px solid var(--input-border)", borderRadius: "8px", cursor: "pointer", background: "var(--input-bg)", display: "flex", justifyContent: "space-between", backdropFilter: "blur(8px)" }}
                >
                  <span style={{ fontFamily: designSettings[`${selectedId}FontFamily`] || "Arial" }}>
                    {designSettings[`${selectedId}FontFamily`] || "Arial"}
                  </span>
                  <span>▼</span>
                </div>
                {isFontDropdownOpen && (
                  <div className="font-dropdown-menu">
                    {fonts.map((font) => (
                      <div 
                        key={font} 
                        className="font-dropdown-item"
                        style={{ fontFamily: font }}
                        onMouseEnter={() => onChangeDesign(`${selectedId}FontFamily`, font)}
                        onClick={() => {
                          onChangeDesign(`${selectedId}FontFamily`, font);
                          setIsFontDropdownOpen(false);
                        }}
                      >
                        {font}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </label>
            <label className="field">
              <span>Font Size</span>
              <input
                type="number"
                min="10"
                max="150"
                value={designSettings[`${selectedId}FontSize`] || 20}
                onChange={(e) => onChangeDesign(`${selectedId}FontSize`, Number(e.target.value))}
              />
            </label>
            <label className="field color-field">
              <span>Color</span>
              <input
                type="color"
                value={designSettings[`${selectedId}FontColor`] || "#000000"}
                onChange={(e) => onChangeDesign(`${selectedId}FontColor`, e.target.value)}
              />
            </label>
            <label className="field full-width">
              <span>Alignment</span>
              <CustomSelect
                value={designSettings[`${selectedId}Align`] || "center"}
                onChange={(val) => onChangeDesign(`${selectedId}Align`, val)}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" }
                ]}
              />
            </label>
            <label className="field full-width">
              <span>Opacity</span>
              <input
                type="range" min="0" max="1" step="0.05"
                value={designSettings[`${selectedId}Opacity`] !== undefined ? designSettings[`${selectedId}Opacity`] : 1}
                onChange={(e) => onChangeDesign(`${selectedId}Opacity`, Number(e.target.value))}
              />
            </label>
            <hr style={{ border: "0", borderTop: "1px solid var(--panel-border)", margin: "14px 0" }} />
            <span className="field-label">Text Shadow</span>
            <label className="field color-field full-width">
              <span>Shadow Color</span>
              <input
                type="color"
                value={designSettings[`${selectedId}ShadowColor`] || "#000000"}
                onChange={(e) => onChangeDesign(`${selectedId}ShadowColor`, e.target.value)}
              />
            </label>
            <label className="field">
              <span>Shadow Blur</span>
              <input
                type="number" min="0" max="50"
                value={designSettings[`${selectedId}ShadowBlur`] || 0}
                onChange={(e) => onChangeDesign(`${selectedId}ShadowBlur`, Number(e.target.value))}
              />
            </label>
            <label className="field">
              <span>Shadow Offset Y</span>
              <input
                type="number" min="-50" max="50"
                value={designSettings[`${selectedId}ShadowOffsetY`] || 0}
                onChange={(e) => onChangeDesign(`${selectedId}ShadowOffsetY`, Number(e.target.value))}
              />
            </label>
          </>
        )}

        {/* COLOR BLOB EDITOR */}
        {isColorBlob && (() => {
          const blob = colorPoints.find((p) => p.id === selectedId);
          if (!blob) return null;
          return (
            <>
              <label className="field full-width">
                <span>Shape</span>
                <CustomSelect
                  value={blob.shape || "circle"}
                  onChange={(val) => onChangeColorPoint(selectedId, { shape: val })}
                  options={shapes.filter(s => s.id !== "custom").map(s => ({ value: s.id, label: s.label }))}
                />
              </label>
              <label className="field color-field full-width">
                <span>Blob Color</span>
                <input
                  type="color"
                  value={blob.color}
                  onChange={(e) => onChangeColorPoint(selectedId, { color: e.target.value })}
                />
              </label>
              {blob.shape !== "line" && (
                <label className="field full-width">
                  <span>Size / Radius</span>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    value={blob.radius}
                    onChange={(e) => onChangeColorPoint(selectedId, { radius: Number(e.target.value) })}
                  />
                  <small>{blob.radius}px</small>
                </label>
              )}
              {blob.shape === "line" && (
                <>
                  <label className="field full-width">
                    <span>Line Length</span>
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      value={blob.length !== undefined ? blob.length : blob.radius * 2}
                      onChange={(e) => onChangeColorPoint(selectedId, { length: Number(e.target.value) })}
                    />
                    <small>{blob.length !== undefined ? blob.length : blob.radius * 2}px</small>
                  </label>
                  <label className="field full-width">
                    <span>Line Thickness</span>
                    <input
                      type="range"
                      min="5"
                      max="200"
                      value={blob.thickness !== undefined ? blob.thickness : blob.radius / 4}
                      onChange={(e) => onChangeColorPoint(selectedId, { thickness: Number(e.target.value) })}
                    />
                    <small>{blob.thickness !== undefined ? blob.thickness : blob.radius / 4}px</small>
                  </label>
                  <label className="field full-width">
                    <span>Dash Spacing (0 for solid)</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={blob.dash || 0}
                      onChange={(e) => onChangeColorPoint(selectedId, { dash: Number(e.target.value) })}
                    />
                    <small>{blob.dash || 0}px</small>
                  </label>
                </>
              )}
            </>
          );
        })()}

        {/* EMOJI EDITOR */}
        {isEmoji && (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Use the corner handles on the canvas to resize and rotate this sticker.
          </p>
        )}

        {/* FRAME EDITOR */}
        {isFrame && (
          <>
            <label className="field full-width">
              <span>Photo Frame Shape</span>
              <CustomSelect
                value={designSettings.frameShape || "circle"}
                onChange={(val) => onChangeDesign("frameShape", val)}
                options={shapes.map(shape => ({ value: shape.id, label: shape.label }))}
              />
            </label>
            
            {designSettings.frameShape === "custom" && (
              <button 
                type="button" 
                className="secondary-button" 
                onClick={onOpenDrawModal} 
                style={{ width: "100%", marginBottom: "14px" }}
              >
                ✏️ Draw Custom Shape
              </button>
            )}

            <label className="field full-width">
              <span>Frame Scale</span>
              <input
                type="range" min="0.2" max="3" step="0.05"
                value={designSettings.frameScale !== undefined ? designSettings.frameScale : 1}
                onChange={(e) => onChangeDesign("frameScale", Number(e.target.value))}
              />
              <small>{Math.round((designSettings.frameScale !== undefined ? designSettings.frameScale : 1) * 100)}%</small>
            </label>
            
            <label className="field full-width">
              <span>Frame Border Style</span>
              <CustomSelect
                value={designSettings.frameStyle || "classic"}
                onChange={(val) => onChangeDesign("frameStyle", val)}
                options={frameStyles.map(style => ({ value: style.id, label: style.label }))}
              />
            </label>

            <label className="field">
              <span>Frame Border Width</span>
              <input
                type="number"
                min="0"
                max="50"
                value={designSettings.circleBorderWidth !== undefined ? designSettings.circleBorderWidth : 8}
                onChange={(e) => onChangeDesign("circleBorderWidth", Number(e.target.value))}
              />
            </label>

            <label className="field color-field">
              <span>Frame Border Color</span>
              <input
                type="color"
                value={designSettings.circleBorderColor || "#000000"}
                onChange={(e) => onChangeDesign("circleBorderColor", e.target.value)}
              />
            </label>
          </>
        )}

        <hr style={{ border: "0", borderTop: "1px solid #e5edf5", margin: "10px 0" }} />

        {/* COMMON ACTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span className="field-label">Layering & Actions</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" className="secondary-button" style={{ flex: 1 }} onClick={onBringForward}>
              Forward
            </button>
            <button type="button" className="secondary-button" style={{ flex: 1 }} onClick={onSendBackward}>
              Backward
            </button>
          </div>
          {/* We do not allow deleting the core text nodes or the frame */}
          {!isTextNode && !isFrame && (
            <button type="button" className="secondary-button" style={{ color: "#ef4444", marginTop: "8px" }} onClick={onDeleteSelected}>
              Delete Selected
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
