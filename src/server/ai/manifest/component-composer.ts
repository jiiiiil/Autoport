import type { PortfolioBlueprint } from "../blueprint/types";
import type { ComposedComponent } from "./types";

const HERO_COMPOSITIONS: Record<string, { base: string; elements: string[]; behavior: string }> = {
  "terminal": { base: "terminal-hero", elements: ["typing-animation", "command-prompt", "blinking-cursor", "output-lines", "floating-stats"], behavior: "auto-type on load" },
  "split": { base: "split-hero", elements: ["text-content", "visual-panel", "gradient-accent", "floating-badge"], behavior: "fade-in-left + fade-in-right" },
  "centered": { base: "centered-hero", elements: ["headline", "subtitle", "cta-group", "scroll-indicator"], behavior: "stagger-up reveal" },
  "full-screen": { base: "fullscreen-hero", elements: ["background-image", "overlay-gradient", "centered-text", "scroll-indicator"], behavior: "parallax-background" },
  "animated-gradient": { base: "gradient-hero", elements: ["animated-bg", "glass-card", "text-content", "particle-overlay"], behavior: "gradient-shift animation" },
  "particle": { base: "particle-hero", elements: ["canvas-background", "connected-dots", "text-content", "glow-effects"], behavior: "mouse-follow particles" },
  "typewriter": { base: "typewriter-hero", elements: ["rotating-text", "static-prefix", "cursor", "subtitle"], behavior: "type-delete cycle" },
  "minimal": { base: "minimal-hero", elements: ["clean-headline", "single-line-sub", "minimal-cta"], behavior: "simple-fade-in" },
  "3d": { base: "three-hero", elements: ["3d-scene", "orbit-controls", "text-overlay"], behavior: "interactive-3d" },
  "video-bg": { base: "video-hero", elements: ["background-video", "overlay", "text-content"], behavior: "video-autoplay" },
  "code-editor": { base: "code-hero", elements: ["syntax-highlighted-code", "line-numbers", "file-tabs", "gutter"], behavior: "code-type-animation" },
  "glass": { base: "glass-hero", elements: ["frosted-panel", "gradient-bg", "text-content", "floating-elements"], behavior: "glass-blur-reveal" },
};

const PROJECT_COMPOSITIONS: Record<string, { base: string; elements: string[]; behavior: string }> = {
  "card": { base: "project-card-grid", elements: ["image-preview", "title", "description", "tag-list", "link"], behavior: "hover-lift + stagger-reveal" },
  "showcase": { base: "showcase-panel", elements: ["large-image", "project-info", "tech-stack", "visit-link"], behavior: "slide-in-reveal" },
  "masonry": { base: "masonry-grid", elements: ["varied-height-cards", "overlay-on-hover", "quick-info"], behavior: "masonry-layout + fade-in" },
  "case-study": { base: "case-study-card", elements: ["thumbnail", "title", "outcome-metrics", "read-more"], behavior: "expand-on-click" },
  "horizontal-scroll": { base: "horizontal-gallery", elements: ["scroll-container", "project-cards", "scroll-indicator"], behavior: "horizontal-drag-scroll" },
  "bento": { base: "bento-projects", elements: ["large-feature", "small-cards", "span-2", "span-full"], behavior: "varied-grid-placement" },
  "magazine": { base: "magazine-spread", elements: ["editorial-layout", "inline-images", "pull-quotes"], behavior: "page-turn-reveal" },
  "minimal": { base: "minimal-list", elements: ["project-name", "short-desc", "arrow-link"], behavior: "simple-fade" },
  "video": { base: "video-project", elements: ["video-preview", "title-overlay", "play-button"], behavior: "hover-play" },
  "grid": { base: "project-grid", elements: ["grid-cards", "filter-bar", "sort-options"], behavior: "filter-animate" },
};

const SKILL_COMPOSITIONS: Record<string, { base: string; elements: string[]; behavior: string }> = {
  "pills": { base: "skill-pills", elements: ["pill-tags", "category-groups", "hover-highlight"], behavior: "stagger-fade-in" },
  "bars": { base: "skill-bars", elements: ["progress-bars", "percentage-labels", "category-headers"], behavior: "bar-fill-animation" },
  "icon-grid": { base: "skill-icon-grid", elements: ["icon-cards", "skill-name", "level-indicator"], behavior: "grid-stagger" },
  "radar": { base: "skill-radar", elements: ["radar-chart", "data-points", "legend"], behavior: "chart-draw" },
  "tags": { base: "skill-tags", elements: ["tag-cloud", "size-variation", "color-coding"], behavior: "float-in" },
  "minimal": { base: "skill-list", elements: ["simple-list", "category-divider"], behavior: "fade-in" },
  "bubble": { base: "skill-bubbles", elements: ["circle-packing", "size-by-level", "hover-expand"], behavior: "bubble-float" },
  "timeline": { base: "skill-timeline", elements: ["chronological-skills", "growth-indicator"], behavior: "timeline-reveal" },
  "progress": { base: "skill-progress", elements: ["circular-progress", "skill-name", "level-text"], behavior: "progress-fill" },
  "grid": { base: "skill-grid", elements: ["grid-cells", "color-coded", "hover-info"], behavior: "grid-reveal" },
};

const TIMELINE_COMPOSITIONS: Record<string, { base: string; elements: string[]; behavior: string }> = {
  "vertical": { base: "vertical-timeline", elements: ["center-line", "timeline-cards", "date-markers", "connecting-dots"], behavior: "scroll-reveal" },
  "horizontal": { base: "horizontal-timeline", elements: ["scroll-track", "timeline-items", "scroll-controls"], behavior: "horizontal-scroll" },
  "alternating": { base: "alternating-timeline", elements: ["center-line", "left-cards", "right-cards", "date-badges"], behavior: "alternating-reveal" },
  "minimal": { base: "minimal-timeline", elements: ["simple-list", "date-separator"], behavior: "fade-in" },
  "card": { base: "card-timeline", elements: ["timeline-cards", "date-header", "content-body"], behavior: "card-flip" },
  "compact": { base: "compact-timeline", elements: ["dense-list", "inline-dates"], behavior: "slide-in" },
  "detailed": { base: "detailed-timeline", elements: ["rich-cards", "media-attachments", "metrics"], behavior: "expand-reveal" },
  "glass": { base: "glass-timeline", elements: ["frosted-cards", "gradient-line", "glow-dots"], behavior: "glass-fade" },
};

export function composeComponent(
  componentName: string,
  variant: string,
  blueprint: PortfolioBlueprint
): ComposedComponent {
  let composition: { base: string; elements: string[]; behavior: string };

  switch (componentName) {
    case "hero":
      composition = HERO_COMPOSITIONS[variant] ?? HERO_COMPOSITIONS["centered"];
      break;
    case "project":
      composition = PROJECT_COMPOSITIONS[variant] ?? PROJECT_COMPOSITIONS["card"];
      break;
    case "skill":
      composition = SKILL_COMPOSITIONS[variant] ?? SKILL_COMPOSITIONS["pills"];
      break;
    case "timeline":
      composition = TIMELINE_COMPOSITIONS[variant] ?? TIMELINE_COMPOSITIONS["vertical"];
      break;
    default:
      composition = { base: `${variant}-${componentName}`, elements: [`${componentName}-content`], behavior: "fade-in" };
  }

  const elements = [...composition.elements];
  if (blueprint.animations.intensity !== "none") {
    elements.push("animation-wrapper");
  }

  const responsive = blueprint.responsive.breakpoints.length > 3 ? "full-responsive" : "basic-responsive";

  return {
    name: componentName,
    base: composition.base,
    elements,
    behavior: composition.behavior,
    animation: blueprint.animations.library,
    responsive,
  };
}

export function composeAllComponents(blueprint: PortfolioBlueprint): Record<string, ComposedComponent> {
  return {
    hero: composeComponent("hero", blueprint.components.hero, blueprint),
    navbar: { name: "navbar", base: `${blueprint.components.navbar}-nav`, elements: ["nav-links", "logo", "mobile-toggle"], behavior: "scroll-aware", animation: blueprint.animations.library, responsive: "full-responsive" },
    project: composeComponent("project", blueprint.components.project, blueprint),
    skill: composeComponent("skill", blueprint.components.skill, blueprint),
    timeline: composeComponent("timeline", blueprint.components.timeline, blueprint),
    gallery: { name: "gallery", base: `${blueprint.components.gallery}-gallery`, elements: ["image-grid", "filter-bar", "lightbox"], behavior: "masonry-reveal", animation: blueprint.animations.library, responsive: "full-responsive" },
    footer: { name: "footer", base: `${blueprint.components.footer}-footer`, elements: ["footer-content", "links", "copyright"], behavior: "static", animation: "none", responsive: "full-responsive" },
    form: { name: "form", base: `${blueprint.components.form}-form`, elements: ["form-fields", "submit-button", "validation"], behavior: "interactive", animation: blueprint.animations.library, responsive: "full-responsive" },
    button: { name: "button", base: `${blueprint.components.button}-button`, elements: ["button-content", "hover-effect"], behavior: "hover-interactive", animation: blueprint.animations.library, responsive: "none" },
    card: { name: "card", base: `${blueprint.components.card}-card`, elements: ["card-content", "hover-state"], behavior: "hover-interactive", animation: blueprint.animations.library, responsive: "basic-responsive" },
  };
}
