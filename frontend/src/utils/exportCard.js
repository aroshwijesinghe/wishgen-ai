import { jsPDF } from "jspdf";

export const exportCard = async (stageRef, format, filename) => {
  if (!stageRef.current) return;

  const stage = stageRef.current;
  
  if (format === "png") {
    const dataURL = stage.toDataURL({ pixelRatio: 1, mimeType: "image/png" });
    downloadURI(dataURL, `${filename}.png`);
  } else if (format === "jpeg") {
    const dataURL = stage.toDataURL({ pixelRatio: 1, mimeType: "image/jpeg", quality: 0.95 });
    downloadURI(dataURL, `${filename}.jpg`);
  } else if (format === "pdf") {
    const dataURL = stage.toDataURL({ pixelRatio: 1, mimeType: "image/png" });
    const width = stage.width();
    const height = stage.height();
    
    // Create a PDF with matching dimensions
    const pdf = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "px",
      format: [width, height]
    });
    
    pdf.addImage(dataURL, "PNG", 0, 0, width, height);
    pdf.save(`${filename}.pdf`);
  }
};

function downloadURI(uri, name) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
