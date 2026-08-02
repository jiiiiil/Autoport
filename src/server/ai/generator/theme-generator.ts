// @ts-nocheck
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
  --color-foreground: ${tokens.colors.text || "#171717"};
  --color-foreground-secondary: ${tokens.colors.textSecondary || "#737373"};
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
  --radius-2xl: ${tokens.radius["2xl"] || "1.5rem"};
  --radius-3xl: ${tokens.radius["3xl"] || "2rem"};
  --radius-full: ${tokens.radius.full || "9999px"};

  --shadow-sm: ${tokens.shadows.sm || "0 1px 2px 0 rgba(0,0,0,0.05)"};
  --shadow-md: ${tokens.shadows.md || "0 4px 6px -1px rgba(0,0,0,0.1)"};
  --shadow-lg: ${tokens.shadows.lg || "0 10px 15px -3px rgba(0,0,0,0.1)"};
  --shadow-xl: ${tokens.shadows.xl || "0 20px 25px -5px rgba(0,0,0,0.1)"};
  --shadow-2xl: ${tokens.shadows["2xl"] || "0 25px 50px -12px rgba(0,0,0,0.25)"};
  --shadow-glow: 0 0 20px rgba(124,58,237,0.3);
  --shadow-glow-lg: 0 0 30px rgba(124,58,237,0.5);

  --blur-xs: 2px;
  --blur-2xl: 40px;
  --blur-3xl: 60px;
}

:root {
  color-scheme: ${isDark ? "dark" : "light"};
}

* {
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-background);
  color: var(--color-foreground);
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

@keyframes meshDrift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(5%, 3%) scale(1.05); }
  66% { transform: translate(-3%, 5%) scale(0.95); }
}

@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(20px, -30px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(30px, 10px) scale(1.05); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
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

.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.gradient-border {
  position: relative;
  border-radius: var(--radius-2xl);
}

.gradient-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.shimmer-text {
  background: linear-gradient(90deg, var(--color-foreground) 0%, var(--color-primary) 50%, var(--color-foreground) 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
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
