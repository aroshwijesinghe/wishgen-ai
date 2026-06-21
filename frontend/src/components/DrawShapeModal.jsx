import { useState, useRef } from "react";
import { Stage, Layer, Line, Image as KonvaImage } from "react-konva";
import { useCanvasImage } from "./CardPreview.jsx";

export default function DrawShapeModal({ isOpen, imageUrl, onSave, onCancel }) {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const image = useCanvasImage(imageUrl);

  if (!isOpen) return null;

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    // Clear existing lines to start a fresh shape
    setLines([{ points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const clear = () => setLines([]);

  const containerWidth = Math.min(window.innerWidth * 0.8, 600);
  const containerHeight = Math.min(window.innerHeight * 0.6, 600);

  const imgWidth = image?.width || 500;
  const imgHeight = image?.height || 500;
  const scale = Math.min(containerWidth / imgWidth, containerHeight / imgHeight);

  const save = () => {
    if (lines.length === 0) return;
    const allPoints = lines.reduce((acc, line) => acc.concat(line.points), []);
    
    const mappedPoints = allPoints.map((val, i) => {
      if (i % 2 === 0) {
        return (val / scale) - (imgWidth / 2);
      } else {
        return (val / scale) - (imgHeight / 2);
      }
    });

    onSave(mappedPoints);
  };

  return (
    <div className="modal-backdrop">
      <section className="photo-modal" style={{ maxWidth: "800px" }}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">Custom Shape</p>
            <h2>Draw a continuous loop over your photo</h2>
          </div>
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        </div>

        <div className="modal-stage-wrap" style={{ display: "flex", justifyContent: "center", background: "#f9fafb" }}>
          <Stage
            width={imgWidth * scale}
            height={imgHeight * scale}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            style={{ border: "1px dashed #ccc", cursor: "crosshair" }}
          >
            <Layer>
              {image && (
                <KonvaImage
                  image={image}
                  width={imgWidth * scale}
                  height={imgHeight * scale}
                  opacity={0.5}
                />
              )}
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="#ef4444"
                  strokeWidth={4}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              ))}
            </Layer>
          </Stage>
        </div>

        <div className="modal-controls">
          <button type="button" className="secondary-button" onClick={clear}>
            Clear
          </button>
          <button type="button" className="primary-button" onClick={save}>
            Use Shape
          </button>
        </div>
      </section>
    </div>
  );
}
