import type { AIContextObject } from "../intelligence/types";
import type { PromptConstraints, ComposedResponsive, ResponsiveStrategy, ComposedLayout } from "./types";

function inferResponsiveStrategy(
  context: AIContextObject,
  promptHash: string
): ResponsiveStrategy {
  const hashNum = parseInt(promptHash, 36) % 100;

  if (context.responsive === false) return "desktop-first";

  const designLang = context.designLanguage[0]?.name;
  if (designLang === "dashboard") return "container-queries";
  if (designLang === "minimal") return "fluid";

  if (hashNum % 4 === 0) return "mobile-first";
  if (hashNum % 4 === 1) return "fluid";
  if (hashNum % 4 === 2) return "adaptive";
  return "mobile-first";
}

function getBreakpoints(
  strategy: ResponsiveStrategy,
  layout: ComposedLayout,
  promptHash: string
): ComposedResponsive["breakpoints"] {
  const baseBreakpoints = [
    {
      name: "mobile",
      minWidth: "0px",
      maxWidth: "639px",
      columns: 1,
      gutter: "1rem",
      sectionPadding: "1.5rem",
      fontSize: {
        heading: "1.75rem",
        subheading: "1.25rem",
        body: "0.9375rem",
        small: "0.8125rem",
      },
      layout: "stacked",
      navigation: "hamburger",
      gridColumns: 4,
    },
    {
      name: "tablet",
      minWidth: "640px",
      maxWidth: "1023px",
      columns: 2,
      gutter: "1.5rem",
      sectionPadding: "3rem",
      fontSize: {
        heading: "2.25rem",
        subheading: "1.5rem",
        body: "1rem",
        small: "0.875rem",
      },
      layout: "2-col",
      navigation: "collapsed",
      gridColumns: 8,
    },
    {
      name: "desktop",
      minWidth: "1024px",
      maxWidth: "1439px",
      columns: 12,
      gutter: "2rem",
      sectionPadding: "5rem",
      fontSize: {
        heading: "3rem",
        subheading: "1.875rem",
        body: "1rem",
        small: "0.875rem",
      },
      layout: layout.gridStrategy,
      navigation: "full",
      gridColumns: 12,
    },
    {
      name: "wide",
      minWidth: "1440px",
      columns: 12,
      gutter: "2rem",
      sectionPadding: "6rem",
      fontSize: {
        heading: "3.5rem",
        subheading: "2.25rem",
        body: "1.0625rem",
        small: "0.875rem",
      },
      layout: layout.gridStrategy,
      navigation: "full",
      gridColumns: 12,
    },
  ];

  const hashNum = parseInt(promptHash, 36) % 100;

  if (strategy === "fluid") {
    for (const bp of baseBreakpoints) {
      const fluidScale = 0.9 + (hashNum % 20) / 100;
      bp.fontSize.heading = `${parseFloat(bp.fontSize.heading) * fluidScale}rem`;
      bp.fontSize.body = `${parseFloat(bp.fontSize.body) * fluidScale}rem`;
    }
  }

  if (strategy === "container-queries") {
    for (const bp of baseBreakpoints) {
      bp.columns = Math.max(bp.columns, 3);
    }
  }

  if (layout.style === "gallery" || layout.style === "masonry") {
    for (const bp of baseBreakpoints) {
      bp.gridColumns = Math.max(bp.gridColumns, 3);
    }
  }

  if (layout.style === "horizontal-scroll") {
    baseBreakpoints[0].layout = "vertical-stack";
    baseBreakpoints[1].layout = "horizontal-peek";
    baseBreakpoints[2].layout = "horizontal-scroll";
    baseBreakpoints[3].layout = "horizontal-scroll";
  }

  return baseBreakpoints;
}

function getAdaptiveLayouts(
  layout: ComposedLayout,
  strategy: ResponsiveStrategy
): Record<string, string> {
  const adaptive: Record<string, string> = {};

  switch (layout.style) {
    case "split":
      adaptive.mobile = "stacked";
      adaptive.tablet = "narrow-split";
      break;
    case "magazine":
      adaptive.mobile = "single-column";
      adaptive.tablet = "2-column";
      break;
    case "bento":
      adaptive.mobile = "stacked-cards";
      adaptive.tablet = "2x2-grid";
      break;
    case "gallery":
      adaptive.mobile = "single-column";
      adaptive.tablet = "2-column-masonry";
      break;
    case "timeline":
      adaptive.mobile = "vertical-linear";
      adaptive.tablet = "vertical-centered";
      break;
    case "horizontal-scroll":
      adaptive.mobile = "vertical-stack";
      adaptive.tablet = "horizontal-peek";
      break;
    case "asymmetric":
      adaptive.mobile = "full-width";
      adaptive.tablet = "slight-asymmetry";
      break;
    case "cinematic":
      adaptive.mobile = "stacked-full-bleed";
      adaptive.tablet = "stacked-cinematic";
      break;
    default:
      adaptive.mobile = "stacked";
      adaptive.tablet = "2-col";
  }

  return adaptive;
}

export function composeResponsive(
  context: AIContextObject,
  constraints: PromptConstraints,
  layout: ComposedLayout,
  promptHash: string
): ComposedResponsive {
  const strategy = inferResponsiveStrategy(context, promptHash);
  const breakpoints = getBreakpoints(strategy, layout, promptHash);
  const adaptiveLayouts = getAdaptiveLayouts(layout, strategy);

  return {
    strategy,
    breakpoints,
    containerMaxWidth: layout.containerWidth,
    mobileFirst: strategy !== "desktop-first",
    fluidTypography: strategy === "fluid" || strategy === "hybrid",
    adaptiveLayouts,
  };
}
