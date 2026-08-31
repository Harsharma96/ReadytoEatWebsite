"use client";

import { useCallback } from "react";
import { triggerFoodRainCelebration } from "../animations/foodRain";

export const useFoodRain = () => {
  const triggerRain = useCallback((containerId = "food-rain-layer", count = 100) => {
    triggerFoodRainCelebration(containerId, count);
  }, []);

  return { triggerRain };
};
