import { jsPDF } from "jspdf";

export function downloadStage(stage, format, filenameBase) {
  if (!stage) return;

  const safeName = (filenameBase || "birthday-card").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

  if (format === "pdf") {
    const image = stage.toDataURL({ mimeType: "image/png", pixelRatio: 2 });
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [stage.width(), stage.height()] });
    pdf.addImage(image, "PNG", 0, 0, stage.width(), stage.height());
    pdf.save(`wishgen-ai-${safeName}.pdf`);
    return;
  }

  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
  const extension = format === "jpeg" ? "jpg" : "png";
  const dataUrl = stage.toDataURL({ mimeType, quality: 0.95, pixelRatio: 2 });
  const link = document.createElement("a");
  link.download = `wishgen-ai-${safeName}.${extension}`;
  link.href = dataUrl;
  link.click();
}
