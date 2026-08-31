"use client";

import React, { useEffect, useState } from "react";

interface FryParticle {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  rotation: number;
  spinSpeed: number;
  opacity: number;
}

export const FriesRain: React.FC = () => {
  const [fries, setFries] = useState<FryParticle[]>([]);

  useEffect(() => {
    // Generate 12 gentle floating / falling fries particles with varied timings
    const initialFries: FryParticle[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.floor(Math.random() * 92) + 4, // 4% to 96% of screen width
      duration: Math.floor(Math.random() * 8) + 10, // 10s to 18s fall
      delay: Math.floor(Math.random() * 12),
      size: Math.floor(Math.random() * 10) + 20, // 20px to 30px
      rotation: Math.floor(Math.random() * 360),
      spinSpeed: Math.floor(Math.random() * 6) + 4,
      opacity: Math.random() * 0.4 + 0.35, // 0.35 to 0.75
    }));

    setFries(initialFries);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[15] overflow-hidden">
      {fries.map((fry) => (
        <div
          key={fry.id}
          className="absolute -top-12 animate-fry-fall select-none drop-shadow-md"
          style={{
            left: `${fry.left}%`,
            animationDuration: `${fry.duration}s`,
            animationDelay: `${fry.delay}s`,
            opacity: fry.opacity,
            fontSize: `${fry.size}px`,
          }}
        >
          <div
            className="animate-spin-slow inline-block transform"
            style={{
              animationDuration: `${fry.spinSpeed}s`,
            }}
          >
            {["🍚", "🫓", "🍯", "🌾", "🥟", "🌶️"][fry.id % 6]}
          </div>
        </div>
      ))}
    </div>
  );
};
