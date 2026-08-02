// @ts-nocheck
import type { PortfolioBlueprint } from "../blueprint/types";
import type { ComposedLayout } from "./types";

const LAYOUT_COMPOSITIONS: Record<string, { primary: string; modifiers: string[]; cssStrategy: string }> = {
  "split": { primary: "split-panel", modifiers: ["sticky-content", "scroll-visual"], cssStrategy: "grid-template-columns: 1fr 1fr" },
  "magazine": { primary: "multi-column", modifiers: ["varied-widths", "pull-quotes", "inline-images"], cssStrategy: "column-count with break-inside" },
  "editorial": { primary: "single-column-narrow", modifiers: ["typography-focus", "large-headings", "generous-spacing"], cssStrategy: "max-width: 720px centered" },
  "creative": { primary: "asymmetric-grid", modifiers: ["overlapping-elements", "negative-margins", "z-index-layering"], cssStrategy: "grid with varied span" },
  "minimal": { primary: "single-column", modifiers: ["centered-content", "generous-whitespace"], cssStrategy: "max-width: 1024px centered" },
  "gallery": { primary: "image-grid", modifiers: ["masonry-layout", "lightbox-trigger", "hover-zoom"], cssStrategy: "grid with aspect-ratio" },
  "timeline": { primary: "chronological-flow", modifiers: ["center-line", "alternating-cards", "scroll-triggered"], cssStrategy: "flex column with relative positioning" },
  "storytelling": { primary: "narrative-flow", modifiers: ["section-transitions", "scroll-progress", "parallax-layers"], cssStrategy: "full-width sections with scroll-snap" },
  "grid": { primary: "data-grid", modifiers: ["card-matrix", "filter-bar", "sortable"], cssStrategy: "CSS grid with auto-fill" },
  "bento": { primary: "bento-box", modifiers: ["varied-sizes", "span-2", "span-full", "aspect-varied"], cssStrategy: "grid with grid-template-areas" },
  "dashboard": { primary: "sidebar-content", modifiers: ["collapsible-nav", "widget-grid", "data-cards"], cssStrategy: "grid sidebar + main" },
  "portfolio-landing": { primary: "hero-landing", modifiers: ["fullscreen-hero", "scroll-indicator", "section-panels"], cssStrategy: "100vh hero + stacked sections" },
  "landing-sections": { primary: "stacked-sections", modifiers: ["full-width-bands", "alternating-bg", "parallax"], cssStrategy: "full-width sections with container inner" },
};

export function composeLayout(blueprint: PortfolioBlueprint): ComposedLayout {
  const composition = LAYOUT_COMPOSITIONS[blueprint.layout.type] ?? LAYOUT_COMPOSITIONS["minimal"];

  const modifiers = [...composition.modifiers];

  if (blueprint.animations.scroll.enabled) {
    modifiers.push("scroll-triggered-reveal");
  }
  if (blueprint.animations.intensity === "heavy") {
    modifiers.push("parallax-layers");
  }
  if (blueprint.designSystem.theme === "dark") {
    modifiers.push("dark-surface-layers");
  }

  const description = `${composition.primary} layout with ${modifiers.join(", ")} behaviors`;

  return {
    primary: composition.primary,
    modifiers,
    description,
    cssStrategy: composition.cssStrategy,
  };
}
