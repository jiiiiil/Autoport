import type { DetectedFramework, DetectedLanguage, DetectedStyling } from "./types";

const FRAMEWORK_PATTERNS: { pattern: RegExp; name: DetectedFramework["name"] }[] = [
  { pattern: /\bnext\.?js\b/i, name: "nextjs" },
  { pattern: /\breact\b/i, name: "react" },
  { pattern: /\bvue\.?js\b|\bvue\b/i, name: "vue" },
  { pattern: /\bnuxt\b/i, name: "nuxt" },
  { pattern: /\bangular\b/i, name: "angular" },
  { pattern: /\bsvelte\b/i, name: "svelte" },
  { pattern: /\bsveltekit\b/i, name: "sveltekit" },
  { pattern: /\bastro\b/i, name: "astro" },
  { pattern: /\bremix\b/i, name: "remix" },
  { pattern: /\bgatsby\b/i, name: "gatsby" },
  { pattern: /\blaravel\b/i, name: "laravel" },
  { pattern: /\bexpress\.?js\b|\bexpress\b/i, name: "express" },
  { pattern: /\bfastapi\b/i, name: "fastapi" },
  { pattern: /\bdjango\b/i, name: "django" },
  { pattern: /\bflask\b/i, name: "flask" },
  { pattern: /\bspring\b/i, name: "spring" },
  { pattern: /\brails\b|\bruby on rails\b/i, name: "ruby-on-rails" },
  { pattern: /\bsolid\.?js\b|\bsolidjs\b/i, name: "solid" },
  { pattern: /\bqwik\b/i, name: "qwik" },
];

const LANGUAGE_PATTERNS: { pattern: RegExp; name: DetectedLanguage["name"] }[] = [
  { pattern: /\btypescript\b|\b\.?ts\b/i, name: "typescript" },
  { pattern: /\bjavascript\b|\b\.?js\b/i, name: "javascript" },
  { pattern: /\btsx\b/i, name: "tsx" },
  { pattern: /\bjsx\b/i, name: "jsx" },
  { pattern: /\bpython\b|\b\.?py\b/i, name: "python" },
  { pattern: /\bphp\b/i, name: "php" },
  { pattern: /\bruby\b/i, name: "ruby" },
  { pattern: /\bgolang\b|\bgo\b/i, name: "go" },
  { pattern: /\brust\b/i, name: "rust" },
  { pattern: /\bjava\b(?!script)/i, name: "java" },
];

const STYLING_PATTERNS: { pattern: RegExp; name: DetectedStyling["name"] }[] = [
  { pattern: /\btailwind\b/i, name: "tailwind" },
  { pattern: /\bscss\b|\bsass\b/i, name: "scss" },
  { pattern: /\bcss modules?\b/i, name: "css-modules" },
  { pattern: /\bstyled components?\b/i, name: "styled-components" },
  { pattern: /\bemotion\b/i, name: "emotion" },
  { pattern: /\bbootstrap\b/i, name: "bootstrap" },
  { pattern: /\bmaterial ui\b|\bmaterial-ui\b|\bmui\b/i, name: "material-ui" },
  { pattern: /\bchakra\b/i, name: "chakra" },
  { pattern: /\bvanilla.?extract\b/i, name: "vanilla-extract" },
  { pattern: /\bwindicss\b/i, name: "windicss" },
  { pattern: /\bunocss\b|\buno\b/i, name: "unocss" },
  { pattern: /\bcss\b(?![-\s]?modules)/i, name: "css" },
];

export function detectFrameworks(prompt: string): DetectedFramework[] {
  const results: DetectedFramework[] = [];
  const lower = prompt.toLowerCase();

  for (const fp of FRAMEWORK_PATTERNS) {
    if (fp.pattern.test(lower)) {
      const explicit = new RegExp(`\\b${fp.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(prompt);
      results.push({
        name: fp.name,
        confidence: explicit ? 0.95 : 0.7,
        explicit,
      });
    }
  }

  if (results.length === 0) {
    results.push({ name: "react", confidence: 0.3, explicit: false });
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

export function detectLanguages(prompt: string): DetectedLanguage[] {
  const results: DetectedLanguage[] = [];
  const lower = prompt.toLowerCase();

  for (const lp of LANGUAGE_PATTERNS) {
    if (lp.pattern.test(lower)) {
      const explicit = new RegExp(`\\b${lp.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(prompt);
      results.push({
        name: lp.name,
        confidence: explicit ? 0.95 : 0.7,
        explicit,
      });
    }
  }

  if (results.length === 0) {
    results.push({ name: "typescript", confidence: 0.3, explicit: false });
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

export function detectStyling(prompt: string): DetectedStyling[] {
  const results: DetectedStyling[] = [];
  const lower = prompt.toLowerCase();

  for (const sp of STYLING_PATTERNS) {
    if (sp.pattern.test(lower)) {
      const explicit = new RegExp(`\\b${sp.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(prompt);
      results.push({
        name: sp.name,
        confidence: explicit ? 0.95 : 0.7,
        explicit,
      });
    }
  }

  if (results.length === 0) {
    results.push({ name: "tailwind", confidence: 0.3, explicit: false });
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}
