import type { ThemeMode } from "./types";
import type { ComposedTheme } from "@/server/ai/composition/types";

type ThemeVars = Record<string, string>;

const FALLBACK_THEMES: Record<ThemeMode, ThemeVars> = {
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

export function getThemeStylesFromComposition(theme: ComposedTheme): React.CSSProperties {
  const vars: Record<string, string> = {};

  const colors = theme?.colors;
  if (colors) {
    vars["--p-bg"] = colors.background ?? "#0f0f0f";
    vars["--p-bg-card"] = colors.surface ?? "#1a1a1a";
    vars["--p-bg-card-hover"] = colors.surfaceElevated ?? "#222222";
    vars["--p-border"] = colors.border ?? "#2a2a2a";
    vars["--p-border-subtle"] = colors.borderSubtle ?? "#1a1a1a";
    vars["--p-text"] = colors.text ?? "#ffffff";
    vars["--p-text-muted"] = colors.textMuted ?? "#a0a0a0";
    vars["--p-text-secondary"] = colors.textSecondary ?? "#a3a3a3";
    vars["--p-primary"] = colors.primary ?? "#7c3aed";
    vars["--p-secondary"] = colors.secondary ?? "#4f46e5";
    vars["--p-accent"] = colors.accent ?? "#06b6d4";
    vars["--p-success"] = colors.success ?? "#22c55e";
    vars["--p-warning"] = colors.warning ?? "#f59e0b";
    vars["--p-error"] = colors.error ?? "#ef4444";
    vars["--p-info"] = colors.info ?? "#3b82f6";
    vars["--p-gradient-from"] = colors.primary ?? "#7c3aed";
    vars["--p-gradient-via"] = colors.accent ?? "#06b6d4";
    vars["--p-gradient-to"] = colors.primary ?? "#7c3aed";
    vars["--p-overlay"] = colors.overlay ?? "rgba(0,0,0,0.8)";
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
