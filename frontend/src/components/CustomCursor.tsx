"use client";

import React, { useEffect, useState } from "react";

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFoodHovered, setIsFoodHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer");

      const isFood =
        target.tagName === "IMG" ||
        target.closest(".group") !== null ||
        target.closest(".glass-card") !== null;

      setIsHovered(Boolean(isInteractive));
      setIsFoodHovered(Boolean(isFood));
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Liquid Physics spring smoothing
  useEffect(() => {
    let animationFrameId: number;

    const follow = () => {
      setFollowerPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.16,
        y: prev.y + (position.y - prev.y) * 0.16,
      }));
      animationFrameId = requestAnimationFrame(follow);
    };

    animationFrameId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      
      {/* Morphing Liquid Follower Blob */}
      <div
        className="absolute transition-transform duration-75 ease-out pointer-events-none"
        style={{
          transform: `translate3d(${followerPos.x - (isFoodHovered ? 40 : 25)}px, ${
            followerPos.y - (isFoodHovered ? 40 : 25)
          }px, 0) scale(${isHovered ? 1.6 : isFoodHovered ? 2.0 : 1})`,
          width: isFoodHovered ? "80px" : "50px",
          height: isFoodHovered ? "80px" : "50px",
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full filter blur-[2px] opacity-75">
          <defs>
            <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FF8A00" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path fill="url(#cursorGradient)">
            <animate
              attributeName="d"
              dur="4s"
              repeatCount="indefinite"
              values="
                M 50,15 C 70,15 85,30 85,50 C 85,70 70,85 50,85 C 30,85 15,70 15,50 C 15,30 30,15 50,15 Z;
                M 50,10 C 78,18 90,35 82,60 C 75,82 58,90 40,84 C 20,78 10,58 18,35 C 25,15 35,5 50,10 Z;
                M 50,15 C 70,15 85,30 85,50 C 85,70 70,85 50,85 C 30,85 15,70 15,50 C 15,30 30,15 50,15 Z
              "
            />
          </path>
        </svg>
      </div>

      {/* Center Precision Glow Dot */}
      <div
        className="absolute w-2.5 h-2.5 rounded-full pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${position.x - 5}px, ${position.y - 5}px, 0) scale(${isHovered ? 1.4 : 1})`,
          backgroundColor: isFoodHovered ? "#FF4D6D" : "#FF6B35",
          boxShadow: "0 0 12px rgba(255, 107, 53, 0.9)",
        }}
      />
    </div>
  );
};
