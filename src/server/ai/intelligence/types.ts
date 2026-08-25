export type Framework =
  | "react" | "nextjs" | "vue" | "nuxt" | "angular"
  | "svelte" | "sveltekit" | "astro" | "remix" | "gatsby"
  | "laravel" | "express" | "fastapi" | "django" | "flask"
  | "spring" | "ruby-on-rails" | "solid" | "qwik"
  | "vanilla" | "other";

export type Language =
  | "typescript" | "javascript" | "tsx" | "jsx"
  | "python" | "php" | "ruby" | "go" | "rust" | "java" | "other";

export type PackageManager =
  | "npm" | "yarn" | "pnpm" | "bun" | "pip" | "composer" | "cargo" | "maven" | "other";

export type BuildScripts = Record<string, string>;

export type StylingSystem =
  | "tailwind" | "css" | "scss" | "sass" | "less"
  | "css-modules" | "styled-components" | "emotion"
  | "bootstrap" | "material-ui" | "chakra"
  | "vanilla-extract" | "windicss" | "unocss"
  | "other";

export type UILibrary =
  | "shadcn" | "radix" | "headless-ui" | "mantine"
  | "antd" | "material-ui" | "chakra" | "flowbite"
  | "react-bits" | "magic-ui" | "aceternity" | "acernity"
  | "daisyui" | "park-ui" | "nextui" | "arco"
  | "primereact" | "evergreen" | "other";

export type AnimationLibrary =
  | "framer-motion" | "gsap" | "lenis" | "motion-one"
  | "react-spring" | "lottie" | "animejs" | "popmotion"
  | "three" | "react-three-fiber" | "rive"
  | "other";

export type IconLibrary =
  | "lucide" | "heroicons" | "tabler" | "phosphor"
  | "react-icons" | "fontawesome" | "feather"
  | "other";

export type ChartLibrary =
  | "recharts" | "chartjs" | "echarts" | "nivo"
  | "visx" | "d3" | "highcharts" | "apex"
  | "victory" | "other";

export type DesignLanguage =
  | "apple" | "linear" | "raycast" | "stripe" | "vercel"
  | "google" | "glassmorphism" | "neumorphism" | "cyberpunk"
  | "luxury" | "minimal" | "editorial" | "magazine"
  | "brutalist" | "dashboard" | "creative" | "gallery"
  | "retro" | "corporate" | "playful" | "dark-academic"
  | "cottagecore" | "other";

export type Profession =
  | "developer" | "fullstack-developer" | "frontend-developer"
  | "backend-developer" | "ai-engineer" | "ml-engineer"
  | "data-scientist" | "data-engineer" | "devops-engineer"
  | "mobile-developer" | "ui-designer" | "ux-designer"
  | "product-designer" | "graphic-designer" | "photographer"
  | "architect" | "doctor" | "lawyer" | "researcher"
  | "agency" | "startup" | "freelancer" | "student"
  | "creator" | "teacher" | "consultant" | "writer"
  | "musician" | "other";

export type ThemeMode = "dark" | "light" | "system" | "both" | "spatial-3d" | "3d-creator";

export interface DetectedFramework {
  name: Framework;
  confidence: number;
  version?: string;
  explicit: boolean;
}

export interface DetectedLanguage {
  name: Language;
  confidence: number;
  explicit: boolean;
}

export interface DetectedStyling {
  name: StylingSystem;
  confidence: number;
  explicit: boolean;
}

export interface DetectedLibrary {
  name: string;
  category: "ui" | "animation" | "icons" | "charts" | "forms" | "editor" | "other";
  confidence: number;
  explicit: boolean;
}

export interface DetectedDesignLanguage {
  name: DesignLanguage;
  confidence: number;
  explicit: boolean;
}

export interface Requirement {
  category: string;
  key: string;
  value: string;
  explicit: boolean;
  priority: "required" | "preferred" | "optional";
}

export interface Restriction {
  type: "forbidden" | "required" | "limitation";
  target: string;
  description: string;
}

export interface DependencyConflict {
  library_a: string;
  library_b: string;
  reason: string;
  severity: "error" | "warning";
  resolution?: string;
}

export interface MissingContext {
  category: string;
  field: string;
  impact: "critical" | "important" | "minor";
  suggestion: string;
}

export interface SectionRequirement {
  name: string;
  type: "required" | "forbidden" | "preferred" | "optional";
  description?: string;
  customizations?: Record<string, string>;
}

export interface AIContextObject {
  rawPrompt: string;
  normalizedPrompt: string;

  intent: {
    objective: string;
    portfolioGoal: string;
    targetAudience?: string;
    tone?: string;
  };

  profession: Profession;
  professionContext?: string;

  frameworks: DetectedFramework[];
  primaryFramework: Framework;

  languages: DetectedLanguage[];
  primaryLanguage: Language;

  styling: DetectedStyling[];
  primaryStyling: StylingSystem;

  uiLibraries: DetectedLibrary[];
  animationLibraries: DetectedLibrary[];
  iconLibraries: DetectedLibrary[];
  chartLibraries: DetectedLibrary[];
  otherLibraries: DetectedLibrary[];

  designLanguage: DetectedDesignLanguage[];

  theme: ThemeMode;

  sections: SectionRequirement[];
  customSections?: string[];

  responsive: boolean;
  accessibility: boolean;
  seo: boolean;
  performance: boolean;
  pwa: boolean;

  animations: {
    enabled: boolean;
    intensity: "none" | "subtle" | "moderate" | "heavy";
    types: string[];
  };

  restrictions: Restriction[];

  dependencies: {
    all: string[];
    conflicts: DependencyConflict[];
  };

  missing: MissingContext[];

  rawExtraction: {
    technologies: string[];
    libraries: string[];
    designReferences: string[];
    keywords: string[];
    numbers: string[];
    urls: string[];
  };

  metadata: {
    analyzedAt: string;
    promptLength: number;
    wordCount: number;
    complexity: "simple" | "moderate" | "complex" | "expert";
    confidence: number;
  };
}
