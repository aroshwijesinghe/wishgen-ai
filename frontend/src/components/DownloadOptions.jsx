import { exportCard } from "../utils/exportCard.js";

export default function DownloadOptions({ stageRef, name, disabled }) {
  const filename = `${name || "birthday"}-birthday-card`;

  return (
    <section className="download-options">
      <span>Download final card</span>
      <div className="download-row">
        <button type="button" className="secondary-button" disabled={disabled} onClick={() => exportCard(stageRef, "png", filename)}>
          PNG
        </button>
        <button type="button" className="secondary-button" disabled={disabled} onClick={() => exportCard(stageRef, "jpeg", filename)}>
          JPEG
        </button>
        <button type="button" className="secondary-button" disabled={disabled} onClick={() => exportCard(stageRef, "pdf", filename)}>
          PDF
        </button>
      </div>
    </section>
  );
}
