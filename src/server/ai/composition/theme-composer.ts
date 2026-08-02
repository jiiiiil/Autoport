import type { AIContextObject, ThemeMode } from "../intelligence/types";
import type { PromptConstraints, ComposedTheme } from "./types";

interface ColorPaletteDefinition {
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
  overlay: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`;
}

function blendColors(c1: string, c2: string, ratio: number): string {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  if (!a || !b) return c1;
  return rgbToHex(
    a.r * (1 - ratio) + b.r * ratio,
    a.g * (1 - ratio) + b.g * ratio,
    a.b * (1 - ratio) + b.b * ratio,
  );
}

function darken(hex: string, amount: number): string {
  const c = hexToRgb(hex);
  if (!c) return hex;
  return rgbToHex(c.r * (1 - amount), c.g * (1 - amount), c.b * (1 - amount));
}

function lighten(hex: string, amount: number): string {
  const c = hexToRgb(hex);
  if (!c) return hex;
  return rgbToHex(
    c.r + (255 - c.r) * amount,
    c.g + (255 - c.g) * amount,
    c.b + (255 - c.b) * amount,
  );
}

function getLuminance(hex: string): number {
  const c = hexToRgb(hex);
  if (!c) return 0;
  return (c.r * 299 + c.g * 587 + c.b * 114) / 255000;
}

function extractHexColor(prompt: string): string | null {
  const hexMatch = prompt.match(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/);
  if (hexMatch) {
    let hex = hexMatch[0];
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    return hex;
  }
  return null;
}

function extractRgbColor(prompt: string): string | null {
  const rgbMatch = prompt.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (rgbMatch) {
    return rgbToHex(
      parseInt(rgbMatch[1]),
      parseInt(rgbMatch[2]),
      parseInt(rgbMatch[3]),
    );
  }
  return null;
}

const colorMap: Record<string, string> = {
  "dark blue": "#1e40af", "navy": "#1e3a8a", "royal blue": "#2563eb",
  "deep blue": "#1e3a5f", "ocean blue": "#0891b2", "ocean": "#0891b2",
  "green": "#059669", "emerald": "#10b981", "forest green": "#166534",
  "lime": "#65a30d", "mint": "#34d399",
  "red": "#dc2626", "crimson": "#b91c1c", "ruby": "#e11d48", "maroon": "#881337",
  "purple": "#7c3aed", "violet": "#8b5cf6", "lavender": "#a78bfa", "plum": "#86198f",
  "pink": "#ec4899", "rose": "#f43f5e", "magenta": "#d946ef", "coral": "#f97316",
  "orange": "#ea580c", "amber": "#d97706", "tangerine": "#f97316", "peach": "#fb923c",
  "yellow": "#eab308", "gold": "#d4a017", "sunflower": "#facc15",
  "teal": "#0d9488", "cyan": "#06b6d4", "turquoise": "#14b8a6", "aqua": "#22d3ee",
  "gray": "#6b7280", "grey": "#6b7280", "silver": "#9ca3af", "slate": "#64748b",
  "black": "#111111", "white": "#f5f5f5", "ivory": "#fffff0", "cream": "#fefce8",
  "brown": "#78350f", "coffee": "#4a2c0a", "chocolate": "#3c1f0a",
};

const colorMapEntries = Object.entries(colorMap).sort((a, b) => b[0].length - a[0].length);

function resolveColorValue(input: string): string | null {
  const hex = extractHexColor(input);
  if (hex) return hex;
  const rgb = extractRgbColor(input);
  if (rgb) return rgb;
  const lower = input.toLowerCase().trim();
  for (const [keyword, color] of colorMapEntries) {
    if (lower === keyword || lower.startsWith(keyword + " ") || lower.endsWith(" " + keyword)) return color;
  }
  for (const [keyword, color] of colorMapEntries) {
    if (lower.includes(keyword)) return color;
  }
  return null;
}

function extractColorAfterKeyword(prompt: string, keywords: string[]): string | null {
  const lower = prompt.toLowerCase();
  for (const kw of keywords) {
    const patterns = [
      new RegExp(`${kw}\\s*(?:color|scheme|is)?\\s*[=:]?\\s*(#[0-9a-fA-F]{3,6}|rgb\\(\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*\\))`),
      new RegExp(`${kw}\\s*(?:color|scheme|is)?\\s*[=:]?\\s*([a-zA-Z]+(?:\\s+[a-zA-Z]+){0,3})(?:\\.|,|;|$)`, 'm'),
    ];
    for (const pat of patterns) {
      const m = lower.match(pat);
      if (m) {
        const val = m[1].trim();
        const resolved = resolveColorValue(val);
        if (resolved) return resolved;
      }
    }
    const reversePat = new RegExp(`(#[0-9a-fA-F]{3,6}|[a-zA-Z]+(?:\\s+[a-zA-Z]+){0,3})\\s*(?:background|bg)\\b`);
    if (kw === "background" || kw === "bg") {
      const rm = lower.match(reversePat);
      if (rm) {
        const resolved = resolveColorValue(rm[1].trim());
        if (resolved) return resolved;
      }
    }
  }
  return null;
}

interface ExplicitColorOverrides {
  background?: string;
  text?: string;
  primary?: string;
  accent?: string;
  surface?: string;
  border?: string;
}

function extractExplicitColorOverrides(prompt: string): ExplicitColorOverrides {
  const overrides: ExplicitColorOverrides = {};

  const bg = extractColorAfterKeyword(prompt, ["background", "bg"]);
  if (bg) overrides.background = bg;

  const txt = extractColorAfterKeyword(prompt, ["text", "font", "foreground"]);
  if (txt) overrides.text = txt;

  const primary = extractColorAfterKeyword(prompt, ["primary", "main"]);
  if (primary) overrides.primary = primary;

  const accent = extractColorAfterKeyword(prompt, ["accent", "highlight"]);
  if (accent) overrides.accent = accent;

  const surface = extractColorAfterKeyword(prompt, ["surface", "card", "panel"]);
  if (surface) overrides.surface = surface;

  const border = extractColorAfterKeyword(prompt, ["border", "outline"]);
  if (border) overrides.border = border;

  return overrides;
}

function extractPrimaryColor(prompt: string): string | null {
  const hex = extractHexColor(prompt);
  if (hex) return hex;

  const rgb = extractRgbColor(prompt);
  if (rgb) return rgb;

  const lower = prompt.toLowerCase();
  for (const [keyword, color] of colorMapEntries) {
    if (lower.includes(keyword)) return color;
  }
  return null;
}

function deriveFullPalette(primaryHex: string, isDark: boolean): ColorPaletteDefinition {
  const lum = getLuminance(primaryHex);
  const isLightColor = lum > 0.5;

  let bg: string;
  let surface: string;
  let surfaceElevated: string;
  let text: string;
  let textSecondary: string;
  let textMuted: string;
  let border: string;
  let borderSubtle: string;

  if (isDark) {
    const bgAmount = Math.max(0.85, Math.min(0.95, 0.92 - (1 - lum) * 0.1));
    bg = darken(primaryHex, bgAmount);
    bg = blendColors(bg, "#000000", 0.3);

    surface = lighten(bg, 0.08);
    surfaceElevated = lighten(bg, 0.15);
    text = "#f8fafc";
    textSecondary = lighten(primaryHex, 0.4);
    textMuted = lighten(primaryHex, 0.2);
    border = lighten(bg, 0.2);
    borderSubtle = lighten(bg, 0.1);
  } else {
    bg = lighten(primaryHex, 0.85);
    bg = blendColors(bg, "#ffffff", 0.3);

    surface = lighten(primaryHex, 0.92);
    surfaceElevated = lighten(primaryHex, 0.88);
    text = darken(primaryHex, 0.75);
    textSecondary = darken(primaryHex, 0.5);
    textMuted = darken(primaryHex, 0.3);
    border = darken(primaryHex, 0.15);
    borderSubtle = darken(primaryHex, 0.08);
  }

  const secondary = isDark
    ? lighten(darken(primaryHex, 0.3), 0.1)
    : darken(primaryHex, 0.2);

  const accent = isLightColor
    ? darken(primaryHex, 0.3)
    : lighten(primaryHex, 0.3);

  return {
    primary: primaryHex,
    secondary,
    accent,
    background: bg,
    surface,
    surfaceElevated,
    text,
    textSecondary,
    textMuted,
    border,
    borderSubtle,
    overlay: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
  };
}

function applyOverrides(colors: ColorPaletteDefinition, overrides: ExplicitColorOverrides): ColorPaletteDefinition {
  const result = { ...colors };
  if (overrides.background) result.background = overrides.background;
  if (overrides.text) {
    result.text = overrides.text;
    result.textSecondary = blendColors(overrides.text, colors.primary, 0.4);
    result.textMuted = blendColors(overrides.text, colors.primary, 0.2);
  }
  if (overrides.primary) {
    result.primary = overrides.primary;
    result.secondary = darken(overrides.primary, 0.15);
    result.accent = lighten(overrides.primary, 0.15);
  }
  if (overrides.accent) result.accent = overrides.accent;
  if (overrides.surface) {
    result.surface = overrides.surface;
    result.surfaceElevated = lighten(overrides.surface, 0.07);
  }
  if (overrides.border) {
    result.border = overrides.border;
    result.borderSubtle = blendColors(overrides.border, result.background, 0.5);
  }
  return result;
}

function generateThemeFromPrompt(prompt: string, isDark: boolean, overrides?: ExplicitColorOverrides): ColorPaletteDefinition {
  const lower = prompt.toLowerCase();
  const primaryColor = extractPrimaryColor(prompt);

  const styleLuxury = lower.includes("luxury") || lower.includes("premium") || lower.includes("elegant") || lower.includes("gold");
  const styleCyberpunk = lower.includes("cyberpunk") || lower.includes("neon") || lower.includes("futuristic");
  const styleMinimal = lower.includes("minimal") || lower.includes("clean") || lower.includes("simple");
  const styleGlass = lower.includes("glass") || lower.includes("glassmorphism") || lower.includes("frosted");
  const styleApple = lower.includes("apple") || lower.includes("ios") || lower.includes("macos");
  const stylePlayful = lower.includes("playful") || lower.includes("fun") || lower.includes("colorful");

  let palette: ColorPaletteDefinition;

  if (primaryColor) {
    palette = deriveFullPalette(primaryColor, isDark);
  } else if (styleLuxury) {
    palette = {
      primary: "#c9a84c", secondary: "#1a1a1a", accent: "#d4af37",
      background: "#0d0d0d", surface: "#1a1a1a", surfaceElevated: "#262626",
      text: "#f5f5f5", textSecondary: "#b0b0b0", textMuted: "#808080",
      border: "#2a2a2a", borderSubtle: "#1a1a1a", overlay: "rgba(13,13,13,0.85)",
    };
  } else if (styleCyberpunk) {
    palette = {
      primary: "#00ff88", secondary: "#0a0a2e", accent: "#ff00ff",
      background: "#050520", surface: "#0a0a2e", surfaceElevated: "#12124a",
      text: "#e0e0ff", textSecondary: "#8888cc", textMuted: "#6060aa",
      border: "#1a1a4a", borderSubtle: "#0a0a2e", overlay: "rgba(5,5,32,0.85)",
    };
  } else if (styleGlass) {
    palette = {
      primary: "#60a5fa", secondary: "#3b82f6", accent: "#818cf8",
      background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.6)",
      surface: isDark ? "rgba(30,41,59,0.4)" : "rgba(255,255,255,0.4)",
      surfaceElevated: isDark ? "rgba(51,65,85,0.3)" : "rgba(255,255,255,0.5)",
      text: isDark ? "#f8fafc" : "#0f172a",
      textSecondary: isDark ? "#94a3b8" : "#334155",
      textMuted: isDark ? "#64748b" : "#64748b",
      border: isDark ? "rgba(148,163,184,0.2)" : "rgba(0,0,0,0.1)",
      borderSubtle: isDark ? "rgba(148,163,184,0.1)" : "rgba(0,0,0,0.05)",
      overlay: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.8)",
    };
  } else if (styleApple) {
    palette = {
      primary: "#007AFF", secondary: "#5856D6", accent: "#FF2D55",
      background: isDark ? "#000000" : "#f5f5f7",
      surface: isDark ? "#1c1c1e" : "#ffffff",
      surfaceElevated: isDark ? "#2c2c2e" : "#f5f5f7",
      text: isDark ? "#f5f5f7" : "#1d1d1f",
      textSecondary: isDark ? "#a1a1a6" : "#6e6e73",
      textMuted: isDark ? "#636366" : "#aeaeb2",
      border: isDark ? "#38383a" : "#d2d2d7",
      borderSubtle: isDark ? "#2c2c2e" : "#e5e5ea",
      overlay: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
    };
  } else if (stylePlayful) {
    palette = {
      primary: "#8b5cf6", secondary: "#ec4899", accent: "#06b6d4",
      background: isDark ? "#0f0a1a" : "#faf5ff",
      surface: isDark ? "#1f1430" : "#ffffff",
      surfaceElevated: isDark ? "#2e1e40" : "#f3e8ff",
      text: isDark ? "#faf5ff" : "#1e1b4b",
      textSecondary: isDark ? "#c4b5fd" : "#6d28d9",
      textMuted: isDark ? "#8b7fd4" : "#a78bfa",
      border: isDark ? "#2e1e40" : "#e9d5ff",
      borderSubtle: isDark ? "#1f1430" : "#f3e8ff",
      overlay: isDark ? "rgba(15,10,26,0.85)" : "rgba(255,255,255,0.8)",
    };
  } else if (isDark) {
    palette = {
      primary: "#6366f1", secondary: "#4f46e5", accent: "#818cf8",
      background: "#0a0a0a", surface: "#141414", surfaceElevated: "#1f1f1f",
      text: "#fafafa", textSecondary: "#a3a3a3", textMuted: "#737373",
      border: "#262626", borderSubtle: "#1a1a1a", overlay: "rgba(0,0,0,0.8)",
    };
  } else {
    palette = {
      primary: "#6366f1", secondary: "#4f46e5", accent: "#818cf8",
      background: "#fafafa", surface: "#ffffff", surfaceElevated: "#f5f5f5",
      text: "#171717", textSecondary: "#525252", textMuted: "#a3a3a3",
      border: "#e5e5e5", borderSubtle: "#f0f0f0", overlay: "rgba(255,255,255,0.8)",
    };
  }

  if (overrides) {
    palette = applyOverrides(palette, overrides);
  }

  return palette;
}

function getTypographyFromPrompt(prompt: string, _designLang: string): ComposedTheme["typography"] {
  const lower = prompt.toLowerCase();

  const styleLuxury = lower.includes("luxury") || lower.includes("premium") || lower.includes("elegant");
  const styleApple = lower.includes("apple") || lower.includes("ios") || lower.includes("macos");
  const styleEditorial = lower.includes("editorial") || lower.includes("magazine") || lower.includes("writer");
  const styleCyberpunk = lower.includes("cyberpunk") || lower.includes("neon") || lower.includes("futuristic");
  const styleBrutalist = lower.includes("brutalist") || lower.includes("bold");
  const styleRetro = lower.includes("retro") || lower.includes("vintage");
  const stylePlayful = lower.includes("playful") || lower.includes("fun");

  let headingFont: string;
  let bodyFont: string;

  if (styleLuxury) {
    headingFont = "'Playfair Display', Georgia, serif";
    bodyFont = "'Inter', system-ui, sans-serif";
  } else if (styleApple) {
    headingFont = "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
    bodyFont = "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
  } else if (styleEditorial) {
    headingFont = "'Playfair Display', Georgia, serif";
    bodyFont = "'Source Serif 4', Georgia, serif";
  } else if (styleCyberpunk) {
    headingFont = "'Orbitron', sans-serif";
    bodyFont = "'JetBrains Mono', monospace";
  } else if (styleBrutalist) {
    headingFont = "'Space Grotesk', sans-serif";
    bodyFont = "'Space Mono', monospace";
  } else if (styleRetro) {
    headingFont = "'DM Serif Display', Georgia, serif";
    bodyFont = "'Inter', system-ui, sans-serif";
  } else if (stylePlayful) {
    headingFont = "'Space Grotesk', sans-serif";
    bodyFont = "'Inter', system-ui, sans-serif";
  } else {
    headingFont = "'Inter', system-ui, sans-serif";
    bodyFont = "'Inter', system-ui, sans-serif";
  }

  const scale = styleLuxury
    ? { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem", "4xl": "2.5rem", "5xl": "3.5rem", "6xl": "4.5rem", "7xl": "5.5rem", "8xl": "7rem" }
    : styleApple
    ? { xs: "0.7rem", sm: "0.85rem", base: "1rem", lg: "1.15rem", xl: "1.3rem", "2xl": "1.55rem", "3xl": "1.95rem", "4xl": "2.45rem", "5xl": "3.25rem", "6xl": "4rem", "7xl": "5rem", "8xl": "6rem" }
    : { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem", "6xl": "3.75rem", "7xl": "4.5rem", "8xl": "6rem" };

  const lineHeights = styleLuxury
    ? { tight: "1.05", snug: "1.2", normal: "1.5", relaxed: "1.65", loose: "2" }
    : { tight: "1.1", snug: "1.25", normal: "1.5", relaxed: "1.625", loose: "2" };

  return {
    headingFont,
    bodyFont,
    monoFont: "'JetBrains Mono', 'Fira Code', monospace",
    scale,
    lineHeights,
    letterSpacings: {
      tighter: "-0.05em", tight: "-0.025em", normal: "0",
      wide: "0.025em", wider: "0.05em", widest: "0.1em",
    },
    fontWeights: { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  };
}

function getSpacing(prompt: string, _designLang: string): Record<string, string> {
  const lower = prompt.toLowerCase();
  const isLuxury = lower.includes("luxury") || lower.includes("premium") || lower.includes("elegant");
  const isApple = lower.includes("apple");

  if (isLuxury) {
    return {
      "0": "0", "0.5": "0.125rem", "1": "0.25rem", "1.5": "0.375rem",
      "2": "0.5rem", "2.5": "0.625rem", "3": "0.75rem", "4": "1rem",
      "5": "1.25rem", "6": "1.75rem", "8": "2.5rem", "10": "3rem",
      "12": "3.5rem", "16": "5rem", "20": "6rem", "24": "7rem",
      "32": "9rem", "40": "12rem", "48": "14rem", "64": "18rem",
    };
  }
  if (isApple) {
    return {
      "0": "0", "0.5": "0.125rem", "1": "0.25rem", "1.5": "0.375rem",
      "2": "0.5rem", "2.5": "0.625rem", "3": "0.75rem", "4": "1rem",
      "5": "1.25rem", "6": "1.5rem", "8": "2rem", "10": "2.5rem",
      "12": "3rem", "16": "4rem", "20": "5rem", "24": "6rem",
      "32": "8rem", "40": "10rem", "48": "12rem", "64": "16rem",
    };
  }
  return {
    "0": "0", "0.5": "0.125rem", "1": "0.25rem", "1.5": "0.375rem",
    "2": "0.5rem", "2.5": "0.625rem", "3": "0.75rem", "4": "1rem",
    "5": "1.25rem", "6": "1.5rem", "8": "2rem", "10": "2.5rem",
    "12": "3rem", "16": "4rem", "20": "5rem", "24": "6rem",
    "32": "8rem", "40": "10rem", "48": "12rem", "64": "16rem",
  };
}

function getRadius(prompt: string, _designLang: string): Record<string, string> {
  const lower = prompt.toLowerCase();
  if (lower.includes("brutalist")) return { none: "0", sm: "0", md: "0", lg: "0", xl: "0", "2xl": "0", full: "0" };
  if (lower.includes("luxury")) return { none: "0", sm: "0.125rem", md: "0.25rem", lg: "0.375rem", xl: "0.5rem", "2xl": "0.75rem", full: "9999px" };
  if (lower.includes("apple")) return { none: "0", sm: "0.375rem", md: "0.5rem", lg: "0.75rem", xl: "1rem", "2xl": "1.25rem", full: "9999px" };
  if (lower.includes("glass") || lower.includes("glassmorphism")) return { none: "0", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "2.5rem", full: "9999px" };
  return { none: "0", sm: "0.25rem", md: "0.5rem", lg: "0.75rem", xl: "1rem", "2xl": "1.5rem", full: "9999px" };
}

function getShadows(prompt: string, _designLang: string): Record<string, string> {
  const lower = prompt.toLowerCase();
  if (lower.includes("cyberpunk")) {
    return {
      sm: "0 0 5px rgba(0,255,255,0.2)", md: "0 0 10px rgba(0,255,255,0.3)",
      lg: "0 0 20px rgba(0,255,255,0.4)", xl: "0 0 40px rgba(0,255,255,0.5)",
    };
  }
  if (lower.includes("brutalist")) {
    return {
      sm: "4px 4px 0px rgba(0,0,0,0.15)", md: "6px 6px 0px rgba(0,0,0,0.15)",
      lg: "8px 8px 0px rgba(0,0,0,0.15)", xl: "12px 12px 0px rgba(0,0,0,0.2)",
    };
  }
  if (lower.includes("apple")) {
    return {
      sm: "0 1px 2px rgba(0,0,0,0.04)", md: "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.06)",
      lg: "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)",
      xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06)",
    };
  }
  return {
    sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
  };
}

function getGradientSystem(_prompt: string, colors: ColorPaletteDefinition): ComposedTheme["gradients"] {
  return {
    primary: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
    secondary: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
    hero: `linear-gradient(180deg, ${colors.background}, ${colors.surface})`,
    card: `linear-gradient(135deg, ${colors.surface}, ${colors.surfaceElevated})`,
    text: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
  };
}

function getBackgroundStyle(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes("cyberpunk") || lower.includes("neon")) return "grid";
  if (lower.includes("luxury") || lower.includes("premium") || lower.includes("elegant")) return "mesh-gradient";
  if (lower.includes("apple")) return "aurora";
  if (lower.includes("glass") || lower.includes("glassmorphism") || lower.includes("frosted")) return "noise";
  if (lower.includes("minimal") || lower.includes("clean") || lower.includes("simple")) return "flat";
  if (lower.includes("creative") || lower.includes("artistic")) return "floating-blobs";
  if (lower.includes("dark")) return "mesh-gradient";
  if (lower.includes("light") || lower.includes("white")) return "noise";

  return "mesh-gradient";
}

function fallbackTheme(): ComposedTheme {
  return {
    mode: "dark",
    colors: {
      primary: "#7c3aed",
      secondary: "#1e1b4b",
      accent: "#06b6d4",
      background: "#0a0a0a",
      surface: "#141414",
      surfaceElevated: "#1a1a1a",
      text: "#fafafa",
      textSecondary: "#a1a1aa",
      textMuted: "#71717a",
      border: "#27272a",
      borderSubtle: "#1f1f23",
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
      overlay: "rgba(0,0,0,0.8)",
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      monoFont: "'JetBrains Mono', 'Fira Code', monospace",
      scale: { base: "1.25" },
      lineHeights: { tight: "1.1", snug: "1.25", normal: "1.5", relaxed: "1.625", loose: "2" },
      letterSpacings: {
        tighter: "-0.05em", tight: "-0.025em", normal: "0",
        wide: "0.025em", wider: "0.05em", widest: "0.1em",
      },
      fontWeights: { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
    },
    spacing: {
      unit: "4px",
      sectionPadding: "5rem",
      containerPadding: "1.5rem",
      elementGap: "1.5rem",
    },
    radius: {
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      full: "9999px",
    },
    shadows: {
      sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
      md: "0 4px 6px -1px rgba(0,0,0,0.1)",
      lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
      xl: "0 20px 25px -5px rgba(0,0,0,0.1)",
      "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
    },
    backgroundStyle: "mesh-gradient",
    gradients: {
      primary: "linear-gradient(135deg, #7c3aed, #06b6d4)",
      secondary: "linear-gradient(135deg, #1e1b4b, #06b6d4)",
      hero: "linear-gradient(135deg, #7c3aed, #06b6d4)",
      card: "linear-gradient(135deg, #1a1a1a, #222222)",
      text: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    },
    borders: { thin: "1px solid", medium: "2px solid", thick: "3px solid" },
    transitionDurations: { fast: "150ms", normal: "300ms", slow: "500ms", slower: "700ms" },
    zIndex: { base: 0, dropdown: 10, sticky: 20, overlay: 30, modal: 40, popover: 50, tooltip: 60 },
  };
}

export function applyExplicitColorOverrides(theme: ComposedTheme | undefined, prompt: string): ComposedTheme {
  if (!theme) return fallbackTheme();

  const overrides = extractExplicitColorOverrides(prompt);
  const keys = Object.keys(overrides);
  if (keys.length === 0) return theme;

  const colors = { ...theme.colors };

  if (overrides.background) {
    colors.background = overrides.background;
    colors.surface = blendColors(overrides.background, "#ffffff", 0.1);
    colors.surfaceElevated = blendColors(overrides.background, "#ffffff", 0.18);
  }
  if (overrides.text) {
    colors.text = overrides.text;
    colors.textSecondary = blendColors(overrides.text, colors.primary, 0.4);
    colors.textMuted = blendColors(overrides.text, colors.primary, 0.2);
  }
  if (overrides.primary) {
    colors.primary = overrides.primary;
    colors.secondary = darken(overrides.primary, 0.15);
    colors.accent = lighten(overrides.primary, 0.15);
  }
  if (overrides.accent) colors.accent = overrides.accent;
  if (overrides.surface) {
    colors.surface = overrides.surface;
    colors.surfaceElevated = lighten(overrides.surface, 0.07);
  }
  if (overrides.border) {
    colors.border = overrides.border;
    colors.borderSubtle = blendColors(overrides.border, colors.background, 0.5);
  }

  return { ...theme, colors };
}

export function composeTheme(
  context: AIContextObject,
  constraints: PromptConstraints,
  promptHash: string
): ComposedTheme {
  const rawPrompt = context.rawPrompt;
  const lower = rawPrompt.toLowerCase();

  const isDarkRequest = lower.includes("dark") || lower.includes("night") || lower.includes("black") || lower.includes("midnight") || lower.includes("deep");
  const isLightRequest = lower.includes("light") || lower.includes("white") || lower.includes("bright") || lower.includes("day") || lower.includes("cream") || lower.includes("ivory");

  let mode: ThemeMode = "dark";
  if (isLightRequest && !isDarkRequest) mode = "light";
  else if (isDarkRequest) mode = "dark";
  else if (context.theme === "light") mode = "light";

  const explicitOverrides = extractExplicitColorOverrides(rawPrompt);
  const colors = generateThemeFromPrompt(rawPrompt, mode === "dark", explicitOverrides);
  const designLang = context.designLanguage[0]?.name || "";

  return {
    mode,
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: colors.background,
      surface: colors.surface,
      surfaceElevated: colors.surfaceElevated,
      text: colors.text,
      textSecondary: colors.textSecondary,
      textMuted: colors.textMuted,
      border: colors.border,
      borderSubtle: colors.borderSubtle,
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
      overlay: colors.overlay,
    },
    typography: getTypographyFromPrompt(rawPrompt, designLang),
    spacing: getSpacing(rawPrompt, designLang),
    radius: getRadius(rawPrompt, designLang),
    shadows: getShadows(rawPrompt, designLang),
    gradients: getGradientSystem(rawPrompt, colors),
    backgroundStyle: getBackgroundStyle(rawPrompt),
    borders: {
      thin: "1px solid",
      medium: "2px solid",
      thick: "3px solid",
    },
    transitionDurations: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
      slower: "700ms",
    },
    zIndex: {
      base: 0,
      dropdown: 10,
      sticky: 20,
      overlay: 30,
      modal: 40,
      popover: 50,
      tooltip: 60,
    },
  };
}
