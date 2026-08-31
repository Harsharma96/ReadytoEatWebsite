export const triggerConfetti = (options?: any) => {
  if (typeof window !== "undefined") {
    import("canvas-confetti").then((module) => {
      const confetti = module.default || module;
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          ...options,
        });
      } catch (e) {
        console.error("Confetti error", e);
      }
    }).catch(() => {});
  }
};

/**
 * 🪙 Golden Chillar & Royal Coin Shower
 * Bursts realistic shimmering gold coins, discs, and celebratory sparkles.
 */
export const triggerChillarShower = () => {
  if (typeof window !== "undefined") {
    import("canvas-confetti").then((module) => {
      const confetti = module.default || module;
      try {
        // Gold Coin Color Palette
        const goldColors = ["#FFD700", "#FFC72C", "#FFA500", "#F59E0B", "#FFEAA7", "#E67E22"];

        // 1. Center High-Power Golden Coin Volley
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.55 },
          colors: goldColors,
          shapes: ["circle"],
          scalar: 1.4,
          drift: 0,
          gravity: 0.85,
          ticks: 200,
        });

        // 2. Left and Right Shimmer Cannons
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 70,
            origin: { x: 0.15, y: 0.65 },
            colors: goldColors,
            shapes: ["circle", "square"],
            scalar: 1.2,
            gravity: 0.9,
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 70,
            origin: { x: 0.85, y: 0.65 },
            colors: goldColors,
            shapes: ["circle", "square"],
            scalar: 1.2,
            gravity: 0.9,
          });
        }, 200);

        // 3. Lingering Golden Sparkles
        setTimeout(() => {
          confetti({
            particleCount: 40,
            spread: 140,
            origin: { y: 0.45 },
            colors: ["#FFE082", "#FFD54F", "#FFFFFF"],
            scalar: 0.9,
            gravity: 0.7,
            ticks: 180,
          });
        }, 450);
      } catch (e) {
        console.error("Chillar shower error:", e);
      }
    }).catch(() => {});
  }
};
