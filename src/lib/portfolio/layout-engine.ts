import type { PortfolioObject } from "./types";

/**
 * Phase 17 — AI Layout Constraint & Pixel Perfect Composition Engine
 *
 * Before a section renders, its content is measured and translated into
 * adaptive layout directives: grid columns, card sizing, typography scale
 * and intelligent text clamping. This guarantees content always fits inside
 * its container — no overflow, no broken cards, no huge paragraphs.
 */

export type ContentDensity = "sparse" | "balanced" | "dense" | "rich";

export interface ContentProfile {
  sectionKey: string;
  itemCount: number;
  maxTitleChars: number;
  maxTitleWords: number;
  maxDescChars: number;
  maxDescWords: number;
  avgDescChars: number;
  totalDescChars: number;
  hasLongStrings: boolean;
  needsClamp: boolean;
  density: ContentDensity;
}

export interface SectionLayoutDirective {
  sectionKey: string;
  gridClass: string;
  clampClass: string | null;
  headingClass: string;
  cardClass: string;
  density: ContentDensity;
  useClamp: boolean;
}

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

const UNBROKEN_WORD_LIMIT = 36;
const CLAMP_WORD_LIMIT = 34;
const CLAMP_CHAR_LIMIT = 240;

function countWords(value: string): number {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function hasLongString(value: string): boolean {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return false;
  return trimmed.split(/\s+/).some((w) => w.length > UNBROKEN_WORD_LIMIT);
}

export interface MeasurableText {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

export function measureItems(sectionKey: string, items: MeasurableText[]): ContentProfile {
  let maxTitleChars = 0;
  let maxTitleWords = 0;
  let maxDescChars = 0;
  let maxDescWords = 0;
  let totalDescChars = 0;
  let hasLongStrings = false;

  for (const item of items) {
    const title = typeof item.title === "string" ? item.title : "";
    const desc = typeof item.description === "string" ? item.description : "";

    if (title.length > maxTitleChars) maxTitleChars = title.length;
    if (countWords(title) > maxTitleWords) maxTitleWords = countWords(title);
    if (desc.length > maxDescChars) maxDescChars = desc.length;
    if (countWords(desc) > maxDescWords) maxDescWords = countWords(desc);
    totalDescChars += desc.length;
    if (hasLongString(title) || hasLongString(desc)) hasLongStrings = true;
  }

  const avgDescChars = items.length > 0 ? Math.round(totalDescChars / items.length) : 0;
  const needsClamp = maxDescWords > CLAMP_WORD_LIMIT || maxDescChars > CLAMP_CHAR_LIMIT;

  const density: ContentDensity =
    items.length === 0 ? "sparse" : items.length >= 12 ? "rich" : items.length >= 6 ? "dense" : items.length >= 3 ? "balanced" : "sparse";

  return {
    sectionKey,
    itemCount: items.length,
    maxTitleChars,
    maxTitleWords,
    maxDescChars,
    maxDescWords,
    avgDescChars,
    totalDescChars,
    hasLongStrings,
    needsClamp,
    density,
  };
}

export function stringItems(items: unknown[]): MeasurableText[] {
  return items.map((item) => {
    if (typeof item === "string") return { title: item };
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      const title =
        typeof obj.title === "string"
          ? obj.title
          : typeof obj.name === "string"
            ? (obj.name as string)
            : typeof obj.label === "string"
              ? (obj.label as string)
              : "";
      const description =
        typeof obj.description === "string"
          ? (obj.description as string)
          : typeof obj.summary === "string"
            ? (obj.summary as string)
            : typeof obj.excerpt === "string"
              ? (obj.excerpt as string)
              : typeof obj.content === "string"
                ? (obj.content as string)
                : "";
      return { title, description };
    }
    return {};
  });
}

// ---------------------------------------------------------------------------
// Grid engine (STEP 5)
// Desktop 4/3 cols → tablet 2 → mobile 1. Cards resize automatically.
// ---------------------------------------------------------------------------

const GRID_DEFAULTS = {
  base: "grid grid-cols-1 gap-4 md:gap-5",
  two: "sm:grid-cols-2",
  three: "md:grid-cols-2 lg:grid-cols-3",
  four: "md:grid-cols-2 lg:grid-cols-4",
};

export function getAdaptiveGridClass(sectionKey: string, profile: ContentProfile): string {
  const count = profile.itemCount;
  const descHeavy = profile.avgDescChars > 200;

  switch (sectionKey) {
    case "skills":
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
    case "metrics":
      return "grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6";
    case "clients":
      return count >= 8
        ? `${GRID_DEFAULTS.base} sm:grid-cols-2 lg:grid-cols-4`
        : `${GRID_DEFAULTS.base} sm:grid-cols-2 lg:grid-cols-3`;
    case "projects":
    case "products":
    case "services":
    case "testimonials":
    case "articles":
      if (count >= 9) return `${GRID_DEFAULTS.base} ${GRID_DEFAULTS.four}`;
      if (count >= 5) return descHeavy ? `${GRID_DEFAULTS.base} ${GRID_DEFAULTS.two}` : `${GRID_DEFAULTS.base} ${GRID_DEFAULTS.three}`;
      return `${GRID_DEFAULTS.base} ${GRID_DEFAULTS.two}`;
    case "education":
    case "achievements":
    case "organizations":
    case "awards":
    case "publications":
    case "certifications":
      return `${GRID_DEFAULTS.base} ${GRID_DEFAULTS.two}`;
    case "experience":
    case "speaking":
    case "roadmap":
    case "faq":
    case "timeline":
      // Narrative/list sections stay single-column full-width for readability.
      return "space-y-6 md:space-y-8";
    default:
      return count >= 9 ? `${GRID_DEFAULTS.base} ${GRID_DEFAULTS.four}` : `${GRID_DEFAULTS.base} ${GRID_DEFAULTS.three}`;
  }
}

// ---------------------------------------------------------------------------
// Content clamping (STEP 8)
// Intelligent limits — only clamp when the content is actually long.
// ---------------------------------------------------------------------------

const CLAMP_LIMITS: Record<string, number> = {
  projects: 6,
  products: 5,
  services: 4,
  testimonials: 6,
  publications: 4,
  articles: 4,
  achievements: 4,
  awards: 3,
  organizations: 3,
  speaking: 3,
  roadmap: 3,
  experience: 4,
  timeline: 4,
  about: 8,
};

export function getClampClass(sectionKey: string, profile: ContentProfile): string | null {
  const limit = CLAMP_LIMITS[sectionKey];
  if (!limit) return null;
  if (!profile.needsClamp) return null;
  return `line-clamp-${limit}`;
}

// ---------------------------------------------------------------------------
// Card sizing & typography adaptation (STEPS 3 & 4)
// Never force every card to the same height — compact content gets compact cards.
// ---------------------------------------------------------------------------

export function getCardClass(sectionKey: string, profile: ContentProfile, baseCardClass: string): string {
  const descHeavy = profile.avgDescChars > 200;
  const density = profile.density;

  if (descHeavy || density === "rich") {
    return `${baseCardClass} p-6`;
  }
  if (density === "sparse") {
    return `${baseCardClass} p-5`;
  }
  return `${baseCardClass} p-5`;
}

export function getHeadingClass(sectionKey: string, profile: ContentProfile): string {
  if (profile.maxTitleChars > 48 || profile.maxTitleWords > 8) {
    return "text-base md:text-lg font-semibold break-words";
  }
  return "text-base md:text-lg font-semibold break-words";
}

// ---------------------------------------------------------------------------
// Full portfolio analysis
// ---------------------------------------------------------------------------

export type PortfolioFitMap = Record<string, SectionLayoutDirective>;

function sectionItems(portfolio: PortfolioObject, key: string): MeasurableText[] {
  const sections = portfolio.sections ?? {};
  const raw = sections[key as keyof typeof sections];
  if (Array.isArray(raw)) return stringItems(raw);
  if (raw && typeof raw === "object") {
    return stringItems([raw]);
  }
  return [];
}

const GRID_SECTIONS = [
  "skills", "projects", "products", "services", "testimonials", "articles",
  "achievements", "organizations", "awards", "publications", "clients", "metrics",
];

const LIST_SECTIONS = [
  "experience", "education", "speaking", "roadmap", "faq", "timeline",
];

export function analyzePortfolioFit(portfolio: PortfolioObject): PortfolioFitMap {
  const fitMap: PortfolioFitMap = {};
  const allKeys = [...GRID_SECTIONS, ...LIST_SECTIONS, "about", "gallery", "hero", "contact", "socialLinks", "languages"];

  for (const key of allKeys) {
    const items = sectionItems(portfolio, key);
    const profile = measureItems(key, items);
    const gridClass = getAdaptiveGridClass(key, profile);
    const clampClass = getClampClass(key, profile);
    const headingClass = getHeadingClass(key, profile);
    const cardClass = getCardClass(key, profile, "rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)]");

    fitMap[key] = {
      sectionKey: key,
      gridClass,
      clampClass,
      headingClass,
      cardClass,
      density: profile.density,
      useClamp: clampClass !== null,
    };
  }

  return fitMap;
}

export function getGridClass(fitMap: PortfolioFitMap | undefined, key: string, fallback: string): string {
  return fitMap?.[key]?.gridClass ?? fallback;
}

export function getClamp(fitMap: PortfolioFitMap | undefined, key: string): string | null {
  return fitMap?.[key]?.clampClass ?? null;
}
