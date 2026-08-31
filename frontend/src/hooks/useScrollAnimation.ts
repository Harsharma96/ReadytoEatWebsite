"use client";

import { useEffect } from "react";
import { initScrollReveal } from "../animations/scroll";

export const useScrollAnimation = (selector = ".reveal-on-scroll") => {
  useEffect(() => {
    initScrollReveal(selector);
  }, [selector]);
};
