"use client";

import React from "react";

export interface FoodeatLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "intro";
  showTagline?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  taglineClassName?: string;
  iconRef?: React.RefObject<SVGSVGElement>;
  textRef?: React.RefObject<HTMLDivElement>;
  taglineRef?: React.RefObject<HTMLParagraphElement>;
}

export const FoodeatLogo: React.FC<FoodeatLogoProps> = ({
  size = "md",
  showTagline = true,
  className = "",
  iconClassName = "",
  textClassName = "",
  taglineClassName = "",
  iconRef,
  textRef,
  taglineRef,
}) => {
  // Dimension presets for different contexts
  const dimensions = {
    sm: {
      icon: "w-8 h-8",
      text: "text-lg tracking-tight",
      tagline: "text-[8px] tracking-[0.2em]",
      gap: "gap-1",
    },
    md: {
      icon: "w-11 h-11",
      text: "text-2xl tracking-tight",
      tagline: "text-[10px] tracking-[0.22em]",
      gap: "gap-1.5",
    },
    lg: {
      icon: "w-16 h-16",
      text: "text-3xl sm:text-4xl tracking-tight",
      tagline: "text-xs sm:text-sm tracking-[0.24em]",
      gap: "gap-2 sm:gap-2.5",
    },
    xl: {
      icon: "w-20 h-20 sm:w-24 sm:h-24",
      text: "text-4xl sm:text-5xl tracking-tight",
      tagline: "text-sm sm:text-base tracking-[0.26em]",
      gap: "gap-3",
    },
    intro: {
      icon: "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32",
      text: "text-5xl sm:text-6xl md:text-7xl tracking-tight font-black",
      tagline: "text-xs sm:text-sm md:text-base tracking-[0.28em] font-extrabold",
      gap: "gap-3 sm:gap-4",
    },
  }[size];

  return (
    <div className={`flex flex-col items-center select-none text-center ${dimensions.gap} ${className}`}>
      {/* ── Official Crossed Fork & Spoon Icon ── */}
      <div className="relative flex items-center justify-center">
        <svg
          ref={iconRef}
          viewBox="0 0 200 200"
          className={`${dimensions.icon} ${iconClassName} overflow-visible`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="FOODEAT Crossed Fork and Spoon Logo"
        >
          {/* Subtle ambient orange glow filter for high-end feel */}
          <defs>
            <filter id="foodeatIconGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Spoon: Tilted 45 degrees to the right (bowl top-right, handle bottom-left) */}
          <g transform="rotate(45 100 100)">
            {/* Oval Spoon Bowl */}
            <ellipse
              cx="100"
              cy="62"
              rx="17"
              ry="25"
              stroke="#FF6B35"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Spoon Handle */}
            <path
              d="M 100 87 L 100 166"
              stroke="#FF6B35"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Fork: Tilted 45 degrees to the left (tines top-left, handle bottom-right) */}
          <g transform="rotate(-45 100 100)">
            {/* Outer Tines & Curved Fork Base */}
            <path
              d="M 77 42 L 77 78 Q 77 90 100 90 Q 123 90 123 78 L 123 42"
              stroke="#FF6B35"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Center Tine */}
            <path
              d="M 100 42 L 100 90"
              stroke="#FF6B35"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Fork Handle */}
            <path
              d="M 100 90 L 100 166"
              stroke="#FF6B35"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {/* ── Brand Wordmark: FOOD (Dark) + EAT (Orange) ── */}
      <div
        ref={textRef}
        className={`font-black font-heading leading-none flex items-center justify-center ${dimensions.text} ${textClassName}`}
      >
        <span className="text-[#0B1220]">FOOD</span>
        <span className="text-[#FF6B35]">EAT</span>
      </div>

      {/* ── Heritage Tagline: SHAHI RASOI • DESI GHEE (Green) ── */}
      {showTagline && (
        <p
          ref={taglineRef}
          className={`uppercase font-sans font-bold text-[#0D6832] leading-tight ${dimensions.tagline} ${taglineClassName}`}
        >
          SHAHI RASOI • DESI GHEE
        </p>
      )}
    </div>
  );
};
