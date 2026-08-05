"use client";

import { useMemo } from "react";
import { analyzePortfolioFit, getClamp, getGridClass } from "@/lib/portfolio/layout-engine";
import type { PortfolioObject } from "@/lib/portfolio/types";
import type { PortfolioFitMap } from "@/lib/portfolio/layout-engine";

export function useLayoutFit(portfolio: PortfolioObject): PortfolioFitMap {
  return useMemo(() => analyzePortfolioFit(portfolio), [portfolio]);
}

export function useSectionGrid(
  portfolio: PortfolioObject,
  sectionKey: string,
  fallback: string
): { gridClass: string; clampClass: string | null } {
  const fit = useLayoutFit(portfolio);
  return {
    gridClass: getGridClass(fit, sectionKey, fallback),
    clampClass: getClamp(fit, sectionKey),
  };
}
