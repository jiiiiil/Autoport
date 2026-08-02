import type { AIContextObject, Framework, Language, StylingSystem, DesignLanguage, Profession, ThemeMode } from "../intelligence/types";
import type { PortfolioBlueprint } from "../blueprint/types";
import type { ExecutionManifest } from "../generation/execution-manifest.types";

export type CompositionState =
  | "idle"
  | "validating"
  | "composing"
  | "refining"
  | "generating"
  | "completed"
  | "failed"
  | "restored";

export type LayoutStyle =
  | "portfolio-landing" | "split" | "magazine" | "editorial"
  | "creative" | "gallery" | "timeline" | "storytelling"
  | "grid" | "bento" | "dashboard" | "landing-sections"
  | "minimal" | "horizontal-scroll" | "asymmetric" | "cinematic"
  | "newspaper" | "card-stack" | "immersive"
  | "masonry" | "custom";

export type NavigationStyle =
  | "sticky" | "floating" | "transparent" | "glass" | "sidebar"
  | "minimal" | "hidden-scroll" | "hamburger" | "pills" | "underline"
  | "dock" | "magazine-toc" | "bottom" | "horizontal-scroll"
  | "progressive" | "split" | "none";

export type MotionStyle =
  | "minimal" | "apple" | "editorial" | "gsap-heavy" | "physics"
  | "scroll-storytelling" | "parallax" | "3d" | "micro-interactions"
  | "experimental" | "none" | "subtle" | "moderate" | "heavy";

export type StorytellingFlow =
  | "linear" | "narrative" | "problem-journey-impact" | "magazine"
  | "editorial-grid" | "timeline-scroll" | "interactive-landing"
  | "horizontal-journey" | "cinematic-reveal" | "modular-cards"
  | "asymmetric-canvas" | "newspaper-spread" | "dark-to-light"
  | "chronological" | "portfolio-showcase" | "case-study";

export type ResponsiveStrategy =
  | "mobile-first" | "desktop-first" | "adaptive" | "fluid"
  | "container-queries" | "hybrid";

export interface ComposedSection {
  id: string;
  name: string;
  componentName: string;
  type: "required" | "optional" | "forbidden";
  storytellingRole: string;
  priority: number;
  variant: string;
  layout: string;
  interaction: string;
  animation: string;
  accessibility: string;
  responsive: Record<string, string>;
  contentRequirements: string[];
  visualWeight: "primary" | "secondary" | "tertiary" | "accent";
  metadata: Record<string, unknown>;
}

export interface ComposedLayout {
  style: LayoutStyle;
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
  style: NavigationStyle;
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
  mode: ThemeMode;
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
  style: MotionStyle;
  library: string;
  intensity: "none" | "subtle" | "moderate" | "heavy";
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
  gsap: {
    textReveal: boolean;
    fadeReveal: boolean;
    imageReveal: boolean;
    sectionPinning: boolean;
    parallax: boolean;
    floatingElements: boolean;
    magneticButtons: boolean;
    cursorInteraction: boolean;
    cardHoverMotion: boolean;
    smoothScroll: boolean;
  };
}

export interface ComposedComponent {
  name: string;
  purpose: string;
  priority: number;
  variant: string;
  elements: string[];
  behavior: string;
  animation: string;
  accessibility: string;
  responsive: Record<string, string>;
  visualWeight: "primary" | "secondary" | "tertiary" | "accent";
  interactionType: "static" | "hover" | "click" | "scroll" | "gesture" | "animated";
  contentRules: {
    maxLines?: number;
    truncation?: string;
    mediaAspect?: string;
  };
}

export interface ComposedResponsive {
  strategy: ResponsiveStrategy;
  breakpoints: {
    name: string;
    minWidth: string;
    maxWidth?: string;
    columns: number;
    gutter: string;
    sectionPadding: string;
    fontSize: {
      heading: string;
      subheading: string;
      body: string;
      small: string;
    };
    layout: string;
    navigation: string;
    gridColumns: number;
  }[];
  containerMaxWidth: string;
  mobileFirst: boolean;
  fluidTypography: boolean;
  adaptiveLayouts: Record<string, string>;
}

export interface ComposedAccessibility {
  semanticHTML: boolean;
  ariaLabels: boolean;
  keyboardNavigation: boolean;
  focusManagement: boolean;
  reducedMotion: boolean;
  colorContrast: string;
  screenReader: boolean;
  skipLinks: boolean;
  headingHierarchy: boolean;
  altTextRequired: boolean;
  landmarkRegions: boolean;
}

export interface CompositionMetadata {
  composedAt: string;
  version: string;
  promptHash: string;
  confidence: number;
  uniquenessScore: number;
  constraintOverrides: string[];
  compositionTime: string;
  refinementApplied: boolean;
  validationPassed: boolean;
}

export interface CompositionGraph {
  prompt: string;
  aiContext: AIContextObject;
  blueprint: PortfolioBlueprint;
  layout: ComposedLayout;
  sections: ComposedSection[];
  navigation: ComposedNavigation;
  theme: ComposedTheme;
  motion: ComposedMotion;
  components: ComposedComponent[];
  responsive: ComposedResponsive;
  accessibility: ComposedAccessibility;
  story: {
    flow: StorytellingFlow;
    narrativeArc: string[];
    sectionTransitions: Record<string, string>;
    storytellingDevices: string[];
  };
  tokens: Record<string, string>;
  metadata: CompositionMetadata;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number;
}

export interface ValidationError {
  code: string;
  message: string;
  field: string;
  severity: "critical" | "major";
}

export interface ValidationWarning {
  code: string;
  message: string;
  field: string;
  severity: "minor" | "info";
}

export interface RefinementResult {
  composition: CompositionGraph;
  changes: RefinementChange[];
  score: number;
}

export interface RefinementChange {
  type: string;
  target: string;
  before: unknown;
  after: unknown;
  reason: string;
}

export interface GenerationSession {
  id: string;
  prompt: string;
  state: CompositionState;
  composition: CompositionGraph | null;
  startedAt: string;
  completedAt: string | null;
  error: string | null;
  metadata: {
    totalDuration: number;
    compositionDuration: number;
    refinementDuration: number;
    validationDuration: number;
  };
}

export interface PromptConstraints {
  forbidden: string[];
  required: string[];
  preferences: Record<string, string>;
  overrides: Record<string, unknown>;
}
