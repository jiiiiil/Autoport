import type { ThemeMode } from "./types";
import type { ComposedTheme } from "@/server/ai/composition/types";
import { composedThemeToTokens } from "@/design-system/composition";
import { designTokensToCssVars } from "@/design-system/css";

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

const CREATOR_3D_THEME_VARS: ThemeVars = {
  "--p-bg": "#0C0C0C",
  "--p-bg-card": "#1a1a1a",
  "--p-bg-card-hover": "#252525",
  "--p-border": "#2a2a2a",
  "--p-border-subtle": "#1a1a1a",
  "--p-text": "#D7E2EA",
  "--p-text-muted": "#646973",
  "--p-text-secondary": "#BBCCD7",
  "--p-primary": "#BBCCD7",
  "--p-primary-soft": "rgba(187, 204, 215, 0.12)",
  "--p-primary-softer": "rgba(187, 204, 215, 0.06)",
  "--p-secondary": "#646973",
  "--p-accent": "#D7E2EA",
  "--p-gradient-from": "#646973",
  "--p-gradient-via": "#9AA7B5",
  "--p-gradient-to": "#BBCCD7",
  "--p-code-bg": "#161616",
  "--p-code-border": "#2a2a2a",
  "--neu-outset": "6px 6px 14px #050505, -6px -6px 14px #1c1c1c",
  "--neu-inset": "inset 4px 4px 8px #050505, inset -4px -4px 8px #1c1c1c",
};

const FALLBACK_THEMES: Record<ThemeMode, ThemeVars> = {
  dark: BLACK_THEME_VARS,
  black: BLACK_THEME_VARS,
  light: WHITE_THEME_VARS,
  white: WHITE_THEME_VARS,
  "spatial-3d": BLACK_THEME_VARS,
  spatial: BLACK_THEME_VARS,
  "3d-creator": CREATOR_3D_THEME_VARS,
};

export function getThemeStylesFromComposition(theme: ComposedTheme): React.CSSProperties {
  try {
    const tokens = composedThemeToTokens(theme);
    return designTokensToCssVars(tokens) as React.CSSProperties;
  } catch {
    // legacy fallback for minimal ComposedTheme shapes
  }

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
      vars[`--p-space-${key}`] = value;
    }
  }
  if (theme?.radius) {
    for (const [key, value] of Object.entries(theme.radius)) {
      vars[`--p-radius-${key}`] = value;
    }
  }
  if (theme?.shadows) {
    for (const [key, value] of Object.entries(theme.shadows)) {
      vars[`--p-shadow-${key}`] = value;
    }
  }
  if (theme?.transitionDurations) {
    for (const [key, value] of Object.entries(theme.transitionDurations)) {
      vars[`--p-duration-${key}`] = value;
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
  const border = colors?.border ?? "#2a2a2a";

  switch (style) {
    case "mesh-gradient":
      return {
        background: `
          radial-gradient(ellipse 80% 60% at 0% 0%, ${primary}22 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 100% 10%, ${accent}18 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 50% 100%, ${secondary}15 0%, transparent 50%),
          ${bg}
        `,
      };
    case "aurora":
      return {
        background: `
          linear-gradient(180deg, ${primary}11 0%, transparent 30%),
          linear-gradient(0deg, ${accent}0d 0%, transparent 40%),
          radial-gradient(ellipse 100% 40% at 50% 20%, ${primary}08 0%, transparent 50%),
          radial-gradient(ellipse 80% 30% at 30% 80%, ${accent}06 0%, transparent 50%),
          ${bg}
        `,
      };
    case "grid":
      return {
        background: `
          linear-gradient(${bg}, ${bg}),
          linear-gradient(90deg, ${border} 1px, transparent 1px),
          linear-gradient(0deg, ${border} 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        backgroundBlendMode: "normal, overlay, overlay",
      };
    case "floating-blobs":
      return {
        background: `
          radial-gradient(ellipse 50% 40% at 20% 30%, ${primary}20 0%, transparent 50%),
          radial-gradient(ellipse 40% 30% at 80% 20%, ${accent}18 0%, transparent 50%),
          radial-gradient(ellipse 30% 50% at 60% 70%, ${secondary}15 0%, transparent 50%),
          radial-gradient(ellipse 35% 35% at 10% 80%, ${primary}10 0%, transparent 50%),
          ${bg}
        `,
      };
    case "noise":
      return {
        background: bg,
        backgroundImage: `
          radial-gradient(circle at 1px 1px, ${border} 1px, transparent 0)
        `,
        backgroundSize: "24px 24px",
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
    .map(f => `family=${f.replace(/\s+/g, "+")}:wght@400;500;600;700;800`)
    .join("&");

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
