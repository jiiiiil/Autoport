import type { MissingContext } from "./types";

export function detectMissingContext(prompt: string, detected: {
  frameworks: string[];
  languages: string[];
  styling: string[];
  designLanguage: string[];
  profession: string;
  theme: string;
  libraries: string[];
}): MissingContext[] {
  const missing: MissingContext[] = [];
  const lower = prompt.toLowerCase();

  if (detected.frameworks.length === 0) {
    missing.push({
      category: "Framework",
      field: "framework",
      impact: "critical",
      suggestion: "No framework detected. Defaulting to React + Next.js.",
    });
  }

  if (detected.languages.length === 0) {
    missing.push({
      category: "Language",
      field: "language",
      impact: "critical",
      suggestion: "No language detected. Defaulting to TypeScript.",
    });
  }

  if (detected.styling.length === 0) {
    missing.push({
      category: "Styling",
      field: "styling",
      impact: "important",
      suggestion: "No styling system detected. Defaulting to Tailwind CSS.",
    });
  }

  if (detected.designLanguage.length === 0) {
    missing.push({
      category: "Design",
      field: "designLanguage",
      impact: "important",
      suggestion: "No design language specified. Will infer from profession and context.",
    });
  }

  if (detected.profession === "other") {
    missing.push({
      category: "Context",
      field: "profession",
      impact: "important",
      suggestion: "Profession not specified. Will infer from prompt context.",
    });
  }

  if (detected.theme === "dark" && !/\bdark\b/i.test(lower) && !/\blight\b/i.test(lower)) {
    missing.push({
      category: "Theme",
      field: "theme",
      impact: "minor",
      suggestion: "Theme preference not explicitly specified. Defaulting to dark.",
    });
  }

  if (!/\banimation\b|\banimate\b|\bmotion\b|\btransition\b|\beffect\b/i.test(lower)) {
    missing.push({
      category: "Animations",
      field: "animations",
      impact: "minor",
      suggestion: "No animation requirements specified. Will use subtle defaults.",
    });
  }

  if (!/\bresponsive\b|\bmobile\b|\btablet\b|\bphone\b/i.test(lower)) {
    missing.push({
      category: "Responsive",
      field: "responsive",
      impact: "important",
      suggestion: "Responsive requirements not specified. Will ensure mobile-first responsive design.",
    });
  }

  if (!/\baccessib|\ba11y\b|\bwcag\b/i.test(lower)) {
    missing.push({
      category: "Accessibility",
      field: "accessibility",
      impact: "minor",
      suggestion: "Accessibility requirements not specified. Will follow WCAG 2.1 AA standards.",
    });
  }

  if (!/\bseo\b|\bmeta\b|\bsearch engine\b/i.test(lower)) {
    missing.push({
      category: "SEO",
      field: "seo",
      impact: "minor",
      suggestion: "SEO requirements not specified. Will include basic meta tags.",
    });
  }

  const sectionKeywords = ["hero", "about", "skills", "projects", "experience", "contact", "education", "blog"];
  const mentionedSections = sectionKeywords.filter((s) => lower.includes(s));

  if (mentionedSections.length === 0) {
    missing.push({
      category: "Sections",
      field: "sections",
      impact: "important",
      suggestion: "No specific sections mentioned. Will generate standard portfolio sections.",
    });
  }

  return missing;
}
