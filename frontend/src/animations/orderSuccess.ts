import { gsap } from "./gsap";
import { triggerFoodRainCelebration } from "./foodRain";

export const playOrderCelebrationFlow = (containerId: string, onComplete?: () => void) => {
  if (typeof window === "undefined") return;

  triggerFoodRainCelebration(containerId, 120);

  const celebrationTimeline = gsap.timeline({
    onComplete: () => {
      if (onComplete) onComplete();
    },
  });

  celebrationTimeline.to(".celebration-badge", {
    scale: 1.2,
    rotation: 360,
    duration: 1,
    ease: "elastic.out(1, 0.3)",
  });

  return celebrationTimeline;
};
