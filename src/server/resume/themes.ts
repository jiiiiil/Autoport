import type { ThemeName } from "./types";
import type { ComposedTheme } from "@/server/ai/composition/types";

export interface ThemePreset {
  id: ThemeName;
  label: string;
  description: string;
  swatch: string[];
  dark: boolean;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "dark-blue",
    label: "Dark Blue",
    description: "Deep navy with electric blue accents — trust, depth, engineering.",
    swatch: ["#0a1128", "#1e3a8a", "#3b82f6", "#38bdf8", "#e2e8f0"],
    dark: true,
  },
  {
    id: "dark-red",
    label: "Dark Red",
    description: "Near-black crimson with ember accents — bold and dramatic.",
    swatch: ["#1a0505", "#7f1d1d", "#ef4444", "#f97316", "#fecaca"],
    dark: true,
  },
  {
    id: "black",
    label: "Black",
    description: "Pure monochrome with silver glints — premium and editorial.",
    swatch: ["#0a0a0a", "#1c1c1c", "#e5e5e5", "#737373", "#fafafa"],
    dark: true,
  },
  {
    id: "purple",
    label: "Purple",
    description: "Deep violet with magenta glow — creative and distinctive.",
    swatch: ["#0c0815", "#4c1d95", "#8b5cf6", "#d946ef", "#ede9fe"],
    dark: true,
  },
  {
    id: "green",
    label: "Green",
    description: "Forest darkness with emerald and lime — growth and innovation.",
    swatch: ["#04120b", "#14532d", "#22c55e", "#84cc16", "#dcfce7"],
    dark: true,
  },
  {
    id: "custom",
    label: "Custom",
    description: "AI-composed palette tuned to your resume.",
    swatch: ["#0f0f0f", "#7c3aed", "#06b6d4", "#22c55e", "#f59e0b"],
    dark: true,
  },
];

const TYPOGRAPHY = {
  headingFont: "'Inter', sans-serif",
  bodyFont: "'Inter', sans-serif",
  monoFont: "'JetBrains Mono', monospace",
  scale: {
    xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem",
    xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem",
    "5xl": "3rem", "6xl": "3.75rem", "7xl": "4.5rem", "8xl": "6rem",
  },
  lineHeights: { tight: "1.15", snug: "1.3", normal: "1.5", relaxed: "1.625", loose: "2" },
  letterSpacings: { tighter: "-0.05em", tight: "-0.025em", normal: "0", wide: "0.025em", wider: "0.05em", widest: "0.1em" },
  fontWeights: { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
} as const;

const SPACING = {
  "0": "0", "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem",
  "6": "1.5rem", "8": "2rem", "10": "2.5rem", "12": "3rem", "16": "4rem",
  "20": "5rem", "24": "6rem", "32": "8rem",
};

const RADIUS = {
  none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem", xl: "1rem",
  "2xl": "1.5rem", full: "9999px",
};

const SHADOWS = {
  sm: "0 1px 2px rgba(0,0,0,0.4)",
  md: "0 4px 6px rgba(0,0,0,0.4)",
  lg: "0 10px 15px rgba(0,0,0,0.4)",
  xl: "0 20px 25px rgba(0,0,0,0.4)",
};

const BORDERS = { thin: "1px solid", medium: "2px solid", thick: "3px solid" };

const TRANSITIONS = { fast: "150ms", normal: "300ms", slow: "500ms", slower: "700ms" };

const Z_INDEX = { base: 0, dropdown: 10, sticky: 20, overlay: 30, modal: 40, popover: 50, tooltip: 60 };

function buildTheme(palette: {
  primary: string; secondary: string; accent: string;
  background: string; surface: string; surfaceElevated: string;
  text: string; textSecondary: string; textMuted: string;
  border: string; borderSubtle: string;
}): ComposedTheme {
  const { primary, secondary, accent, background, surface, surfaceElevated, text, textSecondary, textMuted, border, borderSubtle } = palette;

  return {
    mode: "dark",
    colors: {
      primary, secondary, accent, background, surface, surfaceElevated,
      text, textSecondary, textMuted, border, borderSubtle,
      success: "#22c55e", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6",
      overlay: "rgba(0,0,0,0.85)",
    },
    typography: { ...TYPOGRAPHY },
    spacing: { ...SPACING },
    radius: { ...RADIUS },
    shadows: { ...SHADOWS },
    gradients: {
      primary: `linear-gradient(135deg, ${primary}, ${accent})`,
      secondary: `linear-gradient(135deg, ${accent}, ${secondary})`,
      hero: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
      card: `linear-gradient(160deg, ${surface} 0%, ${surfaceElevated} 100%)`,
      text: `linear-gradient(120deg, ${text} 0%, ${primary} 60%, ${accent} 100%)`,
    },
    backgroundStyle: "mesh-gradient",
    borders: { ...BORDERS },
    transitionDurations: { ...TRANSITIONS },
    zIndex: { ...Z_INDEX },
  };
}

const THEME_PALETTES: Record<ThemeName, ReturnType<typeof buildTheme>> = {
  "dark-blue": buildTheme({
    primary: "#3b82f6",
    secondary: "#1e3a8a",
    accent: "#38bdf8",
    background: "#0a1128",
    surface: "#111c3d",
    surfaceElevated: "#17274f",
    text: "#f1f5f9",
    textSecondary: "#cbd5e1",
    textMuted: "#7d93b8",
    border: "#243b63",
    borderSubtle: "#16264a",
  }),
  "dark-red": buildTheme({
    primary: "#ef4444",
    secondary: "#7f1d1d",
    accent: "#f97316",
    background: "#1a0505",
    surface: "#2a0d0d",
    surfaceElevated: "#3a1515",
    text: "#fef2f2",
    textSecondary: "#fca5a5",
    textMuted: "#b56565",
    border: "#4a1f1f",
    borderSubtle: "#361414",
  }),
  black: buildTheme({
    primary: "#e5e5e5",
    secondary: "#737373",
    accent: "#fafafa",
    background: "#0a0a0a",
    surface: "#161616",
    surfaceElevated: "#1f1f1f",
    text: "#fafafa",
    textSecondary: "#d4d4d4",
    textMuted: "#8a8a8a",
    border: "#2a2a2a",
    borderSubtle: "#1d1d1d",
  }),
  purple: buildTheme({
    primary: "#8b5cf6",
    secondary: "#4c1d95",
    accent: "#d946ef",
    background: "#0c0815",
    surface: "#170f28",
    surfaceElevated: "#1f1437",
    text: "#f5f3ff",
    textSecondary: "#ddd6fe",
    textMuted: "#8b7fb5",
    border: "#332558",
    borderSubtle: "#251a42",
  }),
  green: buildTheme({
    primary: "#22c55e",
    secondary: "#14532d",
    accent: "#84cc16",
    background: "#04120b",
    surface: "#0b2417",
    surfaceElevated: "#123322",
    text: "#f0fdf4",
    textSecondary: "#bbf7d0",
    textMuted: "#6fa887",
    border: "#1c4d33",
    borderSubtle: "#123a26",
  }),
  custom: buildTheme({
    primary: "#8b5cf6",
    secondary: "#0ea5e9",
    accent: "#ec4899",
    background: "#0c0c1a",
    surface: "#161630",
    surfaceElevated: "#1e1e3c",
    text: "#f8fafc",
    textSecondary: "#cbd5e1",
    textMuted: "#7e86a6",
    border: "#2a2a50",
    borderSubtle: "#1e1e3e",
  }),
};

export function getThemePreset(name: ThemeName): ComposedTheme {
  return THEME_PALETTES[name] ?? THEME_PALETTES.custom;
}

export function getThemeNameFromPreset(theme: ComposedTheme): ThemeName {
  for (const [name, preset] of Object.entries(THEME_PALETTES)) {
    if (preset.colors.background === theme.colors.background && preset.colors.primary === theme.colors.primary) {
      return name as ThemeName;
    }
  }
  return "custom";
}

export function applyCustomThemeColors(theme: ComposedTheme, colors: { primary?: string; secondary?: string; accent?: string; background?: string; surface?: string; text?: string }): ComposedTheme {
  const merged = {
    ...theme.colors,
    primary: colors.primary ?? theme.colors.primary,
    secondary: colors.secondary ?? theme.colors.secondary,
    accent: colors.accent ?? theme.colors.accent,
    background: colors.background ?? theme.colors.background,
    surface: colors.surface ?? theme.colors.surface,
    text: colors.text ?? theme.colors.text,
  };

  const updated = buildTheme(merged);
  return {
    ...updated,
    gradients: {
      primary: `linear-gradient(135deg, ${merged.primary}, ${merged.accent})`,
      secondary: `linear-gradient(135deg, ${merged.accent}, ${merged.secondary})`,
      hero: `linear-gradient(135deg, ${merged.primary} 0%, ${merged.accent} 100%)`,
      card: `linear-gradient(160deg, ${merged.surface} 0%, ${theme.colors.surfaceElevated} 100%)`,
      text: `linear-gradient(120deg, ${merged.text} 0%, ${merged.primary} 60%, ${merged.accent} 100%)`,
    },
  };
}
