"use client";

import React, { useEffect, useState } from "react";
import { UtensilsCrossed, Sparkles } from "lucide-react";

export const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 22) + 14;
      });
    }, 55);

    return () => clearInterval(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#FFF8F2] transition-opacity duration-700 ${
        progress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Radiant moving aurora blur */}
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-[#FF6B35]/30 via-[#FF8A00]/25 to-[#FF4D6D]/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        
        {/* Animated Glowing Logo with Spinning Fork & Knife */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] flex items-center justify-center text-white shadow-glow animate-bounce">
            <UtensilsCrossed className="w-11 h-11 animate-spin-slow" />
          </div>
          <div className="absolute -inset-3 rounded-[2.5rem] border-2 border-[#FF6B35]/40 animate-ping opacity-60 pointer-events-none" />
        </div>

        {/* Brand Title */}
        <div className="text-center space-y-1.5">
          <h2 className="text-4xl font-black tracking-tight text-[#0B1220] font-heading">
            FOOD<span className="text-[#FF6B35]">EAT</span>
          </h2>
          <p className="text-xs font-black text-gray-400 tracking-widest uppercase">
            Awwwards Culinary Experience
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-52 h-2 bg-gray-200/90 rounded-full overflow-hidden p-0.5 border border-white">
          <div
            className="h-full bg-gradient-to-r from-[#FF6B35] via-[#FF8A00] to-[#FF4D6D] rounded-full transition-all duration-150 ease-out"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        <span className="text-xs font-black text-[#FF6B35] font-mono">
          {Math.min(100, progress)}%
        </span>
      </div>
    </div>
  );
};
