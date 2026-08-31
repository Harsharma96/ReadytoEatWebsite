"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

interface FlyingCartParticle {
  id: number;
  emoji: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

export const AddToCartFlyAnimation: React.FC = () => {
  const [particles, setParticles] = useState<FlyingCartParticle[]>([]);

  useEffect(() => {
    const handleFlyEvent = (e: CustomEvent<{ emoji: string; x: number; y: number }>) => {
      const { emoji, x, y } = e.detail;
      const cartEl = document.getElementById("cart-bag-btn");
      const rect = cartEl ? cartEl.getBoundingClientRect() : { left: window.innerWidth - 80, top: 30 };

      const newParticle: FlyingCartParticle = {
        id: Date.now() + Math.random(),
        emoji: emoji || "🍔",
        startX: x || window.innerWidth / 2,
        startY: y || window.innerHeight / 2,
        targetX: rect.left + 20,
        targetY: rect.top + 20,
      };

      setParticles((prev) => [...prev, newParticle]);

      // Trigger cart button bounce & glow
      if (cartEl) {
        cartEl.classList.add("cart-bounce-glow");
        setTimeout(() => {
          cartEl.classList.remove("cart-bounce-glow");
        }, 800);
      }
    };

    window.addEventListener("foodEatFlyToCart" as any, handleFlyEvent);
    return () => window.removeEventListener("foodEatFlyToCart" as any, handleFlyEvent);
  }, []);

  const handleAnimationEnd = (id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          onAnimationEnd={() => handleAnimationEnd(p.id)}
          className="absolute text-4xl select-none animate-fly-to-cart will-change-transform"
          style={{
            left: `${p.startX}px`,
            top: `${p.startY}px`,
            "--fly-target-x": `${p.targetX - p.startX}px`,
            "--fly-target-y": `${p.targetY - p.startY}px`,
            filter: "drop-shadow(0 10px 15px rgba(255, 107, 53, 0.6))",
          } as React.CSSProperties}
        >
          <span className="inline-block transform">{p.emoji}</span>
          <span className="absolute -top-1 -right-1 text-xs animate-ping text-[#FFC94A]">✨</span>
        </div>
      ))}
    </div>
  );
};
