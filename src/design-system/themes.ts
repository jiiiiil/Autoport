import {
  FONT_FAMILIES,
  FONT_SCALE,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  LETTER_SPACINGS,
  RADIUS_STYLES,
  SHADOW_ALPHAS,
  SHADOW_STRUCTURES,
  SPACING_SCALE,
  BREAKPOINTS,
  CONTAINER_WIDTHS,
  Z_INDEX_SCALE,
  OPACITY_SCALE,
  BLUR_SCALE,
  DURATIONS,
  EASINGS,
  GRID,
  GLASS_PRESETS,
  BORDERS,
} from "./tokens";
import type { DesignTokens, DesignThemeKey, ThemeDefinition, ThemeColors, DerivedColors } from "./types";
import { withAlpha, mix, adjustForMode, readableOn, toRgbTuple } from "./color";

export const DESIGN_THEME_KEYS: DesignThemeKey[] = [
  "black",
  "white",
  "dark-blue",
  "spatial-3d",
  "minimal-light",
];

export const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    key: "spatial-3d",
    label: "AiPort Spatial 3D Engine",
    description: "Apple editorial typography + Awwwards 3D character storytelling + continuous scroll spatial motion.",
    swatch: ["#050508", "#12131c", "#38bdf8", "#a855f7", "#ffffff"],
    mode: "dark",
    backgroundStyle: "mesh-gradient",
    radiusStyle: "rounded",
    glassIntensity: "subtle",
    colors: {
      primary: "#38bdf8",
      secondary: "#a855f7",
      accent: "#38bdf8",
      background: "#050508",
      surface: "#12131c",
      surfaceElevated: "#1a1c2b",
      text: "#ffffff",
      textSecondary: "#cbd5e1",
      textMuted: "#94a3b8",
      border: "#1e293b",
      borderSubtle: "#0f172a",
    },
  },
  {
    key: "black",
    label: "Black (Pure Dark Neumorphic)",
    description: "Deep obsidian dark background, dual neumorphic depth, bold white h1 headings & pure white text.",
    swatch: ["#050508", "#0e0e14", "#00f0ff", "#ffffff", "#ffffff"],
    mode: "dark",
    backgroundStyle: "mesh-gradient",
    radiusStyle: "rounded",
    glassIntensity: "subtle",
    colors: {
      primary: "#ffffff",
      secondary: "#94a3b8",
      accent: "#ffffff",
      background: "#050508",
      surface: "#0e0e14",
      surfaceElevated: "#161620",
      text: "#ffffff",
      textSecondary: "#e2e8f0",
      textMuted: "#94a3b8",
      border: "#222230",
      borderSubtle: "#141420",
    },
  },
  {
    key: "white",
    label: "White (Pure Light Neumorphic)",
    description: "Crisp white background, dual light neumorphic depth, bold black h1 headings & pure black text.",
    swatch: ["#ffffff", "#f8f9fa", "#000000", "#18181b", "#000000"],
    mode: "light",
    backgroundStyle: "flat",
    radiusStyle: "rounded",
    glassIntensity: "strong",
    shadowTint: "#0f172a",
    container: "wide",
    colors: {
      primary: "#000000",
      secondary: "#334155",
      accent: "#2563eb",
      background: "#ffffff",
      surface: "#ffffff",
      surfaceElevated: "#f4f6f9",
      text: "#000000",
      textSecondary: "#1e293b",
      textMuted: "#475569",
      border: "#e2e8f0",
      borderSubtle: "#f1f5f9",
      success: "#16a34a",
      warning: "#d97706",
      error: "#dc2626",
      info: "#2563eb",
      overlay: "rgba(255, 255, 255, 0.9)",
    },
  },
  {
    key: "dark-blue",
    label: "Black (Obsidian Cyber)",
    description: "Deep obsidian black with pure white text.",
    swatch: ["#050508", "#0e0e14", "#ffffff", "#ffffff"],
    mode: "dark",
    backgroundStyle: "mesh-gradient",
    radiusStyle: "standard",
    glassIntensity: "subtle",
    colors: {
      primary: "#ffffff",
      secondary: "#94a3b8",
      accent: "#e2e8f0",
      background: "#050508",
      surface: "#0e0e14",
      surfaceElevated: "#161620",
      text: "#ffffff",
      textSecondary: "#e2e8f0",
      textMuted: "#94a3b8",
      border: "#222230",
      borderSubtle: "#141420",
    },
  },
  {
    key: "minimal-light",
    label: "White Neumorphic",
    description: "Crisp white canvas with pure black text.",
    swatch: ["#ffffff", "#f8f9fa", "#000000", "#18181b"],
    mode: "light",
    backgroundStyle: "flat",
    radiusStyle: "rounded",
    glassIntensity: "strong",
    shadowTint: "#0f172a",
    container: "wide",
    colors: {
      primary: "#000000",
      secondary: "#1d4ed8",
      accent: "#0ea5e9",
      background: "#ffffff",
      surface: "#ffffff",
      surfaceElevated: "#f4f6f9",
      text: "#000000",
      textSecondary: "#1e293b",
      textMuted: "#475569",
      border: "#e2e8f0",
      borderSubtle: "#f1f5f9",
      success: "#16a34a",
      warning: "#d97706",
      error: "#dc2626",
      info: "#2563eb",
      overlay: "rgba(255, 255, 255, 0.9)",
    },
  },
];

const DEFAULT_FUNCTION_COLORS: Record<"dark" | "light", { success: string; warning: string; error: string; info: string }> = {
  dark: { success: "#22c55e", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6" },
  light: { success: "#16a34a", warning: "#d97706", error: "#dc2626", info: "#2563eb" },
};

function completeColors(def: ThemeDefinition): ThemeColors {
  const fn = DEFAULT_FUNCTION_COLORS[def.mode];
  return {
    primary: def.colors.primary,
    secondary: def.colors.secondary,
    accent: def.colors.accent,
    background: def.colors.background,
    surface: def.colors.surface,
    surfaceElevated: def.colors.surfaceElevated,
    text: def.colors.text,
    textSecondary: def.colors.textSecondary,
    textMuted: def.colors.textMuted,
    border: def.colors.border,
    borderSubtle: def.colors.borderSubtle,
    success: def.colors.success ?? fn.success,
    warning: def.colors.warning ?? fn.warning,
    error: def.colors.error ?? fn.error,
    info: def.colors.info ?? fn.info,
    overlay: def.colors.overlay ?? (def.mode === "dark" ? "rgba(0, 0, 0, 0.85)" : "rgba(255, 255, 255, 0.8)"),
  };
}

export function deriveColors(colors: ThemeColors, mode: "dark" | "light", shadowTint?: string): DerivedColors {
  const primaryStates = adjustForMode(colors.primary, mode);
  const surfaceStates = adjustForMode(colors.surface, mode, 0.05, 0.09);
  const shadowColor = shadowTint ?? (mode === "dark" ? "#000000" : "#0f172a");

  return {
    primaryHover: primaryStates.hover,
    primaryActive: primaryStates.active,
    primarySoft: withAlpha(colors.primary, mode === "dark" ? 0.14 : 0.1),
    primarySofter: withAlpha(colors.primary, 0.06),
    ring: withAlpha(colors.primary, 0.4),
    onPrimary: readableOn(colors.primary),
    onAccent: readableOn(colors.accent),
    onSurface: colors.text,
    surfaceHover: surfaceStates.hover,
    surfaceActive: surfaceStates.active,
    successSoft: withAlpha(colors.success, 0.12),
    warningSoft: withAlpha(colors.warning, 0.12),
    errorSoft: withAlpha(colors.error, 0.12),
    infoSoft: withAlpha(colors.info, 0.12),
    shadowColor,
    gradientPrimary: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
    gradientSecondary: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
    gradientHero: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    gradientCard: `linear-gradient(160deg, ${colors.surface} 0%, ${colors.surfaceElevated} 100%)`,
    gradientText: `linear-gradient(120deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
  };
}

function buildShadows(colors: ThemeColors, derived: DerivedColors, intensity = 1): Record<string, string> {
  const [r, g, b] = toRgbTuple(derived.shadowColor);
  const out: Record<string, string> = {};
  for (const [name, alpha] of Object.entries(SHADOW_ALPHAS)) {
    const a = Math.max(0, Math.min(1, alpha * intensity));
    const structure = SHADOW_STRUCTURES[name];
    out[name] = structure(a).replaceAll("SHADOW", `${r}, ${g}, ${b}`);
  }
  out["none"] = "none";
  return out;
}

function buildGlass(def: ThemeDefinition, colors: ThemeColors) {
  const preset = GLASS_PRESETS[def.glassIntensity ?? "subtle"];
  const isLight = def.mode === "light";
  const baseBg = isLight ? "#ffffff" : colors.surface;
  const baseBorder = isLight ? "#e2e8f0" : colors.border;

  return {
    background: withAlpha(baseBg, preset.opacity),
    border: withAlpha(baseBorder, preset.borderOpacity),
    blur: preset.blur,
    saturate: preset.saturate,
    opacity: preset.opacity,
    hoverBackground: withAlpha(baseBg, Math.min(1, preset.opacity + 0.1)),
    hoverBorder: withAlpha(baseBorder, Math.min(1, preset.borderOpacity + 0.15)),
    panelBackground: withAlpha(baseBg, isLight ? 0.7 : 0.5),
    panelBorder: withAlpha(baseBorder, isLight ? 0.5 : 0.3),
  };
}

function buildElevation(shadows: Record<string, string>): Record<string, string> {
  return {
    "0": "none",
    "1": shadows.md,
    "2": shadows.lg,
    "3": shadows["2xl"],
  };
}

function buildContainer(def: ThemeDefinition): Record<string, string> {
  const widths: Record<string, string> = { ...CONTAINER_WIDTHS };
  if (def.container === "wide") {
    widths.content = "1320px";
    widths.wide = "1440px";
    widths["2xl"] = "1536px";
  } else if (def.container === "narrow") {
    widths.content = "1080px";
    widths.wide = "1200px";
  }
  return widths;
}

export function buildDesignTokens(def: ThemeDefinition): DesignTokens {
  const colors = completeColors(def);
  const derived = deriveColors(colors, def.mode, def.shadowTint);
  const shadows = buildShadows(colors, derived, def.shadowIntensity ?? 1);
  const glass = buildGlass(def, colors);
  const radius = RADIUS_STYLES[def.radiusStyle ?? "standard"];
  const grid = { ...GRID, gap: def.gridGap ?? GRID.gap };
  const typography = {
    headingFont: def.typography?.headingFont ?? FONT_FAMILIES.heading,
    bodyFont: def.typography?.bodyFont ?? FONT_FAMILIES.body,
    monoFont: def.typography?.monoFont ?? FONT_FAMILIES.mono,
  };

  return {
    key: def.key,
    mode: def.mode,
    label: def.label,
    description: def.description,
    swatch: def.swatch,
    backgroundStyle: def.backgroundStyle,
    colors,
    derived,
    typography,
    fontScale: { ...FONT_SCALE },
    fontWeight: { ...FONT_WEIGHTS },
    lineHeight: { ...LINE_HEIGHTS },
    letterSpacing: { ...LETTER_SPACINGS },
    radius,
    shadows,
    glass,
    blur: { ...BLUR_SCALE },
    elevation: buildElevation(shadows),
    opacity: { ...OPACITY_SCALE },
    grid,
    containerWidths: buildContainer(def),
    breakpoints: { ...BREAKPOINTS },
    zIndex: { ...Z_INDEX_SCALE },
    spacing: { ...SPACING_SCALE },
    durations: { ...DURATIONS },
    easing: { ...EASINGS },
    borders: { ...BORDERS },
  };
}

export function getThemeDefinition(key: DesignThemeKey): ThemeDefinition {
  const def = THEME_DEFINITIONS.find((d) => d.key === key);
  if (!def) return THEME_DEFINITIONS[0];
  return def;
}

const DESIGN_TOKENS_CACHE = new Map<string, DesignTokens>();

export function getDesignTokens(key: DesignThemeKey): DesignTokens {
  const cached = DESIGN_TOKENS_CACHE.get(key);
  if (cached) return cached;
  const tokens = buildDesignTokens(getThemeDefinition(key));
  DESIGN_TOKENS_CACHE.set(key, tokens);
  return tokens;
}

export function getAllDesignTokens(): DesignTokens[] {
  return DESIGN_THEME_KEYS.map((key) => getDesignTokens(key));
}

export function buildCustomDesignTokens(overrides: Partial<ThemeColors> = {}): DesignTokens {
  const base = getDesignTokens("dark-blue");
  const colors: ThemeColors = { ...base.colors, ...overrides };
  const derived = deriveColors(colors, "dark");
  const shadows = buildShadows(colors, derived);
  const glass = buildGlass({ ...getThemeDefinition("dark-blue"), mode: "dark" }, colors);

  return {
    ...base,
    key: "custom",
    label: "Custom",
    description: "AI-composed palette tuned to your resume.",
    colors,
    derived,
    shadows,
    glass,
    elevation: buildElevation(shadows),
  };
}

export { mix };
