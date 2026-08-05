import type { DesignTokens } from "./types";
import { getDesignTokens } from "./themes";

export function designTokensToCssVars(tokens: DesignTokens): Record<string, string> {
  const vars: Record<string, string> = {};
  const { colors, derived, typography } = tokens;

  const safe = (key: string) => key.replace(/\./g, "_");

  vars["--p-mode"] = tokens.mode;
  vars["--p-background-style"] = tokens.backgroundStyle;

  vars["--p-primary"] = colors.primary;
  vars["--p-primary-hover"] = derived.primaryHover;
  vars["--p-primary-active"] = derived.primaryActive;
  vars["--p-primary-soft"] = derived.primarySoft;
  vars["--p-primary-softer"] = derived.primarySofter;
  vars["--p-secondary"] = colors.secondary;
  vars["--p-accent"] = colors.accent;
  vars["--p-bg"] = colors.background;
  vars["--p-bg-card"] = colors.surface;
  vars["--p-bg-card-hover"] = derived.surfaceHover;
  vars["--p-bg-card-active"] = derived.surfaceActive;
  vars["--p-bg-elevated"] = colors.surfaceElevated;
  vars["--p-text"] = colors.text;
  vars["--p-text-secondary"] = colors.textSecondary;
  vars["--p-text-muted"] = colors.textMuted;
  vars["--p-border"] = colors.border;
  vars["--p-border-subtle"] = colors.borderSubtle;
  vars["--p-success"] = colors.success;
  vars["--p-warning"] = colors.warning;
  vars["--p-error"] = colors.error;
  vars["--p-info"] = colors.info;
  vars["--p-success-soft"] = derived.successSoft;
  vars["--p-warning-soft"] = derived.warningSoft;
  vars["--p-error-soft"] = derived.errorSoft;
  vars["--p-info-soft"] = derived.infoSoft;
  vars["--p-ring"] = derived.ring;
  vars["--p-on-primary"] = derived.onPrimary;
  vars["--p-on-accent"] = derived.onAccent;
  vars["--p-on-surface"] = derived.onSurface;
  vars["--p-overlay"] = colors.overlay;
  vars["--p-shadow-color"] = derived.shadowColor;

  vars["--p-gradient-primary"] = derived.gradientPrimary;
  vars["--p-gradient-secondary"] = derived.gradientSecondary;
  vars["--p-gradient-hero"] = derived.gradientHero;
  vars["--p-gradient-card"] = derived.gradientCard;
  vars["--p-gradient-text"] = derived.gradientText;
  vars["--p-gradient-from"] = colors.primary;
  vars["--p-gradient-via"] = colors.accent;
  vars["--p-gradient-to"] = colors.primary;

  vars["--p-font-heading"] = typography.headingFont;
  vars["--p-font-body"] = typography.bodyFont;
  vars["--p-font-mono"] = typography.monoFont;

  for (const [key, value] of Object.entries(tokens.fontScale)) vars[`--p-text-${key}`] = value;
  for (const [key, value] of Object.entries(tokens.fontWeight)) vars[`--p-font-weight-${key}`] = String(value);
  for (const [key, value] of Object.entries(tokens.lineHeight)) vars[`--p-leading-${key}`] = value;
  for (const [key, value] of Object.entries(tokens.letterSpacing)) vars[`--p-tracking-${key}`] = value;

  for (const [key, value] of Object.entries(tokens.radius)) vars[`--p-radius-${key}`] = value;
  for (const [key, value] of Object.entries(tokens.shadows)) vars[`--p-shadow-${key}`] = value;
  for (const [key, value] of Object.entries(tokens.blur)) vars[`--p-blur-${key}`] = value;
  for (const [key, value] of Object.entries(tokens.elevation)) vars[`--p-elevation-${key}`] = value;
  for (const [key, value] of Object.entries(tokens.opacity)) vars[`--p-opacity-${key}`] = String(value);

  vars["--p-glass-bg"] = tokens.glass.background;
  vars["--p-glass-border"] = tokens.glass.border;
  vars["--p-glass-blur"] = tokens.glass.blur;
  vars["--p-glass-saturate"] = tokens.glass.saturate;
  vars["--p-glass-opacity"] = String(tokens.glass.opacity);
  vars["--p-glass-hover-bg"] = tokens.glass.hoverBackground;
  vars["--p-glass-hover-border"] = tokens.glass.hoverBorder;
  vars["--p-glass-panel-bg"] = tokens.glass.panelBackground;
  vars["--p-glass-panel-border"] = tokens.glass.panelBorder;

  vars["--p-grid-columns"] = String(tokens.grid.columns);
  vars["--p-grid-gap"] = tokens.grid.gap;
  vars["--p-grid-section-columns"] = String(tokens.grid.sectionColumns);
  vars["--p-grid-card-columns"] = tokens.grid.cardColumns;
  vars["--p-grid-gallery-columns"] = tokens.grid.galleryColumns;
  vars["--p-grid-sidebar-width"] = tokens.grid.sidebarWidth;

  for (const [key, value] of Object.entries(tokens.containerWidths)) vars[`--p-container-${safe(key)}`] = value;
  for (const [key, value] of Object.entries(tokens.breakpoints)) vars[`--p-breakpoint-${safe(key)}`] = value;
  for (const [key, value] of Object.entries(tokens.zIndex)) vars[`--p-z-index-${safe(key)}`] = String(value);
  for (const [key, value] of Object.entries(tokens.spacing)) vars[`--p-space-${safe(key)}`] = value;
  for (const [key, value] of Object.entries(tokens.durations)) vars[`--p-duration-${key}`] = value;
  for (const [key, value] of Object.entries(tokens.easing)) vars[`--p-ease-${key}`] = value;
  for (const [key, value] of Object.entries(tokens.borders)) vars[`--p-border-${key}`] = value;

  return vars;
}

export function designTokensToCssString(tokens: DesignTokens): string {
  const vars = designTokensToCssVars(tokens);
  const lines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
  return `:root {\n${lines}\n}\n`;
}

export function buildGlobalsCss(tokens: DesignTokens): string {
  return [
    "/* ------------------------------------------------------------------",
    " * AI Portfolio Platform — Design Tokens",
    " * Auto-generated by src/design-system. Do not edit by hand.",
    " * ------------------------------------------------------------------ */",
    "",
    designTokensToCssString(tokens).trimEnd(),
    "",
    "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
    "html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }",
    "body { font-family: var(--p-font-body); color: var(--p-text); background: var(--p-bg); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; line-height: var(--p-leading-normal); }",
    "::selection { background: var(--p-primary-soft); color: var(--p-text); }",
    "",
    "@media (prefers-reduced-motion: reduce) {",
    "  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }",
    "  html { scroll-behavior: auto; }",
    "}",
    "",
  ].join("\n");
}

export function buildTailwindThemeInline(tokens: DesignTokens): string {
  const lines: string[] = [];

  const colorKeys: Array<[string, string]> = [
    ["primary", "--p-primary"], ["primary-hover", "--p-primary-hover"], ["primary-active", "--p-primary-active"],
    ["primary-soft", "--p-primary-soft"], ["primary-softer", "--p-primary-softer"], ["secondary", "--p-secondary"],
    ["accent", "--p-accent"], ["background", "--p-bg"], ["bg", "--p-bg"], ["surface", "--p-bg-card"],
    ["surface-hover", "--p-bg-card-hover"], ["surface-elevated", "--p-bg-elevated"], ["text", "--p-text"],
    ["text-primary", "--p-text"], ["text-secondary", "--p-text-secondary"], ["text-muted", "--p-text-muted"],
    ["border", "--p-border"], ["border-subtle", "--p-border-subtle"], ["success", "--p-success"],
    ["warning", "--p-warning"], ["error", "--p-error"], ["info", "--p-info"], ["ring", "--p-ring"],
    ["on-primary", "--p-on-primary"], ["on-accent", "--p-on-accent"], ["on-surface", "--p-on-surface"],
    ["overlay", "--p-overlay"],
  ];

  for (const [name, varName] of colorKeys) lines.push(`  --color-${name}: var(${varName});`);

  lines.push("");
  lines.push("  --font-sans: var(--p-font-body);");
  lines.push("  --font-heading: var(--p-font-heading);");
  lines.push("  --font-mono: var(--p-font-mono);");

  for (const [key] of Object.entries(tokens.fontScale)) lines.push(`  --text-${key}: var(--p-text-${key});`);
  for (const [key] of Object.entries(tokens.fontWeight)) lines.push(`  --font-weight-${key}: var(--p-font-weight-${key});`);
  for (const [key] of Object.entries(tokens.lineHeight)) lines.push(`  --leading-${key}: var(--p-leading-${key});`);
  for (const [key] of Object.entries(tokens.letterSpacing)) lines.push(`  --tracking-${key}: var(--p-tracking-${key});`);

  for (const [key] of Object.entries(tokens.radius)) lines.push(`  --radius-${key}: var(--p-radius-${key});`);
  for (const [key] of Object.entries(tokens.shadows)) lines.push(`  --shadow-${key}: var(--p-shadow-${key});`);
  for (const [key] of Object.entries(tokens.blur)) lines.push(`  --blur-${key}: var(--p-blur-${key});`);
  for (const [key] of Object.entries(tokens.opacity)) lines.push(`  --opacity-${key}: var(--p-opacity-${key});`);
  for (const [key] of Object.entries(tokens.zIndex)) lines.push(`  --z-${key}: var(--p-z-index-${key});`);
  for (const [key] of Object.entries(tokens.durations)) lines.push(`  --duration-${key}: var(--p-duration-${key});`);
  for (const [key] of Object.entries(tokens.easing)) lines.push(`  --ease-${key}: var(--p-ease-${key});`);
  for (const [key] of Object.entries(tokens.containerWidths)) lines.push(`  --container-${key}: var(--p-container-${key});`);
  for (const [key, value] of Object.entries(tokens.breakpoints)) lines.push(`  --breakpoint-${key}: ${value};`);

  return `@theme inline {\n${lines.join("\n")}\n}\n`;
}

export { getDesignTokens };
