import type { GeneratorContext, GeneratedFile } from "./types";

export function generateGlobalStyles(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const tokens = manifest.designTokens;
  const themeMode = manifest.blueprint.theme;
  const isDark = themeMode === "dark";

  const content = `@import "tailwindcss";

@theme {
  --color-primary: ${tokens.colors.primary || "#7c3aed"};
  --color-accent: ${tokens.colors.accent || "#06b6d4"};
  --color-background: ${tokens.colors.background || "#ffffff"};
  --color-surface: ${tokens.colors.surface || "#f5f5f5"};
  --color-text: ${tokens.colors.text || "#171717"};
  --color-text-secondary: ${tokens.colors.textSecondary || "#737373"};
  --color-border: ${tokens.colors.border || "#e5e5e5"};
  --color-success: ${tokens.colors.success || "#22c55e"};
  --color-warning: ${tokens.colors.warning || "#f59e0b"};
  --color-error: ${tokens.colors.error || "#ef4444"};
  --color-info: ${tokens.colors.info || "#3b82f6"};

  --font-heading: ${tokens.typography.heading || "Inter, system-ui, sans-serif"};
  --font-body: ${tokens.typography.body || "Inter, system-ui, sans-serif"};
  --font-mono: ${tokens.typography.mono || "JetBrains Mono, monospace"};

  --spacing-unit: ${tokens.spacing.unit || "0.25rem"};

  --radius-sm: ${tokens.radius.sm || "0.25rem"};
  --radius-md: ${tokens.radius.md || "0.5rem"};
  --radius-lg: ${tokens.radius.lg || "0.75rem"};
  --radius-xl: ${tokens.radius.xl || "1rem"};
  --radius-full: ${tokens.radius.full || "9999px"};

  --shadow-sm: ${tokens.shadows.sm || "0 1px 2px 0 rgba(0,0,0,0.05)"};
  --shadow-md: ${tokens.shadows.md || "0 4px 6px -1px rgba(0,0,0,0.1)"};
  --shadow-lg: ${tokens.shadows.lg || "0 10px 15px -3px rgba(0,0,0,0.1)"};
  --shadow-xl: ${tokens.shadows.xl || "0 20px 25px -5px rgba(0,0,0,0.1)"};
}

:root {
  color-scheme: ${isDark ? "dark" : "light"};
}

body {
  font-family: var(--font-body);
  background-color: var(--color-background);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

::selection {
  background-color: var(--color-primary);
  color: white;
}

* {
  box-sizing: border-box;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;
  return { path: `${ctx.stylesDir}/globals.css`, content, type: "style" };
}

export function generateThemeUtils(ctx: GeneratorContext): GeneratedFile {
  const content = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  return { path: `${ctx.utilsDir}/cn.ts`, content, type: "util" };
}

export function generateAllThemes(ctx: GeneratorContext): GeneratedFile[] {
  return [generateGlobalStyles(ctx), generateThemeUtils(ctx)];
}
