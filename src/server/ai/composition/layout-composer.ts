import type { AIContextObject, DesignLanguage } from "../intelligence/types";
import type { PromptConstraints, ComposedLayout, LayoutStyle } from "./types";
import { getPreferredLayout, isSectionForbidden } from "./constraint-resolver";

const DENSITY_THRESHOLDS = {
  low: 3,
  medium: 6,
  high: 10,
};

function calculateInformationDensity(context: AIContextObject): number {
  let density = 0;
  density += context.sections.length;
  density += context.customSections?.length || 0;
  if (context.rawExtraction.technologies.length > 5) density += 2;
  if (context.rawExtraction.keywords.length > 10) density += 2;
  return density;
}

function inferLayoutFromContext(
  context: AIContextObject,
  constraints: PromptConstraints,
  promptHash: string
): LayoutStyle {
  const preferred = getPreferredLayout(constraints);
  if (preferred && isValidLayout(preferred)) {
    return preferred as LayoutStyle;
  }

  const density = calculateInformationDensity(context);
  const designLang = context.designLanguage[0]?.name;
  const sectionCount = context.sections.filter(s => s.type !== "forbidden").length;
  const hasRestrictions = context.restrictions.length > 0;
  const hashNum = parseInt(promptHash, 36) % 100;

  if (designLang) {
    const layoutMap: Partial<Record<DesignLanguage, LayoutStyle>> = {
      magazine: "magazine",
      editorial: "editorial",
      gallery: "gallery",
      minimal: "minimal",
      creative: "creative",
      brutalist: "asymmetric",
      retro: "newspaper",
      dashboard: "bento",
      corporate: "split",
      playful: "card-stack",
      "dark-academic": "immersive",
      luxury: "cinematic",
      cyberpunk: "immersive",
    };
    if (layoutMap[designLang]) return layoutMap[designLang];
  }

  if (context.profession === "photographer" || context.profession === "graphic-designer") {
    return hashNum % 2 === 0 ? "gallery" : "masonry";
  }
  if (context.profession === "writer" || context.profession === "musician") {
    return hashNum % 2 === 0 ? "editorial" : "storytelling";
  }
  if (context.profession === "researcher" || context.profession === "teacher") {
    return hashNum % 2 === 0 ? "editorial" : "newspaper";
  }
  if (context.profession === "agency" || context.profession === "startup") {
    return hashNum % 3 === 0 ? "bento" : hashNum % 3 === 1 ? "landing-sections" : "creative";
  }

  if (density <= DENSITY_THRESHOLDS.low) {
    return hashNum % 3 === 0 ? "minimal" : hashNum % 3 === 1 ? "split" : "landing-sections";
  }
  if (density <= DENSITY_THRESHOLDS.medium) {
    return hashNum % 4 === 0 ? "portfolio-landing" : hashNum % 4 === 1 ? "split" : hashNum % 4 === 2 ? "bento" : "grid";
  }

  if (hasRestrictions) {
    return hashNum % 2 === 0 ? "asymmetric" : "editorial";
  }

  const layouts: LayoutStyle[] = [
    "portfolio-landing", "split", "magazine", "editorial",
    "creative", "grid", "bento", "storytelling",
    "landing-sections", "asymmetric", "cinematic", "masonry",
  ];
  return layouts[hashNum % layouts.length];
}

function isValidLayout(layout: string): boolean {
  const valid: string[] = [
    "portfolio-landing", "split", "magazine", "editorial",
    "creative", "gallery", "timeline", "storytelling",
    "grid", "bento", "dashboard", "landing-sections",
    "minimal", "horizontal-scroll", "asymmetric", "cinematic",
    "newspaper", "card-stack", "immersive",
    "masonry", "custom",
  ];
  return valid.includes(layout);
}

function getGridStrategy(layout: LayoutStyle): string {
  const strategies: Record<LayoutStyle, string> = {
    "portfolio-landing": "12-col",
    "split": "2-col-asymmetric",
    "magazine": "editorial-grid",
    "editorial": "12-col",
    "creative": "freeform",
    "gallery": "masonry-grid",
    "timeline": "1-col-centered",
    "storytelling": "12-col",
    "grid": "12-col",
    "bento": "bento-grid",
    "dashboard": "auto-grid",
    "landing-sections": "12-col",
    "minimal": "8-col-centered",
    "horizontal-scroll": "horizontal-flow",
    "asymmetric": "asymmetric-grid",
    "cinematic": "12-col-full-bleed",
    "newspaper": "newspaper-grid",
    "card-stack": "card-grid",
    "immersive": "full-bleed",
    "masonry": "masonry-grid",
    "custom": "12-col",
  };
  return strategies[layout] || "12-col";
}

function getContainerWidth(layout: LayoutStyle): string {
  const widths: Record<LayoutStyle, string> = {
    "portfolio-landing": "1200px",
    "split": "1100px",
    "magazine": "1400px",
    "editorial": "1200px",
    "creative": "1300px",
    "gallery": "1600px",
    "timeline": "900px",
    "storytelling": "1200px",
    "grid": "1200px",
    "bento": "1200px",
    "dashboard": "1400px",
    "landing-sections": "100%",
    "minimal": "800px",
    "horizontal-scroll": "100vw",
    "asymmetric": "1300px",
    "cinematic": "100vw",
    "newspaper": "1400px",
    "card-stack": "1200px",
    "immersive": "100vw",
    "masonry": "1400px",
    "custom": "1200px",
  };
  return widths[layout] || "1200px";
}

function getSectionSpacing(layout: LayoutStyle, sectionCount: number): string {
  const baseSpacing = sectionCount > 8 ? "4rem" : sectionCount > 5 ? "6rem" : "8rem";
  const layoutMultipliers: Record<string, number> = {
    magazine: 0.7,
    editorial: 0.8,
    minimal: 1.2,
    gallery: 0.6,
    bento: 0.5,
    storytelling: 1.0,
    cinematic: 0.8,
  };
  const multiplier = layoutMultipliers[layout] || 1.0;
  const remValue = parseFloat(baseSpacing) * multiplier;
  return `${remValue}rem`;
}

function getBackgroundStrategy(layout: LayoutStyle, context: AIContextObject): string {
  const theme = context.theme;
  const designLang = context.designLanguage[0]?.name;

  if (designLang === "glassmorphism") return "glass-layers";
  if (designLang === "brutalist") return "raw-contrast";
  if (designLang === "luxury") return "gradient-luxury";

  switch (layout) {
    case "cinematic":
    case "immersive":
      return "full-bleed-media";
    case "magazine":
    case "editorial":
      return "editorial-sections";
    case "bento":
    case "card-stack":
      return "card-surfaces";
    case "minimal":
      return "clean-surface";
    default:
      return theme === "dark" ? "dark-surface" : "light-surface";
  }
}

export function composeLayout(
  context: AIContextObject,
  constraints: PromptConstraints,
  promptHash: string,
  sectionOrder: string[]
): ComposedLayout {
  const layoutStyle = inferLayoutFromContext(context, constraints, promptHash);
  const validSectionOrder = sectionOrder.filter(
    s => !isSectionForbidden(s, constraints)
  );

  return {
    style: layoutStyle,
    sectionOrder: validSectionOrder,
    gridStrategy: getGridStrategy(layoutStyle),
    containerWidth: getContainerWidth(layoutStyle),
    verticalRhythm: "1.6",
    sectionSpacing: getSectionSpacing(layoutStyle, validSectionOrder.length),
    padding: {
      desktop: "6rem 2rem",
      tablet: "4rem 1.5rem",
      mobile: "3rem 1rem",
    },
    maxWidth: getContainerWidth(layoutStyle),
    backgroundStrategy: getBackgroundStrategy(layoutStyle, context),
    visualHierarchy: validSectionOrder.slice(0, 5),
  };
}
