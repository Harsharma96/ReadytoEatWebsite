"use client";

import React from "react";

interface SectionDividerProps {
  label?: string;
  icon?: string;
  variant?: "flame" | "leaf" | "star" | "drop" | "crown";
}

const ICONS: Record<string, string> = {
  flame: "🔥",
  leaf:  "🌿",
  star:  "✦",
  drop:  "💧",
  crown: "👑",
};

export const SectionDivider: React.FC<SectionDividerProps> = ({
  label,
  icon,
  variant = "star",
}) => {
  const emoji = icon || ICONS[variant] || "✦";

  return (
    <div className="relative w-full flex flex-col items-center py-5 sm:py-6 overflow-hidden">
      
      {/* ── Background frosted glass strip (visible on all screens) ── */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10"
        style={{
          background:
            "linear-gradient(90deg,transparent 0%,rgba(255,107,53,0.06) 15%,rgba(255,138,0,0.10) 50%,rgba(255,107,53,0.06) 85%,transparent 100%)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* ── Thin gradient rule lines ── */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center px-5">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-orange-400/30" />
        <div className="w-28 sm:w-36 mx-3" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-orange-300/50 to-orange-400/30" />
      </div>

      {/* ── Center pill badge ── */}
      <div
        className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200/70 shadow-sm"
        style={{
          background: "rgba(255,255,255,0.70)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 2px 12px rgba(255,107,53,0.10), 0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {/* Left decorative dot */}
        <span className="w-1 h-1 rounded-full bg-orange-400/60 animate-pulse" />

        {/* Emoji icon */}
        <span className="text-sm leading-none">{emoji}</span>

        {/* Label or default ornament */}
        {label ? (
          <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase text-gray-500">
            {label}
          </span>
        ) : (
          <span className="flex gap-0.5 items-center">
            <span className="w-1 h-1 rounded-full bg-orange-300/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]/70" />
            <span className="w-1 h-1 rounded-full bg-orange-300/80" />
          </span>
        )}

        {/* Right decorative dot */}
        <span className="w-1 h-1 rounded-full bg-orange-400/60 animate-pulse" />
      </div>
    </div>
  );
};
