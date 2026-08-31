import { gsap, ScrollTrigger } from "./gsap";

export const initScrollReveal = (selector: string) => {
  if (typeof window === "undefined") return;

  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};
