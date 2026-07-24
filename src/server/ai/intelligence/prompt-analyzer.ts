import type { AIContextObject, Framework, Language, StylingSystem } from "./types";
import { detectFrameworks, detectLanguages, detectStyling } from "./tech-detector";
import { detectAllLibraries } from "./library-detector";
import { detectDesignLanguages, detectProfession, detectTheme } from "./design-detector";
import { validateDependencies } from "./dependency-validator";
import { detectMissingContext } from "./missing-context";
import { detectSections, detectRestrictions } from "./section-detector";

function normalizePrompt(prompt: string): string {
  return prompt.trim().replace(/\s+/g, " ");
}

function extractRawKeywords(prompt: string): {
  technologies: string[];
  libraries: string[];
  designReferences: string[];
  keywords: string[];
  numbers: string[];
  urls: string[];
} {
  const lower = prompt.toLowerCase();

  const techTerms = [
    "react", "vue", "angular", "svelte", "next", "nuxt", "astro", "remix",
    "typescript", "javascript", "python", "php", "ruby", "go", "rust",
    "tailwind", "css", "scss", "sass", "bootstrap", "material",
    "node", "express", "fastapi", "django", "flask", "laravel",
  ];

  const techs = techTerms.filter((t) => lower.includes(t));

  const libTerms = [
    "framer", "gsap", "lenis", "motion", "three", "lottie",
    "shadcn", "radix", "mantine", "antd", "daisyui",
    "lucide", "heroicons", "tabler",
    "recharts", "chartjs", "echarts",
  ];

  const libs = libTerms.filter((l) => lower.includes(l));

  const designTerms = [
    "minimal", "creative", "luxury", "brutalist", "glassmorphism",
    "cyberpunk", "retro", "corporate", "playful", "editorial",
    "apple", "linear", "stripe", "vercel",
  ];

  const designs = designTerms.filter((d) => lower.includes(d));

  const words = prompt.split(/\s+/).filter((w) => w.length > 2);

  const numbers = prompt.match(/\d+/g) ?? [];

  const urls = prompt.match(/https?:\/\/[^\s]+/g) ?? [];

  return {
    technologies: techs,
    libraries: libs,
    designReferences: designs,
    keywords: [...new Set(words)],
    numbers,
    urls,
  };
}

function extractIntent(prompt: string): AIContextObject["intent"] {
  const lower = prompt.toLowerCase();

  let objective = "Generate a portfolio website";
  if (lower.includes("landing page")) objective = "Generate a landing page";
  else if (lower.includes("dashboard")) objective = "Generate a dashboard";
  else if (lower.includes("blog")) objective = "Generate a blog";
  else if (lower.includes("ecommerce") || lower.includes("e-commerce")) objective = "Generate an e-commerce site";

  let portfolioGoal = "Showcase professional work and skills";
  if (lower.includes("personal")) portfolioGoal = "Personal portfolio for self-expression";
  else if (lower.includes("business")) portfolioGoal = "Business portfolio for client acquisition";
  else if (lower.includes("agency")) portfolioGoal = "Agency portfolio to showcase team work";
  else if (lower.includes("freelanc")) portfolioGoal = "Freelancer portfolio to attract clients";
  else if (lower.includes("student")) portfolioGoal = "Student portfolio for job applications";

  let targetAudience: string | undefined;
  if (lower.includes("client")) targetAudience = "Potential clients";
  else if (lower.includes("employer") || lower.includes("hiring")) targetAudience = "Potential employers";
  else if (lower.includes("recruiter")) targetAudience = "Recruiters";
  else if (lower.includes("investor")) targetAudience = "Investors";

  const toneMatch = prompt.match(/(?:tone|vibe|mood)[:\s]+(\w+)/i);
  const tone = toneMatch?.[1];

  return { objective, portfolioGoal, targetAudience, tone };
}

function inferPrimaryFramework(frameworks: AIContextObject["frameworks"]): Framework {
  if (frameworks.length === 0) return "react";
  const explicit = frameworks.find((f) => f.explicit);
  return explicit?.name ?? frameworks[0].name;
}

function inferPrimaryLanguage(languages: AIContextObject["languages"]): Language {
  if (languages.length === 0) return "typescript";
  const explicit = languages.find((l) => l.explicit);
  return explicit?.name ?? languages[0].name;
}

function inferPrimaryStyling(styling: AIContextObject["styling"]): StylingSystem {
  if (styling.length === 0) return "tailwind";
  const explicit = styling.find((s) => s.explicit);
  return explicit?.name ?? styling[0].name;
}

function calculateComplexity(prompt: string, libraryCount: number): AIContextObject["metadata"]["complexity"] {
  const words = prompt.split(/\s+/).length;
  const hasMultipleFrameworks = (prompt.match(/\b(react|vue|angular|svelte|next|nuxt)\b/gi) ?? []).length > 1;
  const hasComplexLibraries = libraryCount > 5;

  if (words < 15 && libraryCount < 2) return "simple";
  if (words > 80 || hasComplexLibraries || hasMultipleFrameworks) return "expert";
  if (words > 40 || libraryCount > 3) return "complex";
  return "moderate";
}

function calculateConfidence(ctx: Partial<AIContextObject>): number {
  let score = 0.5;

  if (ctx.frameworks && ctx.frameworks.length > 0 && ctx.frameworks[0].explicit) score += 0.1;
  if (ctx.languages && ctx.languages.length > 0 && ctx.languages[0].explicit) score += 0.1;
  if (ctx.styling && ctx.styling.length > 0 && ctx.styling[0].explicit) score += 0.1;
  if (ctx.uiLibraries && ctx.uiLibraries.length > 0) score += 0.05;
  if (ctx.designLanguage && ctx.designLanguage.length > 0) score += 0.1;
  if (ctx.profession && ctx.profession !== "other") score += 0.05;
  if (ctx.sections && ctx.sections.length > 2) score += 0.05;

  return Math.min(score, 1);
}

export function analyzePrompt(prompt: string): AIContextObject {
  const normalized = normalizePrompt(prompt);
  const lower = normalized.toLowerCase();

  const frameworks = detectFrameworks(normalized);
  const languages = detectLanguages(normalized);
  const styling = detectStyling(normalized);
  const libraries = detectAllLibraries(normalized);
  const designLanguage = detectDesignLanguages(normalized);
  const profession = detectProfession(normalized);
  const theme = detectTheme(normalized);
  const sections = detectSections(normalized);
  const restrictions = detectRestrictions(normalized);
  const rawExtraction = extractRawKeywords(normalized);
  const intent = extractIntent(normalized);

  const primaryFramework = inferPrimaryFramework(frameworks);
  const primaryLanguage = inferPrimaryLanguage(languages);
  const primaryStyling = inferPrimaryStyling(styling);

  const responsive = !/\bno responsive\b|\bstatic only\b/i.test(lower);
  const accessibility = !/\bno accessibility\b|\bno a11y\b/i.test(lower);
  const seo = !/\bno seo\b/i.test(lower);
  const performance = !/\bno optimization\b/i.test(lower);
  const pwa = /\bpwa\b|\bprogressive web app\b/i.test(lower);

  const animationsEnabled = !/\bno animations?\b|\bstatic only\b|\bwithout animations?\b/i.test(lower);
  let intensity: "none" | "subtle" | "moderate" | "heavy" = "subtle";
  if (!animationsEnabled) intensity = "none";
  else if (/\bsubtle\b|\bminimal animations?\b|\bsimple animations?\b/i.test(lower)) intensity = "subtle";
  else if (/\bmoderate\b|\bbalanced\b/i.test(lower)) intensity = "moderate";
  else if (/\bheavy\b|\bcomplex\b|\bsmooth\b|\bparallax\b|\b3d\b|\bscroll\b/i.test(lower)) intensity = "heavy";

  const animationTypes: string[] = [];
  if (/\bscroll\b/i.test(lower)) animationTypes.push("scroll");
  if (/\bparallax\b/i.test(lower)) animationTypes.push("parallax");
  if (/\bhover\b/i.test(lower)) animationTypes.push("hover");
  if (/\btransition\b/i.test(lower)) animationTypes.push("transition");
  if (/\bfade\b/i.test(lower)) animationTypes.push("fade");
  if (/\bslide\b/i.test(lower)) animationTypes.push("slide");
  if (/\b3d\b/i.test(lower)) animationTypes.push("3d");
  if (/\bglitch\b/i.test(lower)) animationTypes.push("glitch");
  if (/\bmorph\b/i.test(lower)) animationTypes.push("morph");

  const allLibraries = [...libraries.ui, ...libraries.animation, ...libraries.icons, ...libraries.charts, ...libraries.other];
  const conflicts = validateDependencies(
    frameworks.map((f) => f.name),
    styling.map((s) => s.name),
    allLibraries
  );

  const customSections = sections
    .filter((s) => s.type === "required")
    .map((s) => s.name);

  const missing = detectMissingContext(normalized, {
    frameworks: frameworks.map((f) => f.name),
    languages: languages.map((l) => l.name),
    styling: styling.map((s) => s.name),
    designLanguage: designLanguage.map((d) => d.name),
    profession: profession.profession,
    theme,
    libraries: allLibraries.map((l) => l.name),
  });

  const wordCount = normalized.split(/\s+/).length;
  const complexity = calculateComplexity(normalized, allLibraries.length);
  const confidence = calculateConfidence({
    frameworks,
    languages,
    styling,
    uiLibraries: libraries.ui,
    designLanguage,
    profession: profession.profession,
    sections,
  });

  return {
    rawPrompt: prompt,
    normalizedPrompt: normalized,

    intent,
    profession: profession.profession,
    professionContext: profession.explicit ? `Explicitly mentioned: ${profession.profession}` : undefined,

    frameworks,
    primaryFramework,

    languages,
    primaryLanguage,

    styling,
    primaryStyling,

    uiLibraries: libraries.ui,
    animationLibraries: libraries.animation,
    iconLibraries: libraries.icons,
    chartLibraries: libraries.charts,
    otherLibraries: libraries.other,

    designLanguage,

    theme,

    sections,
    customSections: customSections.length > 0 ? customSections : undefined,

    responsive,
    accessibility,
    seo,
    performance,
    pwa,

    animations: {
      enabled: animationsEnabled,
      intensity,
      types: animationTypes,
    },

    restrictions,

    dependencies: {
      all: allLibraries.map((l) => l.name),
      conflicts,
    },

    missing,

    rawExtraction,

    metadata: {
      analyzedAt: new Date().toISOString(),
      promptLength: normalized.length,
      wordCount,
      complexity,
      confidence,
    },
  };
}
