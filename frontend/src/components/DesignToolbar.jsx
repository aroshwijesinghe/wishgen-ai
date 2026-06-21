import { useState } from "react";

const fonts = [
  "Arial", "Georgia", "Times New Roman", "Verdana", "Courier New", "cursive", "fantasy", "monospace",
  "Roboto", "Open Sans", "Lato", "Montserrat", "Oswald", "Raleway", "PT Sans", "Merriweather", 
  "Nunito", "Playfair Display", "Rubik", "Work Sans", "Lora", "Quicksand", "Fira Sans", "Inter", 
  "Karla", "Inconsolata", "Josefin Sans", "Anton", "Dancing Script", "Pacifico", "Caveat", "Satisfy"
];

const partyEmojis = [
  "🎂", "🎈", "🎉", "🎁", "🥳", "👑", "✨", "💖", "🍾", "🥂", "🎶", "🌟",
  "🍰", "🧁", "🎊", "🎇", "🎆", "🍹", "🎀", "🌺", "🌸", "🦄", "🌈", "🔥",
  "💯", "🙌", "👏", "💃", "🕺", "🎤", "🎸", "🎷", "🚀", "🛸", "🍕", "🍔",
  "🍩", "🍭", "🍬", "🍫", "🍓", "🍒", "🍉", "🥂", "🍻", "🧸", "🎈"
];

export default function DesignToolbar({ 
  designSettings, 
  onChange, 
  onAddEmoji,
  hasSelection,
  onBringForward,
  onSendBackward,
  onDeleteSelected,
  onOpenDrawModal
}) {
  const [isEmojiExpanded, setIsEmojiExpanded] = useState(false);

  const handleChange = (field, value) => {
    onChange(field, value);
  };

  const displayedEmojis = isEmojiExpanded ? partyEmojis : partyEmojis.slice(0, 12);

  return (
    <section className="border-controls">
      <div className="section-heading-row">
        <span>Elements</span>
        <small>Add blobs and stickers</small>
      </div>

      <div className="form-grid" style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        <button type="button" className="secondary-button" onClick={() => handleChange("addColorPoint", true)}>
          + Add Background Color Blob
        </button>
      </div>

      <div className="section-heading-row" style={{ marginTop: "1.5rem" }}>
        <span>Stickers & Emojis</span>
      </div>
      <div className="emoji-grid" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "0.5rem" }}>
        {displayedEmojis.map((emoji, index) => (
          <button 
            key={`${emoji}-${index}`} 
            type="button" 
            onClick={() => onAddEmoji(emoji)}
            style={{ fontSize: "1.5rem", padding: "0.25rem", background: "none", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
            title={`Add ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <button 
        type="button" 
        onClick={() => setIsEmojiExpanded(!isEmojiExpanded)}
        style={{ width: "100%", padding: "0.25rem", marginBottom: "1rem", background: "#f3f4f6", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.875rem" }}
      >
        {isEmojiExpanded ? "Show Less" : "Show More"}
      </button>
      
      {/* Font editors and layering controls have been moved to PropertiesPanel.jsx */}
    </section>
  );
}
