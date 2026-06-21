import { Layer, Stage } from "react-konva";
import { CircularPhoto, Decorations, TemplateBackground, useCanvasImage } from "./CardPreview.jsx";

const MIN_SCALE = 0.25;
const MAX_SCALE = 6;

export default function PhotoAdjustModal({ isOpen, template, imageUrl, transform, designSettings, onChange, onConfirm, onCancel }) {
  const image = useCanvasImage(imageUrl);

  if (!isOpen) return null;

  const updateScale = (amount) => {
    onChange({ ...transform, scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number((transform.scale + amount).toFixed(2)))) });
  };

  const move = (dx, dy) => {
    onChange({ ...transform, x: transform.x + dx, y: transform.y + dy });
  };

  const reset = () => onChange({ x: 0, y: 0, scale: 1 });

  const maxStageWidth = Math.min(window.innerWidth * 0.8, 800) - 64; // Modal padding buffer
  const maxStageHeight = Math.min(window.innerHeight * 0.7, 800) - 150; // Controls buffer
  const scale = Math.min(maxStageWidth / template.width, maxStageHeight / template.height);

  return (
    <div className="modal-backdrop">
      <section className="photo-modal" style={{ maxWidth: "90vw", width: "fit-content" }}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Photo Position</p>
            <h2>Fit photo inside the shape</h2>
          </div>
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        </div>

        <div className="modal-stage-wrap" style={{ display: "flex", justifyContent: "center", overflow: "hidden" }}>
          <Stage width={template.width * scale} height={template.height * scale} scaleX={scale} scaleY={scale}>
            <Layer>
              <TemplateBackground template={template} designSettings={designSettings} />

              <CircularPhoto
                template={template}
                image={image}
                transform={transform}
                designSettings={designSettings}
                draggable
                onDragEnd={(nextPosition) => onChange({ ...transform, ...nextPosition })}
              />
            </Layer>
          </Stage>
        </div>

        <div className="modal-controls">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "8px" }}>
            <button type="button" className="secondary-button" onClick={() => move(0, -10)}>Up</button>
            <button type="button" className="secondary-button" onClick={() => move(0, 10)}>Down</button>
            <button type="button" className="secondary-button" onClick={() => move(-10, 0)}>Left</button>
            <button type="button" className="secondary-button" onClick={() => move(10, 0)}>Right</button>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            <button type="button" className="secondary-button" onClick={() => updateScale(0.1)}>
              Zoom In
            </button>
            <button type="button" className="secondary-button" onClick={() => updateScale(-0.1)}>
              Zoom Out
            </button>
            <button type="button" className="secondary-button" onClick={reset}>
              Reset
            </button>
            <button type="button" className="primary-button" onClick={onConfirm}>
              Confirm Photo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
