import type { Framework, Language, StylingSystem, DesignLanguage, Profession, ThemeMode } from "../intelligence/types";

export type LayoutType =
  | "portfolio-landing" | "split" | "magazine" | "editorial"
  | "creative" | "gallery" | "timeline" | "storytelling"
  | "grid" | "bento" | "dashboard" | "landing-sections"
  | "minimal" | "custom";

export type HeroVariant =
  | "centered" | "split" | "particle" | "minimal"
  | "typewriter" | "3d" | "video-bg" | "glass" | "animated-gradient"
  | "full-screen" | "scroll";

export type NavbarVariant =
  | "sticky" | "floating" | "transparent" | "glass" | "sidebar"
  | "minimal" | "hidden-scroll" | "hamburger" | "pills" | "underline";

export type ProjectVariant =
  | "card" | "masonry" | "showcase" | "case-study" | "horizontal-scroll"
  | "bento" | "magazine" | "video";

export type SkillVariant =
  | "pills" | "bars" | "icon-grid" | "radar" | "minimal" | "bubble";

export type TimelineVariant =
  | "alternating" | "vertical" | "horizontal" | "minimal" | "card"
  | "compact" | "detailed" | "glass";

export type GalleryVariant =
  | "grid" | "masonry" | "lightbox" | "carousel" | "justified"
  | "fullscreen" | "polaroid" | "minimal";

export type FooterVariant =
  | "minimal" | "multi-column" | "centered" | "newsletter" | "social"
  | "none" | "glass" | "creative";

export type FormVariant =
  | "card" | "modal" | "split" | "inline" | "multi-step" | "glass"
  | "gradient" | "minimal";

export type ButtonVariant =
  | "primary" | "outline" | "ghost" | "minimal" | "glass" | "gradient"
  | "neon" | "pill";

export type CardVariant =
  | "elevated" | "outlined" | "glass" | "gradient" | "neon" | "minimal"
  | "hover-lift" | "border-glow";

export interface ColorShade {
  name: string;
  value: string;
  usage: string;
}

export interface ColorPalette {
  primary: ColorShade[];
  secondary: ColorShade[];
  accent: ColorShade[];
  neutral: ColorShade[];
  semantic: { success: string; warning: string; error: string; info: string };
  background: { default: string; card: string; elevated: string; overlay: string };
  text: { primary: string; secondary: string; muted: string; inverse: string };
  border: { default: string; subtle: string; strong: string };
}

export interface TypographyScale {
  fontFamily: string;
  weights: { normal: number; medium: number; semibold: number; bold: number };
  sizes: Record<string, string>;
  lineHeights: Record<string, string>;
  letterSpacing: Record<string, string>;
}

export interface SpacingScale {
  unit: number;
  scale: Record<string, string>;
}

export interface RadiusScale {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ShadowScale {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  glow?: string;
}

export interface AnimationPlan {
  library: string;
  intensity: string;
  hero: { type: string; duration: string; easing: string };
  cards: { type: string; duration: string; easing: string };
  scroll: { enabled: boolean; type: string };
  transitions: { page: string; hover: string; focus: string };
  microInteractions: string[];
}

export interface SectionPlan {
  id: string;
  name: string;
  component: string;
  variant: string;
  priority: number;
  required: boolean;
  props: Record<string, unknown>;
}

export interface ResponsivePlan {
  breakpoints: {
    name: string;
    minWidth: string;
    maxWidth?: string;
    columns: number;
    gutter: string;
    sectionPadding: string;
    fontSize: { heading: string; subheading: string; body: string; small: string };
    layout: string;
  }[];
  mobileFirst: boolean;
  containerMaxWidth: string;
  gridColumns: number;
}

export interface SEOPlan {
  title: string;
  description: string;
  keywords: string[];
  openGraph: { title: string; description: string; image: string; type: string };
  twitter: { card: string; title: string; description: string };
  structuredData: Record<string, unknown>[];
  canonical: string;
  robots: string;
}

export interface AccessibilityPlan {
  ariaLabels: boolean;
  keyboardNavigation: boolean;
  focusManagement: boolean;
  colorContrast: string;
  reducedMotion: boolean;
  semanticHtml: boolean;
  skipLinks: boolean;
  altTextRequired: boolean;
}

export interface PerformancePlan {
  lazyLoading: boolean;
  dynamicImports: boolean;
  imageOptimization: boolean;
  codeSplitting: boolean;
  animationOptimization: boolean;
  bundleOptimization: boolean;
  prefetching: boolean;
  prerendering: boolean;
}

export interface AssetStrategy {
  images: { type: string; format: string; quality: number; placeholder: string }[];
  fonts: { family: string; weights: number[]; format: string }[];
  icons: { type: string; library: string; format: string };
}

export interface ContentStrategy {
  headline: { style: string; length: string; animation?: string };
  tagline: { style: string; length: string };
  about: { style: string; length: string; storytelling: boolean };
  projects: { presentation: string; details: string; links: string };
  cta: { primary: string; secondary?: string; style: string };
}

export interface FolderStrategy {
  structure: string[];
  naming: string;
  grouping: string;
  components: string;
  hooks: string;
  utils: string;
  types: string;
  styles: string;
}

export interface PortfolioBlueprint {
  portfolioType: string;
  targetAudience: string;
  framework: Framework;
  language: Language;
  styling: StylingSystem;
  designLanguage: DesignLanguage[];
  profession: Profession;
  theme: ThemeMode;

  libraries: {
    ui: string;
    animation: string;
    icons: string;
    charts: string;
  };

  folderStrategy: string[];

  layout: {
    type: string;
    sectionHierarchy: string[];
    gridStrategy: string;
    containerWidth: string;
    verticalRhythm: string;
  };

  navigation: {
    variant: string;
    sections: string[];
    position: string;
    mobileBehavior: string;
    scrollBehavior: string;
  };

  sections: {
    name: string;
    type: "required" | "optional" | "forbidden";
    description: string;
    storytellingRole: string;
    composition: {
      variant: string;
      layout: string;
      interaction: string;
      animation: string;
    };
  }[];

  animations: {
    library: string;
    intensity: "none" | "subtle" | "moderate" | "heavy";
    enabled: boolean;
    pageTransitions: boolean;
    scrollAnimations: boolean;
    microInteractions: boolean;
  };

  content: {
    intent: string;
    tone: string;
    voice: string;
    storytelling: string;
    sections: Record<string, {
      heading: string;
      subheading: string;
      body: string;
      cta: { label: string; href: string }[];
      data: Record<string, unknown>;
    }>;
  };

  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonical: string;
    openGraph: {
      title: string;
      description: string;
      image: string;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
    };
  };

  accessibility: {
    level: string;
    semanticHTML: boolean;
    ariaLabels: boolean;
    keyboardNavigation: boolean;
    focusManagement: boolean;
    reducedMotion: boolean;
    colorContrast: boolean;
    screenReader: boolean;
  };

  performance: {
    lazyLoading: boolean;
    dynamicImports: boolean;
    imageOptimization: boolean;
    codeSplitting: boolean;
    treeShaking: boolean;
    prefetching: boolean;
    bundleAnalysis: boolean;
  };

  designSystem: {
    tokens: {
      colors: Record<string, string>;
      typography: Record<string, string>;
      spacing: Record<string, string>;
      radius: Record<string, string>;
      shadows: Record<string, string>;
      animation: Record<string, string>;
      breakpoints: Record<string, string>;
    };
    components: Record<string, {
      variant: string;
      styles: Record<string, string>;
      states: Record<string, string>;
    }>;
  };

  metadata: {
    createdAt: string;
    version: string;
    confidence: number;
    uniqueness: number;
  };
}
