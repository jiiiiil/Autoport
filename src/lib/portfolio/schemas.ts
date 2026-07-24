import type { PortfolioObject } from "./types";

export function emptyPortfolio(): PortfolioObject {
  return {
    personalInfo: {},
    sections: {},
    theme: { mode: "dark" },
    layout: { style: "minimal" },
    navigation: { links: [] },
    seo: {},
  };
}
