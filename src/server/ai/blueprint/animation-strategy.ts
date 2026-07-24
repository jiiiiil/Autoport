import type { AIContextObject } from "../intelligence/types";

interface AnimationPlan {
  library: string;
  intensity: string;
  hero: { type: string; duration: string; easing: string };
  cards: { type: string; duration: string; easing: string };
  scroll: { enabled: boolean; type: string };
  transitions: { page: string; hover: string; focus: string };
  microInteractions: string[];
}

export function planAnimations(context: AIContextObject): AnimationPlan {
  const animLib = context.animationLibraries[0]?.name ?? "framer-motion";
  const intensity = context.animations.intensity;

  if (intensity === "none") {
    return {
      library: animLib,
      intensity: "none",
      hero: { type: "none", duration: "0ms", easing: "ease" },
      cards: { type: "none", duration: "0ms", easing: "ease" },
      scroll: { enabled: false, type: "none" },
      transitions: { page: "none", hover: "none", focus: "none" },
      microInteractions: [],
    };
  }

  const heroTypes: Record<string, { type: string; duration: string; easing: string }> = {
    "framer-motion": { type: "fade-up", duration: "600ms", easing: "[0.22, 1, 0.36, 1]" },
    "gsap": { type: "gsap-hero", duration: "1s", easing: "power3.out" },
    "lenis": { type: "smooth-fade", duration: "800ms", easing: "ease-out" },
    "motion-one": { type: "fade-up", duration: "600ms", easing: "ease-out" },
  };

  const cardTypes: Record<string, { type: string; duration: string; easing: string }> = {
    "framer-motion": { type: "fade-up-stagger", duration: "400ms", easing: "[0.22, 1, 0.36, 1]" },
    "gsap": { type: "gsap-stagger", duration: "0.6s", easing: "power2.out" },
    "motion-one": { type: "stagger-fade", duration: "400ms", easing: "ease-out" },
  };

  const hero = heroTypes[animLib] ?? heroTypes["framer-motion"];
  const cards = cardTypes[animLib] ?? cardTypes["framer-motion"];

  const scrollEnabled = intensity === "moderate" || intensity === "heavy";
  const microInteractions: string[] = [];

  if (intensity === "subtle") {
    microInteractions.push("hover-scale", "focus-ring");
  } else if (intensity === "moderate") {
    microInteractions.push("hover-scale", "focus-ring", "page-transition", "scroll-indicator");
  } else if (intensity === "heavy") {
    microInteractions.push(
      "hover-scale", "hover-glow", "focus-ring", "page-transition",
      "scroll-indicator", "cursor-follow", "text-reveal", "parallax"
    );
  }

  const lower = context.normalizedPrompt;
  if (/\bscroll\b/i.test(lower)) microInteractions.push("scroll-trigger");
  if (/\bparallax\b/i.test(lower)) microInteractions.push("parallax");
  if (/\bhover\b/i.test(lower) && !microInteractions.includes("hover-scale")) microInteractions.push("hover-scale");
  if (/\bcursor\b/i.test(lower)) microInteractions.push("cursor-follow");
  if (/\bloading\b/i.test(lower)) microInteractions.push("loading-skeleton");

  return {
    library: animLib,
    intensity,
    hero,
    cards,
    scroll: {
      enabled: scrollEnabled,
      type: animLib === "lenis" ? "lenis-smooth" : "scroll-trigger",
    },
    transitions: {
      page: intensity === "heavy" ? "shared-layout" : "fade",
      hover: "scale",
      focus: "ring",
    },
    microInteractions,
  };
}
