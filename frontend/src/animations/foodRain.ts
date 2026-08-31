import { gsap } from "./gsap";

const FOOD_EMOJIS = ["🍔", "🍕", "🍟", "🌮", "🍩", "🥤", "🍪", "🧀", "🍣", "🥑", "🍓"];

export const triggerFoodRainCelebration = (containerId: string, count = 100) => {
  if (typeof window === "undefined") return;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "absolute pointer-events-none select-none text-3xl sm:text-5xl";
    el.innerText = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)];

    const startX = Math.random() * window.innerWidth;
    const startY = -60 - Math.random() * 200;
    const duration = 1.2 + Math.random() * 1.5;
    const rotation = Math.random() * 720 - 360;

    container.appendChild(el);

    gsap.fromTo(
      el,
      { x: startX, y: startY, rotation: 0, opacity: 1, scale: 0.8 + Math.random() * 0.5 },
      {
        y: window.innerHeight + 100,
        rotation,
        duration,
        delay: Math.random() * 1.2,
        ease: "power1.in",
        onComplete: () => el.remove(),
      }
    );
  }
};
