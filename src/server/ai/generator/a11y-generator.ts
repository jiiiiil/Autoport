import type { GeneratorContext, GeneratedFile } from "./types";

export function generateAccessibilityFiles(ctx: GeneratorContext): GeneratedFile[] {
  const { manifest } = ctx;
  const a11y = manifest.blueprint.accessibility;

  const a11yFile: GeneratedFile = {
    path: `${ctx.libDir}/a11y.ts`,
    content: `export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

export function trapFocus(container: HTMLElement): () => void {
  const focusable = getFocusableElements(container);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  };

  container.addEventListener("keydown", handleKeyDown);
  first?.focus();

  return () => container.removeEventListener("keydown", handleKeyDown);
}

export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite") {
  const el = document.createElement("div");
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", priority);
  el.setAttribute("aria-atomic", "true");
  el.className = "sr-only";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => document.body.removeChild(el), 1000);
}

export const skipLinks = [
  { href: "#main-content", label: "Skip to main content" },
  { href: "#navigation", label: "Skip to navigation" },
] as const;

export const a11yConfig = {
  level: "${a11y.level || "AA"}",
  semanticHTML: ${a11y.semanticHTML},
  ariaLabels: ${a11y.ariaLabels},
  keyboardNavigation: ${a11y.keyboardNavigation},
  focusManagement: ${a11y.focusManagement},
  reducedMotion: ${a11y.reducedMotion},
  colorContrast: ${a11y.colorContrast},
  screenReader: ${a11y.screenReader},
};
`,
    type: "util",
  };

  const skipNavFile: GeneratedFile = {
    path: `${ctx.componentsDir}/skip-nav.tsx`,
    content: `"use client";

export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to main content
    </a>
  );
}
`,
    type: "util",
  };

  return [a11yFile, skipNavFile];
}
