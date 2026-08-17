import type { PortfolioObject } from "./types";
import type { CompositionGraph } from "@/server/ai/composition/types";
import JSZip from "jszip";

export interface CodeFile {
  filename: string;
  language: string;
  content: string;
  path: string;
}

export function generatePortfolioCodeFiles(portfolio: PortfolioObject | null, composition?: CompositionGraph | null): CodeFile[] {
  const p = portfolio || {};
  const c = composition || null;
  const files: CodeFile[] = [];

  // 1. JSON Data Store (Single Source of Truth)
  files.push({
    filename: "portfolio.json",
    language: "json",
    path: "src/portfolio.json",
    content: JSON.stringify(p, null, 2),
  });

  files.push({
    filename: "composition.json",
    language: "json",
    path: "src/composition.json",
    content: JSON.stringify(c || {}, null, 2),
  });

  // 2. App.tsx - Render PortfolioRenderer with exact JSON blueprint
  const appTsx = `"use client";

import React from "react";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";
import portfolioData from "./portfolio.json";
import compositionData from "./composition.json";
import "./index.css";

export default function App() {
  return (
    <PortfolioRenderer
      portfolio={portfolioData as any}
      composition={compositionData as any}
    />
  );
}
`;
  files.push({ filename: "App.tsx", language: "typescript", path: "src/App.tsx", content: appTsx });

  // 3. main.tsx
  const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
  files.push({ filename: "main.tsx", language: "typescript", path: "src/main.tsx", content: mainTsx });

  // 4. index.css
  const indexCss = `@import "tailwindcss";

:root, .theme-black {
  --p-bg: #050508;
  --p-bg-card: #0e0e14;
  --p-bg-card-hover: #161620;
  --p-border: #222230;
  --p-border-subtle: #141420;
  --p-text: #ffffff;
  --p-text-secondary: #e2e8f0;
  --p-text-muted: #94a3b8;
  --p-primary: #ffffff;
  --p-accent: #ffffff;
}

.ap-portfolio-root {
  min-height: 100vh;
}

.theme-white {
  --p-bg: #f8fafc;
  --p-bg-card: #ffffff;
  --p-bg-card-hover: #f1f5f9;
  --p-border: #cbd5e1;
  --p-border-subtle: #e2e8f0;
  --p-text: #020617;
  --p-text-secondary: #0f172a;
  --p-text-muted: #334155;
  --p-primary: #0284c7;
  --p-accent: #0284c7;
}

* { box-sizing: border-box; }
body {
  background-color: var(--p-bg, #050508);
  color: var(--p-text, #ffffff);
  margin: 0;
  padding: 0;
  font-family: var(--p-font-body, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  min-height: 100vh;
  overflow-x: hidden;
}
`;
  files.push({ filename: "index.css", language: "css", path: "src/index.css", content: indexCss });

  // 5. utils.ts
  const utilsTs = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  files.push({ filename: "utils.ts", language: "typescript", path: "src/lib/utils.ts", content: utilsTs });

  // 6. portfolio/types.ts
  const typesTs = `export interface PortfolioPersonalInfo {
  name?: string;
  role?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  tech?: string[];
}

export interface PortfolioHero {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface PortfolioSkill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  category?: string;
}

export interface PortfolioProject {
  title: string;
  description?: string;
  tags?: string[];
  link?: string;
  image?: string;
  features?: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export interface PortfolioExperience {
  company: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  location?: string;
  current?: boolean;
  highlights?: string[];
  technologies?: string[];
}

export interface PortfolioEducation {
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  grade?: string;
  achievements?: string[];
}

export interface PortfolioAchievement {
  title: string;
  date?: string;
  description?: string;
  metric?: string;
}

export interface PortfolioCertification {
  name: string;
  issuer?: string;
  date?: string;
  link?: string;
}

export interface PortfolioSocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface PortfolioTestimonial {
  author?: string;
  role?: string;
  content?: string;
  rating?: number;
  company?: string;
}

export interface PortfolioService {
  name?: string;
  description?: string;
  price?: string;
  features?: string[];
}

export interface PortfolioMetric {
  label?: string;
  value?: string;
  icon?: string;
  description?: string;
}

export interface PortfolioPublication {
  title?: string;
  publisher?: string;
  date?: string;
  link?: string;
  excerpt?: string;
}

export interface PortfolioFaq {
  question?: string;
  answer?: string;
}

export interface PortfolioProduct {
  name?: string;
  description?: string;
  link?: string;
  status?: "live" | "beta" | "coming-soon";
}

export interface PortfolioClient {
  name?: string;
  industry?: string;
  project?: string;
}

export interface PortfolioAward {
  title?: string;
  organization?: string;
  date?: string;
  description?: string;
}

export interface PortfolioRoadmap {
  milestone?: string;
  date?: string;
  status?: "completed" | "in-progress" | "upcoming";
}

export interface PortfolioArticle {
  title?: string;
  excerpt?: string;
  date?: string;
  link?: string;
}

export interface PortfolioSpeaking {
  event?: string;
  topic?: string;
  date?: string;
  link?: string;
}

export interface PortfolioLanguage {
  name?: string;
  proficiency?: string;
}

export interface PortfolioOrganization {
  title?: string;
  organization?: string;
  role?: string;
  date?: string;
  description?: string;
}

export interface PortfolioGalleryItem {
  title?: string;
  description?: string;
  category?: string;
  image?: string;
}

export interface PortfolioContact {
  email?: string;
  phone?: string;
  location?: string;
  availableFor?: string;
}

export type ThemeMode = "dark" | "light" | "black" | "white";

export interface PortfolioTheme {
  mode: ThemeMode;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  headingFont?: string;
  bodyFont?: string;
}

export type LayoutStyle = "minimal" | "creative" | "developer" | "agency" | "startup";

export interface PortfolioLayout {
  style: LayoutStyle;
  sectionOrder?: string[];
  gridColumns?: number;
}

export interface PortfolioNavigation {
  links?: { label: string; href: string }[];
  style?: "pills" | "underline" | "minimal";
}

export interface PortfolioSEO {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface PortfolioAbout {
  title?: string;
  content?: string;
  intro?: string;
  highlights?: string[];
  strengths?: { label: string; detail?: string }[];
  metrics?: { label: string; value: string }[];
}

export interface PortfolioSections {
  hero?: PortfolioHero;
  about?: PortfolioAbout;
  skills?: PortfolioSkill[];
  projects?: PortfolioProject[];
  experience?: PortfolioExperience[];
  education?: PortfolioEducation[];
  achievements?: PortfolioAchievement[];
  certifications?: PortfolioCertification[];
  socialLinks?: PortfolioSocialLink[];
  contact?: PortfolioContact;
  testimonials?: PortfolioTestimonial[];
  gallery?: PortfolioGalleryItem[];
  services?: PortfolioService[];
  metrics?: PortfolioMetric[];
  publications?: PortfolioPublication[];
  faq?: PortfolioFaq[];
  products?: PortfolioProduct[];
  clients?: PortfolioClient[];
  awards?: PortfolioAward[];
  roadmap?: PortfolioRoadmap[];
  articles?: PortfolioArticle[];
  speaking?: PortfolioSpeaking[];
  timeline?: PortfolioExperience[];
  openSource?: PortfolioProject[];
  community?: PortfolioAchievement[];
  experiments?: PortfolioProject[];
  resume?: PortfolioExperience[];
  languages?: PortfolioLanguage[];
  organizations?: PortfolioOrganization[];
}

export interface PortfolioObject {
  personalInfo?: PortfolioPersonalInfo;
  sections?: PortfolioSections;
  theme?: PortfolioTheme;
  layout?: PortfolioLayout;
  navigation?: PortfolioNavigation;
  seo?: PortfolioSEO;
  mascotOption?: string;
}
`;
  files.push({ filename: "types.ts", language: "typescript", path: "src/lib/portfolio/types.ts", content: typesTs });

  // 7. server/ai/composition/types.ts
  const compositionTypesTs = `export interface ComposedSection {
  id: string;
  name: string;
  componentName: string;
  type: string;
  storytellingRole: string;
  priority: number;
  variant: string;
  layout: string;
  interaction: string;
  animation: string;
  accessibility: string;
  responsive: Record<string, string>;
  contentRequirements: string[];
  visualWeight: string;
  metadata: Record<string, unknown>;
  design?: any;
}

export interface ComposedLayout {
  style: string;
  sectionOrder: string[];
  gridStrategy: string;
  containerWidth: string;
  verticalRhythm: string;
  sectionSpacing: string;
  padding: Record<string, string>;
  maxWidth: string;
  backgroundStrategy: string;
  visualHierarchy: string[];
}

export interface ComposedNavigation {
  style: string;
  position: string;
  sections: string[];
  mobileBehavior: string;
  scrollBehavior: string;
  visualStyle: Record<string, string>;
  overlay: boolean;
  transparent: boolean;
  backdropFilter: string;
}

export interface ComposedTheme {
  mode: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderSubtle: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    overlay: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    monoFont: string;
    scale: Record<string, string>;
    lineHeights: Record<string, string>;
    letterSpacings: Record<string, string>;
    fontWeights: Record<string, number>;
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  gradients: {
    primary: string;
    secondary: string;
    hero: string;
    card: string;
    text: string;
  };
  backgroundStyle: string;
  borders: Record<string, string>;
  transitionDurations: Record<string, string>;
  zIndex: Record<string, number>;
}

export interface ComposedMotion {
  style: string;
  library: string;
  intensity: string;
  hero: {
    type: string;
    duration: string;
    easing: string;
    stagger: string;
  };
  sections: {
    enter: string;
    exit: string;
    stagger: string;
  };
  cards: {
    hover: string;
    focus: string;
    tap: string;
  };
  scroll: {
    enabled: boolean;
    type: string;
    trigger: string;
    offset: string;
  };
  pageTransitions: {
    enabled: boolean;
    type: string;
    duration: string;
  };
  microInteractions: string[];
  reducedMotionFallback: string;
  gsap: Record<string, boolean>;
}

export interface CompositionGraph {
  prompt: string;
  aiContext?: any;
  blueprint?: any;
  layout: ComposedLayout;
  sections: ComposedSection[];
  navigation: ComposedNavigation;
  theme: ComposedTheme;
  motion: ComposedMotion;
  components: any[];
  responsive: any;
  accessibility: any;
  story: any;
  tokens: Record<string, string>;
  metadata: any;
}
`;
  files.push({ filename: "types.ts", language: "typescript", path: "src/server/ai/composition/types.ts", content: compositionTypesTs });

  // 8. themes.ts
  const themesTs = `import type { ThemeMode } from "./types";
import type { ComposedTheme } from "@/server/ai/composition/types";

type ThemeVars = Record<string, string>;

const BLACK_THEME_VARS: ThemeVars = {
  "--p-bg": "#050508",
  "--p-bg-card": "#0e0e14",
  "--p-bg-card-hover": "#161620",
  "--p-border": "#222230",
  "--p-border-subtle": "#141420",
  "--p-text": "#ffffff",
  "--p-text-muted": "#94a3b8",
  "--p-text-secondary": "#e2e8f0",
  "--p-primary": "#ffffff",
  "--p-primary-soft": "rgba(255, 255, 255, 0.12)",
  "--p-primary-softer": "rgba(255, 255, 255, 0.06)",
  "--p-secondary": "#94a3b8",
  "--p-accent": "#ffffff",
  "--p-gradient-from": "#ffffff",
  "--p-gradient-via": "#e2e8f0",
  "--p-gradient-to": "#ffffff",
  "--p-code-bg": "#050508",
  "--p-code-border": "#1e1e2d",
  "--neu-outset": "6px 6px 14px #030305, -6px -6px 14px #191925",
  "--neu-inset": "inset 4px 4px 8px #030305, inset -4px -4px 8px #191925",
};

const WHITE_THEME_VARS: ThemeVars = {
  "--p-bg": "#f8fafc",
  "--p-bg-card": "#ffffff",
  "--p-bg-card-hover": "#f1f5f9",
  "--p-border": "#cbd5e1",
  "--p-border-subtle": "#e2e8f0",
  "--p-text": "#020617",
  "--p-text-muted": "#334155",
  "--p-text-secondary": "#0f172a",
  "--p-primary": "#0284c7",
  "--p-primary-soft": "rgba(2, 132, 199, 0.12)",
  "--p-primary-softer": "rgba(2, 132, 199, 0.06)",
  "--p-secondary": "#0f172a",
  "--p-accent": "#0284c7",
  "--p-gradient-from": "#020617",
  "--p-gradient-via": "#0f172a",
  "--p-gradient-to": "#020617",
  "--p-code-bg": "#e2e8f0",
  "--p-code-border": "#cbd5e1",
  "--neu-outset": "8px 8px 18px #cbd5e1, -8px -8px 18px #ffffff",
  "--neu-inset": "inset 4px 4px 10px #cbd5e1, inset -4px -4px 10px #ffffff",
};

const FALLBACK_THEMES: Record<ThemeMode, ThemeVars> = {
  dark: BLACK_THEME_VARS,
  black: BLACK_THEME_VARS,
  light: WHITE_THEME_VARS,
  white: WHITE_THEME_VARS,
};

export function getThemeStylesFromComposition(theme: ComposedTheme): React.CSSProperties {
  const vars: Record<string, string> = {};
  const colors = theme?.colors;

  if (colors) {
    vars["--p-bg"] = colors.background ?? "#050508";
    vars["--p-bg-card"] = colors.surface ?? "#0e0e14";
    vars["--p-bg-card-hover"] = colors.surfaceElevated ?? "#161620";
    vars["--p-border"] = colors.border ?? "#222230";
    vars["--p-border-subtle"] = colors.borderSubtle ?? "#141420";
    vars["--p-text"] = colors.text ?? "#ffffff";
    vars["--p-text-muted"] = colors.textMuted ?? "#94a3b8";
    vars["--p-text-secondary"] = colors.textSecondary ?? "#e2e8f0";
    vars["--p-primary"] = colors.primary ?? "#ffffff";
    vars["--p-secondary"] = colors.secondary ?? "#94a3b8";
    vars["--p-accent"] = colors.accent ?? "#ffffff";
    vars["--p-success"] = colors.success ?? "#10b981";
    vars["--p-warning"] = colors.warning ?? "#f59e0b";
    vars["--p-error"] = colors.error ?? "#ef4444";
    vars["--p-info"] = colors.info ?? "#ffffff";
    vars["--p-gradient-from"] = colors.primary ?? "#ffffff";
    vars["--p-gradient-via"] = colors.accent ?? "#e2e8f0";
    vars["--p-gradient-to"] = colors.primary ?? "#ffffff";
    vars["--p-overlay"] = colors.overlay ?? "rgba(0,0,0,0.85)";
  }

  if (theme?.gradients) {
    vars["--p-gradient-primary"] = theme.gradients.primary;
    vars["--p-gradient-secondary"] = theme.gradients.secondary;
    vars["--p-gradient-hero"] = theme.gradients.hero;
    vars["--p-gradient-card"] = theme.gradients.card;
    vars["--p-gradient-text"] = theme.gradients.text;
  }

  vars["--p-background-style"] = theme?.backgroundStyle || "flat";
  vars["--p-font-heading"] = theme?.typography?.headingFont ?? "'Inter', sans-serif";
  vars["--p-font-body"] = theme?.typography?.bodyFont ?? "'Inter', sans-serif";
  vars["--p-font-mono"] = theme?.typography?.monoFont ?? "'JetBrains Mono', monospace";

  if (theme?.spacing) {
    for (const [key, value] of Object.entries(theme.spacing)) {
      vars[\`--p-space-\${key}\`] = value;
    }
  }
  if (theme?.radius) {
    for (const [key, value] of Object.entries(theme.radius)) {
      vars[\`--p-radius-\${key}\`] = value;
    }
  }
  if (theme?.shadows) {
    for (const [key, value] of Object.entries(theme.shadows)) {
      vars[\`--p-shadow-\${key}\`] = value;
    }
  }

  return vars as React.CSSProperties;
}

export function getThemeVars(mode: ThemeMode): ThemeVars {
  return FALLBACK_THEMES[mode] ?? FALLBACK_THEMES.dark;
}

export function getThemeStyles(mode: ThemeMode): React.CSSProperties {
  const vars = getThemeVars(mode);
  return Object.fromEntries(Object.entries(vars)) as React.CSSProperties;
}

export function getBackgroundStyles(theme: ComposedTheme): React.CSSProperties {
  const style = theme?.backgroundStyle || "flat";
  const colors = theme?.colors;
  const bg = colors?.background ?? "#0f0f0f";
  const primary = colors?.primary ?? "#7c3aed";
  const secondary = colors?.secondary ?? "#4f46e5";
  const accent = colors?.accent ?? "#06b6d4";

  switch (style) {
    case "mesh-gradient":
      return {
        background: \`
          radial-gradient(ellipse 80% 60% at 0% 0%, \${primary}22 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 100% 10%, \${accent}18 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 50% 100%, \${secondary}15 0%, transparent 50%),
          \${bg}
        \`,
      };
    case "aurora":
      return {
        background: \`
          linear-gradient(180deg, \${primary}11 0%, transparent 30%),
          linear-gradient(0deg, \${accent}0d 0%, transparent 40%),
          radial-gradient(ellipse 100% 40% at 50% 20%, \${primary}08 0%, transparent 50%),
          radial-gradient(ellipse 80% 30% at 30% 80%, \${accent}06 0%, transparent 50%),
          \${bg}
        \`,
      };
    case "floating-blobs":
      return {
        background: \`
          radial-gradient(ellipse 50% 40% at 20% 30%, \${primary}20 0%, transparent 50%),
          radial-gradient(ellipse 40% 30% at 80% 20%, \${accent}18 0%, transparent 50%),
          radial-gradient(ellipse 30% 50% at 60% 70%, \${secondary}15 0%, transparent 50%),
          radial-gradient(ellipse 35% 35% at 10% 80%, \${primary}10 0%, transparent 50%),
          \${bg}
        \`,
      };
    case "flat":
    default:
      return { background: bg };
  }
}

export function getGoogleFontsUrl(theme: ComposedTheme): string {
  if (!theme?.typography) return "";
  const heading = (theme.typography?.headingFont ?? "").split(",")[0].replace(/'/g, "").trim();
  const body = (theme.typography?.bodyFont ?? "").split(",")[0].replace(/'/g, "").trim();
  const mono = (theme.typography?.monoFont ?? "").split(",")[0].replace(/'/g, "").trim();

  const fonts = new Set<string>();
  if (heading && !heading.includes("system-ui") && !heading.includes("sans-serif")) fonts.add(heading);
  if (body && !body.includes("system-ui") && !body.includes("sans-serif")) fonts.add(body);
  if (mono && !mono.includes("monospace")) fonts.add(mono);

  if (fonts.size === 0) return "";

  const families = Array.from(fonts)
    .map(f => \`family=\${f.replace(/\\s+/g, "+")}:wght@400;500;600;700;800\`)
    .join("&");

  return \`https://fonts.googleapis.com/css2?\${families}&display=swap\`;
}
`;
  files.push({ filename: "themes.ts", language: "typescript", path: "src/lib/portfolio/themes.ts", content: themesTs });

  // 9. layouts.ts
  const layoutsTs = `import type { LayoutStyle as LegacyLayoutStyle, PortfolioSections } from "./types";
import type { ComposedLayout } from "@/server/ai/composition/types";

type SectionKey = keyof PortfolioSections;

const DEFAULT_ORDER: SectionKey[] = [
  "hero", "about", "skills", "projects", "experience",
  "education", "achievements", "certifications", "socialLinks", "contact",
];

export function getSectionOrder(style: LegacyLayoutStyle, customOrder?: string[]): SectionKey[] {
  if (customOrder && customOrder.length > 0) {
    return customOrder.filter((s): s is SectionKey => s in DEFAULT_ORDER) as SectionKey[];
  }
  return DEFAULT_ORDER;
}

export function getGridColumns(style: LegacyLayoutStyle): number {
  return 1;
}

export function getVisibleSections(
  sections: PortfolioSections,
  style: LegacyLayoutStyle,
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

const FULL_BLEED_LAYOUTS = new Set(["cinematic", "immersive", "landing-sections"]);

export function getLayoutContainerClass(layout: ComposedLayout): string {
  if (FULL_BLEED_LAYOUTS.has(layout.style)) {
    return "w-full";
  }
  return "w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8";
}

export function getSectionSpacing(layout: ComposedLayout): string {
  return layout.sectionSpacing || "space-y-16";
}
`;
  files.push({ filename: "layouts.ts", language: "typescript", path: "src/lib/portfolio/layouts.ts", content: layoutsTs });

  // 10. layout-engine.ts
  const layoutEngineTs = `import type { PortfolioObject } from "./types";

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
    if (desc.length > maxDescChars) maxDescChars = desc.length;
    totalDescChars += desc.length;
  }

  const avgDescChars = items.length > 0 ? Math.round(totalDescChars / items.length) : 0;
  const needsClamp = maxDescChars > 240;

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

export type PortfolioFitMap = Record<string, SectionLayoutDirective>;

export function analyzePortfolioFit(portfolio: PortfolioObject): PortfolioFitMap {
  const result: PortfolioFitMap = {};
  return result;
}

export function getGridClass(fitMap: PortfolioFitMap, sectionKey: string, fallback: string): string {
  return fitMap[sectionKey]?.gridClass ?? fallback;
}

export function getClamp(fitMap: PortfolioFitMap, sectionKey: string): string | null {
  return fitMap[sectionKey]?.clampClass ?? null;
}
`;
  files.push({ filename: "layout-engine.ts", language: "typescript", path: "src/lib/portfolio/layout-engine.ts", content: layoutEngineTs });

  // 11. use-layout-fit.ts
  const useLayoutFitTs = `"use client";

import { useMemo } from "react";
import { analyzePortfolioFit, getClamp, getGridClass } from "@/lib/portfolio/layout-engine";
import type { PortfolioObject } from "@/lib/portfolio/types";
import type { PortfolioFitMap } from "@/lib/portfolio/layout-engine";

export function useLayoutFit(portfolio: PortfolioObject): PortfolioFitMap {
  return useMemo(() => analyzePortfolioFit(portfolio), [portfolio]);
}

export function useSectionGrid(
  portfolio: PortfolioObject,
  sectionKey: string,
  fallback: string
): { gridClass: string; clampClass: string | null } {
  const fit = useLayoutFit(portfolio);
  return {
    gridClass: getGridClass(fit, sectionKey, fallback),
    clampClass: getClamp(fit, sectionKey),
  };
}
`;
  files.push({ filename: "use-layout-fit.ts", language: "typescript", path: "src/hooks/use-layout-fit.ts", content: useLayoutFitTs });

  // 12. ui/neumorphism.tsx
  const neumorphismTsx = `"use client";

import React from "react";

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function NeumorphicCard({ children, className, variant = "outset", style, ...props }: any) {
  return (
    <div
      style={{ boxShadow: variant === "inset" ? "var(--neu-inset)" : "var(--neu-outset)", ...style }}
      className={cn(
        "rounded-2xl transition-all duration-300 p-6 relative overflow-hidden bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] border border-[var(--p-border,#222230)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function NeumorphicButton({ className, variant = "primary", size = "md", icon, children, style, ...props }: any) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 select-none",
        size === "sm" && "px-3.5 py-1.5 text-xs gap-1.5",
        size === "md" && "px-5 py-2.5 text-sm gap-2",
        size === "lg" && "px-7 py-3.5 text-base gap-2.5",
        variant === "primary" && "bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] border border-[var(--p-border,#222230)] hover:border-white/40",
        variant === "glow" && "bg-[var(--p-text,#ffffff)] text-[var(--p-bg,#050508)] font-black border-none shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105",
        variant === "inset" && "bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text-secondary,#e2e8f0)] border border-[var(--p-border,#222230)]",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export function NeumorphicInput({ className, icon, style, ...props }: any) {
  return (
    <div className="relative flex items-center w-full">
      {icon && <div className="absolute left-3.5 text-[var(--p-text-muted,#94a3b8)]">{icon}</div>}
      <input
        style={{ boxShadow: "var(--neu-inset)", ...style }}
        className={cn(
          "w-full rounded-xl bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] text-sm py-3 transition-all outline-none border border-[var(--p-border,#222230)] focus:border-white/40",
          icon ? "pl-10 pr-4" : "px-4",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function NeumorphicTextarea({ className, style, ...props }: any) {
  return (
    <textarea
      style={{ boxShadow: "var(--neu-inset)", ...style }}
      className={cn(
        "w-full rounded-xl bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] text-sm p-4 transition-all outline-none border border-[var(--p-border,#222230)] focus:border-white/40",
        className
      )}
      {...props}
    />
  );
}

export function NeumorphicBadge({ children, className, variant = "default" }: any) {
  return (
    <span
      style={{ boxShadow: "var(--neu-outset)" }}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200 select-none",
        variant === "default" && "bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] border-[var(--p-border,#222230)]",
        variant === "active" && "bg-[var(--p-bg-card,#0e0e14)] text-[var(--p-text,#ffffff)] border-[var(--p-primary,#00f0ff)]",
        variant === "glow" && "bg-[var(--p-text,#ffffff)] text-[var(--p-bg,#050508)] border-none font-bold",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
      {children}
    </span>
  );
}

export function NeumorphicProgress({ value, label }: any) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex justify-between text-xs font-bold text-[var(--p-text-secondary,#e2e8f0)]">
          <span>{label}</span>
          <span className="font-mono text-[var(--p-text,#ffffff)]">{value}%</span>
        </div>
      )}
      <div style={{ boxShadow: "var(--neu-inset)" }} className="w-full h-3 rounded-full bg-[var(--p-bg-card,#0e0e14)] p-0.5 overflow-hidden border border-[var(--p-border,#222230)]">
        <div className="h-full rounded-full bg-[var(--p-text,#ffffff)] transition-all duration-700 ease-out" style={{ width: \`\${value}%\` }} />
      </div>
    </div>
  );
}
`;
  files.push({ filename: "neumorphism.tsx", language: "typescript", path: "src/components/ui/neumorphism.tsx", content: neumorphismTsx });

  // 13. Interactive 3D & Graphics Subcomponents
  files.push({
    filename: "anime-three-canvas.tsx",
    language: "typescript",
    path: "src/components/portfolio/interactive/anime-three-canvas.tsx",
    content: `"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import anime from "animejs";

interface AnimeThreeCanvasProps {
  className?: string;
  gridSize?: number;
}

export function AnimeThreeCanvas({ className = "", gridSize = 4 }: AnimeThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const detectLightMode = () => {
      if (typeof document === "undefined") return false;
      const root = document.querySelector(".ap-portfolio-root") || document.querySelector(".portfolio-root") || document.body;
      return (
        root.classList.contains("theme-white") ||
        root.classList.contains("theme-light") ||
        document.documentElement.classList.contains("light")
      );
    };

    const isLight = detectLightMode();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isLight ? 0xffffff : 0x050508, 0.012);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    scene.add(camera);

    scene.add(new THREE.AmbientLight(isLight ? 0x18181b : 0xffffff, isLight ? 0.9 : 0.45));

    const pointLight = new THREE.PointLight(isLight ? 0x000000 : 0xffffff, isLight ? 12 : 8, 35, 0.3);
    pointLight.position.set(0, 0, 4.5);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(isLight ? 0x09090b : 0xe2e8f0, isLight ? 3.5 : 2.0);
    dirLight.position.set(3, 5, 6);
    scene.add(dirLight);

    const count = gridSize * gridSize * gridSize;
    const cellSize = 2.2 / gridSize;
    const spread = ((gridSize - 1) / 2) * cellSize * 1.35;
    const geometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);

    const material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(isLight ? "#09090b" : "#e2e8f0"),
      emissive: new THREE.Color(isLight ? "#18181b" : "#050508"),
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const dummy = new THREE.Object3D();
    const instanceTargets: Array<{
      baseX: number; baseY: number; baseZ: number;
      currX: number; currY: number; currZ: number;
      rx: number; ry: number; rz: number;
    }> = [];

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const bx = -spread + (x / (gridSize - 1 || 1)) * (spread * 2);
          const by = -spread + (y / (gridSize - 1 || 1)) * (spread * 2);
          const bz = -spread + (z / (gridSize - 1 || 1)) * (spread * 2);

          instanceTargets.push({
            baseX: bx, baseY: by, baseZ: bz,
            currX: bx, currY: by, currZ: bz,
            rx: 0, ry: 0, rz: 0,
          });
        }
      }
    }

    const meshRotationTarget = { rx: 0, ry: 0 };
    const meshAnim = anime({
      targets: meshRotationTarget,
      ry: Math.PI * 2,
      rx: Math.PI * 2,
      duration: 24000,
      loop: true,
      easing: "linear",
      update: () => {
        mesh.rotation.y = meshRotationTarget.ry;
        mesh.rotation.x = meshRotationTarget.rx;
      },
    });

    const lightTarget = { intensity: isLight ? 12 : 14 };
    const lightAnim = anime({
      targets: lightTarget,
      intensity: isLight ? [24, 4] : [28, 3],
      duration: 6000,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
      update: () => {
        pointLight.intensity = lightTarget.intensity;
      },
    });

    let animationFrameId: number;
    const animateFrame = () => {
      for (let i = 0; i < count; i++) {
        const t = instanceTargets[i];
        dummy.position.set(t.currX, t.currY, t.currZ);
        dummy.rotation.set(t.rx, t.ry, t.rz);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animateFrame);
    };

    animateFrame();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      meshAnim.pause();
      lightAnim.pause();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [gridSize]);

  return (
    <div
      ref={containerRef}
      className={\`fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden \${className}\`}
    />
  );
}
`
  });

  files.push({
    filename: "gb-afterlife-canvas.tsx",
    language: "typescript",
    path: "src/components/portfolio/interactive/gb-afterlife-canvas.tsx",
    content: `"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function GBAfterlifeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = Math.floor(Math.min(width, height) / 14);
    const particles: Array<{
      x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        hue: Math.random() > 0.5 ? 185 : 320,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = \`hsla(\${p.hue}, 100%, 65%, \${p.alpha})\`;
        ctx.shadowColor = \`hsla(\${p.hue}, 100%, 65%, 0.8)\`;
        ctx.shadowBlur = 8;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x; const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = \`hsla(\${p.hue}, 100%, 70%, \${(1 - dist / 110) * 0.15})\`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40 dark:opacity-70" />
      <motion.div
        className="fixed rounded-full pointer-events-none z-10 transition-transform duration-75 ease-out"
        animate={{ x: mousePos.x - 200, y: mousePos.y - 200 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.2 }}
        style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, rgba(255, 0, 127, 0.04) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}

export function GBKineticTitle({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 35, rotateX: -60, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className={\`flex flex-wrap gap-x-4 gap-y-2 \${className ?? ""}\`}>
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariants} className="inline-block transform-gpu">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
`
  });

  files.push({
    filename: "developer-mascot.tsx",
    language: "typescript",
    path: "src/components/portfolio/interactive/developer-mascot.tsx",
    content: `"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Code2, Cpu, Terminal } from "lucide-react";

interface DeveloperMascotProps {
  name?: string;
  role?: string;
  skills?: string[];
  className?: string;
  showSpeechBubble?: boolean;
}

const MESSAGES = [
  "Hi! Welcome to my digital workspace! 🚀",
  "Building high-performance scalable web systems!",
  "Full-stack MERN & AI engineering enthusiast!",
  "Explore my projects & reach out for collaborations! ✨",
];

export function DeveloperMascot({
  name = "Developer",
  role = "Full Stack Engineer",
  skills = ["React.js", "Node.js", "Express.js", "MongoDB"],
  className = "",
  showSpeechBubble = true,
}: DeveloperMascotProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setIsWaving(true);
    setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    setTimeout(() => setIsWaving(false), 2000);
  };

  return (
    <div className={\`relative inline-flex flex-col items-center select-none \${className}\`}>
      {showSpeechBubble && (
        <div className="relative mb-3 z-20 max-w-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="px-4 py-2.5 rounded-2xl border border-purple-500/30 bg-purple-950/80 backdrop-blur-md shadow-xl text-xs font-medium text-purple-100 flex items-center gap-2 cursor-pointer"
              onClick={handleClick}
            >
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
              <span>{MESSAGES[messageIndex]}</span>
            </motion.div>
          </AnimatePresence>
          <div className="w-3 h-3 bg-purple-950/80 border-r border-b border-purple-500/30 rotate-45 mx-auto -mt-1.5 shadow-sm" />
        </div>
      )}

      <div className="relative w-48 h-48 sm:w-56 sm:h-56 cursor-pointer group" onClick={handleClick}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/30 via-rose-600/20 to-cyan-500/20 blur-2xl group-hover:blur-3xl transition-all duration-500 animate-pulse" />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-full h-full flex items-center justify-center"
        >
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-2 border-purple-500/40 p-4 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-20 h-14 rounded-2xl bg-purple-950/90 border border-purple-400/50 flex items-center justify-center gap-3 relative shadow-inner">
              <motion.div animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 3.5, repeat: Infinity }} className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
              <motion.div animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.2 }} className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
            </div>
            <p className="text-[11px] font-mono text-purple-300 font-bold mt-3 tracking-wider">{role}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
`
  });

  files.push({
    filename: "liquid-image.tsx",
    language: "typescript",
    path: "src/components/portfolio/interactive/liquid-image.tsx",
    content: `"use client";

import React from "react";

export function SvgLiquidFilterProvider() {
  return (
    <svg className="hidden pointer-events-none absolute w-0 h-0" aria-hidden="true">
      <defs>
        <filter id="liquid-distortion-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

export function LiquidDistortionImage({ src, alt = "", className = "", fallbackIcon }: any) {
  if (!src) {
    return (
      <div className={\`bg-white/05 border border-white/10 flex items-center justify-center text-slate-400 \${className}\`}>
        {fallbackIcon || <span className="text-3xl">💻</span>}
      </div>
    );
  }
  return <img src={src} alt={alt} className={\`object-cover \${className}\`} />;
}
`
  });

  files.push({
    filename: "ui8-3d-illustrations.tsx",
    language: "typescript",
    path: "src/components/portfolio/interactive/ui8-3d-illustrations.tsx",
    content: `"use client";

import React from "react";
import { motion } from "framer-motion";

export type EmojiType = "rocket" | "code" | "design" | "lightning" | "diamond" | "idea" | "fire" | "trophy" | "package" | "target" | "brain" | "magic";

const EMOJI_MAP: Record<EmojiType, string> = {
  rocket: "🚀", code: "💻", design: "🎨", lightning: "⚡", diamond: "💎", idea: "💡", fire: "🔥", trophy: "🏆", package: "📦", target: "🎯", brain: "🧠", magic: "🔮",
};

export function Emoji3D({ type, size = "md", className = "", animate = true }: { type: EmojiType; size?: "sm" | "md" | "lg" | "xl"; className?: string; animate?: boolean }) {
  const emoji = EMOJI_MAP[type] || "🚀";
  const sizeClasses = { sm: "text-xl w-8 h-8", md: "text-3xl w-12 h-12", lg: "text-5xl w-16 h-16", xl: "text-7xl w-24 h-24" }[size];

  return (
    <motion.div
      whileHover={{ scale: 1.15, rotateZ: 8 }}
      animate={animate ? { y: [0, -6, 0] } : undefined}
      transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.2 } }}
      className={\`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/05 backdrop-blur-md border border-white/15 shadow-2xl select-none cursor-pointer \${sizeClasses} \${className}\`}
    >
      <span>{emoji}</span>
    </motion.div>
  );
}

export function BuyMeACoffeeBadge({ name, role, avatar }: { name: string; role?: string; avatar?: string }) {
  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--p-bg-card,#0e0e14)] border border-[var(--p-border,#222230)] shadow-md backdrop-blur-md">
      {avatar ? (
        <img src={avatar} alt={name} className="w-7 h-7 rounded-full object-cover border border-cyan-400/50" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 text-black font-black text-xs flex items-center justify-center shadow-md">
          {name.charAt(0)}
        </div>
      )}
      <div className="flex flex-col text-left">
        <span className="text-xs font-black text-[var(--p-text,#ffffff)] leading-none tracking-tight">{name}</span>
        {role && <span className="text-[10px] font-semibold text-[var(--p-primary,#00f0ff)] leading-tight">{role}</span>}
      </div>
    </div>
  );
}
`
  });

  files.push({
    filename: "tilt-card.tsx",
    language: "typescript",
    path: "src/components/portfolio/interactive/tilt-card.tsx",
    content: `"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "gold" | "emerald" | "default";
}

export function TiltCard({ children, className = "", glowColor = "cyan" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rX = ((mouseY - height / 2) / (height / 2)) * -12;
    const rY = ((mouseX - width / 2) / (width / 2)) * 12;
    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({ x: (mouseX / width) * 100, y: (mouseY / height) * 100, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const glowBorderClass =
    glowColor === "gold"
      ? "hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]"
      : glowColor === "emerald"
      ? "hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]"
      : "hover:border-[var(--p-primary,#00f0ff)] hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]";

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        style={{ transformStyle: "preserve-3d" }}
        className={\`relative rounded-3xl border border-[var(--p-border,#222230)] bg-[var(--p-bg-card,#0e0e14)] backdrop-blur-xl p-6 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] \${glowBorderClass} \${className}\`}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-10"
          style={{
            background: \`radial-gradient(circle at \${glarePos.x}% \${glarePos.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)\`,
            opacity: glarePos.opacity,
          }}
        />
        <div className="relative z-20" style={{ transform: "translateZ(20px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
`
  });

  files.push({
    filename: "bounce-cards.tsx",
    language: "typescript",
    path: "src/components/portfolio/interactive/bounce-cards.tsx",
    content: `"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function BounceCards({
  className = "",
  images = [],
  cards = [],
  containerWidth = "100%",
  containerHeight = 300,
  animationDelay = 0.1,
  animationStagger = 0.05,
  easeType = "elastic.out(1, 0.6)",
  transformStyles = [
    "rotate(8deg) translate(-140px, 5px)",
    "rotate(4deg) translate(-70px, 0px)",
    "rotate(0deg) translate(0px, -4px)",
    "rotate(-4deg) translate(70px, 0px)",
    "rotate(-8deg) translate(140px, 5px)",
  ],
}: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items: any[] = cards.length > 0 ? cards : images.map((src: string, i: number) => ({ id: \`img-\${i}\`, image: src }));
  const itemCount = items.length;

  useEffect(() => {
    if (!containerRef.current || itemCount === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".card",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
          duration: 0.6,
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [itemCount, animationStagger, easeType, animationDelay]);

  return (
    <div
      ref={containerRef}
      className={\`relative flex items-center justify-center \${className}\`}
      style={{ width: containerWidth, height: containerHeight }}
    >
      {items.map((item, i) => {
        const baseTransform = transformStyles[i % transformStyles.length] || "rotate(0deg) translate(0px, 0px)";
        return (
          <div
            key={item.id || i}
            className={\`card card-\${i} absolute w-64 sm:w-72 rounded-2xl border border-[var(--p-border,rgba(255,255,255,0.1))] bg-[var(--p-bg-card,#0e0e14)] p-5 shadow-2xl cursor-pointer select-none\`}
            style={{ transform: baseTransform, zIndex: i + 1 }}
          >
            {item.image && (
              <img src={item.image} alt={item.title || ""} className="w-full h-32 object-cover rounded-xl mb-3 border border-white/10" />
            )}
            {item.title && <h4 className="text-sm font-black text-[var(--p-text,#ffffff)] leading-snug">{item.title}</h4>}
            {item.description && <p className="text-xs text-[var(--p-text-muted,#94a3b8)] mt-2 line-clamp-2 leading-relaxed">{item.description}</p>}
          </div>
        );
      })}
    </div>
  );
}
`
  });

  files.push({
    filename: "depth-carousel.css",
    language: "css",
    path: "src/components/portfolio/interactive/depth-carousel.css",
    content: `.depth-carousel {
  position: relative; width: 100%; height: 100%; min-height: 420px;
  display: flex; align-items: center; justify-content: center;
  perspective: var(--dc-perspective, 1400px); user-select: none;
}
.depth-carousel__stage { position: absolute; inset: 0; transform-style: preserve-3d; }
.depth-carousel__card {
  position: absolute; top: 50%; left: 50%; overflow: hidden;
  background: var(--p-bg-card, #0e0e14); border: 1px solid var(--p-border, rgba(255, 255, 255, 0.12));
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.75); transform: translate(-50%, -50%);
}
.depth-carousel__img { width: 100%; height: 100%; object-fit: cover; }
`
  });

  files.push({
    filename: "depth-carousel.tsx",
    language: "typescript",
    path: "src/components/portfolio/interactive/depth-carousel.tsx",
    content: `"use client";

import React, { useMemo } from "react";
import "./depth-carousel.css";

export function DepthCarousel({ items = [], cardWidth = 320, cardHeight = 420, className = "" }: any) {
  const data = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  return (
    <div className={\`depth-carousel \${className}\`}>
      <div className="depth-carousel__stage">
        {data.map((item: any, i: number) => (
          <div
            key={i}
            className="depth-carousel__card"
            style={{ width: cardWidth, height: cardHeight, borderRadius: 24 }}
          >
            {item.image && <img className="depth-carousel__img" src={item.image} alt={item.title || ""} />}
            {item.title && (
              <div className="p-4 absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-lg font-black text-white">{item.title}</h3>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
`
  });

  // Spatial 3D Engine Modules
  files.push({
    filename: "asset-registry.ts",
    language: "typescript",
    path: "src/lib/spatial/asset-registry.ts",
    content: `export type SpatialAssetCategory = "character" | "technology" | "object" | "ui";

export interface SpatialAssetItem {
  id: string;
  name: string;
  category: SpatialAssetCategory;
  svgIcon?: string;
  pose?: string;
  defaultScale?: number;
}

export const SPATIAL_ASSET_REGISTRY: Record<string, SpatialAssetItem> = {
  "developer-idle": { id: "developer-idle", name: "Developer (Idle)", category: "character", pose: "idle", defaultScale: 1 },
  "developer-coding": { id: "developer-coding", name: "Developer (Coding)", category: "character", pose: "coding", defaultScale: 1 },
  "developer-pointing": { id: "developer-pointing", name: "Developer (Pointing)", category: "character", pose: "pointing", defaultScale: 1 },
  "developer-walking": { id: "developer-walking", name: "Developer (Walking)", category: "character", pose: "walking", defaultScale: 1 },
  "developer-celebrating": { id: "developer-celebrating", name: "Developer (Celebrating)", category: "character", pose: "celebrating", defaultScale: 1 },
  react: { id: "react", name: "React.js", category: "technology", defaultScale: 1 },
  node: { id: "node", name: "Node.js", category: "technology", defaultScale: 1 },
  mongodb: { id: "mongodb", name: "MongoDB", category: "technology", defaultScale: 1 },
  express: { id: "express", name: "Express.js", category: "technology", defaultScale: 1 },
  javascript: { id: "javascript", name: "JavaScript", category: "technology", defaultScale: 1 },
  typescript: { id: "typescript", name: "TypeScript", category: "technology", defaultScale: 1 },
  html: { id: "html", name: "HTML5", category: "technology", defaultScale: 1 },
  css: { id: "css", name: "CSS3", category: "technology", defaultScale: 1 },
  git: { id: "git", name: "Git", category: "technology", defaultScale: 1 },
  github: { id: "github", name: "GitHub", category: "technology", defaultScale: 1 },
  s3: { id: "s3", name: "AWS S3 / Cloud", category: "technology", defaultScale: 1 },
  laptop: { id: "laptop", name: "MacBook Pro Laptop", category: "object", defaultScale: 1 },
  phone: { id: "phone", name: "Cyber Phone", category: "object", defaultScale: 1 },
  codepanel: { id: "codepanel", name: "Code IDE Panel", category: "ui", defaultScale: 1 },
  rocket: { id: "rocket", name: "Launch Rocket", category: "object", defaultScale: 1 },
  graduation: { id: "graduation", name: "Graduation Cap", category: "object", defaultScale: 1 },
  books: { id: "books", name: "Stack of Books", category: "object", defaultScale: 1 },
  certificate: { id: "certificate", name: "Verified Credential", category: "object", defaultScale: 1 },
  cloud: { id: "cloud", name: "Cloud Infrastructure", category: "object", defaultScale: 1 },
  database: { id: "database", name: "Database Node", category: "object", defaultScale: 1 },
};

export function getSpatialAsset(id: string): SpatialAssetItem {
  return SPATIAL_ASSET_REGISTRY[id] || SPATIAL_ASSET_REGISTRY["laptop"];
}
`
  });

  files.push({
    filename: "visual-asset-mapper.ts",
    language: "typescript",
    path: "src/lib/spatial/visual-asset-mapper.ts",
    content: `import type { PortfolioObject } from "@/lib/portfolio/types";
import { getSpatialAsset, type SpatialAssetItem } from "./asset-registry";

export interface MappedSpatialScene {
  characterPose: string;
  primaryObjects: SpatialAssetItem[];
  secondaryObjects: SpatialAssetItem[];
  techObjects: SpatialAssetItem[];
}

export function mapPortfolioToSpatialAssets(portfolio: PortfolioObject): MappedSpatialScene {
  const skills = portfolio.sections?.skills || [];
  const skillNames = skills.map((s) => s.name.toLowerCase());
  const techObjects: SpatialAssetItem[] = [];

  const addTechIfMatches = (keyword: string, assetId: string) => {
    if (skillNames.some((s) => s.includes(keyword))) {
      techObjects.push(getSpatialAsset(assetId));
    }
  };

  addTechIfMatches("react", "react");
  addTechIfMatches("node", "node");
  addTechIfMatches("mongo", "mongodb");
  addTechIfMatches("express", "express");
  addTechIfMatches("script", "javascript");
  addTechIfMatches("type", "typescript");
  addTechIfMatches("git", "git");

  if (techObjects.length === 0) {
    techObjects.push(getSpatialAsset("react"), getSpatialAsset("node"), getSpatialAsset("javascript"));
  }

  return {
    characterPose: "developer-idle",
    primaryObjects: [getSpatialAsset("laptop"), getSpatialAsset("codepanel")],
    secondaryObjects: [getSpatialAsset("phone"), getSpatialAsset("cloud"), getSpatialAsset("database")],
    techObjects,
  };
}
`
  });

  files.push({
    filename: "motion-presets.ts",
    language: "typescript",
    path: "src/lib/spatial/motion-presets.ts",
    content: `export const SPATIAL_MOTION_PRESETS = {
  heroFloat: { start: { y: 0, rotateZ: -2, scale: 1 }, end: { y: -60, rotateZ: 4, scale: 0.95 } },
  slowParallax: { start: { y: 0, opacity: 0.8 }, end: { y: -120, opacity: 1 } },
  enterLeft: { start: { x: "-40vw", opacity: 0 }, end: { x: "0vw", opacity: 1 } },
  enterRight: { start: { x: "40vw", opacity: 0 }, end: { x: "0vw", opacity: 1 } },
};
`
  });

  files.push({
    filename: "SpatialObject.tsx",
    language: "typescript",
    path: "src/components/spatial/SpatialObject.tsx",
    content: `"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Cpu, Terminal, Zap, Database, Rocket, BookOpen, Award, CheckCircle } from "lucide-react";
import { DeveloperMascot } from "@/components/portfolio/interactive/developer-mascot";

export function SpatialObject({ assetId, className = "", style, scale = 1, label }: any) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const ox = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 10;
      const oy = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * 10;
      setMouseOffset({ x: ox, y: oy });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const renderGraphic = () => {
    if (assetId.startsWith("developer")) {
      return <DeveloperMascot name={label || "Developer"} role="Full Stack Developer" showSpeechBubble={false} />;
    }
    switch (assetId) {
      case "react":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 p-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <Code2 className="w-8 h-8 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-cyan-200">React.js</span>
          </div>
        );
      case "node":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-950/80 border border-emerald-400/40 p-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <Cpu className="w-8 h-8 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold text-emerald-200">Node.js</span>
          </div>
        );
      case "mongodb":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-green-950/80 border border-green-400/40 p-3 shadow-[0_0_30px_rgba(34,197,94,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <Database className="w-8 h-8 text-green-400" />
            <span className="text-[10px] font-mono font-bold text-green-200">MongoDB</span>
          </div>
        );
      case "codepanel":
        return (
          <div className="w-64 sm:w-72 rounded-2xl bg-slate-950/90 border border-purple-500/30 p-4 shadow-2xl backdrop-blur-xl font-mono text-[11px]">
            <div className="flex items-center gap-1.5 mb-3 border-b border-white/10 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-400 ml-2">developer.config.ts</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <p className="text-purple-400"><span className="text-sky-400">const</span> developer = &#123;</p>
              <p className="pl-4">role: <span className="text-amber-300">"Full Stack Architect"</span>,</p>
              <p className="pl-4">status: <span className="text-cyan-300">"Building Scalable Systems 🚀"</span></p>
              <p className="text-purple-400">&#125;;</p>
            </div>
          </div>
        );
      case "graduation":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-950/80 border border-indigo-400/40 p-3 shadow-[0_0_30px_rgba(99,102,241,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <BookOpen className="w-8 h-8 text-indigo-400" />
            <span className="text-[10px] font-mono font-bold text-indigo-200">Education</span>
          </div>
        );
      case "certificate":
        return (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-950/80 border border-amber-400/40 p-3 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex flex-col items-center justify-center gap-1 backdrop-blur-md">
            <Award className="w-8 h-8 text-amber-400" />
            <span className="text-[10px] font-mono font-bold text-amber-200">Certified</span>
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 p-3 flex items-center justify-center backdrop-blur-md shadow-lg">
            <CheckCircle className="w-6 h-6 text-sky-400" />
          </div>
        );
    }
  };

  return (
    <motion.div animate={{ x: mouseOffset.x, y: mouseOffset.y }} style={{ transform: \`scale(\${scale})\`, ...style }} className={\`spatial-object inline-flex items-center justify-center select-none \${className}\`}>
      {renderGraphic()}
    </motion.div>
  );
}
`
  });

  files.push({
    filename: "spatial-portfolio-renderer.tsx",
    language: "typescript",
    path: "src/components/portfolio/spatial-portfolio-renderer.tsx",
    content: `"use client";

import React from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import { SpatialObject } from "@/components/spatial/SpatialObject";
import { ArrowRight, Mail, MapPin, Code } from "lucide-react";
import { AnimeThreeCanvas } from "./interactive/anime-three-canvas";
import { GBAfterlifeBackground } from "./interactive/gb-afterlife-canvas";

export function SpatialPortfolioRenderer({ portfolio, className = "" }: { portfolio: PortfolioObject; className?: string }) {
  const name = portfolio.personalInfo?.name ?? "Developer";
  const nameWords = name.toUpperCase().split(" ");
  const firstName = nameWords[0] ?? "PORTFOLIO";
  const lastName = nameWords.slice(1).join(" ");
  const role = portfolio.personalInfo?.role ?? "Software Engineer & Architect";
  const tagline = portfolio.personalInfo?.tagline ?? "Building high-performance digital experiences.";
  const location = portfolio.sections?.contact?.location ?? portfolio.personalInfo?.location ?? "Surat, Gujarat, India";
  const email = portfolio.sections?.contact?.email ?? portfolio.personalInfo?.email ?? "contact@example.com";

  const skills = portfolio.sections?.skills ?? [];
  const experience = portfolio.sections?.experience ?? [];
  const education = portfolio.sections?.education ?? [];
  const certifications = portfolio.sections?.certifications ?? [];

  return (
    <div className={\`relative w-full min-h-screen bg-[#050508] text-white overflow-x-hidden font-sans \${className}\`}>
      <AnimeThreeCanvas />
      <GBAfterlifeBackground />

      <header className="sticky top-0 z-50 w-full bg-[#050508]/80 backdrop-blur-xl border-b border-white/10 px-6 sm:px-12 h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase">
            {firstName} <span className="text-cyan-400">{lastName}</span>
          </span>
        </a>

        <a href="#contact" className="px-5 py-2 rounded-full border border-white/20 bg-white/05 hover:bg-white/15 text-xs font-bold uppercase tracking-wider text-white transition-all">
          <span>Let's Connect</span>
        </a>
      </header>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 space-y-32 sm:space-y-48 pt-12 pb-32">
        <section id="hero" className="min-h-[88vh] flex flex-col justify-between relative py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Available for Hire</span>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{location}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto relative">
            <div className="lg:col-span-8 space-y-6">
              <h1 className="text-[clamp(3.5rem,11vw,10.5rem)] font-black tracking-tighter leading-[0.92] text-white uppercase">
                <div>{firstName}</div>
                {lastName && <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400">{lastName}</div>}
              </h1>
              <p className="text-lg sm:text-2xl font-bold text-slate-300 max-w-2xl">{role}</p>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl">{tagline}</p>
            </div>

            <div className="lg:col-span-4 flex justify-center items-center relative">
              <SpatialObject assetId="developer-idle" label={name} scale={1.1} />
            </div>
          </div>
        </section>

        {experience.length > 0 && (
          <section id="experience" className="py-16 border-t border-white/10 space-y-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">Career Journey</span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mt-1">Work Experience</h2>
            </div>
            <div className="space-y-8">
              {experience.map((exp, i) => (
                <div key={i} className="p-8 sm:p-12 rounded-3xl bg-white/05 border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{exp.role || exp.company}</h3>
                  <p className="text-sm font-bold text-cyan-400">{exp.company}</p>
                  {exp.description && <p className="text-base text-slate-300 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="contact" className="py-20 border-t border-white/10 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">Let's Connect</span>
            <h2 className="text-[clamp(3rem,8vw,7.5rem)] font-black tracking-tighter text-white uppercase">LET'S BUILD SOMETHING.</h2>
            <a href={\`mailto:\${email}\`} className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-cyan-400 text-black font-black text-sm uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-white/10 py-10 text-center text-xs font-mono text-slate-500">
        &copy; {new Date().getFullYear()} {name} — AiPort Spatial 3D Portfolio Engine
      </footer>
    </div>
  );
}
`
  });

  // 14. portfolio-renderer.tsx & section components
  files.push({
    filename: "portfolio-renderer.tsx",
    language: "typescript",
    path: "src/components/portfolio/portfolio-renderer.tsx",
    content: `"use client";

import React from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import type { CompositionGraph } from "@/server/ai/composition/types";
import { getThemeStylesFromComposition, getGoogleFontsUrl, getBackgroundStyles, getThemeStyles } from "@/lib/portfolio/themes";
import { getLayoutContainerClass, getSectionSpacing, getVisibleSections } from "@/lib/portfolio/layouts";
import { DynamicNavigation } from "./dynamic-navigation";
import { CapsuleNavbar } from "./capsule-navbar";
import { renderSection } from "@/lib/portfolio/registry";
import { CompositionAnimator } from "./composition-animator";
import { AnimeThreeCanvas } from "./interactive/anime-three-canvas";
import { GBAfterlifeBackground } from "./interactive/gb-afterlife-canvas";
import { SvgLiquidFilterProvider } from "./interactive/liquid-image";
import { SpatialPortfolioRenderer } from "./spatial-portfolio-renderer";

interface PortfolioRendererProps {
  portfolio: PortfolioObject;
  composition?: CompositionGraph | null;
  className?: string;
}

export function PortfolioRenderer({ portfolio, composition, className }: PortfolioRendererProps) {
  const themeMode = (portfolio.theme?.mode as string) || (composition?.theme?.mode as string);
  const isSpatialTheme = themeMode === "spatial-3d" || themeMode === "spatial" || themeMode === "black" || themeMode === "dark" || !themeMode;

  if (isSpatialTheme) {
    return <SpatialPortfolioRenderer portfolio={portfolio} className={className} />;
  }

  if (composition) {
    return <CompositionRenderer portfolio={portfolio} composition={composition} className={className} />;
  }

  return <LegacyRenderer portfolio={portfolio} className={className} />;
}

function BackgroundDecorations({ theme }: { theme: CompositionGraph["theme"] }) {
  return (
    <>
      <AnimeThreeCanvas />
      <GBAfterlifeBackground />
      <SvgLiquidFilterProvider />
    </>
  );
}

function CompositionRenderer({ portfolio, composition, className }: PortfolioRendererProps & { composition: CompositionGraph }) {
  const themeStyles = getThemeStylesFromComposition(composition.theme);
  const bgStyles = getBackgroundStyles(composition.theme);
  const containerClass = getLayoutContainerClass(composition.layout);
  const spacing = getSectionSpacing(composition.layout);

  const compositionSectionIds = composition.sections ? composition.sections.map((s) => s.id) : [];
  const ALL_KNOWN_KEYS = [
    "hero", "about", "skills", "projects", "experience", "education",
    "services", "certifications", "awards", "products", "contact",
    "languages", "metrics", "faq", "articles", "socialLinks", "gallery",
    "testimonials", "publications", "clients", "roadmap", "speaking",
    "organizations", "achievements"
  ];

  const extraPopulatedKeys = ALL_KNOWN_KEYS.filter((key) => {
    if (compositionSectionIds.includes(key)) return false;
    const sec = (portfolio.sections as any)?.[key];
    if (!sec) return false;
    if (Array.isArray(sec)) return sec.length > 0;
    if (typeof sec === "object") return Object.keys(sec).length > 0;
    return !!sec;
  });

  const sectionOrder = [...compositionSectionIds, ...extraPopulatedKeys];
  const fontsUrl = getGoogleFontsUrl(composition.theme);
  const sectionVariants = new Map((composition.sections || []).map((s) => [s.id, s.variant]));
  const combinedStyles = { ...themeStyles, ...bgStyles } as React.CSSProperties;

  return (
    <div className={\`ap-portfolio-root \${className ?? ""}\`} style={combinedStyles}>
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}
      <BackgroundDecorations theme={composition.theme} />

      <DynamicNavigation
        navigation={composition.navigation}
        theme={composition.theme}
        portfolioName={portfolio.personalInfo?.name || "Portfolio"}
      />

      <main className={\`\${containerClass} flex flex-col gap-12 md:gap-16 pb-20\`}>
        {sectionOrder.map((key) => (
          <div key={key} id={key} className="w-full min-w-0">
            {renderSectionWithVariant(key, portfolio, sectionVariants.get(key), composition)}
          </div>
        ))}
      </main>

      <footer
        className="border-t py-8 px-6 text-center"
        style={{
          borderColor: composition.theme?.colors?.border || "#222230",
          background: composition.theme?.colors?.background || "#050508",
          color: composition.theme?.colors?.textMuted || "#94a3b8",
        }}
      >
        <p className="text-xs">
          &copy; {new Date().getFullYear()} {portfolio.personalInfo?.name || "Developer"}
        </p>
      </footer>
    </div>
  );
}

function renderSectionWithVariant(
  key: string,
  portfolio: PortfolioObject,
  variant: string | undefined,
  composition: CompositionGraph
): React.ReactNode {
  const node = renderSection(key as any, portfolio);
  if (!node) return null;

  return (
    <CompositionAnimator motion={composition.motion}>
      <div data-section={key} data-variant={variant ?? "default"} className="portfolio-section">
        {node}
      </div>
    </CompositionAnimator>
  );
}

function LegacyRenderer({ portfolio, className }: { portfolio: PortfolioObject; className?: string }) {
  const isLight = portfolio.theme?.mode === "light" || portfolio.theme?.mode === "white";
  const themeMode = isLight ? "white" : "black";
  const themeStyles = getThemeStyles(themeMode);
  const layoutStyle = portfolio.layout?.style ?? "minimal";
  const sectionOrder = portfolio.layout?.sectionOrder;
  const visibleSections = getVisibleSections(portfolio.sections ?? {}, layoutStyle, sectionOrder);

  return (
    <div className={\`ap-portfolio-root \${isLight ? "theme-white bg-white text-slate-900" : "theme-dark bg-[#050508] text-white"} \${className ?? ""}\`} style={themeStyles}>
      <AnimeThreeCanvas />
      <GBAfterlifeBackground />
      <SvgLiquidFilterProvider />
      <CapsuleNavbar
        portfolioName={portfolio.personalInfo?.name ?? "Portfolio"}
        links={
          portfolio.navigation?.links && portfolio.navigation.links.length > 0
            ? portfolio.navigation.links
            : [
                { label: "Home", href: "#hero" },
                { label: "About", href: "#about" },
                { label: "Experience", href: "#experience" },
                { label: "Skills", href: "#skills" },
                { label: "Projects", href: "#projects" },
                { label: "Contact", href: "#contact" },
              ]
        }
      />

      <main className="w-full">
        {visibleSections.map((key: string) => (
          <div key={key}>
            {renderSection(key, {
              ...portfolio,
              theme: { mode: isLight ? "light" : "dark" },
            })}
          </div>
        ))}
      </main>

      <footer className="border-t border-[var(--p-border)] mt-16">
        <div className="w-full px-6 py-8 flex items-between">
          <span className="text-xs text-[var(--p-text-muted)]">
            &copy; {new Date().getFullYear()} {portfolio.personalInfo?.name ?? "Developer"}
          </span>
        </div>
      </footer>
    </div>
  );
}
`
  });

  // 15. registry.tsx
  files.push({
    filename: "registry.tsx",
    language: "typescript",
    path: "src/lib/portfolio/registry.tsx",
    content: `"use client";

import React from "react";
import type { PortfolioObject } from "./types";

import { HeroSection } from "@/components/portfolio/hero-section";
import { AboutSection } from "@/components/portfolio/about-section";
import { SkillsSection } from "@/components/portfolio/skills-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { EducationSection } from "@/components/portfolio/education-section";
import { AchievementsSection } from "@/components/portfolio/achievements-section";
import { CertificationsSection } from "@/components/portfolio/certifications-section";
import { SocialLinksSection } from "@/components/portfolio/social-links-section";
import { ContactSection } from "@/components/portfolio/contact-section";
import { TestimonialsSection } from "@/components/portfolio/testimonials-section";
import { GallerySection } from "@/components/portfolio/gallery-section";
import { ServicesSection } from "@/components/portfolio/services-section";
import { MetricsSection } from "@/components/portfolio/metrics-section";
import { PublicationsSection } from "@/components/portfolio/publications-section";
import { FaqSection } from "@/components/portfolio/faq-section";
import { ProductsSection } from "@/components/portfolio/products-section";
import { ClientsSection } from "@/components/portfolio/clients-section";
import { AwardsSection } from "@/components/portfolio/awards-section";
import { RoadmapSection } from "@/components/portfolio/roadmap-section";
import { ArticlesSection } from "@/components/portfolio/articles-section";
import { SpeakingSection } from "@/components/portfolio/speaking-section";
import { LanguagesSection } from "@/components/portfolio/languages-section";
import { OrganizationsSection } from "@/components/portfolio/organizations-section";

const REGISTRY: Record<string, React.FC<{ portfolio: PortfolioObject; sectionKey: any }>> = {
  hero: HeroSection,
  about: AboutSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  education: EducationSection,
  achievements: AchievementsSection,
  certifications: CertificationsSection,
  socialLinks: SocialLinksSection,
  contact: ContactSection,
  testimonials: TestimonialsSection,
  gallery: GallerySection,
  services: ServicesSection,
  metrics: MetricsSection,
  publications: PublicationsSection,
  faq: FaqSection,
  products: ProductsSection,
  clients: ClientsSection,
  awards: AwardsSection,
  roadmap: RoadmapSection,
  articles: ArticlesSection,
  speaking: SpeakingSection,
  timeline: ExperienceSection,
  openSource: ProjectsSection,
  community: AchievementsSection,
  experiments: ProjectsSection,
  resume: ExperienceSection,
  languages: LanguagesSection,
  organizations: OrganizationsSection,
};

export function getSectionComponent(key: string) {
  return REGISTRY[key] ?? null;
}

export function renderSection(key: string, portfolio: PortfolioObject): React.ReactNode {
  const Component = getSectionComponent(key);
  if (!Component) return null;
  return <Component portfolio={portfolio} sectionKey={key as any} />;
}
`
  });

  // 16. Section Component files (with 3D Mascot, GBKineticTitle, etc.)
  files.push({
    filename: "hero-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/hero-section.tsx",
    content: `"use client";

import React from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import { GBKineticTitle } from "./interactive/gb-afterlife-canvas";
import { LiquidDistortionImage } from "./interactive/liquid-image";
import { NeumorphicButton, NeumorphicBadge, NeumorphicCard } from "@/components/ui/neumorphism";
import { DeveloperMascot } from "./interactive/developer-mascot";
import { BuyMeACoffeeBadge, Emoji3D } from "./interactive/ui8-3d-illustrations";
import { ArrowRight, Mail } from "lucide-react";

export function HeroSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const hero = portfolio.sections?.hero;
  const name = portfolio.personalInfo?.name ?? "Developer";
  const role = portfolio.personalInfo?.role ?? "Software Engineer & Creative Technologist";
  const contact = portfolio.sections?.contact;
  const avatar = portfolio.personalInfo?.avatar;
  const skills = portfolio.sections?.skills?.map((s) => s.name) ?? ["React", "TypeScript", "Next.js", "TailwindCSS"];

  const mascotOption = (portfolio as { mascotOption?: string })?.mascotOption ?? "enabled-byte";
  const showMascot = mascotOption !== "disabled";

  return (
    <section id="hero" className="min-h-[85vh] flex items-center justify-center py-12 md:py-24 relative">
      <div className="absolute top-10 right-10 hidden xl:block z-0 pointer-events-none opacity-80">
        <Emoji3D type="rocket" size="lg" />
      </div>
      <div className="absolute bottom-12 left-6 hidden xl:block z-0 pointer-events-none opacity-80">
        <Emoji3D type="code" size="lg" />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <BuyMeACoffeeBadge name={name} role={role} avatar={avatar} />
            <NeumorphicBadge variant="active" className="text-xs uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1.5">
                <Emoji3D type="lightning" size="sm" animate={false} />
                <span>Available for Hire</span>
              </span>
            </NeumorphicBadge>
          </div>

          <GBKineticTitle
            text={hero?.headline ?? \`Hi, I'm \${name}\`}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-[var(--p-text,#ffffff)]"
          />

          <p className="text-base sm:text-lg md:text-xl text-[var(--p-text-secondary,#334155)] max-w-2xl leading-relaxed font-semibold">
            {hero?.subheadline ?? portfolio.personalInfo?.tagline ?? "Crafting high-performance digital experiences with futuristic Neumorphic UI and dynamic motion design."}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a href={hero?.ctaLink ?? "#projects"}>
              <NeumorphicButton variant="glow" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                {hero?.ctaText ?? "Explore Showcase"}
              </NeumorphicButton>
            </a>

            {contact?.email && (
              <a href={\`mailto:\${contact.email}\`}>
                <NeumorphicButton variant="primary" size="lg" icon={<Mail className="w-4 h-4" />}>
                  Get In Touch
                </NeumorphicButton>
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center items-center">
          {avatar ? (
            <NeumorphicCard variant="glowing" className="p-3 w-full max-w-sm">
              <LiquidDistortionImage
                src={avatar}
                alt={name}
                aspectRatio="square"
                className="w-full h-80 rounded-xl"
              />
            </NeumorphicCard>
          ) : showMascot ? (
            <NeumorphicCard variant="outset" className="p-4 w-full flex items-center justify-center">
              <DeveloperMascot name={name} role={role} skills={skills} showSpeechBubble={mascotOption === "enabled-byte"} />
            </NeumorphicCard>
          ) : (
            <NeumorphicCard variant="glowing" className="p-8 w-full max-w-sm text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10 text-white flex items-center justify-center text-4xl font-extrabold shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/20 mb-4">
                {name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <p className="text-xs text-slate-300 mt-1 font-mono">{role}</p>
            </NeumorphicCard>
          )}
        </div>
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "about-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/about-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function AboutSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const about = portfolio.sections?.about;
  if (!about?.content) return null;

  const paragraphs = about.content.split(/\\n+/).map((p) => p.trim()).filter(Boolean);
  const role = portfolio.personalInfo?.role ?? "Developer";
  const location = portfolio.sections?.contact?.location;

  return (
    <section id="about" className="py-12 md:py-16">
      <div className="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-card)]/40 p-6 md:p-10 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--p-primary,#00f0ff)]/10 text-[var(--p-primary,#00f0ff)] mb-2">
              Background & Story
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--p-text)] tracking-tight">
              {about.title ?? "About Me"}
            </h2>
            <div className="space-y-4 pt-2">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-base md:text-lg leading-relaxed text-[var(--p-text,#ffffff)] font-semibold">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--p-primary,#00f0ff)]">
              Quick Highlights
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-[var(--p-text-muted)] font-medium">Role / Focus</span>
                <span className="font-semibold text-[var(--p-text)]">{role}</span>
              </div>
              {location && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-[var(--p-text-muted)] font-medium">Location</span>
                  <span className="font-semibold text-[var(--p-text)]">{location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "skills-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/skills-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { NeumorphicCard, NeumorphicProgress } from "@/components/ui/neumorphism";

function getLevelPercentage(level?: string): number {
  switch (level?.toLowerCase()) {
    case "expert": return 95;
    case "advanced": return 85;
    case "intermediate": return 70;
    case "beginner": return 50;
    default: return 80;
  }
}

export function SkillsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const skills = portfolio.sections?.skills;
  if (!skills || skills.length === 0) return null;

  const categories = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category ?? "Technical Stack";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-12 md:py-20 relative z-10">
      <div className="mb-10 text-center md:text-left">
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--p-primary,#00f0ff)] font-mono">
          Capabilities & Tech Stack
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--p-text,#ffffff)] tracking-tight mt-1">
          Skills & Technical Expertise
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(categories).map(([category, catSkills]) => (
          <NeumorphicCard key={category} variant="outset" className="p-6">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[var(--p-border-subtle,rgba(255,255,255,0.06))]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--p-primary,#00f0ff)] shadow-[0_0_8px_#00f0ff]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--p-text,#ffffff)]">
                {category}
              </h3>
            </div>

            <div className="space-y-4">
              {catSkills.map((skill) => (
                <NeumorphicProgress
                  key={skill.name}
                  label={skill.name}
                  value={getLevelPercentage(skill.level)}
                />
              ))}
            </div>
          </NeumorphicCard>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "projects-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/projects-section.tsx",
    content: `"use client";

import React, { useState } from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import { ExternalLink, Code2, Layers, Grid } from "lucide-react";
import { NeumorphicBadge, NeumorphicButton } from "@/components/ui/neumorphism";
import { LiquidDistortionImage } from "./interactive/liquid-image";
import { TiltCard } from "./interactive/tilt-card";
import { Emoji3D } from "./interactive/ui8-3d-illustrations";
import { DepthCarousel } from "./interactive/depth-carousel";
import { BounceCards } from "./interactive/bounce-cards";

export function ProjectsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const projects = portfolio.sections?.projects;
  const [viewMode, setViewMode] = useState<"bounce" | "depth" | "grid">("bounce");

  if (!projects || projects.length === 0) return null;

  const bounceCardItems = projects.map((p, i) => ({
    id: \`proj-\${i}\`,
    title: p.title,
    subtitle: p.tags?.slice(0, 2).join(" • ") || "Featured Project",
    description: p.description,
    badge: "Project",
    tags: p.tags,
    image: p.image || \`https://picsum.photos/seed/\${encodeURIComponent(p.title || "proj")}/400/400\`,
  }));

  const carouselItems = projects.map((p) => ({
    image: p.image || \`https://picsum.photos/seed/\${encodeURIComponent(p.title || "proj")}/800/1000\`,
    alt: p.title,
    title: p.title,
    description: p.description,
    tags: p.tags,
    link: p.link,
  }));

  return (
    <section id="projects" className="py-12 md:py-20 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Emoji3D type="diamond" size="sm" animate={false} />
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 font-mono">
              Featured Showcase
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--p-text,#ffffff)] tracking-tight leading-[1.08]">
            Featured Projects Showcase
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
            <button
              onClick={() => setViewMode("bounce")}
              className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer \${
                viewMode === "bounce" ? "bg-sky-500 text-white font-black shadow-md" : "text-slate-300 hover:text-white"
              }\`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bounce Cards</span>
            </button>
            <button
              onClick={() => setViewMode("depth")}
              className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer \${
                viewMode === "depth" ? "bg-sky-500 text-white font-black shadow-md" : "text-slate-300 hover:text-white"
              }\`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Stack</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={\`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer \${
                viewMode === "grid" ? "bg-sky-500 text-white font-black shadow-md" : "text-slate-300 hover:text-white"
              }\`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === "bounce" ? (
        <div className="w-full relative rounded-3xl bg-white/05 border border-white/10 p-6 overflow-visible backdrop-blur-md shadow-2xl">
          <BounceCards
            cards={bounceCardItems}
            containerWidth="100%"
            containerHeight={340}
            animationDelay={0.1}
            animationStagger={0.15}
            easeType="elastic.out(1, 0.5)"
            enableHover
          />
        </div>
      ) : viewMode === "depth" ? (
        <div className="w-full h-[480px] sm:h-[540px] relative rounded-3xl bg-white/[0.02] border border-white/10 p-4 overflow-hidden">
          <DepthCarousel
            items={carouselItems}
            depth={220}
            spread={100}
            tilt={24}
            tiltDirection="right"
            perspective={1400}
            visibleCards={4}
            falloff={0.2}
            blur={6}
            autoplay
            autoplayDelay={3500}
            loop
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => {
            const isFeatured = projects.length >= 3 && i === 0;
            return (
              <div key={(project.title || "") + i} className={isFeatured ? "md:col-span-2 lg:col-span-2" : ""}>
                <TiltCard glowColor={isFeatured ? "gold" : i % 2 === 0 ? "cyan" : "emerald"}>
                  <div className="flex flex-col justify-between h-full group">
                    <div>
                      <LiquidDistortionImage
                        src={project.image}
                        alt={project.title}
                        aspectRatio="video"
                        fallbackIcon={<Code2 className="w-6 h-6" />}
                        className="mb-6 w-full h-48 sm:h-56 rounded-2xl overflow-hidden"
                      />

                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className={\`font-black text-white min-w-0 leading-snug group-hover:text-[var(--p-primary,#00f0ff)] transition-colors \${
                          isFeatured ? "text-xl sm:text-2xl" : "text-lg"
                        }\`}>
                          {project.title}
                        </h3>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={\`View \${project.title}\`}
                          >
                            <NeumorphicButton variant="inset" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                              Live
                            </NeumorphicButton>
                          </a>
                        )}
                      </div>

                      {project.description && (
                        <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                          {project.description}
                        </p>
                      )}
                    </div>

                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                        {project.tags.map((tag) => (
                          <NeumorphicBadge key={tag} variant="default">
                            {tag}
                          </NeumorphicBadge>
                        ))}
                      </div>
                    )}
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
`
  });

  files.push({
    filename: "experience-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/experience-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { useSectionGrid } from "@/hooks/use-layout-fit";

export function ExperienceSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const experience = portfolio.sections?.experience;
  if (!experience || experience.length === 0) return null;

  const { clampClass } = useSectionGrid(portfolio, "experience", "");

  return (
    <section id="experience" className="py-12 md:py-16 relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--p-primary,#00f0ff)] font-mono">
            Career Journey
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--p-text,#ffffff)] tracking-tight">
            Work Experience
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {experience.map((exp, i) => (
          <div key={i} className="group">
            <div className="rounded-xl border border-[var(--p-border,rgba(255,255,255,0.1))] bg-[var(--p-bg-card,#0e0e14)] p-5 sm:p-6 transition-all duration-300 hover:border-[var(--p-primary,#00f0ff)] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--p-text,#ffffff)] min-w-0 leading-snug">
                    {exp.role ?? exp.company}
                  </h3>
                  <p className="text-sm font-semibold text-[var(--p-primary,#00f0ff)] mt-0.5">
                    {exp.company}
                    {exp.location ? \` • \${exp.location}\` : ""}
                  </p>
                </div>

                {(exp.startDate || exp.endDate) && (
                  <span className="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--p-primary-soft,rgba(0,240,255,0.1))] text-[var(--p-primary,#00f0ff)] border border-[var(--p-border,rgba(255,255,255,0.1))] whitespace-nowrap shrink-0">
                    {exp.startDate ?? ""} {exp.endDate ? \`– \${exp.endDate}\` : exp.current ? "– Present" : ""}
                  </span>
                )}
              </div>

              {exp.description && (
                <p className={\`text-sm text-[var(--p-text-muted,#94a3b8)] leading-relaxed break-words \${clampClass ?? ""}\`}>
                  {exp.description}
                </p>
              )}

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[var(--p-border,rgba(255,255,255,0.1))]/50">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-[var(--p-primary-soft,rgba(0,240,255,0.1))] text-[var(--p-primary,#00f0ff)] border border-[var(--p-border,rgba(255,255,255,0.1))]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "education-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/education-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function EducationSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const education = portfolio.sections?.education;
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="py-12 md:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--p-text)] mb-8">Education</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((edu, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6">
            <h3 className="text-lg font-bold text-[var(--p-text)]">{edu.degree ?? edu.institution}</h3>
            <p className="text-sm text-[var(--p-primary,#00f0ff)] font-semibold mt-1">{edu.institution}</p>
            <span className="text-xs font-mono text-[var(--p-text-muted)] mt-2 block">
              {edu.startDate} {edu.endDate ? \`- \${edu.endDate}\` : ""}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "achievements-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/achievements-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { useSectionGrid } from "@/hooks/use-layout-fit";

export function AchievementsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const achievements = portfolio.sections?.achievements;
  if (!achievements || achievements.length === 0) return null;

  const { gridClass, clampClass } = useSectionGrid(portfolio, "achievements", "grid grid-cols-1 md:grid-cols-2 gap-4");

  return (
    <section id="achievements" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Achievements</h2>
      <div className={gridClass}>
        {achievements.map((ach, i) => (
          <div key={ach.title + i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5">
            <h3 className="text-sm font-semibold text-[var(--p-text)] mb-1">{ach.title}</h3>
            {ach.description && <p className={\`text-xs text-[var(--p-text-muted)] leading-relaxed break-words \${clampClass ?? ""}\`}>{ach.description}</p>}
            {ach.date && <p className="text-[10px] text-[var(--p-text-muted)] mt-2 font-mono">{ach.date}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "certifications-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/certifications-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function CertificationsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const certifications = portfolio.sections?.certifications;
  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-12 md:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--p-text)] mb-8">Certifications</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5">
            <h3 className="text-base font-bold text-[var(--p-text)]">{cert.name}</h3>
            {cert.issuer && <p className="text-xs font-semibold text-[var(--p-primary,#00f0ff)] mt-1">{cert.issuer}</p>}
            {cert.date && <span className="text-[11px] font-mono text-[var(--p-text-muted)] mt-2 block">{cert.date}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "social-links-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/social-links-section.tsx",
    content: `"use client";

import React from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import { ExternalLink, Globe } from "lucide-react";

export function SocialLinksSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const socialLinks = portfolio.sections?.socialLinks;
  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <section id="social-links" className="py-12 relative z-10">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-black text-[var(--p-text,#ffffff)]">Social Profiles & Links</h3>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto px-4">
        {socialLinks.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl border bg-white/10 border-white/20 text-white font-bold text-sm hover:bg-sky-500 hover:border-sky-400 transition-all"
          >
            <Globe className="w-4 h-4 text-sky-400" />
            <span>{link.platform}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "contact-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/contact-section.tsx",
    content: `"use client";

import React, { useState } from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import { NeumorphicCard, NeumorphicInput, NeumorphicTextarea, NeumorphicButton } from "@/components/ui/neumorphism";
import { Mail, Send, User } from "lucide-react";

export function ContactSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const contact = portfolio.sections?.contact;
  const email = contact?.email ?? portfolio.personalInfo?.email ?? "contact@example.com";

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-12 md:py-20 relative z-10">
      <NeumorphicCard variant="glowing" className="max-w-4xl mx-auto p-8 md:p-14">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[var(--p-primary,#00f0ff)] font-mono">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--p-text,#ffffff)] tracking-tight mt-1 mb-3">
            Let's Build Something Exceptional
          </h2>
        </div>

        {submitted ? (
          <div className="p-8 text-center text-[var(--p-primary,#00f0ff)] space-y-3 rounded-2xl bg-white/05 border border-[var(--p-primary,#00f0ff)]/30">
            <h3 className="text-2xl font-black text-[var(--p-text,#ffffff)]">✓ Message Sent!</h3>
            <p className="text-xs text-[var(--p-text-muted,#94a3b8)]">Thank you for reaching out. I'll respond shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--p-text-secondary,#e2e8f0)]">Your Name</label>
                <NeumorphicInput
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                  value={formData.name}
                  onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--p-text-secondary,#e2e8f0)]">Your Email</label>
                <NeumorphicInput
                  type="email"
                  placeholder="john@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  value={formData.email}
                  onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--p-text-secondary,#e2e8f0)]">Message</label>
              <NeumorphicTextarea
                rows={4}
                placeholder="Tell me about your project..."
                value={formData.message}
                onChange={(e: any) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--p-text-secondary,#e2e8f0)]">
                <Mail className="w-4 h-4 text-[var(--p-primary,#00f0ff)]" />
                <span>{email}</span>
              </div>
              <NeumorphicButton type="submit" variant="glow" size="lg" icon={<Send className="w-4 h-4" />}>
                Send Message
              </NeumorphicButton>
            </div>
          </form>
        )}
      </NeumorphicCard>
    </section>
  );
}
`
  });

  files.push({
    filename: "testimonials-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/testimonials-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function TestimonialsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const testimonials = portfolio.sections?.testimonials;
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-12 md:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--p-text)] mb-8">Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6">
            <p className="text-sm italic text-[var(--p-text-secondary)]">"{t.content}"</p>
            <div className="mt-4 pt-4 border-t border-[var(--p-border)]">
              <p className="text-xs font-bold text-[var(--p-text)]">{t.author}</p>
              <p className="text-[11px] text-[var(--p-text-muted)]">{t.role} {t.company ? \`@ \${t.company}\` : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "gallery-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/gallery-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function GallerySection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const gallery = portfolio.sections?.gallery;
  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="gallery" className="py-12 md:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--p-text)] mb-8">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((g, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-4">
            {g.image && <img src={g.image} alt={g.title || ""} className="w-full h-48 object-cover rounded-lg mb-3" />}
            {g.title && <h3 className="text-sm font-bold text-[var(--p-text)]">{g.title}</h3>}
            {g.description && <p className="text-xs text-[var(--p-text-muted)] mt-1">{g.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "services-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/services-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function ServicesSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const services = portfolio.sections?.services;
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="py-12 md:py-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--p-text)] mb-8">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6">
            <h3 className="text-lg font-bold text-[var(--p-text)]">{s.name}</h3>
            {s.description && <p className="text-sm text-[var(--p-text-secondary)] mt-2">{s.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "metrics-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/metrics-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function MetricsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const metrics = portfolio.sections?.metrics;
  if (!metrics || metrics.length === 0) return null;

  return (
    <section id="metrics" className="py-12">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5 text-center">
            <p className="text-3xl font-black text-[var(--p-primary,#00f0ff)]">{m.value}</p>
            <p className="text-xs font-semibold text-[var(--p-text)] mt-1">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "publications-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/publications-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function PublicationsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const publications = portfolio.sections?.publications;
  if (!publications || publications.length === 0) return null;

  return (
    <section id="publications" className="py-12">
      <h2 className="text-2xl font-bold text-[var(--p-text)] mb-6">Publications</h2>
      <div className="space-y-4">
        {publications.map((pub, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5">
            <h3 className="text-base font-bold text-[var(--p-text)]">{pub.title}</h3>
            {pub.publisher && <p className="text-xs text-[var(--p-primary,#00f0ff)] font-semibold mt-1">{pub.publisher}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "faq-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/faq-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function FaqSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const faq = portfolio.sections?.faq;
  if (!faq || faq.length === 0) return null;

  return (
    <section id="faq" className="py-12">
      <h2 className="text-2xl font-bold text-[var(--p-text)] mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faq.map((item, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5">
            <h3 className="text-base font-bold text-[var(--p-text)] mb-2">{item.question}</h3>
            <p className="text-sm text-[var(--p-text-secondary)]">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "products-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/products-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function ProductsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const products = portfolio.sections?.products;
  if (!products || products.length === 0) return null;

  return (
    <section id="products" className="py-12">
      <h2 className="text-2xl font-bold text-[var(--p-text)] mb-6">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {products.map((prod, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5">
            <h3 className="text-base font-bold text-[var(--p-text)]">{prod.name}</h3>
            {prod.description && <p className="text-xs text-[var(--p-text-secondary)] mt-2">{prod.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "clients-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/clients-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function ClientsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const clients = portfolio.sections?.clients;
  if (!clients || clients.length === 0) return null;

  return (
    <section id="clients" className="py-12">
      <h2 className="text-2xl font-bold text-[var(--p-text)] mb-6">Clients</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {clients.map((c, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-4 text-center">
            <span className="text-sm font-bold text-[var(--p-text)]">{c.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "awards-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/awards-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function AwardsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const awards = portfolio.sections?.awards;
  if (!awards || awards.length === 0) return null;

  return (
    <section id="awards" className="py-12">
      <h2 className="text-2xl font-bold text-[var(--p-text)] mb-6">Honors & Awards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {awards.map((a, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5">
            <h3 className="text-base font-bold text-[var(--p-text)]">{a.title}</h3>
            {a.organization && <p className="text-xs text-[var(--p-primary,#00f0ff)] font-semibold mt-1">{a.organization}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "roadmap-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/roadmap-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function RoadmapSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const roadmap = portfolio.sections?.roadmap;
  if (!roadmap || roadmap.length === 0) return null;

  return (
    <section id="roadmap" className="py-12">
      <h2 className="text-2xl font-bold text-[var(--p-text)] mb-6">Future Roadmap</h2>
      <div className="space-y-4">
        {roadmap.map((item, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-4 flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--p-text)]">{item.milestone}</span>
            {item.status && <span className="text-xs font-mono text-[var(--p-primary,#00f0ff)] uppercase">{item.status}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "articles-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/articles-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function ArticlesSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const articles = portfolio.sections?.articles;
  if (!articles || articles.length === 0) return null;

  return (
    <section id="articles" className="py-12">
      <h2 className="text-2xl font-bold text-[var(--p-text)] mb-6">Articles & Writings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((art, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5">
            <h3 className="text-base font-bold text-[var(--p-text)]">{art.title}</h3>
            {art.excerpt && <p className="text-xs text-[var(--p-text-secondary)] mt-2">{art.excerpt}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "speaking-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/speaking-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function SpeakingSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const speaking = portfolio.sections?.speaking;
  if (!speaking || speaking.length === 0) return null;

  return (
    <section id="speaking" className="py-12">
      <h2 className="text-2xl font-bold text-[var(--p-text)] mb-6">Speaking Engagements</h2>
      <div className="space-y-4">
        {speaking.map((spk, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5">
            <h3 className="text-base font-bold text-[var(--p-text)]">{spk.event}</h3>
            {spk.topic && <p className="text-xs text-[var(--p-primary,#00f0ff)] font-semibold mt-1">{spk.topic}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "languages-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/languages-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function LanguagesSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const languages = portfolio.sections?.languages;
  if (!languages || languages.length === 0) return null;

  return (
    <section id="languages" className="py-12">
      <h2 className="text-2xl font-bold text-[var(--p-text)] mb-6">Languages</h2>
      <div className="flex flex-wrap gap-4">
        {languages.map((lang, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] px-5 py-3 flex items-center gap-3">
            <span className="text-sm font-bold text-[var(--p-text)]">{lang.name}</span>
            {lang.proficiency && <span className="text-xs font-mono text-[var(--p-primary,#00f0ff)]">{lang.proficiency}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "organizations-section.tsx",
    language: "typescript",
    path: "src/components/portfolio/organizations-section.tsx",
    content: `"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function OrganizationsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const organizations = portfolio.sections?.organizations;
  if (!organizations || organizations.length === 0) return null;

  return (
    <section id="organizations" className="py-12">
      <h2 className="text-2xl font-bold text-[var(--p-text)] mb-6">Organizations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {organizations.map((org, i) => (
          <div key={i} className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5">
            <h3 className="text-base font-bold text-[var(--p-text)]">{org.title ?? org.organization}</h3>
            {org.role && <p className="text-xs text-[var(--p-primary,#00f0ff)] font-semibold mt-1">{org.role}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
`
  });

  files.push({
    filename: "dynamic-navigation.tsx",
    language: "typescript",
    path: "src/components/portfolio/dynamic-navigation.tsx",
    content: `"use client";

import React, { useState, useEffect } from "react";
import type { ComposedNavigation, ComposedTheme } from "@/server/ai/composition/types";

export function DynamicNavigation({
  navigation,
  theme,
  portfolioName = "Portfolio",
}: {
  navigation?: ComposedNavigation;
  theme?: ComposedTheme;
  portfolioName?: string;
}) {
  const sections = navigation?.sections ?? ["hero", "about", "skills", "projects", "experience", "contact"];
  const [activeHref, setActiveHref] = useState<string>("#" + (sections[0] ?? "hero"));

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const key of sections) {
        const el = document.getElementById(key);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveHref("#" + key);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--p-bg,#080b11)]/70 backdrop-blur-md border-b border-[var(--p-border,rgba(255,255,255,0.1))]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[var(--p-text,#ffffff)] group-hover:text-[var(--p-primary,#00f0ff)] transition-colors">
            {portfolioName}
          </span>
        </a>

        <div className="flex items-center gap-1 p-1.5 rounded-full bg-[var(--p-bg-card,#141b27)]/80 backdrop-blur-xl border border-[var(--p-border,rgba(255,255,255,0.15))] shadow-lg">
          {sections.map((key) => {
            const href = "#" + key;
            const isActive = activeHref === href;
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            return (
              <a
                key={key}
                href={href}
                onClick={() => setActiveHref(href)}
                className={\`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 select-none whitespace-nowrap \${
                  isActive
                    ? "bg-[var(--p-text,#ffffff)] text-[var(--p-bg,#050508)] shadow-md font-black"
                    : "text-[var(--p-text-muted,#94a3b8)] hover:text-[var(--p-text,#ffffff)] hover:bg-white/10"
                }\`}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
`
  });

  files.push({
    filename: "capsule-navbar.tsx",
    language: "typescript",
    path: "src/components/portfolio/capsule-navbar.tsx",
    content: `"use client";

import React, { useState, useEffect } from "react";

export function CapsuleNavbar({ portfolioName = "Portfolio", links = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] }: { portfolioName?: string; links?: { label: string; href: string }[] }) {
  const [activeHref, setActiveHref] = useState<string>(links[0]?.href || "#hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const link of links) {
        const id = link.href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveHref(link.href);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [links]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--p-bg,#080b11)]/70 backdrop-blur-md border-b border-[var(--p-border,rgba(255,255,255,0.1))]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[var(--p-text,#ffffff)] group-hover:text-[var(--p-primary,#00f0ff)] transition-colors">
            {portfolioName}
          </span>
        </a>

        <div className="flex items-center gap-1 p-1.5 rounded-full bg-[var(--p-bg-card,#141b27)]/80 backdrop-blur-xl border border-[var(--p-border,rgba(255,255,255,0.15))] shadow-lg">
          {links.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveHref(link.href)}
                className={\`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 select-none whitespace-nowrap \${
                  isActive
                    ? "bg-[var(--p-text,#ffffff)] text-[var(--p-bg,#050508)] shadow-md font-black"
                    : "text-[var(--p-text-muted,#94a3b8)] hover:text-[var(--p-text,#ffffff)] hover:bg-white/10"
                }\`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
`
  });

  files.push({
    filename: "composition-animator.tsx",
    language: "typescript",
    path: "src/components/portfolio/composition-animator.tsx",
    content: `"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ComposedMotion } from "@/server/ai/composition/types";

export function CompositionAnimator({
  children,
  motion: motionConfig,
}: {
  children: React.ReactNode;
  motion?: ComposedMotion;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
`
  });

  // 17. Config & Manifest files
  const packageJson = JSON.stringify(
    {
      name: `${(portfolio?.personalInfo?.name || "portfolio").toLowerCase().replace(/[^a-z0-9]/g, "-")}-portfolio`,
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1",
        three: "^0.185.1",
        animejs: "^3.2.2",
        gsap: "^3.12.5",
        "framer-motion": "^12.4.2",
        "lucide-react": "^0.344.0",
        clsx: "^2.1.1",
        "tailwind-merge": "^2.5.5",
      },
      devDependencies: {
        "@types/react": "^18.3.3",
        "@types/react-dom": "^18.3.0",
        "@types/three": "^0.185.3",
        "@types/animejs": "^3.1.8",
        "@types/node": "^20.14.10",
        "@vitejs/plugin-react": "^4.3.1",
        "@tailwindcss/vite": "^4.0.0",
        tailwindcss: "^4.0.0",
        typescript: "^5.5.3",
        vite: "^5.4.2",
      },
    },
    null,
    2
  );
  files.push({ filename: "package.json", language: "json", path: "package.json", content: packageJson });

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${portfolio?.personalInfo?.name || "Developer"} - 3D Portfolio</title>
  </head>
  <body class="bg-[var(--p-bg,#050508)] text-[var(--p-text,#ffffff)]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  files.push({ filename: "index.html", language: "html", path: "index.html", content: indexHtml });

  const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
`;
  files.push({ filename: "vite.config.ts", language: "typescript", path: "vite.config.ts", content: viteConfig });

  const tsconfigJson = JSON.stringify(
    {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"]
        },
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        noFallthroughCasesInSwitch: true
      },
      include: ["src"]
    },
    null,
    2
  );
  files.push({ filename: "tsconfig.json", language: "json", path: "tsconfig.json", content: tsconfigJson });

  const readmeMd = `# ${portfolio?.personalInfo?.name || "Developer"} - 3D Modern Portfolio

Generated standalone React + TypeScript + Three.js + Anime.js + GSAP 3D Portfolio Application.

## Quick Start

1. Extract the downloaded ZIP folder.
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Launch development server:
\`\`\`bash
npm run dev
\`\`\`

Open your browser at \`http://localhost:5173\` to view your live 3D portfolio!
`;
  files.push({ filename: "README.md", language: "markdown", path: "README.md", content: readmeMd });

  return files;
}

export async function downloadPortfolioZip(portfolio: PortfolioObject | null, composition?: CompositionGraph | null) {
  const files = generatePortfolioCodeFiles(portfolio, composition);
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const link = document.createElement("a");
  const authorName = (portfolio?.personalInfo?.name || "portfolio").toLowerCase().replace(/[^a-z0-9]/g, "-");
  link.href = url;
  link.download = `${authorName}-react-portfolio.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
