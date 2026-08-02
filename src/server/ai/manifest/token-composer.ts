// @ts-nocheck
import type { PortfolioBlueprint } from "../blueprint/types";
import type { RuntimeDesignTokens } from "./types";

const COLOR_FAMILIES: Record<string, { primary: string; accent: string; neutral: string; semantic: Record<string, string> }> = {
  "cyberpunk": { primary: "#e040fb", accent: "#00e5ff", neutral: "#121212", semantic: { success: "#69f0ae", warning: "#ffd740", error: "#ff5252", info: "#448aff" } },
  "glassmorphism": { primary: "rgba(255,255,255,0.15)", accent: "rgba(124,58,237,0.6)", neutral: "rgba(0,0,0,0.5)", semantic: { success: "rgba(105,240,174,0.6)", warning: "rgba(255,215,64,0.6)", error: "rgba(255,82,82,0.6)", info: "rgba(68,138,255,0.6)" } },
  "neobrutalism": { primary: "#ff5722", accent: "#2196f3", neutral: "#fafafa", semantic: { success: "#4caf50", warning: "#ff9800", error: "#f44336", info: "#2196f3" } },
  "material3": { primary: "#6750a4", accent: "#625b71", neutral: "#1c1b1f", semantic: { success: "#386a20", warning: "#7d5700", error: "#b3261e", info: "#0061a4" } },
  "minimalist": { primary: "#171717", accent: "#525252", neutral: "#f5f5f5", semantic: { success: "#16a34a", warning: "#ca8a04", error: "#dc2626", info: "#2563eb" } },
  "scandinavian": { primary: "#2d3436", accent: "#0984e3", neutral: "#dfe6e9", semantic: { success: "#00b894", warning: "#fdcb6e", error: "#d63031", info: "#74b9ff" } },
  "nature": { primary: "#2d5016", accent: "#d4a373", neutral: "#fefae0", semantic: { success: "#588157", warning: "#bc6c25", error: "#ae2012", info: "#468faf" } },
  "retro": { primary: "#e63946", accent: "#457b9d", neutral: "#f1faee", semantic: { success: "#2a9d8f", warning: "#e9c46a", error: "#e63946", info: "#264653" } },
  "neon": { primary: "#00ff87", accent: "#f72585", neutral: "#0a0a0a", semantic: { success: "#00ff87", warning: "#ffd60a", error: "#ff006e", info: "#3a86ff" } },
  "professional": { primary: "#1e3a5f", accent: "#4a90d9", neutral: "#f8f9fa", semantic: { success: "#28a745", warning: "#ffc107", error: "#dc3545", info: "#17a2b8" } },
  "playful": { primary: "#ff6b6b", accent: "#4ecdc4", neutral: "#ffe66d", semantic: { success: "#51cf66", warning: "#ffd43b", error: "#ff6b6b", info: "#339af0" } },
  "elegant": { primary: "#1a1a2e", accent: "#c9a227", neutral: "#f5f5f0", semantic: { success: "#2d6a4f", warning: "#d4a373", error: "#9b2226", info: "#457b9d" } },
  "tech": { primary: "#00d4ff", accent: "#7b2ff7", neutral: "#0d1117", semantic: { success: "#3fb950", warning: "#d29922", error: "#f85149", info: "#58a6ff" } },
  "warm": { primary: "#e07a5f", accent: "#3d405b", neutral: "#f2cc8f", semantic: { success: "#81b29a", warning: "#f2cc8f", error: "#e07a5f", info: "#3d405b" } },
  "dark-gradient": { primary: "#7c3aed", accent: "#06b6d4", neutral: "#0f0f0f", semantic: { success: "#10b981", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6" } },
  "light-clean": { primary: "#2563eb", accent: "#8b5cf6", neutral: "#ffffff", semantic: { success: "#16a34a", warning: "#ca8a04", error: "#dc2626", info: "#0284c7" } },
  "brutalist": { primary: "#000000", accent: "#ff0000", neutral: "#ffffff", semantic: { success: "#00ff00", warning: "#ffff00", error: "#ff0000", info: "#0000ff" } },
  "skeuomorphic": { primary: "#4a90d9", accent: "#7b68ee", neutral: "#f0f0f0", semantic: { success: "#32cd32", warning: "#ffa500", error: "#dc143c", info: "#4169e1" } },
  "flat": { primary: "#3498db", accent: "#e74c3c", neutral: "#ecf0f1", semantic: { success: "#2ecc71", warning: "#f39c12", error: "#e74c3c", info: "#9b59b6" } },
  "retro-futuristic": { primary: "#ff6b35", accent: "#004e89", neutral: "#1a1423", semantic: { success: "#588157", warning: "#dda15e", error: "#bc4949", info: "#468faf" } },
  "vaporwave": { primary: "#ff71ce", accent: "#01cdfe", neutral: "#120458", semantic: { success: "#05ffa1", warning: "#fffb96", error: "#b967ff", info: "#01cdfe" } },
  "art-deco": { primary: "#c9a227", accent: "#1a1a2e", neutral: "#f5f5f0", semantic: { success: "#2d6a4f", warning: "#c9a227", error: "#9b2226", info: "#457b9d" } },
  "Memphis": { primary: "#ff6b9d", accent: "#c44dff", neutral: "#ffe66d", semantic: { success: "#51cf66", warning: "#ffd43b", error: "#ff6b6b", info: "#339af0" } },
  "brutalist-tech": { primary: "#00ff41", accent: "#ff0000", neutral: "#0a0a0a", semantic: { success: "#00ff41", warning: "#ff0000", error: "#ff0000", info: "#00ff41" } },
  "neo-grotesque": { primary: "#000000", accent: "#ff0000", neutral: "#ffffff", semantic: { success: "#00b140", warning: "#ffb900", error: "#ff0000", info: "#0077c8" } },
};

const TYPOGRAPHY_FAMILIES: Record<string, { heading: string; body: string; mono: string; scale: Record<string, string> }> = {
  "sans": { heading: "'Inter', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", mono: "'JetBrains Mono', monospace", scale: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" } },
  "serif": { heading: "'Playfair Display', Georgia, serif", body: "'Lora', Georgia, serif", mono: "'JetBrains Mono', monospace", scale: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem", "4xl": "2.5rem", "5xl": "3.5rem" } },
  "mono": { heading: "'JetBrains Mono', monospace", body: "'JetBrains Mono', monospace", mono: "'JetBrains Mono', monospace", scale: { xs: "0.7rem", sm: "0.8rem", base: "0.9rem", lg: "1rem", xl: "1.1rem", "2xl": "1.3rem", "3xl": "1.6rem", "4xl": "2rem", "5xl": "2.5rem" } },
  "display": { heading: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif", mono: "'Fira Code', monospace", scale: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem", "4xl": "2.75rem", "5xl": "4rem" } },
  "handwriting": { heading: "'Caveat', cursive", body: "'Nunito', sans-serif", mono: "'JetBrains Mono', monospace", scale: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" } },
  "pixel": { heading: "'Press Start 2P', monospace", body: "'VT323', monospace", mono: "'JetBrains Mono', monospace", scale: { xs: "0.6rem", sm: "0.7rem", base: "0.8rem", lg: "0.9rem", xl: "1rem", "2xl": "1.2rem", "3xl": "1.5rem", "4xl": "1.8rem", "5xl": "2.2rem" } },
  "rounded": { heading: "'Nunito', sans-serif", body: "'Nunito', sans-serif", mono: "'JetBrains Mono', monospace", scale: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" } },
  "modern": { heading: "'Plus Jakarta Sans', sans-serif", body: "'Plus Jakarta Sans', sans-serif", mono: "'JetBrains Mono', monospace", scale: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" } },
  "condensed": { heading: "'Barlow Condensed', sans-serif", body: "'Barlow', sans-serif", mono: "'JetBrains Mono', monospace", scale: { xs: "0.7rem", sm: "0.8rem", base: "0.9rem", lg: "1rem", xl: "1.1rem", "2xl": "1.3rem", "3xl": "1.6rem", "4xl": "2rem", "5xl": "2.5rem" } },
  "wide": { heading: "'Archivo Expanded', sans-serif", body: "'Inter', sans-serif", mono: "'JetBrains Mono', monospace", scale: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem", "4xl": "2.5rem", "5xl": "3.5rem" } },
};

export function composeTokens(blueprint: PortfolioBlueprint): RuntimeDesignTokens {
  const colorFamily = COLOR_FAMILIES[blueprint.designLanguage] ?? COLOR_FAMILIES["professional"];
  const typographyFamily = TYPOGRAPHY_FAMILIES[blueprint.designSystem.typography.fontFamily] ?? TYPOGRAPHY_FAMILIES["sans"];

  const theme = blueprint.designSystem.theme;
  const isDark = theme === "dark";

  return {
    colors: {
      primary: colorFamily.primary,
      accent: colorFamily.accent,
      neutral: colorFamily.neutral,
      background: isDark ? colorFamily.neutral : "#ffffff",
      surface: isDark ? "#1a1a1a" : "#f9fafb",
      text: isDark ? "#f5f5f5" : "#1a1a1a",
      textSecondary: isDark ? "#a0a0a0" : "#6b7280",
      border: isDark ? "#2a2a2a" : "#e5e7eb",
      success: colorFamily.semantic.success,
      warning: colorFamily.semantic.warning,
      error: colorFamily.semantic.error,
      info: colorFamily.semantic.info,
    },
    typography: {
      heading: typographyFamily.heading,
      body: typographyFamily.body,
      mono: typographyFamily.mono,
      ...typographyFamily.scale,
    },
    spacing: {
      unit: `${blueprint.designSystem.spacing.unit}px`,
      ...blueprint.designSystem.spacing.scale,
    },
    radius: {
      none: blueprint.designSystem.radius.none,
      sm: blueprint.designSystem.radius.sm,
      md: blueprint.designSystem.radius.md,
      lg: blueprint.designSystem.radius.lg,
      xl: blueprint.designSystem.radius.xl,
      full: blueprint.designSystem.radius.full,
    },
    shadows: {
      sm: blueprint.designSystem.shadows.sm,
      md: blueprint.designSystem.shadows.md,
      lg: blueprint.designSystem.shadows.lg,
      xl: blueprint.designSystem.shadows.xl,
    },
    animation: {
      library: blueprint.animations.library,
      intensity: blueprint.animations.intensity,
      heroDuration: blueprint.animations.hero.duration,
      heroEasing: blueprint.animations.hero.easing,
      pageTransition: blueprint.animations.transitions.page,
      hoverTransition: blueprint.animations.transitions.hover,
    },
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  };
}
