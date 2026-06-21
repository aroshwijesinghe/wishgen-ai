import React, { useState } from "react";

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
            <select
              value={designSettings.cardAspectRatio || "4:5"}
              onChange={(e) => onChangeDesign("cardAspectRatio", e.target.value)}
            >
              {aspectRatios.map(ar => <option key={ar.id} value={ar.id}>{ar.label}</option>)}
            </select>
          </label>

          <label className="field color-field full-width">
            <span>Card Background Color</span>
            <input
              type="color"
              value={designSettings.cardBackgroundColor || "#ffffff"}
              onChange={(e) => onChangeDesign("cardBackgroundColor", e.target.value)}
            />
          </label>
          
          <hr style={{ border: "0", borderTop: "1px solid #e5edf5", margin: "10px 0" }} />
          <span className="field-label">Main Card Border</span>
          
          <label className="field full-width">
            <span>Border Style</span>
            <select
              value={designSettings.cardBorderStyle || "solid"}
              onChange={(e) => onChangeDesign("cardBorderStyle", e.target.value)}
            >
              {borderStyles.map(bs => <option key={bs.id} value={bs.id}>{bs.label}</option>)}
            </select>
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
                style={{ resize: "vertical", width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
              />
            </label>
            <label className="field full-width">
              <span>Font Family</span>
              <div style={{ position: "relative" }}>
                <div 
                  onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                  style={{ padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer", background: "#fff", display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontFamily: designSettings[`${selectedId}FontFamily`] || "Arial" }}>
                    {designSettings[`${selectedId}FontFamily`] || "Arial"}
                  </span>
                  <span>▼</span>
                </div>
                {isFontDropdownOpen && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #d1d5db", borderRadius: "4px", maxHeight: "250px", overflowY: "auto", zIndex: 10, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
                    {fonts.map((font) => (
                      <div 
                        key={font} 
                        style={{ padding: "10px", fontFamily: font, cursor: "pointer", borderBottom: "1px solid #f3f4f6", fontSize: "16px" }}
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
              <select
                value={designSettings[`${selectedId}Align`] || "center"}
                onChange={(e) => onChangeDesign(`${selectedId}Align`, e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>
            <label className="field full-width">
              <span>Opacity</span>
              <input
                type="range" min="0" max="1" step="0.05"
                value={designSettings[`${selectedId}Opacity`] !== undefined ? designSettings[`${selectedId}Opacity`] : 1}
                onChange={(e) => onChangeDesign(`${selectedId}Opacity`, Number(e.target.value))}
              />
            </label>
            <hr style={{ border: "0", borderTop: "1px solid #e5edf5", margin: "10px 0" }} />
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
                <select
                  value={blob.shape || "circle"}
                  onChange={(e) => onChangeColorPoint(selectedId, { shape: e.target.value })}
                >
                  {shapes.filter(s => s.id !== "custom").map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
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
          <p style={{ color: "#627d98", fontSize: "0.9rem" }}>
            Use the corner handles on the canvas to resize and rotate this sticker.
          </p>
        )}

        {/* FRAME EDITOR */}
        {isFrame && (
          <>
            <label className="field full-width">
              <span>Photo Frame Shape</span>
              <select
                value={designSettings.frameShape || "circle"}
                onChange={(e) => onChangeDesign("frameShape", e.target.value)}
              >
                {shapes.map((shape) => (
                  <option key={shape.id} value={shape.id}>
                    {shape.label}
                  </option>
                ))}
              </select>
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
              <select
                value={designSettings.frameStyle || "classic"}
                onChange={(e) => onChangeDesign("frameStyle", e.target.value)}
              >
                {frameStyles.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                  </option>
                ))}
              </select>
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
            <button type="button" className="secondary-button" style={{ color: "#b42318", marginTop: "8px" }} onClick={onDeleteSelected}>
              Delete Selected
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
