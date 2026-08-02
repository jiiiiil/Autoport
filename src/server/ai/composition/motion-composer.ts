import type { AIContextObject } from "../intelligence/types";
import type { PromptConstraints, ComposedMotion, MotionStyle } from "./types";

function inferMotionStyle(
  context: AIContextObject,
  constraints: PromptConstraints,
  promptHash: string
): MotionStyle {
  const hashNum = parseInt(promptHash, 36) % 100;
  const lower = context.rawPrompt.toLowerCase();

  const preferredMotion = constraints.preferences.motion;
  if (preferredMotion && isValidMotion(preferredMotion)) {
    return preferredMotion as MotionStyle;
  }

  if (!context.animations.enabled || context.animations.intensity === "none") {
    return "none";
  }

  const designLang = context.designLanguage[0]?.name;

  const wantsGsap = lower.includes("gsap") || lower.includes("scrolltrigger") || lower.includes("smooth scroll");
  const wantsParallax = lower.includes("parallax") || lower.includes("scroll animation");
  const wantsTextReveal = lower.includes("text reveal") || lower.includes("typewriter");
  const wantsMagnetic = lower.includes("magnetic") || lower.includes("cursor");
  const wantsHeavy = lower.includes("dramatic") || lower.includes("cinematic") || lower.includes("storytelling");

  if (wantsGsap) return "gsap-heavy";
  if (wantsParallax) return "parallax";
  if (wantsMagnetic) return "physics";
  if (wantsHeavy) return "scroll-storytelling";
  if (wantsTextReveal) return "editorial";

  if (designLang === "apple") return "apple";
  if (designLang === "editorial" || designLang === "magazine") return "editorial";
  if (designLang === "cyberpunk") return "experimental";
  if (designLang === "brutalist") return hashNum % 2 === 0 ? "none" : "micro-interactions";
  if (designLang === "luxury") return "subtle";
  if (designLang === "minimal") return "minimal";

  if (context.animationLibraries.length > 0) {
    const lib = context.animationLibraries[0].name;
    if (lib === "gsap") return "gsap-heavy";
    if (lib === "three" || lib === "react-three-fiber") return "3d";
    if (lib === "lenis") return "scroll-storytelling";
  }

  const intensity = context.animations.intensity;
  if (intensity === "heavy") {
    return hashNum % 3 === 0 ? "apple" : hashNum % 3 === 1 ? "gsap-heavy" : "scroll-storytelling";
  }
  if (intensity === "moderate") {
    return hashNum % 4 === 0 ? "editorial" : hashNum % 4 === 1 ? "subtle" : hashNum % 4 === 2 ? "micro-interactions" : "moderate";
  }

  return hashNum % 2 === 0 ? "minimal" : "subtle";
}

function isValidMotion(motion: string): boolean {
  const valid = [
    "minimal", "apple", "editorial", "gsap-heavy", "physics",
    "scroll-storytelling", "parallax", "3d", "micro-interactions",
    "experimental", "none", "subtle", "moderate", "heavy",
  ];
  return valid.includes(motion);
}

function getMotionLibrary(style: MotionStyle, context: AIContextObject): string {
  const lower = context.rawPrompt.toLowerCase();
  const wantsGsap = lower.includes("gsap") || lower.includes("scrolltrigger");

  if (wantsGsap) return "gsap";

  if (context.animationLibraries.length > 0) {
    const libName = context.animationLibraries[0].name;
    if (libName === "gsap" && (style === "gsap-heavy" || style === "scroll-storytelling")) return "gsap";
    if (libName === "three" || libName === "react-three-fiber") return "three";
  }
  if (style === "gsap-heavy" || style === "scroll-storytelling" || style === "physics") return "gsap";
  if (style === "3d") return "three";
  return "framer-motion";
}

function getIntensity(style: MotionStyle): "none" | "subtle" | "moderate" | "heavy" {
  const intensityMap: Record<MotionStyle, "none" | "subtle" | "moderate" | "heavy"> = {
    "none": "none",
    "minimal": "subtle",
    "subtle": "subtle",
    "apple": "moderate",
    "editorial": "moderate",
    "moderate": "moderate",
    "micro-interactions": "moderate",
    "gsap-heavy": "heavy",
    "scroll-storytelling": "heavy",
    "parallax": "heavy",
    "3d": "heavy",
    "physics": "heavy",
    "experimental": "heavy",
    "heavy": "heavy",
  };
  return intensityMap[style] || "subtle";
}

function getHeroMotion(
  style: MotionStyle,
  designLang: string
): { type: string; duration: string; easing: string; stagger: string } {
  const heroMotions: Record<MotionStyle, { type: string; duration: string; easing: string; stagger: string }> = {
    none: { type: "none", duration: "0ms", easing: "linear", stagger: "0ms" },
    minimal: { type: "fade-up", duration: "600ms", easing: "ease-out", stagger: "100ms" },
    subtle: { type: "fade-up", duration: "500ms", easing: "[0.25,0.46,0.45,0.94]", stagger: "80ms" },
    apple: { type: "spring-scale", duration: "800ms", easing: "[0.23,1,0.32,1]", stagger: "120ms" },
    editorial: { type: "typewriter-reveal", duration: "1200ms", easing: "ease-out", stagger: "150ms" },
    moderate: { type: "slide-up-fade", duration: "600ms", easing: "ease-out", stagger: "100ms" },
    "micro-interactions": { type: "scale-glow", duration: "400ms", easing: "ease-out", stagger: "60ms" },
    "gsap-heavy": { type: "split-text-reveal", duration: "1500ms", easing: "power3.out", stagger: "200ms" },
    "scroll-storytelling": { type: "parallax-text", duration: "1000ms", easing: "power2.out", stagger: "150ms" },
    parallax: { type: "parallax-layers", duration: "1200ms", easing: "ease-out", stagger: "100ms" },
    "3d": { type: "3d-rotate-in", duration: "1000ms", easing: "[0.23,1,0.32,1]", stagger: "150ms" },
    physics: { type: "spring-bounce", duration: "800ms", easing: "spring", stagger: "120ms" },
    experimental: { type: "morph-reveal", duration: "1500ms", easing: "ease-in-out", stagger: "200ms" },
    heavy: { type: "cinematic-reveal", duration: "1800ms", easing: "[0.23,1,0.32,1]", stagger: "250ms" },
  };

  const base = heroMotions[style] || heroMotions.minimal;

  if (designLang === "luxury") {
    return { ...base, duration: `${parseInt(base.duration) * 1.5}ms`, easing: "[0.25,0.1,0.25,1]" };
  }
  if (designLang === "brutalist") {
    return { type: "none", duration: "0ms", easing: "linear", stagger: "0ms" };
  }

  return base;
}

function getGsapAnimations(style: MotionStyle): {
  textReveal: boolean;
  fadeReveal: boolean;
  imageReveal: boolean;
  sectionPinning: boolean;
  parallax: boolean;
  floatingElements: boolean;
  magneticButtons: boolean;
  cursorInteraction: boolean;
  cardHoverMotion: boolean;
  smoothScroll: boolean;
} {
  if (style === "gsap-heavy") {
    return {
      textReveal: true, fadeReveal: true, imageReveal: true, sectionPinning: true,
      parallax: true, floatingElements: true, magneticButtons: true,
      cursorInteraction: true, cardHoverMotion: true, smoothScroll: true,
    };
  }
  if (style === "scroll-storytelling") {
    return {
      textReveal: true, fadeReveal: true, imageReveal: true, sectionPinning: true,
      parallax: true, floatingElements: false, magneticButtons: false,
      cursorInteraction: false, cardHoverMotion: true, smoothScroll: true,
    };
  }
  if (style === "parallax") {
    return {
      textReveal: false, fadeReveal: true, imageReveal: true, sectionPinning: false,
      parallax: true, floatingElements: false, magneticButtons: false,
      cursorInteraction: false, cardHoverMotion: true, smoothScroll: false,
    };
  }
  if (style === "physics") {
    return {
      textReveal: false, fadeReveal: true, imageReveal: false, sectionPinning: false,
      parallax: false, floatingElements: false, magneticButtons: true,
      cursorInteraction: true, cardHoverMotion: true, smoothScroll: false,
    };
  }
  return {
    textReveal: false, fadeReveal: false, imageReveal: false, sectionPinning: false,
    parallax: false, floatingElements: false, magneticButtons: false,
    cursorInteraction: false, cardHoverMotion: false, smoothScroll: false,
  };
}

function getSectionMotion(style: MotionStyle): { enter: string; exit: string; stagger: string } {
  const sectionMotions: Record<MotionStyle, { enter: string; exit: string; stagger: string }> = {
    none: { enter: "none", exit: "none", stagger: "0ms" },
    minimal: { enter: "fade-in", exit: "fade-out", stagger: "50ms" },
    subtle: { enter: "fade-in-up", exit: "fade-out-down", stagger: "60ms" },
    apple: { enter: "scale-in", exit: "scale-out", stagger: "80ms" },
    editorial: { enter: "slide-in-left", exit: "slide-out-right", stagger: "100ms" },
    moderate: { enter: "fade-in-up", exit: "fade-out", stagger: "80ms" },
    "micro-interactions": { enter: "pop-in", exit: "pop-out", stagger: "40ms" },
    "gsap-heavy": { enter: "scroll-trigger-reveal", exit: "scroll-trigger-hide", stagger: "120ms" },
    "scroll-storytelling": { enter: "parallax-section-in", exit: "parallax-section-out", stagger: "100ms" },
    parallax: { enter: "parallax-in", exit: "parallax-out", stagger: "80ms" },
    "3d": { enter: "3d-flip-in", exit: "3d-flip-out", stagger: "100ms" },
    physics: { enter: "spring-in", exit: "spring-out", stagger: "80ms" },
    experimental: { enter: "glitch-in", exit: "glitch-out", stagger: "120ms" },
    heavy: { enter: "cinematic-reveal", exit: "cinematic-hide", stagger: "150ms" },
  };
  return sectionMotions[style] || sectionMotions.minimal;
}

function getCardMotion(style: MotionStyle): { hover: string; focus: string; tap: string } {
  const cardMotions: Record<MotionStyle, { hover: string; focus: string; tap: string }> = {
    none: { hover: "none", focus: "none", tap: "none" },
    minimal: { hover: "lift-sm", focus: "ring", tap: "press-sm" },
    subtle: { hover: "lift", focus: "ring", tap: "press" },
    apple: { hover: "scale-105", focus: "ring-accent", tap: "scale-95" },
    editorial: { hover: "tilt-subtle", focus: "ring", tap: "press" },
    moderate: { hover: "lift-glow", focus: "ring", tap: "press" },
    "micro-interactions": { hover: "wiggle", focus: "glow", tap: "bounce" },
    "gsap-heavy": { hover: "3d-tilt", focus: "ring-glow", tap: "scale-95" },
    "scroll-storytelling": { hover: "parallax-shift", focus: "ring", tap: "press" },
    parallax: { hover: "depth-shift", focus: "ring", tap: "press" },
    "3d": { hover: "3d-rotate", focus: "ring", tap: "scale-95" },
    physics: { hover: "spring-hover", focus: "ring", tap: "spring-tap" },
    experimental: { hover: "morph", focus: "glitch-focus", tap: "explode" },
    heavy: { hover: "dramatic-lift", focus: "ring-glow", tap: "scale-95" },
  };
  return cardMotions[style] || cardMotions.minimal;
}

function getScrollMotion(style: MotionStyle): { enabled: boolean; type: string; trigger: string; offset: string } {
  if (style === "none" || style === "minimal") {
    return { enabled: false, type: "none", trigger: "none", offset: "0px" };
  }
  if (style === "scroll-storytelling" || style === "parallax") {
    return { enabled: true, type: style === "parallax" ? "parallax" : "scroll-linked", trigger: "onEnter", offset: "-100px" };
  }
  return { enabled: true, type: "scroll-reveal", trigger: "onEnter", offset: "-50px" };
}

function getPageTransitions(style: MotionStyle): { enabled: boolean; type: string; duration: string } {
  if (style === "none" || style === "minimal") {
    return { enabled: false, type: "none", duration: "0ms" };
  }
  if (style === "apple") return { enabled: true, type: "shared-element", duration: "500ms" };
  if (style === "editorial") return { enabled: true, type: "slide", duration: "400ms" };
  return { enabled: true, type: "fade", duration: "300ms" };
}

function getMicroInteractions(style: MotionStyle): string[] {
  const interactions: Record<MotionStyle, string[]> = {
    none: [],
    minimal: ["button-press", "link-underline"],
    subtle: ["button-press", "link-underline", "input-focus"],
    apple: ["button-scale", "toggle-bounce", "input-focus-glow", "card-hover-lift"],
    editorial: ["button-slide", "text-reveal", "image-hover"],
    moderate: ["button-scale", "card-lift", "input-focus", "toggle-switch"],
    "micro-interactions": ["button-bounce", "checkbox-check", "toggle-spin", "heart-beat", "confetti"],
    "gsap-heavy": ["button-magnetic", "cursor-follow", "text-split", "image-reveal"],
    "scroll-storytelling": ["scroll-indicator", "progress-bar", "parallax-cursor"],
    parallax: ["depth-cursor", "scroll-indicator", "layer-shift"],
    "3d": ["card-rotate", "button-depth", "cursor-3d"],
    physics: ["spring-button", "bounce-card", "elastic-input"],
    experimental: ["glitch-hover", "morph-button", "noise-background"],
    heavy: ["button-magnetic", "cursor-follow", "text-split", "image-reveal", "scroll-linked"],
  };
  return interactions[style] || interactions.minimal;
}

export function composeMotion(
  context: AIContextObject,
  constraints: PromptConstraints,
  promptHash: string
): ComposedMotion {
  const style = inferMotionStyle(context, constraints, promptHash);
  const designLang = context.designLanguage[0]?.name || "";

  return {
    style,
    library: getMotionLibrary(style, context),
    intensity: getIntensity(style),
    hero: getHeroMotion(style, designLang),
    sections: getSectionMotion(style),
    cards: getCardMotion(style),
    scroll: getScrollMotion(style),
    pageTransitions: getPageTransitions(style),
    microInteractions: getMicroInteractions(style),
    reducedMotionFallback: style === "none" ? "none" : "fade-in",
    gsap: getGsapAnimations(style),
  };
}
