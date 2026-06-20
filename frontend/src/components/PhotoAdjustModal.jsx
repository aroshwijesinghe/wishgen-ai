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

  const reset = () => onChange({ x: 0, y: 0, scale: 1 });

  return (
    <div className="modal-backdrop">
      <section className="photo-modal">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Photo Position</p>
            <h2>Fit photo inside the circle</h2>
          </div>
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        </div>

        <div className="modal-stage-wrap">
          <Stage width={template.width * 0.54} height={template.height * 0.54} scaleX={0.54} scaleY={0.54}>
            <Layer>
              <TemplateBackground template={template} designSettings={designSettings} />
              <Decorations template={template} />
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
      </section>
    </div>
  );
}
