import { forwardRef, useEffect, useRef, useState } from "react";
import { Circle, Group, Image as KonvaImage, Layer, Line, Rect, Stage, Star, Text, Path, Transformer } from "react-konva";

const CardPreview = forwardRef(function CardPreview({ 
  template, imageUrl, photoTransform, wishData, formData, designSettings, 
  elementPositions, onElementDrag, colorPoints = [], onColorPointChange, scale = 0.72,
}, stageRef) {
  const image = useCanvasImage(imageUrl);

  const cardAspectRatio = designSettings?.cardAspectRatio || "4:5";
  const getDimensions = () => {
    const baseW = 1080;
    if (cardAspectRatio === "16:9") return { w: 1920, h: 1080 };
    if (cardAspectRatio === "9:16") return { w: 1080, h: 1920 };
    if (cardAspectRatio === "4:3") return { w: 1440, h: 1080 };
    if (cardAspectRatio === "3:4") return { w: 1080, h: 1440 };
    if (cardAspectRatio === "1:1") return { w: 1080, h: 1080 };
    return { w: 1080, h: 1350 }; // 4:5 default
  };
  const { w: cardW, h: cardH } = getDimensions();
  
  // Create a dynamic template overriding width and height
  const dynTemplate = { ...template, width: cardW, height: cardH };

  const handleStageClick = (e) => {
    // Deselect if clicked on empty area or background
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'background';
    if (clickedOnEmpty) {
      if (onSelectId) onSelectId(null);
    }
  };

  return (
    <Stage 
      ref={stageRef} 
      width={cardW * scale} 
      height={cardH * scale} 
      scaleX={scale} 
      scaleY={scale}
      onClick={handleStageClick}
      onTap={handleStageClick}
    >
      <Layer>
        <TemplateBackground template={dynTemplate} designSettings={designSettings} />
        {colorPoints.map(blob => (
          <ColorBlobNode
            key={blob.id}
            blob={blob}
            isSelected={blob.id === selectedId}
            onSelect={() => onSelectId?.(blob.id)}
            onChange={(newProps) => onColorPointChange?.(blob.id, newProps)}
          />
        ))}
        <Decorations template={dynTemplate} />
        <CircularPhoto 
          template={dynTemplate} 
          image={image} 
          transform={photoTransform} 
          designSettings={designSettings} 
          position={elementPositions?.frame}
          onDragEnd={(pos) => onElementDrag?.("frame", pos)}
          customShapePath={customShapePath}
          isSelected={selectedId === "frame"}
          onSelect={() => onSelectId?.("frame")}
        />
        <TemplateText 
          template={dynTemplate} 
          wishData={wishData} 
          formData={formData} 
          designSettings={designSettings} 
          elementPositions={elementPositions}
          onElementDrag={onElementDrag}
          selectedId={selectedId}
          onSelectId={onSelectId}
        />
        {emojis.map((emoji) => (
          <EmojiNode 
            key={emoji.id} 
            emoji={emoji} 
            isSelected={emoji.id === selectedId} 
            onSelect={() => onSelectId?.(emoji.id)} 
            onChange={(newProps) => onChangeEmoji?.(emoji.id, newProps)} 
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
        onTransformEnd={() => {
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
            if (newBox.width < 10 || newBox.height < 10) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

function ColorBlobNode({ blob, isSelected, onSelect, onChange }) {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const shapeType = blob.shape || "circle";
  
  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const newRadius = blob.radius * scaleX;
    node.scaleX(1);
    node.scaleY(1);
    onChange({
      x: node.x(),
      y: node.y(),
      radius: Math.max(20, newRadius),
    });
  };

  const getShapeProps = () => {
    const baseProps = {
      x: blob.x,
      y: blob.y,
      draggable: true,
      onClick: onSelect,
      onTap: onSelect,
      onDragEnd: (e) => onChange({ x: e.target.x(), y: e.target.y() }),
      onTransformEnd: handleTransformEnd,
    };

    if (shapeType === "line") {
      return (
        <Line 
          points={[-blob.radius, 0, blob.radius, 0]} 
          stroke={blob.color} 
          strokeWidth={blob.radius / 4} 
          lineCap="round"
          {...baseProps} 
          shadowColor={blob.color}
          shadowBlur={blob.radius}
        />
      );
    }
    
    // For closed shapes we use the radial gradient or simple fill
    const fillProps = {
      fillRadialGradientStartPoint: { x: 0, y: 0 },
      fillRadialGradientStartRadius: 0,
      fillRadialGradientEndPoint: { x: 0, y: 0 },
      fillRadialGradientEndRadius: blob.radius,
      fillRadialGradientColorStops: [0, blob.color, 1, 'rgba(0,0,0,0)']
    };

    if (shapeType === "square") {
      return <Rect width={blob.radius * 2} height={blob.radius * 2} offsetX={blob.radius} offsetY={blob.radius} {...baseProps} {...fillProps} />;
    } else if (shapeType === "rounded_rect") {
      return <Rect width={blob.radius * 2} height={blob.radius * 2} offsetX={blob.radius} offsetY={blob.radius} cornerRadius={blob.radius / 4} {...baseProps} {...fillProps} />;
    } else if (shapeType === "star") {
      return <Star numPoints={5} innerRadius={blob.radius / 2} outerRadius={blob.radius} {...baseProps} {...fillProps} />;
    } else if (shapeType === "heart") {
      const s = blob.radius;
      const pathData = `M 0 ${-s * 0.3} C 0 ${-s * 0.8}, ${-s} ${-s * 0.8}, ${-s} ${-s * 0.3} C ${-s} ${s * 0.3}, 0 ${s * 0.7}, 0 ${s} C 0 ${s * 0.7}, ${s} ${s * 0.3}, ${s} ${-s * 0.3} C ${s} ${-s * 0.8}, 0 ${-s * 0.8}, 0 ${-s * 0.3} Z`;
      return <Path data={pathData} {...baseProps} {...fillProps} />;
    } else if (shapeType === "cloud") {
      const r = blob.radius;
      const pathData = `M ${-r*0.5} 0 C ${-r*0.5} ${-r*0.5}, ${r*0.5} ${-r*0.5}, ${r*0.5} 0 C ${r} 0, ${r} ${r*0.5}, ${r*0.5} ${r*0.5} C ${r*0.5} ${r}, ${-r*0.5} ${r}, ${-r*0.5} ${r*0.5} C ${-r} ${r*0.5}, ${-r} 0, ${-r*0.5} 0 Z`;
      return <Path data={pathData} {...baseProps} {...fillProps} />;
    }
    
    // Default circle
    return <Circle radius={blob.radius} {...baseProps} {...fillProps} />;
  };

  return (
    <>
      {getShapeProps()}
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          resizeEnabled={true}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 50) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

export function TemplateBackground({ template, designSettings }) {
  const cardBackgroundColor = designSettings?.cardBackgroundColor || template.colors.background;
  
  const mainBorderStyle = designSettings?.cardBorderStyle || "solid";
  const mainBorderWidth = designSettings?.cardBorderWidth !== undefined ? designSettings.cardBorderWidth : 3;
  const mainBorderColor = designSettings?.cardBorderColor || template.colors.primary;
  const mainBorderRadius = designSettings?.cardBorderRadius || 0;
  const mainBorderInset = designSettings?.cardBorderInset !== undefined ? designSettings.cardBorderInset : 34;

  const borderDash = mainBorderStyle === "dashed" ? [15, 10] : mainBorderStyle === "dotted" ? [5, 10] : [];

  return (
    <>
      <Rect
        name="background"
        x={0}
        y={0}
        width={template.width}
        height={template.height}
        fill={cardBackgroundColor}
      />
      <Rect 
        name="background" 
        x={mainBorderInset} 
        y={mainBorderInset} 
        width={template.width - (mainBorderInset * 2)} 
        height={template.height - (mainBorderInset * 2)} 
        stroke={mainBorderColor} 
        strokeWidth={mainBorderWidth} 
        dash={borderDash}
        cornerRadius={mainBorderRadius}
        opacity={0.64} 
      />
    </>
  );
}

export function CircularPhoto({ template, image, transform, designSettings, draggable = false, onDragEnd, position, customShapePath, isSelected, onSelect }) {
  const frame = template.imageFrame;
  const width = image?.width || 500;
  const height = image?.height || 500;
  const scale = transform?.scale || 1;
  
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
    } else if (shape === "cloud") {
      const r = circleRadius;
      ctx.moveTo(posX - r*0.5, posY);
      ctx.bezierCurveTo(posX - r*0.5, posY - r*0.5, posX + r*0.5, posY - r*0.5, posX + r*0.5, posY);
      ctx.bezierCurveTo(posX + r, posY, posX + r, posY + r*0.5, posX + r*0.5, posY + r*0.5);
      ctx.bezierCurveTo(posX + r*0.5, posY + r, posX - r*0.5, posY + r, posX - r*0.5, posY + r*0.5);
      ctx.bezierCurveTo(posX - r, posY + r*0.5, posX - r, posY, posX - r*0.5, posY);
    } else if (shape === "custom" && customShapePath) {
      // Smooth the custom shape using quadratic curves
      if (customShapePath.length >= 4) {
        ctx.moveTo(posX + customShapePath[0], posY + customShapePath[1]);
        for (let i = 2; i < customShapePath.length - 2; i += 2) {
          const xc = (posX + customShapePath[i] + posX + customShapePath[i + 2]) / 2;
          const yc = (posY + customShapePath[i + 1] + posY + customShapePath[i + 3]) / 2;
          ctx.quadraticCurveTo(posX + customShapePath[i], posY + customShapePath[i + 1], xc, yc);
        }
        ctx.quadraticCurveTo(
          posX + customShapePath[customShapePath.length - 2],
          posY + customShapePath[customShapePath.length - 1],
          posX + customShapePath[0],
          posY + customShapePath[1]
        );
      }
    } else {
      ctx.arc(posX, posY, circleRadius, 0, Math.PI * 2, false);
    }
    ctx.closePath();
  };

  const getBorderStrokeProps = (styleType) => {
    const props = { stroke: circleBorderColor, strokeWidth: circleBorderWidth };
    if (styleType === "dashed") props.dash = [15, 10];
    else if (styleType === "dotted") { props.dash = [5, 10]; props.lineCap = "round"; }
    else if (styleType === "neon") {
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
    } else if (shape === "cloud") {
      const pathData = `M ${posX - r*0.5} ${posY} C ${posX - r*0.5} ${posY - r*0.5}, ${posX + r*0.5} ${posY - r*0.5}, ${posX + r*0.5} ${posY} C ${posX + r} ${posY}, ${posX + r} ${posY + r*0.5}, ${posX + r*0.5} ${posY + r*0.5} C ${posX + r*0.5} ${posY + r}, ${posX - r*0.5} ${posY + r}, ${posX - r*0.5} ${posY + r*0.5} C ${posX - r} ${posY + r*0.5}, ${posX - r} ${posY}, ${posX - r*0.5} ${posY} Z`;
      return <Path data={pathData} {...customProps} />;
    } else if (shape === "custom" && customShapePath && customShapePath.length >= 4) {
      let svgPath = `M ${posX + customShapePath[0]} ${posY + customShapePath[1]} `;
      for (let i = 2; i < customShapePath.length - 2; i += 2) {
        const xc = (posX + customShapePath[i] + posX + customShapePath[i + 2]) / 2;
        const yc = (posY + customShapePath[i + 1] + posY + customShapePath[i + 3]) / 2;
        svgPath += `Q ${posX + customShapePath[i]} ${posY + customShapePath[i + 1]}, ${xc} ${yc} `;
      }
      svgPath += `Q ${posX + customShapePath[customShapePath.length - 2]} ${posY + customShapePath[customShapePath.length - 1]}, ${posX + customShapePath[0]} ${posY + customShapePath[1]} Z`;
      return <Path data={svgPath} {...customProps} lineJoin="round" lineCap="round" />;
    } else {
      return <Circle x={posX} y={posY} radius={r} {...customProps} />;
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
          {renderShapeElement(circleBorderWidth, { stroke: "#000000", strokeWidth: circleBorderWidth * 1.5, offsetX: 5, offsetY: 5 })}
          {renderShapeElement(circleBorderWidth, { stroke: circleBorderColor, strokeWidth: circleBorderWidth })}
          {renderShapeElement(circleBorderWidth, { stroke: "#ffffff", strokeWidth: 2, dash: [20, 10] })}
        </Group>
      );
    }
    return renderShapeElement(circleBorderWidth / 2, getBorderStrokeProps(frameStyle));
  };

  const isOuterDraggable = !!onDragEnd && !draggable;
  const isInnerDraggable = draggable;

  const baseImageX = posX - (width * scale) / 2;
  const baseImageY = posY - (height * scale) / 2;

  return (
    <Group 
      draggable={isOuterDraggable} 
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        if (isOuterDraggable) {
          onDragEnd({ x: posX + e.target.x(), y: posY + e.target.y() });
          e.target.x(0);
          e.target.y(0);
        }
      }}
    >
      {isSelected && (
        <Rect 
          x={posX - circleRadius - 10} 
          y={posY - circleRadius - 10} 
          width={(circleRadius * 2) + 20} 
          height={(circleRadius * 2) + 20} 
          stroke="#0ea5e9" 
          strokeWidth={2} 
          dash={[5, 5]} 
        />
      )}
      <Group clipFunc={clipFunc}>
        <Group
          draggable={isInnerDraggable}
          onDragEnd={(event) => {
            if (isInnerDraggable) {
              onDragEnd?.({ 
                x: (transform?.x || 0) + event.target.x(), 
                y: (transform?.y || 0) + event.target.y() 
              });
              event.target.x(0);
              event.target.y(0);
            }
          }}
        >
          {/* Transparent rect ensures the whole mask area is grabbable, even if the image is small */}
          <Rect x={0} y={0} width={template.width} height={template.height} fill="transparent" />
          
          {image ? (
            <KonvaImage
              image={image}
              x={baseImageX + (transform?.x || 0)}
              y={baseImageY + (transform?.y || 0)}
              width={width * scale}
              height={height * scale}
            />
          ) : (
            <Rect x={posX - circleRadius} y={posY - circleRadius} width={circleRadius*2} height={circleRadius*2} fill="#e7eef5" />
          )}
        </Group>
      </Group>
      {getBorderElements()}
    </Group>
  );
}

function TemplateText({ template, wishData, formData, designSettings, elementPositions, onElementDrag, selectedId, onSelectId }) {
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

  const titleRef = useRef();
  const nameRef = useRef();
  const wishRef = useRef();
  const signatureRef = useRef();
  const trRef = useRef();

  const handleDrag = (id) => (e) => {
    if (onElementDrag) {
      onElementDrag(id, { x: e.target.x(), y: e.target.y() });
    }
  };

  const getSelectedNode = () => {
    if (selectedId === "title") return titleRef.current;
    if (selectedId === "name") return nameRef.current;
    if (selectedId === "wish") return wishRef.current;
    if (selectedId === "signature") return signatureRef.current;
    return null;
  };

  useEffect(() => {
    const node = getSelectedNode();
    if (node && trRef.current) {
      trRef.current.nodes([node]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  return (
    <>
      <Text 
        ref={titleRef}
        text={wishData?.short_title || "Happy Birthday"} 
        x={positions.title?.x || 0} 
        y={positions.title?.y || 100} 
        width={template.width}
        fontSize={titleFontSize} 
        fontFamily={titleFontFamily} 
        fontStyle="bold" 
        fill={titleFontColor} 
        align={designSettings?.titleAlign || "center"} 
        opacity={designSettings?.titleOpacity !== undefined ? designSettings.titleOpacity : 1}
        shadowColor={designSettings?.titleShadowColor || "#000000"}
        shadowBlur={designSettings?.titleShadowBlur || 0}
        shadowOffsetY={designSettings?.titleShadowOffsetY || 0}
        draggable
        onDragEnd={handleDrag("title")}
        onClick={() => onSelectId?.("title")}
        onTap={() => onSelectId?.("title")}
      />
      <Text 
        ref={nameRef}
        text={formData.name ? `${formData.name.trim()}!` : "Your Name!"} 
        x={positions.name?.x || 0} 
        y={positions.name?.y || 150} 
        width={template.width}
        fontSize={nameFontSize} 
        fontFamily={nameFontFamily} 
        fill={nameFontColor} 
        align={designSettings?.nameAlign || "center"} 
        opacity={designSettings?.nameOpacity !== undefined ? designSettings.nameOpacity : 1}
        shadowColor={designSettings?.nameShadowColor || "#000000"}
        shadowBlur={designSettings?.nameShadowBlur || 0}
        shadowOffsetY={designSettings?.nameShadowOffsetY || 0}
        draggable
        onDragEnd={handleDrag("name")}
        onClick={() => onSelectId?.("name")}
        onTap={() => onSelectId?.("name")}
      />
      <Text 
        ref={wishRef}
        text={wishData?.wish || "Generate a personalized birthday wish to preview it here."} 
        x={positions.wish?.x || template.width * 0.1} 
        y={positions.wish?.y || 650} 
        width={template.width * 0.8}
        fontSize={wishFontSize} 
        fontFamily={wishFontFamily} 
        fill={wishFontColor} 
        align={designSettings?.wishAlign || "center"} 
        opacity={designSettings?.wishOpacity !== undefined ? designSettings.wishOpacity : 1}
        shadowColor={designSettings?.wishShadowColor || "#000000"}
        shadowBlur={designSettings?.wishShadowBlur || 0}
        shadowOffsetY={designSettings?.wishShadowOffsetY || 0}
        lineHeight={1.22} 
        draggable
        onDragEnd={handleDrag("wish")}
        onClick={() => onSelectId?.("wish")}
        onTap={() => onSelectId?.("wish")}
      />
      {wishData?.signature_line ? (
        <Text 
          ref={signatureRef}
          text={wishData.signature_line} 
          x={positions.signature?.x || template.width * 0.1} 
          y={positions.signature?.y || 800} 
          width={template.width * 0.8}
          fontSize={signatureFontSize} 
          fontFamily={wishFontFamily} 
          fill={wishFontColor} 
          align={designSettings?.signatureAlign || "center"} 
          opacity={designSettings?.signatureOpacity !== undefined ? designSettings.signatureOpacity : 1}
          shadowColor={designSettings?.signatureShadowColor || "#000000"}
          shadowBlur={designSettings?.signatureShadowBlur || 0}
          shadowOffsetY={designSettings?.signatureShadowOffsetY || 0}
          draggable
          onDragEnd={handleDrag("signature")}
          onClick={() => onSelectId?.("signature")}
          onTap={() => onSelectId?.("signature")}
        />
      ) : null}
      
      {["title", "name", "wish", "signature"].includes(selectedId) && (
        <Transformer
          ref={trRef}
          resizeEnabled={false}
          rotateEnabled={false}
          padding={10}
        />
      )}
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
