import { gsap } from "./gsap";

export const animateHeroEntrance = (target: string) => {
  if (typeof window === "undefined") return;
  
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.fromTo(
    target,
    { opacity: 0, y: 60, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15 }
  );
  return tl;
};
