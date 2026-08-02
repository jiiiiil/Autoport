// @ts-nocheck
import type { PortfolioBlueprint } from "../blueprint/types";
import type { NoveltyReport } from "./types";

const COMMON_PATTERNS = [
  "hero-about-skills-projects-contact",
  "hero-projects-experience-contact",
  "hero-about-projects-contact",
  "hero-skills-projects-experience-contact",
];

const DIVERSIFICATION_STRATEGIES = [
  "non-linear-section-order",
  "asymmetric-layout-composition",
  "unexpected-component-variants",
  "progressive-disclosure",
  "scroll-driven-narrative",
  "interactive-data-visualization",
  "ambient-background-effects",
  "contextual-micro-animations",
  "dynamic-content-loading",
  "personalized-section-ordering",
];

const UNIQUE_ELEMENTS_BY_PROFESSION: Record<string, string[]> = {
  "developer": ["interactive-code-playground", "github-contribution-graph", "tech-stack-visualizer", "project-deployment-status"],
  "ai-engineer": ["model-performance-viz", "data-pipeline-diagram", "accuracy-metrics", "training-progress", "research-paper-links"],
  "designer": ["before-after-comparison", "design-process-timeline", "style-guide-preview", "figma-embed", "interaction-prototype"],
  "photographer": ["exif-data-display", "location-map", "gear-list", "booking-calendar", "print-shop"],
  "writer": ["reading-progress", "word-count", "publication-timeline", "writing-process", "reading-list"],
  "freelancer": ["pricing-table", "availability-calendar", "client-logos", "process-steps", "package-comparison"],
  "agency": ["case-study-deep-dive", "team-rotating-showcase", "client-testimonial-video", "service-comparison", "process-infographic"],
  "student": ["coursework-highlights", "learning-journey", "skill-progress-tracker", "hackathon-projects", "mentor-quotes"],
};

export function diversifyNovelty(blueprint: PortfolioBlueprint): NoveltyReport {
  const sectionPattern = blueprint.sections.map((s) => s.id).join("-");
  const isCommon = COMMON_PATTERNS.some((p) => sectionPattern.includes(p));

  let originalityScore = isCommon ? 40 : 70;

  const diversifications: string[] = [];
  const uniqueElements: string[] = [];

  if (isCommon) {
    diversifications.push("reorder-sections-for-narrative-flow");
    diversifications.push("add-transitional-elements-between-sections");
    originalityScore += 10;
  }

  if (blueprint.layout.type === "minimal" || blueprint.layout.type === "grid") {
    diversifications.push("compose-hybrid-layout");
    originalityScore += 5;
  }

  const professionElements = UNIQUE_ELEMENTS_BY_PROFESSION[blueprint.profession] ?? [];
  if (professionElements.length > 0) {
    uniqueElements.push(...professionElements.slice(0, 3));
    originalityScore += 15;
  }

  if (blueprint.animations.intensity === "heavy") {
    uniqueElements.push("scroll-driven-chapter-transitions");
    originalityScore += 5;
  }

  if (blueprint.designLanguage === "cyberpunk" || blueprint.designLanguage === "creative") {
    uniqueElements.push("ambient-particle-system");
    uniqueElements.push("interactive-cursor-effects");
    originalityScore += 5;
  }

  diversifications.push(...DIVERSIFICATION_STRATEGIES.slice(0, 3));

  originalityScore = Math.min(originalityScore, 100);

  return {
    originalityScore,
    diversifications,
    uniqueElements,
  };
}
