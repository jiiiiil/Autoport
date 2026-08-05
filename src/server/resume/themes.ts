import type { ThemeName } from "./types";
import type { ComposedTheme } from "@/server/ai/composition/types";
import type { ThemeColors } from "@/design-system/types";
import { getAllDesignTokens, getDesignTokens, buildCustomDesignTokens } from "@/design-system/themes";
import {
  getComposedThemeForKey,
  getComposedThemeForCustom,
  composedThemeToTokens,
  tokensToComposedTheme,
} from "@/design-system/composition";

export interface ThemePreset {
  id: ThemeName;
  label: string;
  description: string;
  swatch: string[];
  dark: boolean;
}

export const THEME_PRESETS: ThemePreset[] = getAllDesignTokens().map((tokens) => ({
  id: tokens.key as ThemeName,
  label: tokens.label,
  description: tokens.description,
  swatch: tokens.swatch,
  dark: tokens.mode === "dark",
}));

export const CUSTOM_THEME_PRESET: ThemePreset = {
  id: "custom",
  label: "Custom",
  description: "AI-composed palette tuned to your resume.",
  swatch: getDesignTokens("black").swatch,
  dark: true,
};

export function getThemePreset(name: ThemeName): ComposedTheme {
  if (name === "custom") return getComposedThemeForCustom();
  if (name === "white" || name === "minimal-light") {
    return getComposedThemeForKey("white");
  }
  return getComposedThemeForKey("black");
}

export function getThemeNameFromPreset(theme: ComposedTheme): ThemeName {
  if (theme.mode === "light") return "white";
  return "black";
}

export function applyCustomThemeColors(
  theme: ComposedTheme,
  colors: Partial<Pick<ThemeColors, "primary" | "secondary" | "accent" | "background" | "surface" | "text">>,
): ComposedTheme {
  const tokens = composedThemeToTokens(theme);
  const merged: ThemeColors = {
    ...tokens.colors,
    primary: colors.primary ?? tokens.colors.primary,
    secondary: colors.secondary ?? tokens.colors.secondary,
    accent: colors.accent ?? tokens.colors.accent,
    background: colors.background ?? tokens.colors.background,
    surface: colors.surface ?? tokens.colors.surface,
    text: colors.text ?? tokens.colors.text,
  };

  const custom = tokensToComposedTheme(buildCustomDesignTokens(merged));
  return custom;
}
