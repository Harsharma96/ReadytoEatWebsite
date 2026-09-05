"use client";

import React, { useEffect, useRef } from "react";

export const CustomCursor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on desktop devices with fine pointer (mouse)
    const isDesktopPointer =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!isDesktopPointer) return;

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let isHovered = false;
    let isFoodHovered = false;
    let isVisible = false;
    let rafId: number;

    const renderLoop = () => {
      // Lerp physics spring interpolation
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      if (dotRef.current) {
        const scale = isHovered ? 1.4 : 1.0;
        dotRef.current.style.transform = `translate3d(${mouseX - 5}px, ${mouseY - 5}px, 0) scale(${scale})`;
        dotRef.current.style.backgroundColor = isFoodHovered ? "#FF4D6D" : "#FF6B35";
      }

      if (followerRef.current) {
        const offset = isFoodHovered ? 40 : 25;
        const scale = isHovered ? 1.5 : isFoodHovered ? 1.9 : 1.0;
        followerRef.current.style.transform = `translate3d(${followerX - offset}px, ${followerY - offset}px, 0) scale(${scale})`;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible && containerRef.current) {
        isVisible = true;
        containerRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (containerRef.current) {
        containerRef.current.style.opacity = "0";
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      isHovered = Boolean(
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer")
      );

      isFoodHovered = Boolean(
        target.tagName === "IMG" ||
        target.closest(".group") !== null ||
        target.closest(".glass-card") !== null
      );
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden lg:block pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none opacity-0 transition-opacity duration-200"
    >
      {/* Morphing Liquid Follower Blob */}
      <div
        ref={followerRef}
        className="absolute pointer-events-none will-change-transform w-[50px] h-[50px]"
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
        ref={dotRef}
        className="absolute w-2.5 h-2.5 rounded-full pointer-events-none will-change-transform bg-[#FF6B35] shadow-[0_0_12px_rgba(255,107,53,0.9)]"
      />
    </div>
  );
};
