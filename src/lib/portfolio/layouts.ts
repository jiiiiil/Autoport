import type { LayoutStyle, PortfolioSections } from "./types";

type SectionKey = keyof PortfolioSections;

const DEFAULT_ORDER: SectionKey[] = [
  "hero", "about", "skills", "projects", "experience",
  "education", "achievements", "certifications", "socialLinks", "contact",
];

const LAYOUT_CONFIGS: Record<LayoutStyle, { sectionOrder: SectionKey[]; gridColumns: number }> = {
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

export function getSectionOrder(style: LayoutStyle, customOrder?: string[]): SectionKey[] {
  if (customOrder && customOrder.length > 0) {
    return customOrder.filter((s): s is SectionKey => s in DEFAULT_ORDER) as SectionKey[];
  }
  return LAYOUT_CONFIGS[style]?.sectionOrder ?? DEFAULT_ORDER;
}

export function getGridColumns(style: LayoutStyle): number {
  return LAYOUT_CONFIGS[style]?.gridColumns ?? 1;
}

export function getVisibleSections(
  sections: PortfolioSections,
  style: LayoutStyle,
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
