import type { Framework, Language, StylingSystem, DesignLanguage, Profession, ThemeMode } from "../intelligence/types";

export type ProjectRoot = string;

export interface ComponentDefinition {
  name: string;
  variant: string;
  props: Record<string, string>;
  contentKey: string;
  animation: string;
  accessibility: string;
  responsive: Record<string, string>;
}

export interface LayoutDefinition {
  type: string;
  sectionHierarchy: string[];
  gridStrategy: string;
  containerWidth: string;
  verticalRhythm: string;
}

export interface AnimationConfig {
  library: string;
  intensity: "none" | "subtle" | "moderate" | "heavy";
  pageTransitions: boolean;
  scrollAnimations: boolean;
  microInteractions: boolean;
}

export interface DesignTokenColors {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface DesignTokenTypography {
  heading: string;
  body: string;
  mono: string;
}

export interface DesignTokenSpacing {
  unit: string;
}

export interface DesignTokenRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface DesignTokenShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface DesignTokens {
  colors: DesignTokenColors;
  typography: DesignTokenTypography;
  spacing: DesignTokenSpacing;
  radius: DesignTokenRadius;
  shadows: DesignTokenShadows;
}

export interface SeoConfig {
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
}

export interface AccessibilityConfig {
  level: string;
  semanticHTML: boolean;
  ariaLabels: boolean;
  keyboardNavigation: boolean;
  focusManagement: boolean;
  reducedMotion: boolean;
  colorContrast: boolean;
  screenReader: boolean;
}

export interface PerformanceConfig {
  lazyLoading: boolean;
  dynamicImports: boolean;
  imageOptimization: boolean;
  codeSplitting: boolean;
  treeShaking: boolean;
  prefetching: boolean;
  bundleAnalysis: boolean;
}

export interface PlaceholderContent {
  [key: string]: {
    heading: string;
    subheading: string;
    body: string;
    cta: { label: string; href: string }[];
    data: Record<string, unknown>;
  };
}

export interface ExecutionManifest {
  blueprint: {
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
    layout: LayoutDefinition;
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
    animations: AnimationConfig;
    content: {
      intent: string;
      tone: string;
      voice: string;
      storytelling: string;
      sections: PlaceholderContent;
    };
    seo: SeoConfig;
    accessibility: AccessibilityConfig;
    performance: PerformanceConfig;
    designSystem: {
      tokens: DesignTokens;
      components: Record<string, {
        variant: string;
        styles: Record<string, string>;
        states: Record<string, string>;
      }>;
    };
  };
  optimizedSections: {
    id: string;
    name: string;
    component: string;
    variant: string;
    priority: number;
    required: boolean;
    composition: {
      name: string;
      base: string;
      elements: string[];
      behavior: string;
      animation: string;
      responsive: string;
      accessibility: string;
    };
    storytellingRole: string;
    ctaPlacement: string;
    layout: string;
    animation: string;
    content: Record<string, unknown>;
  }[];
  composedLayout: LayoutDefinition;
  designTokens: DesignTokens;
  dependencies: {
    core: { name: string; version: string; reason: string }[];
    ui: { name: string; version: string; reason: string }[];
    animation: { name: string; version: string; reason: string }[];
    utilities: { name: string; version: string; reason: string }[];
    dev: { name: string; version: string; reason: string }[];
    installOrder: string[];
    configFiles: { name: string; content: string }[];
  };
  projectManifest: {
    name: string;
    version: string;
    framework: string;
    language: string;
    fileStructure: {
      root: string;
      srcDir: string;
      publicDir: string;
      componentsDir: string;
      pagesDir: string;
      stylesDir: string;
      libDir: string;
      utilsDir: string;
      typesDir: string;
      assetsDir: string;
      hooksDir: string;
    };
    configFiles: { name: string; content: string; purpose: string }[];
    assetRequirements: { type: string; name: string; purpose: string; required: boolean; format: string; maxSize: string }[];
    environmentVariables: { name: string; description: string; required: boolean; example: string }[];
    scripts: Record<string, string>;
  };
  metadata: {
    generatedAt: string;
    blueprintVersion: string;
    manifestVersion: string;
    totalInstructions: number;
    estimatedGenerationTime: string;
  };
}
