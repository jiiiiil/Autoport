import type { AIContextObject } from "../intelligence/types";
import type { ResponsivePlan } from "./types";

export function planResponsive(_context: AIContextObject): ResponsivePlan {
  return {
    breakpoints: [
      {
        name: "mobile",
        minWidth: "0px",
        maxWidth: "639px",
        columns: 1,
        gutter: "1rem",
        sectionPadding: "3rem 1rem",
        fontSize: {
          heading: "1.875rem",
          subheading: "1.25rem",
          body: "0.9375rem",
          small: "0.8125rem",
        },
        layout: "stacked",
      },
      {
        name: "tablet",
        minWidth: "640px",
        maxWidth: "1023px",
        columns: 2,
        gutter: "1.5rem",
        sectionPadding: "4rem 1.5rem",
        fontSize: {
          heading: "2.25rem",
          subheading: "1.5rem",
          body: "1rem",
          small: "0.875rem",
        },
        layout: "grid-2",
      },
      {
        name: "laptop",
        minWidth: "1024px",
        maxWidth: "1279px",
        columns: 12,
        gutter: "1.5rem",
        sectionPadding: "5rem 2rem",
        fontSize: {
          heading: "2.5rem",
          subheading: "1.75rem",
          body: "1rem",
          small: "0.875rem",
        },
        layout: "grid-12",
      },
      {
        name: "desktop",
        minWidth: "1280px",
        maxWidth: "1535px",
        columns: 12,
        gutter: "2rem",
        sectionPadding: "6rem 2rem",
        fontSize: {
          heading: "3rem",
          subheading: "1.875rem",
          body: "1rem",
          small: "0.875rem",
        },
        layout: "grid-12",
      },
      {
        name: "ultrawide",
        minWidth: "1536px",
        columns: 12,
        gutter: "2rem",
        sectionPadding: "8rem 4rem",
        fontSize: {
          heading: "3.75rem",
          subheading: "2.25rem",
          body: "1.125rem",
          small: "1rem",
        },
        layout: "centered-constrained",
      },
    ],
    mobileFirst: true,
    containerMaxWidth: "1280px",
    gridColumns: 12,
  };
}
