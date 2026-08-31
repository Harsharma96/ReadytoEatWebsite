"use client";

import React, { useEffect, useState, useRef } from "react";

interface SparkParticle {
  x: number;
  y: number;
  size: number;
  emoji: string;
}

interface FoodBurstItem {
  id: number;
  emoji: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation: number;
  size: number;
  duration: number;
  direction: "down" | "up" | "epic";
  glowColor: string;
  sparks: SparkParticle[];
}

const BURST_FOODS = [
  { emoji: "🍚", glow: "rgba(255, 107, 53, 0.65)" },
  { emoji: "🍲", glow: "rgba(255, 77, 109, 0.65)" },
  { emoji: "🍢", glow: "rgba(255, 138, 0, 0.65)" },
  { emoji: "🫓", glow: "rgba(212, 163, 115, 0.65)" },
  { emoji: "🍯", glow: "rgba(255, 201, 74, 0.65)" },
  { emoji: "🥛", glow: "rgba(62, 207, 110, 0.65)" },
  { emoji: "🥟", glow: "rgba(255, 160, 60, 0.65)" },
  { emoji: "🌶️", glow: "rgba(255, 60, 60, 0.65)" },
  { emoji: "🌾", glow: "rgba(255, 215, 0, 0.65)" },
  { emoji: "🌿", glow: "rgba(62, 207, 110, 0.65)" },
  { emoji: "🍋", glow: "rgba(255, 220, 50, 0.65)" },
];

const WOW_MOMENTS = [
  { emoji: "👑🍚", label: "Royal Awadhi Dum Biryani" },
  { emoji: "🍲✨", label: "Purani Dilli Butter Chicken" },
  { emoji: "🍢🔥", label: "Tandoori Tikka Meteor" },
  { emoji: "🍯💫", label: "24K Gold Gulab Jamun" },
  { emoji: "👨‍🍳👑", label: "Royal Master Chef" },
];

export const FoodUniverseEngine: React.FC = () => {
  const [activeItems, setActiveItems] = useState<FoodBurstItem[]>([]);
  const lastScrollY = useRef(0);
  const scrollCounter = useRef(0);
  const itemCounter = useRef(0);
  const isCooldown = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;
      const absDelta = Math.abs(deltaY);

      lastScrollY.current = currentScrollY;

      // Filter micro-jitter with snappy 160ms cooldown
      if (absDelta < 12 || isCooldown.current) return;
      isCooldown.current = true;
      setTimeout(() => {
        isCooldown.current = false;
      }, 160);

      scrollCounter.current += 1;
      const isScrollDown = deltaY > 0;
      const isWowTrigger = scrollCounter.current % 7 === 0;

      const newItems: FoodBurstItem[] = [];

      if (isWowTrigger) {
        // RARE WOW MOMENT (1.2s luxurious flight)
        itemCounter.current += 1;
        const wow = WOW_MOMENTS[Math.floor(Math.random() * WOW_MOMENTS.length)];
        const fromLeft = Math.random() > 0.5;

        newItems.push({
          id: itemCounter.current,
          emoji: wow.emoji,
          startX: fromLeft ? -110 : window.innerWidth + 80,
          startY: window.innerHeight * (0.26 + Math.random() * 0.32),
          endX: fromLeft ? window.innerWidth + 110 : -110,
          endY: window.innerHeight * (0.3 + Math.random() * 0.32),
          rotation: fromLeft ? 220 : -220,
          size: 68,
          duration: 1.2,
          direction: "epic",
          glowColor: "rgba(255, 107, 53, 0.8)",
          sparks: [
            { x: -18, y: -18, size: 14, emoji: "✨" },
            { x: 22, y: -14, size: 12, emoji: "⭐" },
            { x: -14, y: 22, size: 12, emoji: "💫" },
          ],
        });
      } else {
        // SCROLL FOOD BURST (2 to 4 items, 45px to 70px, 0.9s duration)
        const burstCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 items

        for (let i = 0; i < burstCount; i++) {
          itemCounter.current += 1;
          const food = BURST_FOODS[Math.floor(Math.random() * BURST_FOODS.length)];
          const size = Math.floor(Math.random() * 26) + 45; // 45px to 70px

          if (isScrollDown) {
            // SCROLL DOWN: Fast curved drop, bounce settle, 0.9s duration
            const startX = Math.random() * (window.innerWidth - 130) + 65;
            const startY = -55 - Math.random() * 45;
            const endY = startY + window.innerHeight * 0.36;
            const endX = startX + (Math.random() - 0.5) * 150;

            newItems.push({
              id: itemCounter.current,
              emoji: food.emoji,
              startX,
              startY,
              endX,
              endY,
              rotation: (Math.random() - 0.5) * 300,
              size,
              duration: 0.9, // 0.9s target duration
              direction: "down",
              glowColor: food.glow,
              sparks: [
                { x: (Math.random() - 0.5) * 28, y: (Math.random() - 0.5) * 28, size: 10, emoji: "✨" },
              ],
            });
          } else {
            // SCROLL UP: Fast rising upward on elastic float
            const startX = Math.random() * (window.innerWidth - 130) + 65;
            const startY = window.innerHeight + 55;
            const endY = startY - window.innerHeight * 0.38;
            const endX = startX + (Math.random() - 0.5) * 160;

            newItems.push({
              id: itemCounter.current,
              emoji: food.emoji,
              startX,
              startY,
              endX,
              endY,
              rotation: (Math.random() - 0.5) * 260,
              size,
              duration: 0.9, // 0.9s target duration
              direction: "up",
              glowColor: food.glow,
              sparks: [
                { x: (Math.random() - 0.5) * 28, y: (Math.random() - 0.5) * 28, size: 10, emoji: "✨" },
              ],
            });
          }
        }
      }

      // Keep viewport clean & 60fps
      setActiveItems((prev) => [...prev.slice(-3), ...newItems]);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Snappy auto-cleanup after 0.95s
  useEffect(() => {
    if (activeItems.length === 0) return;
    const timer = setTimeout(() => {
      setActiveItems((prev) => prev.slice(1));
    }, 950);
    return () => clearTimeout(timer);
  }, [activeItems]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[25] overflow-hidden">
      {activeItems.map((item) => {
        const animationClass =
          item.direction === "epic"
            ? "animate-burst-epic"
            : item.direction === "down"
            ? "animate-burst-down"
            : "animate-burst-up";

        return (
          <div
            key={item.id}
            className={`absolute select-none transform will-change-transform ${animationClass}`}
            style={{
              left: `${item.startX}px`,
              top: `${item.startY}px`,
              fontSize: `${item.size}px`,
              animationDuration: `${item.duration}s`,
              "--burst-dx": `${item.endX - item.startX}px`,
              "--burst-dy": `${item.endY - item.startY}px`,
              "--burst-rot": `${item.rotation}deg`,
              filter: `drop-shadow(0 12px 22px ${item.glowColor})`,
            } as React.CSSProperties}
          >
            {/* Food Emoji */}
            <span className="inline-block transform">{item.emoji}</span>

            {/* Spark Particle */}
            {item.sparks.map((spark, sIdx) => (
              <span
                key={sIdx}
                className="absolute animate-ping opacity-85 pointer-events-none"
                style={{
                  left: `${spark.x}px`,
                  top: `${spark.y}px`,
                  fontSize: `${spark.size}px`,
                  animationDuration: "0.7s",
                }}
              >
                {spark.emoji}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
