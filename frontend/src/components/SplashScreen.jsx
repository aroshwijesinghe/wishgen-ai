import React, { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading out at 1.7s to finish exactly at 2.0s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1700);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${isFading ? 'fade-out' : ''}`}>
      <div className="ambient-glow splash-glow-1"></div>
      <div className="ambient-glow splash-glow-2"></div>
      
      <div className="splash-content">
        <div className="creative-spinner">
          <div className="spinner-ring ring-1"></div>
          <div className="spinner-ring ring-2"></div>
          <div className="spinner-ring ring-3"></div>
          <div className="spinner-core">✨</div>
        </div>
        
        <h1 className="splash-title">
          {"Wishgen AI".split("").map((char, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <p className="splash-subtitle">Crafting your magic...</p>
      </div>
    </div>
  );
}
