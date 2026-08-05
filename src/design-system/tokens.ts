export const FONT_FAMILIES = {
  heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

export const FONT_SCALE: Record<string, string> = {
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
  display: "clamp(3.5rem, 8vw, 6.5rem)",
};

export const FONT_WEIGHTS: Record<string, number> = {
  thin: 100,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

export const LINE_HEIGHTS: Record<string, string> = {
  none: "1",
  tight: "1.1",
  snug: "1.25",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
  heading: "1.2",
  body: "1.6",
  display: "1.05",
};

export const LETTER_SPACINGS: Record<string, string> = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  display: "-0.02em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
};

export const RADIUS_SCALE: Record<string, string> = {
  none: "0px",
  xs: "0.25rem",
  sm: "0.375rem",
  base: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",
};

export const RADIUS_STYLES: Record<NonNullable<import("./types").ThemeDefinition["radiusStyle"]>, Record<string, string>> = {
  standard: {
    none: "0px", xs: "0.25rem", sm: "0.375rem", base: "0.5rem", md: "0.75rem",
    lg: "1rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem", full: "9999px",
  },
  rounded: {
    none: "0px", xs: "0.5rem", sm: "0.75rem", base: "1rem", md: "1.25rem",
    lg: "1.5rem", xl: "1.75rem", "2xl": "2rem", "3xl": "2.5rem", full: "9999px",
  },
  sharp: {
    none: "0px", xs: "0px", sm: "0px", base: "0px", md: "0px",
    lg: "0px", xl: "0px", "2xl": "0px", "3xl": "0px", full: "9999px",
  },
  glass: {
    none: "0px", xs: "0.5rem", sm: "0.75rem", base: "1rem", md: "1.5rem",
    lg: "2rem", xl: "2.5rem", "2xl": "3rem", "3xl": "3.5rem", full: "9999px",
  },
};

export const SHADOW_ALPHAS: Record<"sm" | "md" | "lg" | "xl" | "2xl" | "3xl", number> = {
  sm: 0.16,
  md: 0.2,
  lg: 0.22,
  xl: 0.25,
  "2xl": 0.3,
  "3xl": 0.38,
};

export const SHADOW_STRUCTURES: Record<string, (a: number) => string> = {
  sm: (a) => `0 1px 2px 0 rgba(SHADOW, ${a})`,
  md: (a) => `0 1px 3px 0 rgba(SHADOW, ${a}), 0 1px 2px -1px rgba(SHADOW, ${a})`,
  lg: (a) => `0 4px 6px -1px rgba(SHADOW, ${a}), 0 2px 4px -2px rgba(SHADOW, ${a})`,
  xl: (a) => `0 10px 15px -3px rgba(SHADOW, ${a}), 0 4px 6px -4px rgba(SHADOW, ${a})`,
  "2xl": (a) => `0 25px 50px -12px rgba(SHADOW, ${a})`,
  "3xl": (a) => `0 35px 60px -15px rgba(SHADOW, ${a})`,
};

export const SPACING_SCALE: Record<string, string> = {
  "0": "0px",
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
  "11": "2.75rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "18": "4.5rem",
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
  section: "6rem",
  "section-lg": "8rem",
  "container-x": "1.5rem",
};

export const BREAKPOINTS: Record<string, string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const CONTAINER_WIDTHS: Record<string, string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1440px",
  narrow: "880px",
  content: "1200px",
  wide: "1320px",
};

export const Z_INDEX_SCALE: Record<string, number> = {
  base: 0,
  nav: 10,
  dock: 20,
  sticky: 30,
  dropdown: 40,
  overlay: 50,
  modal: 60,
  popover: 70,
  tooltip: 80,
  toast: 90,
  beacon: 100,
};

export const OPACITY_SCALE: Record<string, number> = {
  "0": 0,
  "5": 0.05,
  "10": 0.1,
  "15": 0.15,
  "20": 0.2,
  "25": 0.25,
  "30": 0.3,
  "40": 0.4,
  "50": 0.5,
  "60": 0.6,
  "70": 0.7,
  "75": 0.75,
  "80": 0.8,
  "90": 0.9,
  "95": 0.95,
  "100": 1,
};

export const BLUR_SCALE: Record<string, string> = {
  none: "0px",
  xs: "4px",
  sm: "8px",
  base: "12px",
  md: "16px",
  lg: "24px",
  xl: "36px",
  "2xl": "64px",
  "3xl": "96px",
};

export const DURATIONS: Record<string, string> = {
  faster: "75ms",
  fast: "150ms",
  base: "250ms",
  normal: "300ms",
  slow: "500ms",
  slower: "700ms",
  slowest: "1000ms",
};

export const EASINGS: Record<string, string> = {
  linear: "linear",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  snap: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
};

export const GRID = {
  columns: 12,
  sectionColumns: 12,
  gap: "1.5rem",
  cardColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  galleryColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  sidebarWidth: "320px",
};

export const GLASS_PRESETS = {
  subtle: {
    blur: "12px",
    saturate: "140%",
    opacity: 0.55,
    borderOpacity: 0.4,
  },
  strong: {
    blur: "20px",
    saturate: "160%",
    opacity: 0.72,
    borderOpacity: 0.55,
  },
} as const;

export const BORDERS = {
  thin: "1px solid",
  medium: "2px solid",
  thick: "3px solid",
} as const;
