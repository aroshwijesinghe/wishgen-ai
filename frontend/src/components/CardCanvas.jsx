import { useEffect, useMemo, useRef, useState } from "react";
import { Circle, Group, Image as KonvaImage, Layer, Rect, Stage, Star, Text } from "react-konva";
import { CARD_TYPES } from "../data/cardTypes.js";
import { CARD_HEIGHT, CARD_WIDTH } from "../utils/layoutGenerator.js";
import DownloadButton from "./DownloadButton.jsx";
import TextToolbar from "./TextToolbar.jsx";

export default function CardCanvas({ layers, setLayers, initialLayers, formData }) {
  const stageRef = useRef(null);
  const wrapRef = useRef(null);
  const [selectedLayerId, setSelectedLayerId] = useState("");
  const [scale, setScale] = useState(0.72);
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);

  useEffect(() => {
    const updateScale = () => {
      const width = wrapRef.current?.clientWidth || 720;
      setScale(Math.min(1, width / CARD_WIDTH));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const background = layers.find((layer) => layer.type === "background");
  const drawableLayers = layers.filter((layer) => layer.type !== "background");

  const updateLayer = (layerId, patch) => {
    setLayers((current) => current.map((layer) => (layer.id === layerId ? { ...layer, ...patch } : layer)));
  };

  const handleToolbarChange = (patch) => {
    if (!selectedLayerId) return;
    updateLayer(selectedLayerId, patch);
  };

  const resetLayout = () => {
    setLayers(initialLayers);
    setSelectedLayerId("");
  };

  return (
    <section className="canvas-panel">
      <div className="canvas-actions">
        <div>
          <p className="eyebrow">Editable Card</p>
          <h2>AI birthday designer</h2>
        </div>
        <div className="action-row">
          <button type="button" className="secondary-button" onClick={resetLayout} disabled={!initialLayers.length}>
            Reset layout
          </button>
          <DownloadButton stageRef={stageRef} name={formData.name} />
        </div>
      </div>

      <TextToolbar selectedLayer={selectedLayer} onChange={handleToolbarChange} />

      <div className="canvas-wrap" ref={wrapRef}>
        {layers.length ? (
          <Stage
            ref={stageRef}
            width={CARD_WIDTH * scale}
            height={CARD_HEIGHT * scale}
            scaleX={scale}
            scaleY={scale}
            onMouseDown={(event) => {
              if (event.target === event.target.getStage()) {
                setSelectedLayerId("");
              }
            }}
          >
            <Layer>
              <CardBackground background={background} cardType={formData.cardType} />
              {drawableLayers.map((layer) => (
                <CanvasLayer
                  key={layer.id}
                  layer={layer}
                  selected={selectedLayerId === layer.id}
                  onSelect={() => setSelectedLayerId(layer.id)}
                  onChange={(patch) => updateLayer(layer.id, patch)}
                />
              ))}
            </Layer>
          </Stage>
        ) : (
          <div className="empty-canvas">
            <span>Generate an AI card to start editing.</span>
          </div>
        )}
      </div>
    </section>
  );
}

function CardBackground({ background, cardType }) {
  const theme = CARD_TYPES[cardType] || CARD_TYPES.modern_dark;
  const fill = background?.fill || theme.colors.background;
  const accentFill = background?.accentFill || theme.colors.backgroundAlt;

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: CARD_WIDTH, y: CARD_HEIGHT }}
        fillLinearGradientColorStops={[0, fill, 1, accentFill]}
      />
      <Circle x={110} y={130} radius={190} fill={theme.colors.accent} opacity={0.18} />
      <Circle x={710} y={870} radius={240} fill={theme.colors.accent} opacity={0.16} />
      <Rect x={28} y={28} width={CARD_WIDTH - 56} height={CARD_HEIGHT - 56} stroke={theme.colors.primary} strokeWidth={2} opacity={0.36} />
      {cardType === "luxury" ? (
        <Rect x={38} y={38} width={CARD_WIDTH - 76} height={CARD_HEIGHT - 76} stroke={theme.colors.primary} strokeWidth={5} />
      ) : null}
      {cardType === "floral" ? (
        <>
          <Circle x={62} y={72} radius={32} fill={theme.colors.accent} opacity={0.72} />
          <Circle x={728} y={82} radius={28} fill={theme.colors.primary} opacity={0.5} />
        </>
      ) : null}
    </>
  );
}

function CanvasLayer({ layer, selected, onSelect, onChange }) {
  const image = useCanvasImage(layer.type === "portrait" ? layer.imageUrl : "");
  const commonProps = {
    x: layer.x,
    y: layer.y,
    draggable: layer.draggable,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: (event) => onChange({ x: event.target.x(), y: event.target.y() })
  };

  if (layer.type === "portrait") {
    return (
      <Group {...commonProps}>
        <Rect x={-12} y={-12} width={layer.width + 24} height={layer.height + 24} fill="#ffffff" opacity={0.12} cornerRadius={28} />
        {image ? (
          <KonvaImage image={image} width={layer.width} height={layer.height} />
        ) : (
          <Rect width={layer.width} height={layer.height} fill="#d8dee9" cornerRadius={24} />
        )}
        {selected ? <Rect x={-16} y={-16} width={layer.width + 32} height={layer.height + 32} stroke="#38bdf8" dash={[10, 8]} /> : null}
      </Group>
    );
  }

  if (layer.type === "object") {
    return <ObjectLayer layer={layer} selected={selected} commonProps={commonProps} />;
  }

  if (layer.type === "badge") {
    return (
      <Group {...commonProps} onDblClick={() => editText(layer, onChange)}>
        <Rect width={layer.width} height={38} fill={layer.badgeFill} cornerRadius={19} opacity={0.95} />
        <Text {...textProps(layer)} y={8} height={26} />
        {selected ? <Rect width={layer.width} height={38} stroke="#38bdf8" dash={[8, 6]} cornerRadius={19} /> : null}
      </Group>
    );
  }

  return (
    <Group {...commonProps} onDblClick={() => editText(layer, onChange)}>
      <Text {...textProps(layer)} />
      {selected ? <Rect width={layer.width} height={Math.max(34, layer.fontSize * 1.35)} stroke="#38bdf8" dash={[8, 6]} /> : null}
    </Group>
  );
}

function ObjectLayer({ layer, selected, commonProps }) {
  const size = layer.size;
  const icon = layer.icon;
  const renderedIcon = useMemo(() => icon || "✦", [icon]);

  if (layer.objectType === "code_symbol") {
    return (
      <Group {...commonProps}>
        <Rect width={size} height={size * 0.68} fill={layer.fill} cornerRadius={18} opacity={0.95} />
        <Text text="</>" x={0} y={size * 0.15} width={size} align="center" fontSize={size * 0.28} fontStyle="bold" fill="#101010" />
        {selected ? <Rect width={size} height={size * 0.68} stroke="#38bdf8" dash={[8, 6]} cornerRadius={18} /> : null}
      </Group>
    );
  }

  if (layer.objectType === "stars" || layer.objectType === "fireworks" || layer.objectType === "confetti") {
    return (
      <Group {...commonProps}>
        <Star x={size / 2} y={size / 2} numPoints={7} innerRadius={size * 0.18} outerRadius={size * 0.44} fill={layer.fill} stroke={layer.accentFill} strokeWidth={4} />
        {selected ? <Rect width={size} height={size} stroke="#38bdf8" dash={[8, 6]} /> : null}
      </Group>
    );
  }

  if (layer.objectType === "heart") {
    return (
      <Group {...commonProps}>
        <Text text="♥" width={size} height={size} align="center" fontSize={size * 0.82} fill={layer.fill} />
        {selected ? <Rect width={size} height={size} stroke="#38bdf8" dash={[8, 6]} /> : null}
      </Group>
    );
  }

  return (
    <Group {...commonProps}>
      <Circle x={size / 2} y={size / 2} radius={size * 0.46} fill={layer.accentFill} opacity={0.2} />
      <Text text={renderedIcon} width={size} height={size} align="center" verticalAlign="middle" fontSize={Math.min(72, size * 0.52)} fill={layer.fill} fontStyle="bold" />
      {selected ? <Rect width={size} height={size} stroke="#38bdf8" dash={[8, 6]} /> : null}
    </Group>
  );
}

function textProps(layer) {
  return {
    text: layer.text,
    width: layer.width,
    fontSize: layer.fontSize,
    fontFamily: layer.fontFamily,
    fontStyle: layer.fontStyle,
    fill: layer.fill,
    align: layer.align,
    lineHeight: 1.18
  };
}

function editText(layer, onChange) {
  const nextText = window.prompt("Edit text", layer.text);
  if (nextText !== null) {
    onChange({ text: nextText });
  }
}

function useCanvasImage(url) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!url) {
      setImage(null);
      return undefined;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return image;
}
