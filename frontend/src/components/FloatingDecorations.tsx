"use client";

import React, { useEffect, useState } from "react";

export const FloatingDecorations: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      
      {/* 🌿 Drifting Basil Leaf (Left Upper) */}
      <div
        className="absolute top-[22%] left-[3%] text-3xl opacity-80 filter drop-shadow-md transition-transform duration-700 ease-out animate-drift-herb"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.08}px, 0) rotate(${scrollY * 0.05}deg)`,
        }}
      >
        🌿
      </div>

      {/* 🍋 Rotating Lemon Slice (Right Upper) */}
      <div
        className="absolute top-[35%] right-[4%] text-3xl opacity-75 filter drop-shadow-md transition-transform duration-700 ease-out animate-rotate-lemon"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.06}px, 0)`,
        }}
      >
        🍋
      </div>

      {/* 🧄 Garlic Clove (Left Mid) */}
      <div
        className="absolute top-[48%] left-[5%] text-2xl opacity-70 filter drop-shadow-md transition-transform duration-700 ease-out animate-float-center"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.07}px, 0)`,
        }}
      >
        🧄
      </div>

      {/* 🧅 Onion Ring (Right Mid) */}
      <div
        className="absolute top-[58%] right-[6%] text-3xl opacity-75 filter drop-shadow-md transition-transform duration-700 ease-out animate-drift-herb"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.09}px, 0) rotate(${-scrollY * 0.06}deg)`,
        }}
      >
        🧅
      </div>

      {/* 🧀 Cheese Cube (Left Lower-Mid) */}
      <div
        className="absolute top-[68%] left-[4%] text-3xl opacity-75 filter drop-shadow-md transition-transform duration-700 ease-out animate-float-center"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.05}px, 0)`,
        }}
      >
        🧀
      </div>

      {/* 🌶️ Chili Pepper (Right Lower) */}
      <div
        className="absolute top-[78%] right-[5%] text-3xl opacity-80 filter drop-shadow-md transition-transform duration-700 ease-out animate-drift-herb"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.08}px, 0) rotate(${scrollY * 0.07}deg)`,
        }}
      >
        🌶️
      </div>

      {/* 🍅 Fresh Cherry Tomato (Left Bottom) */}
      <div
        className="absolute top-[88%] left-[7%] text-3xl opacity-75 filter drop-shadow-md transition-transform duration-700 ease-out animate-float-center"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.06}px, 0)`,
        }}
      >
        🍅
      </div>

      {/* 🫑 Sweet Bell Pepper (Right Bottom) */}
      <div
        className="absolute top-[92%] right-[8%] text-3xl opacity-70 filter drop-shadow-md transition-transform duration-700 ease-out animate-drift-herb"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.04}px, 0) rotate(${-scrollY * 0.05}deg)`,
        }}
      >
        🫑
      </div>

      {/* ✨ Floating Sparkles */}
      <div className="absolute top-[52%] right-[15%] text-xl opacity-60 animate-ping">
        ✨
      </div>

    </div>
  );
};
