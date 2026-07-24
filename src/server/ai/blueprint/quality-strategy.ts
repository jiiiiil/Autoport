import type { AIContextObject } from "../intelligence/types";
import type { AccessibilityPlan, PerformancePlan } from "./types";

export function planAccessibility(context: AIContextObject): AccessibilityPlan {
  return {
    ariaLabels: true,
    keyboardNavigation: true,
    focusManagement: true,
    colorContrast: "AA",
    reducedMotion: context.animations.intensity !== "none",
    semanticHtml: true,
    skipLinks: true,
    altTextRequired: true,
  };
}

export function planPerformance(context: AIContextObject): PerformancePlan {
  const heavy = context.animations.intensity === "heavy";

  return {
    lazyLoading: true,
    dynamicImports: context.metadata.complexity !== "simple",
    imageOptimization: true,
    codeSplitting: context.metadata.complexity === "complex" || context.metadata.complexity === "expert",
    animationOptimization: heavy,
    bundleOptimization: true,
    prefetching: context.metadata.complexity !== "expert",
    prerendering: context.primaryFramework === "nextjs",
  };
}
