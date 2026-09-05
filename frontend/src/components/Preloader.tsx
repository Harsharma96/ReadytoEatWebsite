"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/gsap";

export const Preloader: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // References for GSAP targets
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const iconWrapperRef = useRef<HTMLDivElement>(null);
  const iconGlowRef = useRef<HTMLDivElement>(null);
  const brandTextRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const shineBeamRef = useRef<HTMLDivElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);

    // 1. Check if user already saw the intro in this session
    if (typeof window !== "undefined") {
      const hasSeenIntro = sessionStorage.getItem("foodeat_logo_intro_seen");
      const urlParams = new URLSearchParams(window.location.search);
      const isReplaying = urlParams.has("replay") || urlParams.has("intro");

      if (hasSeenIntro && !isReplaying) {
        setIsFinished(true);
        return;
      }
    }

    // 2. Accessibility: Respect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsFinished(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("foodeat_logo_intro_seen", "true");
      }
      return;
    }

    // Prevent body scrolling during intro playback
    document.body.style.overflow = "hidden";

    // 3. GSAP 60fps Hardware-Accelerated Animation Timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.body.style.overflow = "";
          setIsFinished(true);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("foodeat_logo_intro_seen", "true");
          }
        },
      });

      // Initial States
      gsap.set(iconWrapperRef.current, {
        opacity: 0,
        scale: 0.84,
        y: 8,
        transformOrigin: "center center",
      });

      gsap.set(iconGlowRef.current, {
        opacity: 0,
        scale: 0.6,
      });

      gsap.set(brandTextRef.current, {
        opacity: 0,
        y: 16,
        filter: "blur(14px)",
      });

      gsap.set(taglineRef.current, {
        opacity: 0,
        y: 12,
      });

      gsap.set(shineBeamRef.current, {
        x: -280,
        opacity: 0,
      });

      gsap.set(skipButtonRef.current, {
        opacity: 0,
      });

      // ── Step 1: Fork & Spoon Icon Smooth Fade + Scale-Up (0.05s - 0.45s)
      tl.to(
        iconWrapperRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.42,
          ease: "power2.out",
        },
        0.05
      );

      // ── Step 2: Subtle Ambient Orange Glow Around Icon (0.15s - 0.65s)
      tl.to(
        iconGlowRef.current,
        {
          opacity: 0.65,
          scale: 1.12,
          duration: 0.4,
          ease: "power2.out",
        },
        0.15
      );

      // ── Step 3: "FOODEAT" Text Reveal from Blurred to Sharp (0.25s - 0.65s)
      tl.to(
        brandTextRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.4,
          ease: "power3.out",
        },
        0.25
      );

      // ── Step 4: Tagline "SHAHI RASOI • DESI GHEE" Smooth Fade-Up (0.45s - 0.8s)
      tl.to(
        taglineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        },
        0.45
      );

      // Show subtle skip button after logo stabilizes
      tl.to(
        skipButtonRef.current,
        {
          opacity: 0.6,
          duration: 0.25,
        },
        0.5
      );

      // ── Step 5: Soft Light Sheen Sweep Across the Logo (0.6s - 0.95s)
      tl.to(
        shineBeamRef.current,
        {
          x: 280,
          opacity: 0.45,
          duration: 0.38,
          ease: "power2.inOut",
        },
        0.6
      );
      tl.to(
        shineBeamRef.current,
        {
          opacity: 0,
          duration: 0.15,
          ease: "power1.out",
        },
        0.95
      );

      // ── Step 6: Smooth Cinematic Transition into Main Website (1.05s - 1.35s)
      tl.to(
        contentWrapperRef.current,
        {
          opacity: 0,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.in",
        },
        1.05
      );

      tl.to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
        },
        1.1
      );
    }, overlayRef);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        skipIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const skipIntro = () => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        onComplete: () => {
          document.body.style.overflow = "";
          setIsFinished(true);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("foodeat_logo_intro_seen", "true");
          }
        },
      });
    } else {
      setIsFinished(true);
    }
  };

  if (!mounted || isFinished) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-label="FOODEAT Intro"
      onClick={skipIntro}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#FFF8F2] select-none cursor-pointer overflow-hidden"
      style={{ willChange: "opacity" }}
    >
      {/* ── Ambient Background Lighting (Inherits Website Theme) ── */}
      <div className="absolute inset-0 pointer-events-none aurora-mesh-bg opacity-75" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] bg-gradient-to-tr from-[#FF6B35]/15 via-[#FF8A00]/10 to-[#FF4D6D]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Logo Content Group (Completely seamless, zero box or boundary) ── */}
      <div
        ref={contentWrapperRef}
        className="relative z-10 flex flex-col items-center justify-center"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Ambient Warm Radial Glow behind the Icon */}
        <div
          ref={iconGlowRef}
          className="absolute -top-6 sm:-top-8 w-44 sm:w-56 h-44 sm:h-56 rounded-full bg-radial from-[#FF6B35]/30 via-[#FF8A00]/12 to-transparent blur-2xl pointer-events-none"
          style={{ willChange: "transform, opacity" }}
        />

        {/* ── FOODEAT Crossed Fork & Spoon Icon ── */}
        <div
          ref={iconWrapperRef}
          className="relative mb-3 sm:mb-4 flex items-center justify-center"
          style={{ willChange: "transform, opacity" }}
        >
          <svg
            viewBox="0 0 200 200"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 overflow-visible drop-shadow-[0_4px_16px_rgba(255,107,53,0.18)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Spoon: Tilted 45 degrees to the right (bowl top-right, handle bottom-left) */}
            <g transform="rotate(45 100 100)">
              <ellipse
                cx="100"
                cy="62"
                rx="17"
                ry="25"
                stroke="#FF6B35"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 100 87 L 100 166"
                stroke="#FF6B35"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Fork: Tilted 45 degrees to the left (tines top-left, handle bottom-right) */}
            <g transform="rotate(-45 100 100)">
              <path
                d="M 77 42 L 77 78 Q 77 90 100 90 Q 123 90 123 78 L 123 42"
                stroke="#FF6B35"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 100 42 L 100 90"
                stroke="#FF6B35"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 100 90 L 100 166"
                stroke="#FF6B35"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        {/* ── Brand Wordmark: FOOD (Dark/Black) + EAT (Orange) ── */}
        <div
          ref={brandTextRef}
          className="relative font-heading font-black text-5xl sm:text-6xl md:text-7xl tracking-tight leading-none text-center flex items-center justify-center"
          style={{ willChange: "transform, opacity, filter" }}
        >
          {/* FOOD: Deep Black */}
          <span className="text-[#000000]">FOOD</span>
          {/* EAT: Brand Orange */}
          <span className="text-[#FF6B35]">EAT</span>
        </div>

        {/* ── Heritage Tagline: SHAHI RASOI • DESI GHEE (Green) ── */}
        <p
          ref={taglineRef}
          className="mt-3 sm:mt-3.5 text-xs sm:text-sm md:text-[15px] font-extrabold uppercase text-[#0D6832] tracking-[0.28em] sm:tracking-[0.3em] font-sans text-center leading-none"
          style={{ willChange: "transform, opacity" }}
        >
          SHAHI RASOI • DESI GHEE
        </p>

        {/* ── Single Subtle Feathered Light Sheen Sweep (No rectangular container) ── */}
        <div
          ref={shineBeamRef}
          className="absolute pointer-events-none w-28 sm:w-36 h-[180%] -top-[40%] rotate-[25deg] bg-gradient-to-r from-transparent via-white/55 to-transparent blur-sm mix-blend-overlay"
          style={{ willChange: "transform, opacity" }}
        />
      </div>

      {/* ── Subtle Skip Hint / Button ── */}
      <button
        ref={skipButtonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          skipIntro();
        }}
        className="absolute bottom-8 sm:bottom-10 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase text-[#0B1220]/50 hover:text-[#0B1220] hover:bg-black/5 transition-all duration-200"
      >
        Skip Intro <span className="opacity-60 ml-1">→</span>
      </button>
    </div>
  );
};

export default Preloader;
