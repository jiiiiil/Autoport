"use client";

import type { ComposedMotion } from "@/server/ai/composition/types";

export function getScrollBehavior(motion: ComposedMotion): "smooth" | "auto" {
  if (motion.style === "apple" || motion.style === "minimal" || motion.style === "micro-interactions") {
    return "smooth";
  }
  return "smooth";
}

export function getTransitionStyles(motion: ComposedMotion): React.CSSProperties {
  if (motion.intensity === "none") {
    return {};
  }

  const duration = motion.intensity === "heavy" ? "0.5s" : motion.intensity === "moderate" ? "0.3s" : "0.2s";
  const easing = motion.style === "physics" ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "cubic-bezier(0.25, 0.1, 0.25, 1)";

  return {
    transition: `all ${duration} ${easing}`,
  };
}

export function getParallaxOffset(motion: ComposedMotion): number {
  if (motion.style === "parallax" || motion.style === "gsap-heavy") {
    return motion.intensity === "heavy" ? 100 : motion.intensity === "moderate" ? 50 : 20;
  }
  return 0;
}

export function getHoverScale(motion: ComposedMotion): number {
  if (motion.intensity === "none") return 1;
  if (motion.intensity === "heavy") return 1.03;
  if (motion.intensity === "moderate") return 1.02;
  return 1.01;
}
