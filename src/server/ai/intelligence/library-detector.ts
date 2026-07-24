import type { DetectedLibrary } from "./types";

interface LibraryPattern {
  pattern: RegExp;
  name: string;
  category: DetectedLibrary["category"];
}

const UI_PATTERNS: LibraryPattern[] = [
  { pattern: /\bshadcn\b/i, name: "shadcn", category: "ui" },
  { pattern: /\bradix\b/i, name: "radix", category: "ui" },
  { pattern: /\bheadless.?ui\b/i, name: "headless-ui", category: "ui" },
  { pattern: /\bmantine\b/i, name: "mantine", category: "ui" },
  { pattern: /\bantd\b|\bant.?design\b/i, name: "antd", category: "ui" },
  { pattern: /\bmaterial.?ui\b|\bmui\b/i, name: "material-ui", category: "ui" },
  { pattern: /\bchakra\b/i, name: "chakra", category: "ui" },
  { pattern: /\bflowbite\b/i, name: "flowbite", category: "ui" },
  { pattern: /\breact.?bits\b/i, name: "react-bits", category: "ui" },
  { pattern: /\bmagic.?ui\b/i, name: "magic-ui", category: "ui" },
  { pattern: /\baceternity\b|\bacernity\b/i, name: "aceternity", category: "ui" },
  { pattern: /\bdaisyui\b/i, name: "daisyui", category: "ui" },
  { pattern: /\bpark.?ui\b/i, name: "park-ui", category: "ui" },
  { pattern: /\bnextui\b/i, name: "nextui", category: "ui" },
  { pattern: /\barco\b/i, name: "arco", category: "ui" },
  { pattern: /\bprimereact\b/i, name: "primereact", category: "ui" },
  { pattern: /\bevergreen\b/i, name: "evergreen", category: "ui" },
  { pattern: /\breact.?hook.?form\b/i, name: "react-hook-form", category: "forms" },
  { pattern: /\bformik\b/i, name: "formik", category: "forms" },
  { pattern: /\bzod\b/i, name: "zod", category: "forms" },
  { pattern: /\byup\b/i, name: "yup", category: "forms" },
  { pattern: /\breact.?hot.?toast\b/i, name: "react-hot-toast", category: "ui" },
  { pattern: /\bsonner\b/i, name: "sonner", category: "ui" },
  { pattern: /\breact.?email\b/i, name: "react-email", category: "other" },
  { pattern: /\bresend\b/i, name: "resend", category: "other" },
];

const ANIMATION_PATTERNS: LibraryPattern[] = [
  { pattern: /\bframer.?motion\b|\bmotion\b(?![-\s]?one)/i, name: "framer-motion", category: "animation" },
  { pattern: /\bgsap\b/i, name: "gsap", category: "animation" },
  { pattern: /\blenis\b/i, name: "lenis", category: "animation" },
  { pattern: /\bmotion.?one\b/i, name: "motion-one", category: "animation" },
  { pattern: /\breact.?spring\b/i, name: "react-spring", category: "animation" },
  { pattern: /\blottie\b/i, name: "lottie", category: "animation" },
  { pattern: /\banime\.?js\b|\banimejs\b/i, name: "animejs", category: "animation" },
  { pattern: /\bpopmotion\b/i, name: "popmotion", category: "animation" },
  { pattern: /\bthree\.?js\b|\bthree\b/i, name: "three", category: "animation" },
  { pattern: /\br3f\b|\breact.?three.?fiber\b/i, name: "react-three-fiber", category: "animation" },
  { pattern: /\brive\b/i, name: "rive", category: "animation" },
];

const ICON_PATTERNS: LibraryPattern[] = [
  { pattern: /\blucide\b/i, name: "lucide", category: "icons" },
  { pattern: /\bheroicons\b/i, name: "heroicons", category: "icons" },
  { pattern: /\btabler\b/i, name: "tabler", category: "icons" },
  { pattern: /\bphosphor\b/i, name: "phosphor", category: "icons" },
  { pattern: /\breact.?icons\b/i, name: "react-icons", category: "icons" },
  { pattern: /\bfontawesome\b|\bfont.?awesome\b|\bfa\b/i, name: "fontawesome", category: "icons" },
  { pattern: /\bfeather\b/i, name: "feather", category: "icons" },
];

const CHART_PATTERNS: LibraryPattern[] = [
  { pattern: /\brecharts\b/i, name: "recharts", category: "charts" },
  { pattern: /\bchart\.?js\b|\bchartjs\b/i, name: "chartjs", category: "charts" },
  { pattern: /\becharts\b/i, name: "echarts", category: "charts" },
  { pattern: /\bnivo\b/i, name: "nivo", category: "charts" },
  { pattern: /\bvisx\b/i, name: "visx", category: "charts" },
  { pattern: /\bd3\.?js\b|\bd3\b/i, name: "d3", category: "charts" },
  { pattern: /\bhighcharts\b/i, name: "highcharts", category: "charts" },
  { pattern: /\bapex.?charts?\b/i, name: "apex", category: "charts" },
  { pattern: /\bvictory\b/i, name: "victory", category: "charts" },
];

const ALL_PATTERNS = [...UI_PATTERNS, ...ANIMATION_PATTERNS, ...ICON_PATTERNS, ...CHART_PATTERNS];

function detectLibraries(text: string, patterns: LibraryPattern[]): DetectedLibrary[] {
  const results: DetectedLibrary[] = [];
  const lower = text.toLowerCase();

  for (const p of patterns) {
    if (p.pattern.test(lower)) {
      const wordBoundary = new RegExp(`\\b${p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      const explicit = wordBoundary.test(text);
      results.push({
        name: p.name,
        category: p.category,
        confidence: explicit ? 0.95 : 0.7,
        explicit,
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

export function detectUILibraries(prompt: string): DetectedLibrary[] {
  return detectLibraries(prompt, UI_PATTERNS);
}

export function detectAnimationLibraries(prompt: string): DetectedLibrary[] {
  return detectLibraries(prompt, ANIMATION_PATTERNS);
}

export function detectIconLibraries(prompt: string): DetectedLibrary[] {
  return detectLibraries(prompt, ICON_PATTERNS);
}

export function detectChartLibraries(prompt: string): DetectedLibrary[] {
  return detectLibraries(prompt, CHART_PATTERNS);
}

export function detectAllLibraries(prompt: string): {
  ui: DetectedLibrary[];
  animation: DetectedLibrary[];
  icons: DetectedLibrary[];
  charts: DetectedLibrary[];
  other: DetectedLibrary[];
} {
  const ui = detectUILibraries(prompt);
  const animation = detectAnimationLibraries(prompt);
  const icons = detectIconLibraries(prompt);
  const charts = detectChartLibraries(prompt);

  const otherPatterns = ALL_PATTERNS.filter(
    (p) => !ui.some((u) => u.name === p.name) &&
      !animation.some((a) => a.name === p.name) &&
      !icons.some((i) => i.name === p.name) &&
      !charts.some((c) => c.name === p.name)
  );
  const other = detectLibraries(prompt, otherPatterns);

  return { ui, animation, icons, charts, other };
}
