export type TokenMode = "dark" | "light";

export type DesignThemeKey =
  | "black"
  | "white"
  | "dark-blue"
  | "spatial-3d"
  | "3d-creator"
  | "minimal-light";

export interface ThemeColors {
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
}

export interface DerivedColors {
  primaryHover: string;
  primaryActive: string;
  primarySoft: string;
  primarySofter: string;
  ring: string;
  onPrimary: string;
  onAccent: string;
  onSurface: string;
  surfaceHover: string;
  surfaceActive: string;
  successSoft: string;
  warningSoft: string;
  errorSoft: string;
  infoSoft: string;
  shadowColor: string;
  gradientPrimary: string;
  gradientSecondary: string;
  gradientHero: string;
  gradientCard: string;
  gradientText: string;
}

export interface GlassTokens {
  background: string;
  border: string;
  blur: string;
  saturate: string;
  opacity: number;
  hoverBackground: string;
  hoverBorder: string;
  panelBackground: string;
  panelBorder: string;
}

export interface DesignTokens {
  key: DesignThemeKey | "custom";
  mode: TokenMode;
  label: string;
  description: string;
  swatch: string[];
  backgroundStyle: string;

  colors: ThemeColors;
  derived: DerivedColors;

  typography: {
    headingFont: string;
    bodyFont: string;
    monoFont: string;
  };

  fontScale: Record<string, string>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, string>;
  letterSpacing: Record<string, string>;

  radius: Record<string, string>;
  shadows: Record<string, string>;
  glass: GlassTokens;
  blur: Record<string, string>;
  elevation: Record<string, string>;
  opacity: Record<string, number>;

  grid: {
    columns: number;
    gap: string;
    sectionColumns: number;
    cardColumns: string;
    galleryColumns: string;
    sidebarWidth: string;
  };

  containerWidths: Record<string, string>;
  breakpoints: Record<string, string>;
  zIndex: Record<string, number>;
  spacing: Record<string, string>;
  durations: Record<string, string>;
  easing: Record<string, string>;
  borders: Record<string, string>;
}

export interface ThemeDefinition {
  key: DesignThemeKey;
  label: string;
  description: string;
  swatch: string[];
  mode: TokenMode;
  backgroundStyle: string;
  radiusStyle?: "standard" | "rounded" | "sharp" | "glass";
  glassIntensity?: "subtle" | "strong";
  shadowTint?: string;
  shadowIntensity?: number;
  container?: "wide" | "standard" | "narrow";
  gridGap?: string;
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
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
    overlay?: string;
  };
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    monoFont?: string;
  };
}
