import type { AIContextObject } from "../intelligence/types";
import type { ThemeMode, DesignLanguage } from "../intelligence/types";
import type {
  ColorPalette, TypographyScale, SpacingScale, RadiusScale,
  ShadowScale,
} from "./types";

function generatePalette(designLanguage: DesignLanguage, theme: ThemeMode): ColorPalette {
  const isDark = theme === "dark" || theme === "both";

  const palettes: Record<string, { primary: string; secondary: string; accent: string }> = {
    "apple": { primary: "#007AFF", secondary: "#5856D6", accent: "#FF2D55" },
    "linear": { primary: "#5E6AD2", secondary: "#2A2B3D", accent: "#F2C94C" },
    "raycast": { primary: "#FF6363", secondary: "#FF8C00", accent: "#FFD93D" },
    "stripe": { primary: "#635BFF", secondary: "#0A2540", accent: "#00D4AA" },
    "vercel": { primary: "#000000", secondary: "#7928CA", accent: "#FF0080" },
    "glassmorphism": { primary: "#7C3AED", secondary: "#06B6D4", accent: "#F59E0B" },
    "cyberpunk": { primary: "#00FFFF", secondary: "#FF00FF", accent: "#FFFF00" },
    "luxury": { primary: "#C9A961", secondary: "#1A1A1A", accent: "#D4AF37" },
    "minimal": { primary: "#171717", secondary: "#525252", accent: "#737373" },
    "editorial": { primary: "#1A1A1A", secondary: "#B91C1C", accent: "#F59E0B" },
    "brutalist": { primary: "#FF0000", secondary: "#000000", accent: "#FFFF00" },
    "creative": { primary: "#7C3AED", secondary: "#EC4899", accent: "#06B6D4" },
    "gallery": { primary: "#18181B", secondary: "#27272A", accent: "#A1A1AA" },
    "retro": { primary: "#D97706", secondary: "#92400E", accent: "#FDE68A" },
    "corporate": { primary: "#1E40AF", secondary: "#1E3A8A", accent: "#3B82F6" },
    "playful": { primary: "#8B5CF6", secondary: "#EC4899", accent: "#06B6D4" },
    "dark-academic": { primary: "#78350F", secondary: "#451A03", accent: "#D97706" },
    "cottagecore": { primary: "#166534", secondary: "#713F12", accent: "#CA8A04" },
    "google": { primary: "#4285F4", secondary: "#34A853", accent: "#EA4335" },
    "other": { primary: "#6366F1", secondary: "#8B5CF6", accent: "#06B6D4" },
  };

  const p = palettes[designLanguage] ?? palettes["minimal"];

  return {
    primary: [
      { name: "50", value: isDark ? `${p.primary}15` : `${p.primary}08`, usage: "Lightest tint" },
      { name: "100", value: isDark ? `${p.primary}25` : `${p.primary}15`, usage: "Light tint" },
      { name: "500", value: p.primary, usage: "Primary color" },
      { name: "600", value: p.primary, usage: "Primary hover" },
      { name: "700", value: p.primary, usage: "Primary active" },
    ],
    secondary: [
      { name: "500", value: p.secondary, usage: "Secondary color" },
      { name: "600", value: p.secondary, usage: "Secondary hover" },
    ],
    accent: [
      { name: "500", value: p.accent, usage: "Accent color" },
      { name: "600", value: p.accent, usage: "Accent hover" },
    ],
    neutral: [
      { name: "50", value: isDark ? "#18181B" : "#FAFAFA", usage: "Lightest" },
      { name: "100", value: isDark ? "#27272A" : "#F4F4F5", usage: "Light" },
      { name: "200", value: isDark ? "#3F3F46" : "#E4E4E7", usage: "Lighter" },
      { name: "300", value: isDark ? "#52525B" : "#D4D4D8", usage: "Light" },
      { name: "400", value: isDark ? "#71717A" : "#A1A1AA", usage: "Muted" },
      { name: "500", value: isDark ? "#A1A1AA" : "#71717A", usage: "Medium" },
      { name: "600", value: isDark ? "#D4D4D8" : "#52525B", usage: "Dark" },
      { name: "700", value: isDark ? "#E4E4E7" : "#3F3F46", usage: "Darker" },
      { name: "800", value: isDark ? "#F4F4F5" : "#27272A", usage: "Darkest" },
      { name: "900", value: isDark ? "#FAFAFA" : "#18181B", usage: "Black" },
    ],
    semantic: {
      success: "#22C55E",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    background: {
      default: isDark ? "#09090B" : "#FFFFFF",
      card: isDark ? "#18181B" : "#F9FAFB",
      elevated: isDark ? "#27272A" : "#F3F4F6",
      overlay: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
    },
    text: {
      primary: isDark ? "#FAFAFA" : "#18181B",
      secondary: isDark ? "#A1A1AA" : "#52525B",
      muted: isDark ? "#71717A" : "#A1A1AA",
      inverse: isDark ? "#18181B" : "#FAFAFA",
    },
    border: {
      default: isDark ? "#27272A" : "#E4E4E7",
      subtle: isDark ? "#1F1F22" : "#F0F0F0",
      strong: isDark ? "#3F3F46" : "#D4D4D8",
    },
  };
}

function generateTypography(designLanguage: DesignLanguage): TypographyScale {
  const fonts: Record<string, { heading: string; body: string }> = {
    "apple": { heading: "SF Pro Display, system-ui", body: "SF Pro Text, system-ui" },
    "linear": { heading: "Inter, system-ui", body: "Inter, system-ui" },
    "raycast": { heading: "Inter, system-ui", body: "Inter, system-ui" },
    "stripe": { heading: "system-ui, sans-serif", body: "system-ui, sans-serif" },
    "vercel": { heading: "Geist, system-ui", body: "Geist, system-ui" },
    "luxury": { heading: "Playfair Display, Georgia", body: "Inter, sans-serif" },
    "editorial": { heading: "Playfair Display, Georgia", body: "Source Serif Pro, Georgia" },
    "minimal": { heading: "system-ui, sans-serif", body: "system-ui, sans-serif" },
    "cyberpunk": { heading: "JetBrains Mono, monospace", body: "Inter, sans-serif" },
    "brutalist": { heading: "Space Mono, monospace", body: "Space Grotesk, sans-serif" },
  };

  const f = fonts[designLanguage] ?? fonts["minimal"];

  return {
    fontFamily: f.body,
    weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
    },
    lineHeights: {
      tight: "1.1",
      snug: "1.25",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  };
}

function generateSpacing(): SpacingScale {
  return {
    unit: 4,
    scale: {
      "0": "0",
      "0.5": "0.125rem",
      "1": "0.25rem",
      "1.5": "0.375rem",
      "2": "0.5rem",
      "2.5": "0.625rem",
      "3": "0.75rem",
      "3.5": "0.875rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "12": "3rem",
      "14": "3.5rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
    },
  };
}

function generateRadius(designLanguage: DesignLanguage): RadiusScale {
  const radiusMap: Record<string, RadiusScale> = {
    "apple": { none: "0", sm: "0.375rem", md: "0.5rem", lg: "0.75rem", xl: "1rem", full: "9999px" },
    "minimal": { none: "0", sm: "0.25rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
    "cyberpunk": { none: "0", sm: "0", md: "0.125rem", lg: "0.25rem", xl: "0.375rem", full: "9999px" },
    "brutalist": { none: "0", sm: "0", md: "0", lg: "0", xl: "0", full: "0" },
    "luxury": { none: "0", sm: "0.125rem", md: "0.25rem", lg: "0.375rem", xl: "0.5rem", full: "9999px" },
  };

  return radiusMap[designLanguage] ?? { none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem", xl: "1rem", full: "9999px" };
}

function generateShadows(designLanguage: DesignLanguage): ShadowScale {
  const shadowMap: Record<string, ShadowScale> = {
    "apple": {
      sm: "0 1px 2px rgba(0,0,0,0.04)",
      md: "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.06)",
      lg: "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)",
      xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06)",
    },
    "cyberpunk": {
      sm: "0 0 5px rgba(0,255,255,0.2)",
      md: "0 0 10px rgba(0,255,255,0.3)",
      lg: "0 0 20px rgba(0,255,255,0.4)",
      xl: "0 0 40px rgba(0,255,255,0.5)",
      glow: "0 0 30px rgba(0,255,255,0.6), 0 0 60px rgba(0,255,255,0.3)",
    },
    "minimal": {
      sm: "0 1px 2px rgba(0,0,0,0.05)",
      md: "0 2px 4px rgba(0,0,0,0.05)",
      lg: "0 4px 8px rgba(0,0,0,0.05)",
      xl: "0 8px 16px rgba(0,0,0,0.08)",
    },
  };

  return shadowMap[designLanguage] ?? {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
  };
}

export function planDesignSystem(context: AIContextObject) {
  const designLang = context.designLanguage[0]?.name ?? "minimal";
  const colors = generatePalette(designLang, context.theme);
  const typography = generateTypography(designLang);
  const spacing = generateSpacing();
  const radius = generateRadius(designLang);
  const shadows = generateShadows(designLang);

  return {
    theme: context.theme,
    colors,
    typography,
    spacing,
    radius,
    shadows,
    borders: {
      width: designLang === "brutalist" ? "2px" : "1px",
      style: "solid",
      color: colors.border.default,
    },
  };
}
