export default function DownloadButton({ stageRef, name }) {
  const handleDownload = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const dataUrl = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    const safeName = (name || "birthday").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    link.download = `wishgen-ai-${safeName}-birthday-card.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <button type="button" className="primary-button" onClick={handleDownload}>
      Download PNG
    </button>
  );
}
