"use client";

import React, { useEffect, useRef } from "react";

export const LiquidBlobSystem: React.FC = () => {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable heavy mouse tracking on touch devices to conserve battery and guarantee 60fps
    const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = window.scrollY || 0;
    let isTicking = false;
    let rafId: number;

    const updateTransforms = () => {
      if (blob1Ref.current) {
        blob1Ref.current.style.transform = `translate3d(${mouseX * 0.8}px, ${mouseY * 0.8 - scrollY * 0.15}px, 0) rotate(${scrollY * 0.05}deg)`;
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.transform = `translate3d(${-mouseX * 0.7}px, ${-mouseY * 0.7 - scrollY * 0.1}px, 0) rotate(${-scrollY * 0.04}deg)`;
      }
      if (blob3Ref.current) {
        blob3Ref.current.style.transform = `translate3d(${mouseX * 0.9}px, ${mouseY * 0.9}px, 0) rotate(${scrollY * 0.03}deg)`;
      }
      isTicking = false;
    };

    const requestTick = () => {
      if (!isTicking) {
        isTicking = true;
        rafId = requestAnimationFrame(updateTransforms);
      }
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
      requestTick();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 36;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 36;
      requestTick();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    if (!isTouch) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (!isTouch) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* LAYER 1: Morphing Liquid Blob #1 (Top / Hero - Orange Coral) */}
      <div
        ref={blob1Ref}
        className="absolute -top-20 -left-20 w-[600px] h-[600px] opacity-40 filter blur-[45px] transition-transform duration-300 ease-out will-change-transform"
      >
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <defs>
            <linearGradient id="blobG1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="50%" stopColor="#FF8A00" />
              <stop offset="100%" stopColor="#FF4D6D" />
            </linearGradient>
          </defs>
          <path fill="url(#blobG1)">
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="
                M 250,50 C 370,50 450,130 450,250 C 450,370 370,450 250,450 C 130,450 60,380 60,260 C 60,170 140,80 230,80 C 290,80 340,120 340,170 C 340,210 310,240 270,240 C 230,240 200,210 200,180 C 200,150 160,160 140,190 C 110,240 140,360 250,360 C 330,360 370,300 370,240 C 370,180 330,120 250,120 Z;
                M 260,40 C 390,70 460,160 440,270 C 420,380 340,460 220,440 C 110,420 50,330 70,220 C 80,140 160,60 240,60 C 310,60 360,100 350,160 C 340,200 300,230 260,220 C 220,210 190,190 190,160 C 190,130 150,140 130,180 C 100,230 130,340 240,350 C 320,360 360,290 350,230 C 340,170 300,110 260,40 Z;
                M 240,60 C 360,40 440,120 450,230 C 460,350 380,440 260,450 C 140,460 70,390 60,270 C 50,180 130,90 220,90 C 280,90 330,130 330,180 C 330,220 290,250 250,250 C 210,250 180,220 180,190 C 180,160 140,170 130,200 C 110,250 150,370 260,370 C 340,370 380,310 380,250 C 380,190 340,130 240,60 Z;
                M 250,50 C 370,50 450,130 450,250 C 450,370 370,450 250,450 C 130,450 60,380 60,260 C 60,170 140,80 230,80 C 290,80 340,120 340,170 C 340,210 310,240 270,240 C 230,240 200,210 200,180 C 200,150 160,160 140,190 C 110,240 140,360 250,360 C 330,360 370,300 370,240 C 370,180 330,120 250,120 Z
              "
            />
          </path>
        </svg>
      </div>

      {/* LAYER 2: Morphing Liquid Blob #2 (Mid Page - Fresh Green / Lime) */}
      <div
        ref={blob2Ref}
        className="absolute top-[35%] -right-20 w-[550px] h-[550px] opacity-35 filter blur-[50px] transition-transform duration-300 ease-out will-change-transform"
      >
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <defs>
            <linearGradient id="blobG2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3ECF6E" />
              <stop offset="60%" stopColor="#8BC34A" />
              <stop offset="100%" stopColor="#FFC94A" />
            </linearGradient>
          </defs>
          <path fill="url(#blobG2)">
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="
                M 230,60 C 350,40 440,110 450,220 C 460,340 390,440 270,450 C 150,460 70,390 60,280 C 50,190 120,90 210,80 C 270,70 320,110 330,160 C 340,200 310,240 270,240 C 230,240 190,210 190,170 C 190,140 150,150 130,180 C 100,230 140,350 250,360 C 330,370 380,310 380,240 C 380,180 330,120 230,60 Z;
                M 250,40 C 380,60 450,150 440,260 C 430,370 350,460 230,450 C 120,440 50,350 60,240 C 70,150 150,70 230,60 C 290,50 340,90 350,150 C 360,190 320,230 280,230 C 240,230 200,200 200,160 C 200,130 160,140 140,170 C 110,220 140,330 240,340 C 320,350 370,290 370,220 C 370,160 320,100 250,40 Z;
                M 230,60 C 350,40 440,110 450,220 C 460,340 390,440 270,450 C 150,460 70,390 60,280 C 50,190 120,90 210,80 C 270,70 320,110 330,160 C 340,200 310,240 270,240 C 230,240 190,210 190,170 C 190,140 150,150 130,180 C 100,230 140,350 250,360 C 330,370 380,310 380,240 C 380,180 330,120 230,60 Z
              "
            />
          </path>
        </svg>
      </div>

      {/* LAYER 3: Morphing Liquid Blob #3 (Bottom / Offer / Contact - Neon Pink / Coral) */}
      <div
        ref={blob3Ref}
        className="absolute bottom-10 -left-16 w-[600px] h-[600px] opacity-35 filter blur-[50px] transition-transform duration-300 ease-out will-change-transform"
      >
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <defs>
            <linearGradient id="blobG3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4D6D" />
              <stop offset="50%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#FFC94A" />
            </linearGradient>
          </defs>
          <path fill="url(#blobG3)">
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="
                M 250,50 C 370,50 450,130 450,250 C 450,370 370,450 250,450 C 130,450 60,380 60,260 C 60,170 140,80 230,80 C 290,80 340,120 340,170 C 340,210 310,240 270,240 C 230,240 200,210 200,180 C 200,150 160,160 140,190 C 110,240 140,360 250,360 C 330,360 370,300 370,240 C 370,180 330,120 250,120 Z;
                M 260,40 C 390,70 460,160 440,270 C 420,380 340,460 220,440 C 110,420 50,330 70,220 C 80,140 160,60 240,60 C 310,60 360,100 350,160 C 340,200 300,230 260,220 C 220,210 190,190 190,160 C 190,130 150,140 130,180 C 100,230 130,340 240,350 C 320,360 360,290 350,230 C 340,170 300,110 260,40 Z;
                M 250,50 C 370,50 450,130 450,250 C 450,370 370,450 250,450 C 130,450 60,380 60,260 C 60,170 140,80 230,80 C 290,80 340,120 340,170 C 340,210 310,240 270,240 C 230,240 200,210 200,180 C 200,150 160,160 140,190 C 110,240 140,360 250,360 C 330,360 370,300 370,240 C 370,180 330,120 250,120 Z
              "
            />
          </path>
        </svg>
      </div>

    </div>
  );
};
