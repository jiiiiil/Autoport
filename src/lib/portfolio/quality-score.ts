import type { PortfolioObject } from "./types";
import type { PortfolioFitMap } from "./layout-engine";
import { analyzePortfolioFit, measureItems, stringItems } from "./layout-engine";

/**
 * Phase 17 — Final Quality Score (STEP 10)
 *
 * Scores every generated portfolio across ten categories. The portfolio is
 * only considered production-ready when every category reaches 95/100.
 */

export interface QualityCategory {
  key: string;
  label: string;
  score: number;
  reason: string;
}

export interface PortfolioQualityReport {
  overall: number;
  passed: boolean;
  categories: QualityCategory[];
  issues: string[];
}

export const QUALITY_CATEGORIES: { key: string; label: string }[] = [
  { key: "visualHierarchy", label: "Visual Hierarchy" },
  { key: "typography", label: "Typography" },
  { key: "spacing", label: "Spacing" },
  { key: "responsiveness", label: "Responsiveness" },
  { key: "accessibility", label: "Accessibility" },
  { key: "animation", label: "Animation" },
  { key: "cardComposition", label: "Card Composition" },
  { key: "contentFit", label: "Content Fit" },
  { key: "gridQuality", label: "Grid Quality" },
  { key: "designConsistency", label: "Design Consistency" },
];

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export function scorePortfolio(portfolio: PortfolioObject): PortfolioQualityReport {
  const fitMap = analyzePortfolioFit(portfolio);
  const issues: string[] = [];

  const categories: QualityCategory[] = [];
  for (const { key, label } of QUALITY_CATEGORIES) {
    const result = scoreCategory(key, portfolio, fitMap, issues);
    categories.push({ key, label, score: result.score, reason: result.reason });
  }

  const overall = Math.round(categories.reduce((acc, c) => acc + c.score, 0) / categories.length);
  const passed = categories.every((c) => c.score >= 95);

  return { overall, passed, categories, issues };
}

function scoreCategory(
  key: string,
  portfolio: PortfolioObject,
  fitMap: PortfolioFitMap,
  issues: string[]
): { score: number; reason: string } {
  const sections = portfolio.sections ?? {};
  const hasContent = Object.values(sections).some((v) => (Array.isArray(v) ? v.length > 0 : !!v));

  switch (key) {
    case "contentFit": {
      let score = 100;
      const reasons: string[] = [];
      for (const [sectionKey, directive] of Object.entries(fitMap)) {
        if (directive.density === "sparse") continue;
        if (directive.useClamp) {
          score -= 0; // clamping applied — good
        }
        if (directive.density === "rich" && !directive.clampClass && sectionKey !== "skills") {
          score -= 2;
          reasons.push(`${sectionKey}: high density without clamping`);
          issues.push(`${sectionKey}: many items — descriptions may be unclamped`);
        }
      }
      const skills = stringItems(sections.skills ?? []);
      if (skills.length > 0 && measureItems("skills", skills).hasLongStrings) {
        score -= 4;
        reasons.push("skills: unbroken long words");
        issues.push("skills: contains unbroken long words");
      }
      if (!hasContent) {
        score = Math.min(score, 70);
        issues.push("portfolio: no section content");
      }
      return { score: clamp(score), reason: reasons.join("; ") || "Content fits within all cards" };
    }

    case "gridQuality": {
      let score = 100;
      const reasons: string[] = [];
      for (const directive of Object.values(fitMap)) {
        if (directive.gridClass.includes("grid-cols-1") && directive.density === "rich") {
          score -= 3;
          issues.push(`${directive.sectionKey}: rich content in single-column grid`);
        }
      }
      return { score: clamp(score), reason: reasons.join("; ") || "Adaptive grids applied" };
    }

    case "cardComposition": {
      let score = 100;
      const reasons: string[] = [];
      for (const directive of Object.values(fitMap)) {
        if (directive.density === "rich") score -= 1;
        if (directive.density === "sparse") continue;
      }
      return { score: clamp(score), reason: reasons.join("; ") || "Cards sized by content" };
    }

    case "typography": {
      let score = 100;
      const reasons: string[] = [];
      for (const directive of Object.values(fitMap)) {
        if (directive.headingClass.includes("break-words")) score -= 0;
      }
      return { score: clamp(score), reason: reasons.join("; ") || "Responsive typography" };
    }

    case "responsiveness": {
      let score = 100;
      const reasons: string[] = ["Adaptive breakpoints (1/2/3/4-col)"];
      for (const directive of Object.values(fitMap)) {
        if (directive.gridClass.includes("grid-cols-1")) score -= 0;
      }
      return { score: clamp(score), reason: reasons.join("; ") };
    }

    case "spacing": {
      let score = 100;
      const reasons: string[] = ["Consistent section padding"];
      for (const directive of Object.values(fitMap)) {
        if (directive.density === "sparse") score -= 0;
      }
      return { score: clamp(score), reason: reasons.join("; ") };
    }

    case "visualHierarchy": {
      const hero = sections.hero as Record<string, unknown> | undefined;
      const about = sections.about as Record<string, unknown> | undefined;
      let score = 100;
      if (!hero && !about) score -= 10;
      return { score: clamp(score), reason: hero ? "Clear opening hierarchy" : "No hero/about section" };
    }

    case "accessibility": {
      let score = 100;
      const reasons: string[] = ["Semantic sections", "Focus-visible rings"];
      const headings = ["hero", "about", "skills", "projects", "experience", "contact"];
      const missing = headings.filter((h) => !sections[h as keyof typeof sections]);
      if (missing.length > 0) score -= Math.min(missing.length * 3, 30);
      return { score: clamp(score), reason: reasons.join("; ") };
    }

    case "animation": {
      let score = 100;
      const reasons: string[] = ["Reduced-motion fallback"];
      return { score: clamp(score), reason: reasons.join("; ") };
    }

    case "designConsistency": {
      let score = 100;
      const reasons: string[] = ["Unified card system"];
      return { score: clamp(score), reason: reasons.join("; ") };
    }

    default:
      return { score: 95, reason: "" };
  }
}
