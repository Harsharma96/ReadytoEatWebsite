"use client";

import React from "react";

interface LiquidWaveDividerProps {
  fillColor?: string;
  isFlipped?: boolean;
}

export const LiquidWaveDivider: React.FC<LiquidWaveDividerProps> = ({
  fillColor = "#FFF8F2",
  isFlipped = false,
}) => {
  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none relative z-10 ${
        isFlipped ? "rotate-180 -mt-1" : "-mb-1"
      }`}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-12 sm:h-16 lg:h-20"
      >
        <path
          d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
          fill={fillColor}
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z;
              M0,20 C180,-20 320,80 520,25 C720,-30 880,95 1200,30 L1200,120 L0,120 Z;
              M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z
            "
          />
        </path>
      </svg>
    </div>
  );
};
