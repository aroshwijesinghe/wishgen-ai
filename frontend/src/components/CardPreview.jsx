import { forwardRef, useEffect, useState } from "react";
import { Circle, Group, Image as KonvaImage, Layer, Line, Rect, Stage, Star, Text } from "react-konva";

const CardPreview = forwardRef(function CardPreview({ template, imageUrl, photoTransform, wishData, formData, borderSettings, scale = 0.72 }, stageRef) {
  const image = useCanvasImage(imageUrl);

  return (
    <Stage ref={stageRef} width={template.width * scale} height={template.height * scale} scaleX={scale} scaleY={scale}>
      <Layer>
        <TemplateBackground template={template} borderSettings={borderSettings} />
        <Decorations template={template} />
        <CircularPhoto template={template} image={image} transform={photoTransform} borderSettings={borderSettings} />
        <TemplateText template={template} wishData={wishData} formData={formData} />
      </Layer>
    </Stage>
  );
});

export default CardPreview;

export function TemplateBackground({ template, borderSettings }) {
  const cardBorderColor = borderSettings?.cardBorderColor || template.colors.primary;
  const cardBorderStyle = borderSettings?.cardBorderStyle || "solid";
  const dash = cardBorderStyle === "dashed" ? [18, 12] : undefined;

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={template.width}
        height={template.height}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: template.width, y: template.height }}
        fillLinearGradientColorStops={[0, template.colors.background, 1, template.colors.backgroundAlt]}
      />
      <Rect x={34} y={34} width={template.width - 68} height={template.height - 68} stroke={cardBorderColor} strokeWidth={3} opacity={0.64} dash={dash} />
      {cardBorderStyle === "double" ? (
        <Rect x={52} y={52} width={template.width - 104} height={template.height - 104} stroke={cardBorderColor} strokeWidth={2} opacity={0.46} />
      ) : null}
    </>
  );
}

export function CircularPhoto({ template, image, transform, borderSettings, draggable = false, onDragEnd }) {
  const frame = template.imageFrame;
  const width = image?.width || 500;
  const height = image?.height || 500;
  const scale = transform.scale || 1;
  const circleBorderColor = borderSettings?.circleBorderColor || template.colors.primary;

  return (
    <Group>
      <Group
        clipFunc={(ctx) => {
          ctx.arc(frame.x, frame.y, frame.radius, 0, Math.PI * 2, false);
        }}
      >
        {image ? (
          <KonvaImage
            image={image}
            x={frame.x - (width * scale) / 2 + transform.x}
            y={frame.y - (height * scale) / 2 + transform.y}
            width={width * scale}
            height={height * scale}
            draggable={draggable}
            onDragEnd={(event) => onDragEnd?.({ x: event.target.x() - (frame.x - (width * scale) / 2), y: event.target.y() - (frame.y - (height * scale) / 2) })}
          />
        ) : (
          <Circle x={frame.x} y={frame.y} radius={frame.radius} fill="#e7eef5" />
        )}
      </Group>
      <Circle x={frame.x} y={frame.y} radius={frame.radius + 8} stroke={circleBorderColor} strokeWidth={10} />
      <Circle x={frame.x} y={frame.y} radius={frame.radius + 17} stroke={template.colors.secondary} strokeWidth={2} opacity={0.72} />
    </Group>
  );
}

function TemplateText({ template, wishData, formData }) {
  const text = template.text;

  return (
    <>
      <Text text={wishData?.short_title || "Happy Birthday"} {...text.title} fontSize={text.title.size} fontFamily={template.fonts.title} fontStyle="bold" fill={template.colors.primary} align="center" />
      <Text text={formData.name ? `${formData.name.trim()}!` : "Your Name!"} {...text.name} fontSize={text.name.size} fontFamily={template.fonts.name} fill={template.colors.secondary} align="center" />
      <Text text={wishData?.wish || "Generate a personalized birthday wish to preview it here."} {...text.wish} fontSize={text.wish.size} fontFamily={template.fonts.wish} fill={template.colors.body} align="center" lineHeight={1.22} />
      {wishData?.signature_line ? (
        <Text text={wishData.signature_line} {...text.signature} fontSize={text.signature.size} fontFamily={template.fonts.wish} fill={template.colors.primary} align="center" />
      ) : null}
    </>
  );
}

export function Decorations({ template }) {
  if (template.decorativeStyle === "floral") {
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

  if (template.decorativeStyle === "cute") {
    return (
      <>
        <Circle x={92} y={118} radius={38} fill={template.colors.accent} />
        <Text text="♥" x={650} y={88} width={92} fontSize={76} fill={template.colors.primary} align="center" />
        <Star x={126} y={842} numPoints={5} innerRadius={18} outerRadius={38} fill={template.colors.secondary} opacity={0.8} />
      </>
    );
  }

  if (template.decorativeStyle === "luxury") {
    return (
      <>
        <Line points={[120, 96, 680, 96]} stroke={template.colors.primary} strokeWidth={4} />
        <Text text="♛" x={350} y={82} width={100} align="center" fontSize={52} fill={template.colors.primary} />
        <Line points={[120, 908, 680, 908]} stroke={template.colors.primary} strokeWidth={4} />
      </>
    );
  }

  if (template.decorativeStyle === "party") {
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
