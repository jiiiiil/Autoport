import type { PortfolioObject } from "./types";

export function emptyPortfolio(): PortfolioObject {
  return {
    personalInfo: {},
    sections: {},
    theme: { mode: "spatial-3d" },
    layout: { style: "minimal" },
    navigation: { links: [] },
    seo: {},
  };
}
