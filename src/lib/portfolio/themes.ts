import type { ThemeMode } from "./types";

type ThemeVars = Record<string, string>;

const THEMES: Record<ThemeMode, ThemeVars> = {
  dark: {
    "--p-bg": "#0f0f0f",
    "--p-bg-card": "#1a1a1a",
    "--p-bg-card-hover": "#222222",
    "--p-border": "#2a2a2a",
    "--p-text": "#ffffff",
    "--p-text-muted": "#a0a0a0",
    "--p-primary": "#7c3aed",
    "--p-accent": "#06b6d4",
    "--p-gradient-from": "#7c3aed",
    "--p-gradient-via": "#06b6d4",
    "--p-gradient-to": "#7c3aed",
    "--p-code-bg": "#0a0a0a",
    "--p-code-border": "#1e1e1e",
  },
  light: {
    "--p-bg": "#fafafa",
    "--p-bg-card": "#ffffff",
    "--p-bg-card-hover": "#f5f5f5",
    "--p-border": "#e5e5e5",
    "--p-text": "#171717",
    "--p-text-muted": "#737373",
    "--p-primary": "#7c3aed",
    "--p-accent": "#06b6d4",
    "--p-gradient-from": "#7c3aed",
    "--p-gradient-via": "#06b6d4",
    "--p-gradient-to": "#7c3aed",
    "--p-code-bg": "#f5f5f5",
    "--p-code-border": "#e5e5e5",
  },
  red: {
    "--p-bg": "#1a0a0a",
    "--p-bg-card": "#2a1010",
    "--p-bg-card-hover": "#3a1818",
    "--p-border": "#3d1f1f",
    "--p-text": "#ffffff",
    "--p-text-muted": "#d4a0a0",
    "--p-primary": "#ef4444",
    "--p-accent": "#f97316",
    "--p-gradient-from": "#ef4444",
    "--p-gradient-via": "#f97316",
    "--p-gradient-to": "#ef4444",
    "--p-code-bg": "#1a0808",
    "--p-code-border": "#2a1010",
  },
  futuristic: {
    "--p-bg": "#050a18",
    "--p-bg-card": "#0c1428",
    "--p-bg-card-hover": "#121e38",
    "--p-border": "#1a2a4a",
    "--p-text": "#e8f0ff",
    "--p-text-muted": "#7090c0",
    "--p-primary": "#00d4ff",
    "--p-accent": "#a855f7",
    "--p-gradient-from": "#00d4ff",
    "--p-gradient-via": "#a855f7",
    "--p-gradient-to": "#00d4ff",
    "--p-code-bg": "#080e20",
    "--p-code-border": "#14203a",
  },
};

export function getThemeVars(mode: ThemeMode): ThemeVars {
  return THEMES[mode] ?? THEMES.dark;
}

export function getThemeStyles(mode: ThemeMode): React.CSSProperties {
  const vars = getThemeVars(mode);
  return Object.fromEntries(Object.entries(vars)) as React.CSSProperties;
}
