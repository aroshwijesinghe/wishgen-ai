import { forwardRef, useEffect, useRef, useState } from "react";
import { Circle, Group, Image as KonvaImage, Layer, Line, Rect, Stage, Star, Text, Path, Transformer } from "react-konva";

const CardPreview = forwardRef(function CardPreview({ 
  template, imageUrl, photoTransform, wishData, formData, designSettings, 
  elementPositions, onElementDrag, glowPoint, onSetGlowPoint, scale = 0.72,
  emojis = [], selectedId, onSelectId, onChangeEmoji
}, stageRef) {
  const image = useCanvasImage(imageUrl);

  const handleStageClick = (e) => {
    // Deselect if clicked on empty area or background
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'background';
    if (clickedOnEmpty) {
      if (onSelectId) onSelectId(null);
      if (onSetGlowPoint) {
        const pos = e.target.getStage().getPointerPosition();
        onSetGlowPoint({ x: pos.x / scale, y: pos.y / scale });
      }
    }
  };

  return (
    <Stage 
      ref={stageRef} 
      width={template.width * scale} 
      height={template.height * scale} 
      scaleX={scale} 
      scaleY={scale}
      onClick={handleStageClick}
      onTap={handleStageClick}
    >
      <Layer>
        <TemplateBackground template={template} designSettings={designSettings} glowPoint={glowPoint} />
        <Decorations template={template} />
        <CircularPhoto 
          template={template} 
          image={image} 
          transform={photoTransform} 
          designSettings={designSettings} 
          position={elementPositions?.frame}
          onDragEnd={(pos) => onElementDrag("frame", pos)}
        />
        <TemplateText 
          template={template} 
          wishData={wishData} 
          formData={formData} 
          designSettings={designSettings} 
          elementPositions={elementPositions}
          onElementDrag={onElementDrag}
        />
        {emojis.map((emoji) => (
          <EmojiNode 
            key={emoji.id} 
            emoji={emoji} 
            isSelected={emoji.id === selectedId} 
            onSelect={() => onSelectId(emoji.id)} 
            onChange={(newProps) => onChangeEmoji(emoji.id, newProps)} 
          />
        ))}
      </Layer>
    </Stage>
  );
});

export default CardPreview;

function EmojiNode({ emoji, isSelected, onSelect, onChange }) {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={shapeRef}
        text={emoji.char}
        x={emoji.x}
        y={emoji.y}
        fontSize={60}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        scaleX={emoji.scaleX}
        scaleY={emoji.scaleY}
        rotation={emoji.rotation}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          onChange({
            x: node.x(),
            y: node.y(),
            scaleX: Math.max(0.1, scaleX),
            scaleY: Math.max(0.1, scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}

export function TemplateBackground({ template, designSettings, glowPoint }) {
  const cardBackgroundColor = designSettings?.cardBackgroundColor || template.colors.background;
  const glowColor = designSettings?.glowColor || "transparent";

  let fillProps = { fill: cardBackgroundColor };
  
  if (glowPoint && glowColor && glowColor !== "transparent") {
    fillProps = {
      fillRadialGradientStartPoint: { x: glowPoint.x, y: glowPoint.y },
      fillRadialGradientStartRadius: 0,
      fillRadialGradientEndPoint: { x: glowPoint.x, y: glowPoint.y },
      fillRadialGradientEndRadius: Math.max(template.width, template.height),
      fillRadialGradientColorStops: [0, glowColor, 1, cardBackgroundColor],
    };
  }

  return (
    <>
      <Rect
        name="background"
        x={0}
        y={0}
        width={template.width}
        height={template.height}
        {...fillProps}
      />
      <Rect name="background" x={34} y={34} width={template.width - 68} height={template.height - 68} stroke={template.colors.primary} strokeWidth={3} opacity={0.64} />
    </>
  );
}

export function CircularPhoto({ template, image, transform, designSettings, draggable = false, onDragEnd, position }) {
  const frame = template.imageFrame;
  const width = image?.width || 500;
  const height = image?.height || 500;
  const scale = transform.scale || 1;
  
  const circleBorderColor = designSettings?.circleBorderColor || frame.borderColor;
  const circleBorderWidth = designSettings?.circleBorderWidth !== undefined ? designSettings.circleBorderWidth : frame.borderWidth;
  const circleRadius = designSettings?.circleRadius || frame.radius;
  const shape = designSettings?.frameShape || "circle";
  const frameStyle = designSettings?.frameStyle || "classic";

  const posX = position ? position.x : frame.x;
  const posY = position ? position.y : frame.y;

  const clipFunc = (ctx) => {
    ctx.beginPath();
    if (shape === "circle") {
      ctx.arc(posX, posY, circleRadius, 0, Math.PI * 2, false);
    } else if (shape === "square") {
      ctx.rect(posX - circleRadius, posY - circleRadius, circleRadius * 2, circleRadius * 2);
    } else if (shape === "rounded_rect") {
      ctx.roundRect(posX - circleRadius, posY - circleRadius, circleRadius * 2, circleRadius * 2, circleRadius / 4);
    } else if (shape === "star") {
      const spikes = 5;
      const outerRadius = circleRadius;
      const innerRadius = circleRadius / 2;
      let rot = Math.PI / 2 * 3;
      let x = posX;
      let y = posY;
      let step = Math.PI / spikes;

      ctx.moveTo(posX, posY - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = posX + Math.cos(rot) * outerRadius;
        y = posY + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = posX + Math.cos(rot) * innerRadius;
        y = posY + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(posX, posY - outerRadius);
    } else if (shape === "heart") {
      const size = circleRadius;
      ctx.moveTo(posX, posY - size * 0.3);
      ctx.bezierCurveTo(posX, posY - size * 0.8, posX - size, posY - size * 0.8, posX - size, posY - size * 0.3);
      ctx.bezierCurveTo(posX - size, posY + size * 0.3, posX, posY + size * 0.7, posX, posY + size);
      ctx.bezierCurveTo(posX, posY + size * 0.7, posX + size, posY + size * 0.3, posX + size, posY - size * 0.3);
      ctx.bezierCurveTo(posX + size, posY - size * 0.8, posX, posY - size * 0.8, posX, posY - size * 0.3);
    }
    ctx.closePath();
  };

  const getBorderStrokeProps = (styleType, offset = 0) => {
    const props = {
      stroke: circleBorderColor,
      strokeWidth: circleBorderWidth,
    };
    
    if (styleType === "dashed") {
      props.dash = [15, 10];
    } else if (styleType === "dotted") {
      props.dash = [5, 10];
      props.lineCap = "round";
    } else if (styleType === "double") {
      // The outer component will render twice
    } else if (styleType === "neon") {
      props.shadowColor = circleBorderColor;
      props.shadowBlur = 20;
      props.shadowOffset = { x: 0, y: 0 };
      props.shadowOpacity = 1;
      props.stroke = "#ffffff";
    } else if (styleType === "hiphop") {
      props.strokeWidth = circleBorderWidth + 10;
      props.stroke = "#000000";
    }
    return props;
  };

  const renderShapeElement = (radiusOffset = 0, customProps = {}) => {
    const r = circleRadius + radiusOffset;
    if (shape === "circle") {
      return <Circle x={posX} y={posY} radius={r} {...customProps} />;
    } else if (shape === "square") {
      return <Rect x={posX - r} y={posY - r} width={r * 2} height={r * 2} {...customProps} />;
    } else if (shape === "rounded_rect") {
      return <Rect x={posX - r} y={posY - r} width={r * 2} height={r * 2} cornerRadius={r / 4} {...customProps} />;
    } else if (shape === "star") {
      return <Star x={posX} y={posY} numPoints={5} innerRadius={r / 2} outerRadius={r} {...customProps} />;
    } else if (shape === "heart") {
      const s = r;
      const pathData = `M ${posX} ${posY - s * 0.3} C ${posX} ${posY - s * 0.8}, ${posX - s} ${posY - s * 0.8}, ${posX - s} ${posY - s * 0.3} C ${posX - s} ${posY + s * 0.3}, ${posX} ${posY + s * 0.7}, ${posX} ${posY + s} C ${posX} ${posY + s * 0.7}, ${posX + s} ${posY + s * 0.3}, ${posX + s} ${posY - s * 0.3} C ${posX + s} ${posY - s * 0.8}, ${posX} ${posY - s * 0.8}, ${posX} ${posY - s * 0.3} Z`;
      return <Path data={pathData} {...customProps} />;
    }
  };

  const getBorderElements = () => {
    if (circleBorderWidth <= 0) return null;
    
    if (frameStyle === "double") {
      return (
        <Group>
          {renderShapeElement(circleBorderWidth, { stroke: circleBorderColor, strokeWidth: circleBorderWidth / 2 })}
          {renderShapeElement(circleBorderWidth * 2.5, { stroke: circleBorderColor, strokeWidth: circleBorderWidth / 4 })}
        </Group>
      );
    }

    if (frameStyle === "hiphop") {
      return (
        <Group>
          {/* Outer thick black border */}
          {renderShapeElement(circleBorderWidth, { stroke: "#000000", strokeWidth: circleBorderWidth * 1.5, offsetX: 5, offsetY: 5 })}
          {/* Inner vibrant border */}
          {renderShapeElement(circleBorderWidth, { stroke: circleBorderColor, strokeWidth: circleBorderWidth })}
          {/* Inner white highlight */}
          {renderShapeElement(circleBorderWidth, { stroke: "#ffffff", strokeWidth: 2, dash: [20, 10] })}
        </Group>
      );
    }

    const mainProps = getBorderStrokeProps(frameStyle);
    return renderShapeElement(circleBorderWidth / 2, mainProps);
  };

  // We make the outer group draggable if requested (in main view)
  // Inner image is draggable if we are in the PhotoAdjustModal (where onDragEnd is passed but draggable is true)
  const isOuterDraggable = !!onDragEnd && !draggable;
  const isInnerDraggable = draggable;

  return (
    <Group 
      draggable={isOuterDraggable} 
      onDragEnd={(e) => {
        if (isOuterDraggable) {
          onDragEnd({ x: posX + e.target.x(), y: posY + e.target.y() });
          // reset group internal position to prevent double-offset
          e.target.x(0);
          e.target.y(0);
        }
      }}
    >
      <Group clipFunc={clipFunc}>
        {image ? (
          <KonvaImage
            image={image}
            x={posX - (width * scale) / 2 + transform.x}
            y={posY - (height * scale) / 2 + transform.y}
            width={width * scale}
            height={height * scale}
            draggable={isInnerDraggable}
            onDragEnd={(event) => {
              if (isInnerDraggable) {
                // Return relative translation from the center
                onDragEnd?.({ 
                  x: event.target.x() - (posX - (width * scale) / 2), 
                  y: event.target.y() - (posY - (height * scale) / 2) 
                });
              }
            }}
          />
        ) : (
          <Rect x={posX - circleRadius} y={posY - circleRadius} width={circleRadius*2} height={circleRadius*2} fill="#e7eef5" />
        )}
      </Group>
      {getBorderElements()}
    </Group>
  );
}

function TemplateText({ template, wishData, formData, designSettings, elementPositions, onElementDrag }) {
  const positions = elementPositions || template.positions;

  const titleFontFamily = designSettings?.titleFontFamily || template.fonts.title;
  const titleFontSize = designSettings?.titleFontSize || 50;
  const titleFontColor = designSettings?.titleFontColor || template.colors.primary;

  const nameFontFamily = designSettings?.nameFontFamily || template.fonts.name;
  const nameFontSize = designSettings?.nameFontSize || 40;
  const nameFontColor = designSettings?.nameFontColor || template.colors.secondary;

  const wishFontFamily = designSettings?.wishFontFamily || template.fonts.wish;
  const wishFontSize = designSettings?.wishFontSize || 24;
  const wishFontColor = designSettings?.wishFontColor || template.colors.primary;

  const signatureFontSize = wishFontSize * 0.9;

  const handleDrag = (id) => (e) => {
    if (onElementDrag) {
      onElementDrag(id, { x: e.target.x(), y: e.target.y() });
    }
  };

  return (
    <>
      <Text 
        text={wishData?.short_title || "Happy Birthday"} 
        x={positions.title?.x || 0} 
        y={positions.title?.y || 100} 
        width={template.width}
        fontSize={titleFontSize} 
        fontFamily={titleFontFamily} 
        fontStyle="bold" 
        fill={titleFontColor} 
        align="center" 
        draggable
        onDragEnd={handleDrag("title")}
      />
      <Text 
        text={formData.name ? `${formData.name.trim()}!` : "Your Name!"} 
        x={positions.name?.x || 0} 
        y={positions.name?.y || 150} 
        width={template.width}
        fontSize={nameFontSize} 
        fontFamily={nameFontFamily} 
        fill={nameFontColor} 
        align="center" 
        draggable
        onDragEnd={handleDrag("name")}
      />
      <Text 
        text={wishData?.wish || "Generate a personalized birthday wish to preview it here."} 
        x={positions.wish?.x || template.width * 0.1} 
        y={positions.wish?.y || 650} 
        width={template.width * 0.8}
        fontSize={wishFontSize} 
        fontFamily={wishFontFamily} 
        fill={wishFontColor} 
        align="center" 
        lineHeight={1.22} 
        draggable
        onDragEnd={handleDrag("wish")}
      />
      {wishData?.signature_line ? (
        <Text 
          text={wishData.signature_line} 
          x={positions.signature?.x || template.width * 0.1} 
          y={positions.signature?.y || 800} 
          width={template.width * 0.8}
          fontSize={signatureFontSize} 
          fontFamily={wishFontFamily} 
          fill={wishFontColor} 
          align="center" 
          draggable
          onDragEnd={handleDrag("signature")}
        />
      ) : null}
    </>
  );
}

export function Decorations({ template }) {
  if (template.id === "floral_elegance") {
    return (
      <>
        {[80, 720].map((x) => (
          <Group key={x} x={x} y={110}>
            <Circle radius={30} fill={template.colors.accent} opacity={0.65} />
            <Circle x={28} y={22} radius={22} fill={template.colors.primary} opacity={0.38} />
            <Line points={[0, 40, 20, 84, 44, 118]} stroke={template.colors.primary} strokeWidth={5} tension={0.5} />
          </Group>
        ))}
      </>
    );
  }

  if (template.id === "cute_pastel") {
    return (
      <>
        <Circle x={92} y={118} radius={38} fill={template.colors.accent} />
        <Text text="♥" x={650} y={88} width={92} fontSize={76} fill={template.colors.primary} align="center" />
        <Star x={126} y={842} numPoints={5} innerRadius={18} outerRadius={38} fill={template.colors.secondary} opacity={0.8} />
      </>
    );
  }

  if (template.id === "luxury_gold") {
    return (
      <>
        <Line points={[120, 96, 680, 96]} stroke={template.colors.primary} strokeWidth={4} />
        <Text text="♛" x={350} y={82} width={100} align="center" fontSize={52} fill={template.colors.primary} />
        <Line points={[120, 908, 680, 908]} stroke={template.colors.primary} strokeWidth={4} />
      </>
    );
  }

  if (template.id === "fun_party") {
    return (
      <>
        {[80, 160, 650, 725].map((x, index) => (
          <Line key={x} points={[x, 80, x + 45, 145, x - 12, 220]} stroke={index % 2 ? template.colors.primary : template.colors.accent} strokeWidth={8} tension={0.4} />
        ))}
        <Star x={110} y={820} numPoints={7} innerRadius={18} outerRadius={42} fill={template.colors.primary} />
        <Star x={698} y={810} numPoints={7} innerRadius={16} outerRadius={38} fill={template.colors.secondary} />
      </>
    );
  }

  return (
    <>
      {[92, 156, 644, 710].map((x, index) => (
        <Circle key={x} x={x} y={index % 2 ? 172 : 112} radius={10} fill={index % 2 ? template.colors.accent : template.colors.primary} />
      ))}
      <Star x={120} y={830} numPoints={7} innerRadius={12} outerRadius={32} fill={template.colors.primary} opacity={0.7} />
      <Star x={690} y={805} numPoints={7} innerRadius={12} outerRadius={32} fill={template.colors.accent} opacity={0.7} />
    </>
  );
}

export function useCanvasImage(url) {
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
