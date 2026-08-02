import type { CompositionGraph, ComposedSection } from "../composition/types";
import type { PortfolioData } from "@/server/types";
import { applyExplicitColorOverrides } from "../composition/theme-composer";

export type ReviewAxis =
  | "design"
  | "animation"
  | "accessibility"
  | "responsiveness"
  | "visualHierarchy"
  | "promptCompliance";

export interface AxisScore {
  axis: ReviewAxis;
  label: string;
  score: number;
  passed: boolean;
  issues: string[];
}

export interface DesignReviewReport {
  scores: AxisScore[];
  overall: number;
  passed: boolean;
  improvements: string[];
  reviewedAt: string;
}

export interface ReviewResult {
  composition: CompositionGraph;
  portfolioData: PortfolioData;
  report: DesignReviewReport;
  improved: boolean;
}

const AXIS_LABELS: Record<ReviewAxis, string> = {
  design: "Design Score",
  animation: "Animation Score",
  accessibility: "Accessibility Score",
  responsiveness: "Responsiveness Score",
  visualHierarchy: "Visual Hierarchy Score",
  promptCompliance: "Prompt Compliance Score",
};

function hasValue(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "object") return Object.keys(v as object).length > 0;
  return true;
}

function countTruthy<T>(obj: Record<string, T> | undefined, keys: string[]): number {
  if (!obj) return 0;
  return keys.filter((k) => Boolean((obj as Record<string, unknown>)[k])).length;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function scoreDesign(composition: CompositionGraph): AxisScore {
  const issues: string[] = [];
  let score = 60;
  const { theme } = composition;

  if (theme.gradients && hasValue(theme.gradients.primary)) {
    score += 6;
  } else {
    issues.push("Gradient system missing");
  }
  if (theme.backgroundStyle && theme.backgroundStyle !== "flat") {
    score += 5;
  } else {
    issues.push("Background style is flat or missing");
  }
  if (theme.typography.headingFont && theme.typography.bodyFont) {
    score += 5;
    if (theme.typography.headingFont !== theme.typography.bodyFont) {
      score += 5;
    } else {
      issues.push("Heading and body fonts are identical");
    }
  } else {
    issues.push("Typography not defined");
  }
  if (Object.keys(theme.radius).length >= 4) score += 4;
  else issues.push("Radius scale is too small");
  if (Object.keys(theme.spacing).length >= 8) score += 4;
  else issues.push("Spacing scale is too small");
  if (Object.keys(theme.shadows).length >= 3) score += 4;
  if (Object.keys(theme.colors).length >= 10) score += 5;
  if (composition.story.flow && composition.story.flow !== "linear") {
    score += 2;
  }

  return {
    axis: "design",
    label: AXIS_LABELS.design,
    score: clampScore(score),
    passed: score >= 90,
    issues,
  };
}

function scoreAnimation(composition: CompositionGraph, prompt: string): AxisScore {
  const issues: string[] = [];
  const lower = prompt.toLowerCase();
  const wantsGsap = /gsap|scrolltrigger|scroll trigger|smooth scroll|splittext|stagger|parallax|magnetic|cursor effect/i.test(lower);
  const wantsNone = /no animation|no animations|static|without animation/i.test(lower);
  const { motion } = composition;

  if (wantsNone && motion.intensity === "none") {
    return {
      axis: "animation",
      label: AXIS_LABELS.animation,
      score: 100,
      passed: true,
      issues: [],
    };
  }

  let score = 40;
  if (wantsGsap && motion.library === "gsap") {
    score += 25;
  } else if (wantsGsap) {
    issues.push(`User requested GSAP-style motion but library is "${motion.library}"`);
  } else if (motion.library === "gsap") {
    score += 15;
  }

  const gsapCount = motion.gsap ? Object.values(motion.gsap).filter(Boolean).length : 0;
  score += Math.min(20, gsapCount * 4);
  if (motion.gsap?.textReveal || motion.gsap?.fadeReveal) score += 5;
  if (motion.gsap?.parallax || motion.gsap?.sectionPinning) score += 5;

  if (motion.microInteractions.length >= 2) score += 10;
  else issues.push("Too few micro-interactions");

  if (motion.scroll.enabled) score += 5;
  else issues.push("Scroll-triggered motion is disabled");

  if (motion.intensity === "none" && !wantsNone) {
    score = Math.min(score, 40);
    issues.push("Motion disabled despite prompt not requesting it");
  }

  return {
    axis: "animation",
    label: AXIS_LABELS.animation,
    score: clampScore(score),
    passed: score >= 90,
    issues,
  };
}

function scoreAccessibility(composition: CompositionGraph): AxisScore {
  const issues: string[] = [];
  const flags = composition.accessibility;
  const keys = [
    "semanticHTML", "ariaLabels", "keyboardNavigation", "focusManagement",
    "reducedMotion", "screenReader", "skipLinks", "headingHierarchy",
    "altTextRequired", "landmarkRegions",
  ];
  const present = countTruthy(flags as unknown as Record<string, boolean>, keys);
  const score = (present / keys.length) * 100;
  if (present < keys.length) {
    issues.push(`${keys.length - present} accessibility flags are disabled`);
  }
  return {
    axis: "accessibility",
    label: AXIS_LABELS.accessibility,
    score: clampScore(score),
    passed: score >= 90,
    issues,
  };
}

function scoreResponsiveness(composition: CompositionGraph): AxisScore {
  const issues: string[] = [];
  const { responsive } = composition;
  let score = 50;

  if (responsive.strategy) score += 10;
  if (responsive.mobileFirst) score += 12;
  else issues.push("Not mobile-first");
  if (responsive.fluidTypography) score += 12;
  if (responsive.breakpoints.length >= 3) score += 16;
  else issues.push(`Only ${responsive.breakpoints.length} breakpoints`);
  if (hasValue(responsive.containerMaxWidth)) score += 6;
  if (Object.keys(responsive.adaptiveLayouts).length > 0) score += 6;
  else issues.push("No adaptive layout rules");

  return {
    axis: "responsiveness",
    label: AXIS_LABELS.responsiveness,
    score: clampScore(score),
    passed: score >= 90,
    issues,
  };
}

function scoreVisualHierarchy(composition: CompositionGraph): AxisScore {
  const issues: string[] = [];
  const { sections, layout, story } = composition;
  let score = 50;

  const primaries = sections.filter((s) => s.visualWeight === "primary");
  if (primaries.length >= 1) score += 20;
  else issues.push("No primary visual weight sections");
  if (primaries.length <= 3) score += 10;
  else issues.push(`${primaries.length} primary sections reduce clarity`);
  if (layout.visualHierarchy && layout.visualHierarchy.length > 0) score += 20;
  else issues.push("No explicit visual hierarchy");
  if (new Set(sections.map((s) => s.visualWeight)).size >= 3) score += 15;
  if (sections[sections.length - 1]?.id === "contact") score += 10;
  else issues.push("Contact section is not last");
  if (story.narrativeArc && story.narrativeArc.length > 0) score += 5;

  return {
    axis: "visualHierarchy",
    label: AXIS_LABELS.visualHierarchy,
    score: clampScore(score),
    passed: score >= 90,
    issues,
  };
}

function scorePromptCompliance(composition: CompositionGraph, prompt: string): AxisScore {
  const issues: string[] = [];
  const lower = prompt.toLowerCase();
  let score = 60;

  // Explicit color compliance
  const explicitColors = extractExplicitColors(lower);
  if (explicitColors.length > 0) {
    const themeColors = Object.values(composition.theme.colors).map((c) => String(c).toLowerCase());
    let matched = 0;
    for (const c of explicitColors) {
      if (themeColors.some((t) => t === c || t.includes(c))) matched += 1;
      else issues.push(`Explicit color "${c}" not present in theme`);
    }
    score += Math.min(20, (matched / explicitColors.length) * 20);
  } else {
    score += 15;
  }

  // Layout compliance
  const wantsHorizontal = /horizontal scroll|horizontal-scroll|side scroll|side-scroll/i.test(lower);
  if (wantsHorizontal) {
    if (composition.layout.style === "horizontal-scroll") score += 10;
    else issues.push("User requested horizontal scroll layout");
  } else {
    score += 10;
  }

  // "No hero" / forbidden sections
  const forbiddenRequested = /no hero|without hero|skip hero|no footer|no about|no skills|no experience/i.test(lower);
  const heroAbsent = !composition.sections.some((s) => s.id === "hero");
  if (/no hero|without hero|skip hero/i.test(lower)) {
    if (heroAbsent) score += 10;
    else issues.push("Hero present but user requested none");
  } else if (heroAbsent) {
    issues.push("No hero section for a portfolio landing");
    score -= 5;
  }
  if (forbiddenRequested && heroAbsent) score += 5;

  // Section coverage
  const requiredWords = ["projects", "experience", "education", "skills", "contact", "testimonials", "gallery", "services", "faq"];
  const presentIds = new Set(composition.sections.map((s) => s.id));
  const mentioned = requiredWords.filter((w) => new RegExp(`\\b${w}\\b`).test(lower));
  const matchedSections = mentioned.filter((w) => presentIds.has(w)).length;
  if (mentioned.length > 0) {
    score += Math.min(10, (matchedSections / mentioned.length) * 10);
    if (matchedSections < mentioned.length) {
      issues.push(`Prompt mentions sections not in composition: ${mentioned.filter((w) => !presentIds.has(w)).join(", ")}`);
    }
  } else {
    score += 5;
  }

  return {
    axis: "promptCompliance",
    label: AXIS_LABELS.promptCompliance,
    score: clampScore(score),
    passed: score >= 90,
    issues,
  };
}

function extractExplicitColors(lower: string): string[] {
  const colors: string[] = [];
  const hexMatches = lower.match(/#[0-9a-f]{3,6}\b/g) ?? [];
  colors.push(...hexMatches);
  const named = [
    "dark blue", "navy", "royal blue", "deep blue", "ocean blue", "ocean",
    "green", "emerald", "forest green", "lime", "mint", "red", "crimson",
    "ruby", "maroon", "purple", "violet", "lavender", "plum", "pink", "rose",
    "magenta", "coral", "orange", "amber", "yellow", "gold", "teal", "cyan",
    "turquoise", "gray", "grey", "slate", "black", "white", "ivory", "brown",
  ];
  for (const name of named) {
    if (lower.includes(name)) colors.push(name);
  }
  return [...new Set(colors)];
}

// ---------------------------------------------------------------------------
// Auto-improve
// ---------------------------------------------------------------------------

function improveDesign(composition: CompositionGraph, prompt: string): string[] {
  const improvements: string[] = [];
  const lower = prompt.toLowerCase();
  const { theme } = composition;

  if (!theme.gradients || !theme.gradients.primary) {
    const colors = theme.colors;
    theme.gradients = {
      primary: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
      secondary: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
      hero: `linear-gradient(180deg, ${colors.background}, ${colors.surface})`,
      card: `linear-gradient(135deg, ${colors.surface}, ${colors.surfaceElevated})`,
      text: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
    };
    improvements.push("Generated missing gradient system");
  }

  if (!theme.backgroundStyle) {
    theme.backgroundStyle = lower.includes("cyberpunk") || lower.includes("neon")
      ? "grid"
      : lower.includes("luxury") || lower.includes("premium")
        ? "mesh-gradient"
        : lower.includes("minimal") || lower.includes("clean")
          ? "flat"
          : "mesh-gradient";
    improvements.push("Assigned background style from prompt");
  }

  if (theme.typography.headingFont === theme.typography.bodyFont) {
    const editorial = lower.includes("editorial") || lower.includes("magazine") || lower.includes("writer") || lower.includes("luxury") || lower.includes("premium");
    if (editorial) {
      theme.typography.bodyFont = "'Source Serif 4', Georgia, serif";
      improvements.push("Paired serif body font with heading font for editorial feel");
    }
  }

  if (Object.keys(theme.radius).length < 4) {
    theme.radius = {
      none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem", xl: "1rem", "2xl": "1.5rem", full: "9999px",
    };
    improvements.push("Expanded radius scale");
  }

  return improvements;
}

function improveAnimation(composition: CompositionGraph, prompt: string): string[] {
  const improvements: string[] = [];
  const lower = prompt.toLowerCase();
  const wantsGsap = /gsap|scrolltrigger|scroll trigger|smooth scroll|splittext|parallax|magnetic|cursor effect/i.test(lower);
  const wantsNone = /no animation|no animations|static|without animation/i.test(lower);
  const { motion } = composition;

  if (wantsNone && motion.intensity !== "none") {
    motion.style = "none";
    motion.intensity = "none";
    motion.library = "none";
    motion.gsap = {
      textReveal: false, fadeReveal: false, imageReveal: false, sectionPinning: false,
      parallax: false, floatingElements: false, magneticButtons: false,
      cursorInteraction: false, cardHoverMotion: false, smoothScroll: false,
    };
    motion.scroll.enabled = false;
    improvements.push("Disabled motion to match prompt");
    return improvements;
  }

  if (wantsGsap && motion.library !== "gsap") {
    motion.library = "gsap";
    if (motion.style === "none" || motion.style === "minimal") {
      motion.style = "gsap-heavy";
      motion.intensity = "heavy";
    }
    improvements.push("Switched motion engine to GSAP");
  }

  if (motion.library === "gsap") {
    const heavy = /parallax|cinematic|dramatic|storytelling|scroll/i.test(lower);
    const wantsText = /text reveal|typewriter|split/i.test(lower);
    const wantsMagnetic = /magnetic|cursor/i.test(lower);
    motion.gsap = {
      textReveal: wantsText || heavy,
      fadeReveal: true,
      imageReveal: heavy,
      sectionPinning: heavy,
      parallax: heavy || /parallax/i.test(lower),
      floatingElements: heavy,
      magneticButtons: wantsMagnetic || heavy,
      cursorInteraction: wantsMagnetic,
      cardHoverMotion: true,
      smoothScroll: true,
    };
    if (motion.microInteractions.length < 2) {
      motion.microInteractions = ["button-magnetic", "cursor-follow", "text-split", "image-reveal"];
    }
    motion.scroll.enabled = true;
    motion.scroll.type = "scroll-trigger";
    improvements.push("Enabled real GSAP ScrollTrigger animations matching prompt");
  }

  if (motion.intensity === "none" && !wantsNone) {
    motion.intensity = "subtle";
    motion.scroll.enabled = true;
    improvements.push("Enabled minimal motion");
  }

  return improvements;
}

function improveAccessibility(composition: CompositionGraph): string[] {
  const improvements: string[] = [];
  const flags = composition.accessibility;
  const flagRecord = flags as unknown as Record<string, boolean>;
  const keys = [
    "semanticHTML", "ariaLabels", "keyboardNavigation", "focusManagement",
    "screenReader", "skipLinks", "headingHierarchy", "altTextRequired", "landmarkRegions",
  ];
  for (const key of keys) {
    if (!flagRecord[key]) {
      flagRecord[key] = true;
      improvements.push(`Enabled ${key}`);
    }
  }
  flags.reducedMotion = composition.motion.intensity !== "none";
  flags.colorContrast = "AA";
  return improvements;
}

function improveResponsiveness(composition: CompositionGraph): string[] {
  const improvements: string[] = [];
  const { responsive } = composition;
  responsive.mobileFirst = true;
  responsive.fluidTypography = true;
  if (!responsive.containerMaxWidth) responsive.containerMaxWidth = "72rem";

  const names = responsive.breakpoints.map((b) => b.name);
  if (!names.includes("mobile")) {
    responsive.breakpoints.push({
      name: "mobile", minWidth: "0px", maxWidth: "639px", columns: 4, gutter: "1rem",
      sectionPadding: "3rem 1rem",
      fontSize: { heading: "1.875rem", subheading: "1.25rem", body: "1rem", small: "0.875rem" },
      layout: "stacked", navigation: "bottom", gridColumns: 4,
    });
    improvements.push("Added mobile breakpoint");
  }
  if (!names.includes("tablet")) {
    responsive.breakpoints.push({
      name: "tablet", minWidth: "640px", maxWidth: "1023px", columns: 8, gutter: "1.5rem",
      sectionPadding: "4rem 1.5rem",
      fontSize: { heading: "2.25rem", subheading: "1.375rem", body: "1rem", small: "0.875rem" },
      layout: "stacked", navigation: "sticky", gridColumns: 8,
    });
    improvements.push("Added tablet breakpoint");
  }
  if (!names.includes("desktop")) {
    responsive.breakpoints.push({
      name: "desktop", minWidth: "1024px", columns: 12, gutter: "2rem",
      sectionPadding: "6rem 2rem",
      fontSize: { heading: "3rem", subheading: "1.5rem", body: "1.0625rem", small: "0.875rem" },
      layout: "full", navigation: "sticky", gridColumns: 12,
    });
    improvements.push("Added desktop breakpoint");
  }

  if (Object.keys(responsive.adaptiveLayouts).length === 0) {
    responsive.adaptiveLayouts = {
      mobile: "stacked-compact",
      tablet: "stacked",
      desktop: "full",
    };
    improvements.push("Added adaptive layout rules");
  }

  return improvements;
}

function improveVisualHierarchy(composition: CompositionGraph): string[] {
  const improvements: string[] = [];
  const { sections, layout, story } = composition;

  const primaries = sections.filter((s) => s.visualWeight === "primary");
  if (primaries.length === 0 && sections.length > 0) {
    sections[0].visualWeight = "primary";
    improvements.push("Promoted first section to primary weight");
  }
  if (primaries.length > 3) {
    primaries.slice(3).forEach((s) => {
      s.visualWeight = "secondary";
      improvements.push(`Demoted ${s.id} to secondary weight`);
    });
  }

  if (!layout.visualHierarchy || layout.visualHierarchy.length === 0) {
    layout.visualHierarchy = sections.slice(0, Math.min(4, sections.length)).map((s) => `${s.id}:${s.visualWeight}`);
    improvements.push("Built explicit visual hierarchy");
  }

  const contactIdx = sections.findIndex((s) => s.id === "contact");
  if (contactIdx >= 0 && contactIdx < sections.length - 1) {
    const contact = sections.splice(contactIdx, 1)[0];
    sections.push(contact);
    layout.sectionOrder = sections.map((s) => s.id);
    improvements.push("Moved contact section last");
  }

  if (!story.narrativeArc || story.narrativeArc.length === 0) {
    story.narrativeArc = sections.map((s) => s.storytellingRole).filter(Boolean);
    improvements.push("Built narrative arc");
  }

  return improvements;
}

function improvePromptCompliance(
  composition: CompositionGraph,
  prompt: string
): string[] {
  const improvements: string[] = [];
  const lower = prompt.toLowerCase();

  // Forbidden sections
  const forbidden: string[] = [];
  if (/no hero|without hero|skip hero/i.test(lower)) forbidden.push("hero");
  if (/no footer|without footer/i.test(lower)) forbidden.push("footer");
  if (/no about|without about/i.test(lower)) forbidden.push("about");
  if (/no skills|without skills/i.test(lower)) forbidden.push("skills");
  if (/no experience|without experience/i.test(lower)) forbidden.push("experience");

  for (const id of forbidden) {
    const idx = composition.sections.findIndex((s) => s.id === id);
    if (idx >= 0) {
      composition.sections.splice(idx, 1);
      composition.layout.sectionOrder = composition.sections.map((s) => s.id);
      improvements.push(`Removed forbidden section: ${id}`);
    }
  }

  // Required sections
  const requiredMap: Record<string, RegExp> = {
    projects: /\bprojects?\b|\bshowcase\b|\bwork\b|\bportfolio\b/i,
    experience: /\bexperience\b|\bwork history\b|\bcareer\b/i,
    education: /\beducation\b|\bdegree\b|\bqualifications?\b/i,
    skills: /\bskills\b|\btechnologies\b|\btech stack\b/i,
    testimonials: /\btestimonials?\b|\breviews\b|\breferences\b/i,
    services: /\bservices\b|\bofferings\b/i,
    gallery: /\bgallery\b|\bphotos\b|\bphotography\b/i,
    faq: /\bfaq\b|\bquestions?\b/i,
  };
  const presentIds = new Set(composition.sections.map((s) => s.id));
  for (const [id, re] of Object.entries(requiredMap)) {
    if (re.test(lower) && !presentIds.has(id)) {
      const isForbidden = forbidden.includes(id) || /no (skills|about)/i.test(lower) && id === "skills" || /no about/i.test(lower) && id === "about";
      if (!isForbidden) {
        composition.sections.push(makeSection(id));
        improvements.push(`Added mentioned section: ${id}`);
      }
    }
  }
  composition.layout.sectionOrder = composition.sections.map((s) => s.id);

  // Horizontal scroll
  if (/horizontal scroll|horizontal-scroll|side scroll/i.test(lower)) {
    if (composition.layout.style !== "horizontal-scroll") {
      composition.layout.style = "horizontal-scroll";
      composition.layout.gridStrategy = "full-bleed-snap";
      composition.navigation.style = "horizontal-scroll";
      improvements.push("Applied horizontal scroll layout");
    }
  }

  // Re-apply explicit color overrides (authoritative prompt compliance)
  const before = JSON.stringify(composition.theme.colors);
  composition.theme = applyExplicitColorOverrides(composition.theme, prompt);
  if (JSON.stringify(composition.theme.colors) !== before) {
    improvements.push("Re-applied exact colors from prompt");
  }

  return improvements;
}

function makeSection(id: string): ComposedSection {
  const base: Omit<ComposedSection, "id" | "name" | "componentName"> = {
    type: "required",
    storytellingRole: "supplementary",
    priority: 50,
    variant: "card",
    layout: "grid",
    interaction: "scroll-reveal",
    animation: "section-fade",
    accessibility: "semantic-section",
    responsive: { desktop: "full", tablet: "stacked", mobile: "stacked-compact" },
    contentRequirements: [],
    visualWeight: "secondary",
    metadata: {},
  };
  return {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    componentName: `${id.charAt(0).toUpperCase() + id.slice(1)}Section`,
    ...base,
  } as ComposedSection;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function reviewAndImprove(
  composition: CompositionGraph,
  portfolioData: PortfolioData,
  prompt: string
): ReviewResult {
  const working = JSON.parse(JSON.stringify(composition)) as CompositionGraph;
  const improvements: string[] = [];

  const run = () => [
    scoreDesign(working),
    scoreAnimation(working, prompt),
    scoreAccessibility(working),
    scoreResponsiveness(working),
    scoreVisualHierarchy(working),
    scorePromptCompliance(working, prompt),
  ];

  let scores = run();
  let failedAxes = scores.filter((s) => !s.passed).map((s) => s.axis);

  // Auto-improve pass(es): any axis below 90 triggers deterministic fixes.
  for (let round = 0; round < 2 && failedAxes.length > 0; round++) {
    const didImprove: string[] = [];

    if (failedAxes.includes("design")) didImprove.push(...improveDesign(working, prompt));
    if (failedAxes.includes("animation")) didImprove.push(...improveAnimation(working, prompt));
    if (failedAxes.includes("accessibility")) didImprove.push(...improveAccessibility(working));
    if (failedAxes.includes("responsiveness")) didImprove.push(...improveResponsiveness(working));
    if (failedAxes.includes("visualHierarchy")) didImprove.push(...improveVisualHierarchy(working));
    if (failedAxes.includes("promptCompliance")) didImprove.push(...improvePromptCompliance(working, prompt));

    if (didImprove.length > 0) {
      improvements.push(...didImprove);
      working.metadata.refinementApplied = true;
      working.metadata.uniquenessScore = Math.min(1, working.metadata.uniquenessScore + didImprove.length * 0.02);
      working.metadata.confidence = Math.min(1, working.metadata.confidence + 0.05);
    }

    scores = run();
    failedAxes = scores.filter((s) => !s.passed).map((s) => s.axis);
  }

  const overall = Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length);
  const passed = scores.every((s) => s.passed);

  return {
    composition: working,
    portfolioData,
    improved: improvements.length > 0,
    report: {
      scores,
      overall,
      passed,
      improvements,
      reviewedAt: new Date().toISOString(),
    },
  };
}

export { AXIS_LABELS };
