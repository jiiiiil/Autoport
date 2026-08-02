import type { AIContextObject } from "../intelligence/types";
import type { PromptConstraints, ComposedNavigation, NavigationStyle, ComposedLayout } from "./types";
import { getPreferredNavigation } from "./constraint-resolver";

function inferNavigationStyle(
  context: AIContextObject,
  constraints: PromptConstraints,
  layout: ComposedLayout,
  sectionCount: number,
  promptHash: string
): NavigationStyle {
  const preferred = getPreferredNavigation(constraints);
  if (preferred && isValidNav(preferred)) {
    return preferred as NavigationStyle;
  }

  const hashNum = parseInt(promptHash, 36) % 100;
  const designLang = context.designLanguage[0]?.name;

  if (layout.style === "magazine" || layout.style === "newspaper") return "magazine-toc";
  if (layout.style === "minimal") return hashNum % 2 === 0 ? "minimal" : "hidden-scroll";
  if (layout.style === "immersive" || layout.style === "cinematic") return "transparent";
  if (layout.style === "horizontal-scroll") return "horizontal-scroll";
  if (layout.style === "gallery") return hashNum % 2 === 0 ? "floating" : "dock";
  if (layout.style === "bento" || layout.style === "card-stack") return "dock";
  if (layout.style === "asymmetric") return hashNum % 2 === 0 ? "floating" : "progressive";
  if (layout.style === "dashboard") return "sidebar";

  if (designLang === "glassmorphism") return "glass";
  if (designLang === "apple") return "floating";
  if (designLang === "linear" || designLang === "raycast") return "minimal";
  if (designLang === "stripe") return "pills";
  if (designLang === "vercel") return "underline";

  if (sectionCount <= 3) return "minimal";
  if (sectionCount <= 5) return hashNum % 3 === 0 ? "floating" : hashNum % 3 === 1 ? "sticky" : "pills";
  if (sectionCount <= 8) return hashNum % 4 === 0 ? "sticky" : hashNum % 4 === 1 ? "floating" : hashNum % 4 === 2 ? "pills" : "glass";
  return hashNum % 2 === 0 ? "sticky" : "floating";
}

function isValidNav(nav: string): boolean {
  const valid = [
    "sticky", "floating", "transparent", "glass", "sidebar",
    "minimal", "hidden-scroll", "hamburger", "pills", "underline",
    "dock", "magazine-toc", "bottom", "horizontal-scroll",
    "progressive", "split", "none",
  ];
  return valid.includes(nav);
}

function getNavigationPosition(style: NavigationStyle): string {
  const positions: Record<NavigationStyle, string> = {
    sticky: "top",
    floating: "top-floating",
    transparent: "top-absolute",
    glass: "top-floating",
    sidebar: "left",
    minimal: "top",
    "hidden-scroll": "top",
    hamburger: "top-right",
    pills: "top-centered",
    underline: "top",
    dock: "bottom-centered",
    "magazine-toc": "left-sidebar",
    bottom: "bottom",
    "horizontal-scroll": "top",
    progressive: "top",
    split: "top-split",
    none: "none",
  };
  return positions[style] || "top";
}

function getMobileBehavior(style: NavigationStyle): string {
  const behaviors: Record<NavigationStyle, string> = {
    sticky: "hamburger-collapse",
    floating: "hamburger-collapse",
    transparent: "hamburger-collapse",
    glass: "hamburger-collapse",
    sidebar: "drawer",
    minimal: "hamburger-collapse",
    "hidden-scroll": "hamburger-collapse",
    hamburger: "hamburger-expand",
    pills: "scroll-horizontal",
    underline: "hamburger-collapse",
    dock: "bottom-sheet",
    "magazine-toc": "drawer",
    bottom: "bottom-tabs",
    "horizontal-scroll": "scroll-horizontal",
    progressive: "progressive-reveal",
    split: "drawer",
    none: "none",
  };
  return behaviors[style] || "hamburger-collapse";
}

function getScrollBehavior(style: NavigationStyle): string {
  const behaviors: Record<NavigationStyle, string> = {
    sticky: "sticky",
    floating: "hide-on-scroll-down",
    transparent: "opaque-on-scroll",
    glass: "blur-on-scroll",
    sidebar: "fixed",
    minimal: "hide-on-scroll",
    "hidden-scroll": "reveal-on-scroll-top",
    hamburger: "sticky",
    pills: "sticky",
    underline: "sticky",
    dock: "fixed-bottom",
    "magazine-toc": "scroll-spy",
    bottom: "fixed-bottom",
    "horizontal-scroll": "horizontal-follow",
    progressive: "progressive-reveal",
    split: "sticky",
    none: "none",
  };
  return behaviors[style] || "sticky";
}

function getVisualStyle(style: NavigationStyle): Record<string, string> {
  const styles: Record<NavigationStyle, Record<string, string>> = {
    sticky: {
      background: "surface",
      borderBottom: "1px border-subtle",
      backdropFilter: "none",
    },
    floating: {
      background: "surface-elevated",
      borderRadius: "full",
      boxShadow: "md",
      margin: "1rem",
      backdropFilter: "none",
    },
    transparent: {
      background: "transparent",
      color: "text-inverse",
    },
    glass: {
      background: "surface/80",
      backdropFilter: "blur(12px)",
      border: "1px border-subtle/50",
      borderRadius: "lg",
    },
    sidebar: {
      background: "surface",
      width: "260px",
      borderRight: "1px border-subtle",
    },
    minimal: {
      background: "transparent",
      fontWeight: "500",
    },
    "hidden-scroll": {
      background: "transparent",
      transform: "auto",
    },
    hamburger: {
      background: "surface",
      borderRadius: "md",
    },
    pills: {
      background: "surface-elevated",
      borderRadius: "full",
      padding: "0.25rem",
    },
    underline: {
      background: "transparent",
      borderBottom: "2px transparent",
    },
    dock: {
      background: "surface/90",
      backdropFilter: "blur(16px)",
      borderRadius: "full",
      padding: "0.5rem",
      boxShadow: "lg",
    },
    "magazine-toc": {
      background: "surface",
      width: "200px",
      fontFamily: "heading",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
    bottom: {
      background: "surface",
      borderTop: "1px border-subtle",
    },
    "horizontal-scroll": {
      background: "transparent",
      overflowX: "auto",
    },
    progressive: {
      background: "transparent",
    },
    split: {
      background: "surface",
      borderBottom: "1px border-subtle",
    },
    none: {},
  };
  return styles[style] || styles.sticky;
}

function getOverlay(style: NavigationStyle): boolean {
  return ["transparent", "glass", "floating", "dock"].includes(style);
}

function getTransparent(style: NavigationStyle): boolean {
  return ["transparent", "glass"].includes(style);
}

function getBackdropFilter(style: NavigationStyle): string {
  const filters: Record<NavigationStyle, string> = {
    glass: "blur(12px) saturate(180%)",
    floating: "none",
    transparent: "none",
    dock: "blur(16px)",
    sticky: "none",
    sidebar: "none",
    minimal: "none",
    "hidden-scroll": "none",
    hamburger: "none",
    pills: "none",
    underline: "none",
    "magazine-toc": "none",
    bottom: "none",
    "horizontal-scroll": "none",
    progressive: "none",
    split: "none",
    none: "none",
  };
  return filters[style] || "none";
}

export function composeNavigation(
  context: AIContextObject,
  constraints: PromptConstraints,
  layout: ComposedLayout,
  sectionNames: string[],
  promptHash: string
): ComposedNavigation {
  const style = inferNavigationStyle(context, constraints, layout, sectionNames.length, promptHash);
  const navSections = sectionNames.filter(s => s !== "contact" || sectionNames.length <= 4);

  return {
    style,
    position: getNavigationPosition(style),
    sections: navSections,
    mobileBehavior: getMobileBehavior(style),
    scrollBehavior: getScrollBehavior(style),
    visualStyle: getVisualStyle(style),
    overlay: getOverlay(style),
    transparent: getTransparent(style),
    backdropFilter: getBackdropFilter(style),
  };
}
