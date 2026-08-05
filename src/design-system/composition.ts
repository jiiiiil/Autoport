import type { ComposedTheme } from "@/server/ai/composition/types";
import type { ThemeMode } from "@/server/ai/intelligence/types";
import type { DesignTokens, DesignThemeKey, ThemeColors } from "./types";
import { getDesignTokens, getThemeDefinition, buildDesignTokens, buildCustomDesignTokens, deriveColors } from "./themes";
import { toRgbTuple, withAlpha } from "./color";
import { SHADOW_ALPHAS, SHADOW_STRUCTURES } from "./tokens";

function themeKeyFromMode(theme: ComposedTheme): DesignThemeKey {
  const mode = theme.mode === "light" ? "light" : "dark";
  if (mode === "light") return "white";
  return "black";
}

function tokensFromComposedTheme(theme: ComposedTheme): DesignTokens {
  const mode: "dark" | "light" = theme.mode === "light" ? "light" : "dark";
  const colors: ThemeColors = {
    primary: theme.colors.primary ?? "#9333ea",
    secondary: theme.colors.secondary ?? "#581c87",
    accent: theme.colors.accent ?? "#e11d48",
    background: theme.colors.background ?? "#07040d",
    surface: theme.colors.surface ?? "#130622",
    surfaceElevated: theme.colors.surfaceElevated ?? "#1d0a33",
    text: theme.colors.text ?? "#f5f3ff",
    textSecondary: theme.colors.textSecondary ?? "#ddd6fe",
    textMuted: theme.colors.textMuted ?? "#a78bfa",
    border: theme.colors.border ?? "#2c0e4a",
    borderSubtle: theme.colors.borderSubtle ?? "#1c0930",
    success: theme.colors.success ?? "#22c55e",
    warning: theme.colors.warning ?? "#f59e0b",
    error: theme.colors.error ?? "#ef4444",
    info: theme.colors.info ?? "#9333ea",
    overlay: theme.colors.overlay ?? "rgba(7, 4, 13, 0.85)",
  };

  const shadowColor = theme.colors.shadowColor ?? (mode === "dark" ? "#000000" : "#0f172a");
  const derived = {
    ...deriveColors(colors, mode, theme.colors.shadowColor),
    shadowColor,
    primaryHover: theme.colors.primaryHover ?? deriveColors(colors, mode).primaryHover,
    primaryActive: theme.colors.primaryActive ?? deriveColors(colors, mode).primaryActive,
    primarySoft: theme.colors.primarySoft ?? withAlpha(colors.primary, 0.14),
    primarySofter: theme.colors.primarySofter ?? withAlpha(colors.primary, 0.06),
    ring: theme.colors.ring ?? withAlpha(colors.primary, 0.4),
    onPrimary: theme.colors.onPrimary ?? (mode === "dark" ? "#ffffff" : "#0f172a"),
    onAccent: theme.colors.onAccent ?? (mode === "dark" ? "#ffffff" : "#0f172a"),
    onSurface: theme.colors.onSurface ?? colors.text,
    surfaceHover: theme.colors.surfaceHover ?? deriveColors(colors, mode).surfaceHover,
    surfaceActive: theme.colors.surfaceActive ?? deriveColors(colors, mode).surfaceActive,
    successSoft: theme.colors.successSoft ?? withAlpha(colors.success, 0.12),
    warningSoft: theme.colors.warningSoft ?? withAlpha(colors.warning, 0.12),
    errorSoft: theme.colors.errorSoft ?? withAlpha(colors.error, 0.12),
    infoSoft: theme.colors.infoSoft ?? withAlpha(colors.info, 0.12),
  };

  const key = themeKeyFromMode(theme);
  const base = getDesignTokens(key);

  let shadows = theme.shadows ?? base.shadows;
  if (!shadows || Object.keys(shadows).length === 0) {
    const [r, g, b] = toRgbTuple(shadowColor);
    shadows = {};
    for (const [name, alpha] of Object.entries(SHADOW_ALPHAS)) {
      shadows[name] = SHADOW_STRUCTURES[name](alpha).replaceAll("SHADOW", `${r}, ${g}, ${b}`);
    }
    shadows["none"] = "none";
  }

  return {
    key,
    mode,
    label: base.label,
    description: base.description,
    swatch: base.swatch,
    backgroundStyle: theme.backgroundStyle ?? base.backgroundStyle,
    colors,
    derived,
    typography: {
      headingFont: theme.typography?.headingFont ?? base.typography.headingFont,
      bodyFont: theme.typography?.bodyFont ?? base.typography.bodyFont,
      monoFont: theme.typography?.monoFont ?? base.typography.monoFont,
    },
    fontScale: theme.fontScale ?? base.fontScale,
    fontWeight: theme.fontWeight ?? base.fontWeight,
    lineHeight: theme.lineHeight ?? base.lineHeight,
    letterSpacing: theme.letterSpacing ?? base.letterSpacing,
    radius: theme.radius ?? base.radius,
    shadows,
    glass: {
      background: theme.glass?.["--p-glass-bg"] ?? base.glass.background,
      border: theme.glass?.["--p-glass-border"] ?? base.glass.border,
      blur: theme.glass?.["--p-glass-blur"] ?? base.glass.blur,
      saturate: theme.glass?.["--p-glass-saturate"] ?? base.glass.saturate,
      opacity: Number(theme.glass?.["--p-glass-opacity"] ?? base.glass.opacity),
      hoverBackground: theme.glass?.["--p-glass-hover-bg"] ?? base.glass.hoverBackground,
      hoverBorder: theme.glass?.["--p-glass-hover-border"] ?? base.glass.hoverBorder,
      panelBackground: theme.glass?.["--p-glass-panel-bg"] ?? base.glass.panelBackground,
      panelBorder: theme.glass?.["--p-glass-panel-border"] ?? base.glass.panelBorder,
    },
    blur: theme.blur ?? base.blur,
    elevation: theme.elevation ?? base.elevation,
    opacity: theme.opacity ?? base.opacity,
    grid: {
      columns: Number(theme.grid?.columns ?? base.grid.columns),
      gap: String(theme.grid?.gap ?? base.grid.gap),
      sectionColumns: Number(theme.grid?.sectionColumns ?? base.grid.sectionColumns),
      cardColumns: String(theme.grid?.cardColumns ?? base.grid.cardColumns),
      galleryColumns: String(theme.grid?.galleryColumns ?? base.grid.galleryColumns),
      sidebarWidth: String(theme.grid?.sidebarWidth ?? base.grid.sidebarWidth),
    },
    containerWidths: theme.containerWidths ?? base.containerWidths,
    breakpoints: theme.breakpoints ?? base.breakpoints,
    zIndex: theme.zIndex ?? base.zIndex,
    spacing: theme.spacing ?? base.spacing,
    durations: theme.transitionDurations ?? base.durations,
    easing: theme.transitionCurves ?? base.easing,
    borders: theme.borders ?? base.borders,
  };
}

export function tokensToComposedTheme(tokens: DesignTokens): ComposedTheme {
  const mode = tokens.mode as ThemeMode;
  return {
    mode,
    colors: {
      primary: tokens.colors.primary,
      secondary: tokens.colors.secondary,
      accent: tokens.colors.accent,
      background: tokens.colors.background,
      surface: tokens.colors.surface,
      surfaceElevated: tokens.colors.surfaceElevated,
      text: tokens.colors.text,
      textSecondary: tokens.colors.textSecondary,
      textMuted: tokens.colors.textMuted,
      border: tokens.colors.border,
      borderSubtle: tokens.colors.borderSubtle,
      success: tokens.colors.success,
      warning: tokens.colors.warning,
      error: tokens.colors.error,
      info: tokens.colors.info,
      overlay: tokens.colors.overlay,
      primaryHover: tokens.derived.primaryHover,
      primaryActive: tokens.derived.primaryActive,
      primarySoft: tokens.derived.primarySoft,
      primarySofter: tokens.derived.primarySofter,
      ring: tokens.derived.ring,
      onPrimary: tokens.derived.onPrimary,
      onAccent: tokens.derived.onAccent,
      onSurface: tokens.derived.onSurface,
      surfaceHover: tokens.derived.surfaceHover,
      surfaceActive: tokens.derived.surfaceActive,
      successSoft: tokens.derived.successSoft,
      warningSoft: tokens.derived.warningSoft,
      errorSoft: tokens.derived.errorSoft,
      infoSoft: tokens.derived.infoSoft,
      shadowColor: tokens.derived.shadowColor,
    },
    typography: {
      headingFont: tokens.typography.headingFont,
      bodyFont: tokens.typography.bodyFont,
      monoFont: tokens.typography.monoFont,
      scale: { ...tokens.fontScale },
      lineHeights: { ...tokens.lineHeight },
      letterSpacings: { ...tokens.letterSpacing },
      fontWeights: { ...tokens.fontWeight },
    },
    spacing: { ...tokens.spacing },
    radius: { ...tokens.radius },
    shadows: { ...tokens.shadows },
    gradients: {
      primary: tokens.derived.gradientPrimary,
      secondary: tokens.derived.gradientSecondary,
      hero: tokens.derived.gradientHero,
      card: tokens.derived.gradientCard,
      text: tokens.derived.gradientText,
    },
    backgroundStyle: tokens.backgroundStyle,
    borders: { ...tokens.borders },
    transitionDurations: { ...tokens.durations },
    zIndex: { ...tokens.zIndex },
    fontScale: { ...tokens.fontScale },
    fontWeight: { ...tokens.fontWeight },
    lineHeight: { ...tokens.lineHeight },
    letterSpacing: { ...tokens.letterSpacing },
    blur: { ...tokens.blur },
    glass: {
      "--p-glass-bg": tokens.glass.background,
      "--p-glass-border": tokens.glass.border,
      "--p-glass-blur": tokens.glass.blur,
      "--p-glass-saturate": tokens.glass.saturate,
      "--p-glass-opacity": String(tokens.glass.opacity),
      "--p-glass-hover-bg": tokens.glass.hoverBackground,
      "--p-glass-hover-border": tokens.glass.hoverBorder,
      "--p-glass-panel-bg": tokens.glass.panelBackground,
      "--p-glass-panel-border": tokens.glass.panelBorder,
    },
    elevation: { ...tokens.elevation },
    opacity: { ...tokens.opacity },
    grid: {
      columns: tokens.grid.columns,
      gap: tokens.grid.gap,
      sectionColumns: tokens.grid.sectionColumns,
      cardColumns: tokens.grid.cardColumns,
      galleryColumns: tokens.grid.galleryColumns,
      sidebarWidth: tokens.grid.sidebarWidth,
    },
    containerWidths: { ...tokens.containerWidths },
    breakpoints: { ...tokens.breakpoints },
    transitionCurves: { ...tokens.easing },
  };
}

export function composedThemeToTokens(theme: ComposedTheme): DesignTokens {
  return tokensFromComposedTheme(theme);
}

export function finalizeComposedTheme(theme: ComposedTheme): ComposedTheme {
  return tokensToComposedTheme(tokensFromComposedTheme(theme));
}

export function composedThemeToCssVars(theme: ComposedTheme): Record<string, string> {
  const tokens = composedThemeToTokens(theme);
  return { ...designTokensToVars(tokens) };
}

export function composedThemeToCssString(theme: ComposedTheme): string {
  const tokens = composedThemeToTokens(theme);
  return `:root {\n${Object.entries(designTokensToVars(tokens))
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n")}\n}\n`;
}

import { designTokensToCssVars as designTokensToVars } from "./css";

export function getComposedThemeForKey(key: DesignThemeKey): ComposedTheme {
  return tokensToComposedTheme(getDesignTokens(key));
}

export function getComposedThemeForCustom(overrides?: Partial<ThemeColors>): ComposedTheme {
  return tokensToComposedTheme(buildCustomDesignTokens(overrides));
}

export function themeKeyToComposed(key: DesignThemeKey | "custom", overrides?: Partial<ThemeColors>): ComposedTheme {
  if (key === "custom") return getComposedThemeForCustom(overrides);
  return tokensToComposedTheme(getDesignTokens(key));
}

export { buildDesignTokens, getThemeDefinition };
