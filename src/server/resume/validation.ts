import type { ResumeJSON, AnimationLevel } from "./types";
import type { PortfolioObject } from "@/lib/portfolio/types";
import type { CompositionGraph } from "@/server/ai/composition/types";
import { checkFidelity } from "./fidelity";

export interface ValidationAxis {
  axis: string;
  score: number;
  passed: boolean;
  issues: string[];
}

export interface DesignValidationReport {
  overall: number;
  scores: ValidationAxis[];
  passed: boolean;
  improvements: string[];
}

const REQUIRED_SECTIONS = ["hero", "contact"];

export function validateDesign(
  resume: ResumeJSON,
  portfolio: PortfolioObject,
  composition: CompositionGraph,
  animationLevel: AnimationLevel
): DesignValidationReport {
  const axes: ValidationAxis[] = [];

  const fidelity = checkFidelity(resume, portfolio);
  axes.push({
    axis: "Resume Fidelity",
    score: fidelity.score,
    passed: fidelity.score >= 90,
    issues: fidelity.missing.slice(0, 5).map((m) => `Missing: ${m}`),
  });

  const theme = composition.theme;
  const themeIssues: string[] = [];
  const themeColors = ["primary", "secondary", "accent", "background", "surface", "text", "textMuted", "border"];
  for (const key of themeColors) {
    if (!theme.colors[key as keyof typeof theme.colors]) themeIssues.push(`Missing color token: ${key}`);
  }
  const themeScore = Math.max(0, 100 - themeIssues.length * 15);
  axes.push({
    axis: "Theme Consistency",
    score: themeScore,
    passed: themeScore >= 90,
    issues: themeIssues,
  });

  const motionIssues: string[] = [];
  const expectedIntensity: Record<AnimationLevel, string> = {
    minimal: "subtle", medium: "moderate", heavy: "heavy",
  };
  if (composition.motion.intensity !== expectedIntensity[animationLevel]) {
    motionIssues.push(`Motion intensity ${composition.motion.intensity} != selected ${expectedIntensity[animationLevel]}`);
  }
  if (animationLevel === "heavy" && !composition.motion.scroll.enabled && !composition.motion.gsap.parallax) {
    motionIssues.push("Heavy animation missing scroll effects");
  }
  const motionScore = Math.max(0, 100 - motionIssues.length * 20);
  axes.push({
    axis: "Animation Quality",
    score: motionScore,
    passed: motionScore >= 90,
    issues: motionIssues,
  });

  const layoutIssues: string[] = [];
  const present = new Set(composition.sections.map((s) => s.id));
  for (const section of REQUIRED_SECTIONS) {
    if (!present.has(section)) layoutIssues.push(`Missing required section: ${section}`);
  }
  const layoutScore = Math.max(0, 100 - layoutIssues.length * 20);
  axes.push({
    axis: "Layout Quality",
    score: layoutScore,
    passed: layoutScore >= 90,
    issues: layoutIssues,
  });

  const responsiveScore = composition.responsive.breakpoints.length >= 3 ? 100 : 80;
  axes.push({
    axis: "Responsiveness",
    score: responsiveScore,
    passed: responsiveScore >= 90,
    issues: responsiveScore < 90 ? ["Missing responsive breakpoints"] : [],
  });

  const a11y = composition.accessibility;
  const a11yIssues: string[] = [];
  if (!a11y.semanticHTML) a11yIssues.push("Semantic HTML disabled");
  if (!a11y.ariaLabels) a11yIssues.push("ARIA labels disabled");
  if (!a11y.keyboardNavigation) a11yIssues.push("Keyboard navigation disabled");
  const a11yScore = Math.max(0, 100 - a11yIssues.length * 25);
  axes.push({
    axis: "Accessibility",
    score: a11yScore,
    passed: a11yScore >= 90,
    issues: a11yIssues,
  });

  const perf = composition.blueprint.performance;
  const perfScore = perf.lazyLoading && perf.dynamicImports && perf.imageOptimization ? 100 : 85;
  axes.push({
    axis: "Performance",
    score: perfScore,
    passed: perfScore >= 90,
    issues: perfScore < 90 ? ["Performance optimizations incomplete"] : [],
  });

  const complianceIssues: string[] = [];
  if (resume.personal.name && !portfolio.personalInfo?.name) complianceIssues.push("Name not propagated");
  if (resume.experience.length > 0 && !(portfolio.sections?.experience?.length)) complianceIssues.push("Experience not propagated");
  if (resume.education.length > 0 && !(portfolio.sections?.education?.length)) complianceIssues.push("Education not propagated");
  if ((resume.skills.length > 0 || resume.technologies.length > 0) && !(portfolio.sections?.skills?.length)) complianceIssues.push("Skills not propagated");
  const complianceScore = Math.max(0, 100 - complianceIssues.length * 25);
  axes.push({
    axis: "Resume Compliance",
    score: complianceScore,
    passed: complianceScore >= 90,
    issues: complianceIssues,
  });

  const designScore = Math.round(axes.reduce((acc, a) => acc + a.score, 0) / axes.length);
  axes.push({
    axis: "Design Quality",
    score: designScore,
    passed: designScore >= 90,
    issues: [],
  });

  const overall = Math.round(axes.reduce((acc, a) => acc + a.score, 0) / axes.length);
  const improvements = axes.filter((a) => !a.passed).flatMap((a) => a.issues);

  return {
    overall,
    scores: axes,
    passed: axes.every((a) => a.passed),
    improvements,
  };
}

export function improveFidelity(resume: ResumeJSON, portfolio: PortfolioObject): { portfolio: PortfolioObject; improved: string[] } {
  const report = checkFidelity(resume, portfolio);
  if (report.score >= 90 || report.missing.length === 0) {
    return { portfolio, improved: [] };
  }

  const improved = [...report.missing];
  const missingText = report.missing.join(" · ");

  const sections = { ...(portfolio.sections ?? {}) };
  const about = sections.about ? { ...sections.about } : { title: "About Me", content: "" };
  const appended = `\n\nAdditional profile details: ${missingText}`;
  about.content = `${about.content ?? ""}${appended}`.trim();
  sections.about = about;

  return {
    portfolio: { ...portfolio, sections },
    improved,
  };
}
