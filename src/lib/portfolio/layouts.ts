import type { LayoutStyle as LegacyLayoutStyle, PortfolioSections } from "./types";
import type { ComposedLayout } from "@/server/ai/composition/types";

type SectionKey = keyof PortfolioSections;

const DEFAULT_ORDER: SectionKey[] = [
  "hero", "about", "skills", "projects", "experience",
  "education", "achievements", "certifications", "socialLinks", "contact",
];

const LAYOUT_CONFIGS: Record<LegacyLayoutStyle, { sectionOrder: SectionKey[]; gridColumns: number }> = {
  minimal: {
    sectionOrder: ["hero", "about", "skills", "projects", "experience", "contact"],
    gridColumns: 1,
  },
  creative: {
    sectionOrder: ["hero", "projects", "skills", "about", "experience", "achievements", "contact"],
    gridColumns: 2,
  },
  developer: {
    sectionOrder: ["hero", "skills", "projects", "experience", "education", "contact"],
    gridColumns: 1,
  },
  agency: {
    sectionOrder: ["hero", "about", "projects", "experience", "certifications", "contact"],
    gridColumns: 2,
  },
  startup: {
    sectionOrder: ["hero", "about", "skills", "projects", "experience", "achievements", "contact"],
    gridColumns: 1,
  },
};

export function getSectionOrder(style: LegacyLayoutStyle, customOrder?: string[]): SectionKey[] {
  if (customOrder && customOrder.length > 0) {
    return customOrder.filter((s): s is SectionKey => s in DEFAULT_ORDER) as SectionKey[];
  }
  return LAYOUT_CONFIGS[style]?.sectionOrder ?? DEFAULT_ORDER;
}

export function getGridColumns(style: LegacyLayoutStyle): number {
  return LAYOUT_CONFIGS[style]?.gridColumns ?? 1;
}

export function getVisibleSections(
  sections: PortfolioSections,
  style: LegacyLayoutStyle,
  customOrder?: string[]
): SectionKey[] {
  const order = getSectionOrder(style, customOrder);
  return order.filter((key) => {
    const val = sections[key];
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "object" && val !== null) return Object.keys(val).length > 0;
    return !!val;
  });
}

export function getLayoutStyles(layout: ComposedLayout): React.CSSProperties {
  const styles: React.CSSProperties = {};

  styles.padding = layout.padding.desktop;

  return styles;
}

const FULL_BLEED_LAYOUTS = new Set(["cinematic", "immersive", "landing-sections"]);

export function getLayoutContainerClass(layout: ComposedLayout): string {
  if (FULL_BLEED_LAYOUTS.has(layout.style)) {
    return "w-full";
  }
  return "w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8";
}

export function getSectionSpacing(layout: ComposedLayout): string {
  return layout.sectionSpacing;
}

export function getGridStrategyClass(layout: ComposedLayout): string {
  const strategy = layout.gridStrategy;

  if (strategy.includes("bento")) {
    return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
  }
  if (strategy.includes("masonry")) {
    return "columns-1 md:columns-2 lg:columns-3 gap-4";
  }
  if (strategy.includes("2-col")) {
    return "grid grid-cols-1 md:grid-cols-2 gap-6";
  }
  if (strategy.includes("3-col")) {
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
  }
  if (strategy.includes("12-col")) {
    return "grid grid-cols-12 gap-4";
  }
  if (strategy.includes("8-col")) {
    return "grid grid-cols-8 gap-4";
  }
  if (strategy.includes("full-bleed")) {
    return "w-full";
  }
  if (strategy.includes("editorial")) {
    return "grid grid-cols-12 gap-6";
  }

  return "flex flex-col gap-0";
}
