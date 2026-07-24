"use client";

import { create } from "zustand";
import type { PortfolioObject, ThemeMode, LayoutStyle } from "./types";
import { emptyPortfolio } from "./schemas";

interface PortfolioState {
  portfolio: PortfolioObject;
  setPortfolio: (p: PortfolioObject) => void;
  updatePortfolio: (patch: Partial<PortfolioObject>) => void;

  selectedTheme: ThemeMode;
  setSelectedTheme: (t: ThemeMode) => void;

  currentLayout: LayoutStyle;
  setCurrentLayout: (l: LayoutStyle) => void;

  isReady: boolean;
  setIsReady: (v: boolean) => void;

  resetPortfolio: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolio: emptyPortfolio(),
  setPortfolio: (portfolio) => set({ portfolio }),
  updatePortfolio: (patch) =>
    set((state) => ({
      portfolio: { ...state.portfolio, ...patch },
    })),

  selectedTheme: "dark",
  setSelectedTheme: (selectedTheme) => set({ selectedTheme }),

  currentLayout: "minimal",
  setCurrentLayout: (currentLayout) => set({ currentLayout }),

  isReady: false,
  setIsReady: (isReady) => set({ isReady }),

  resetPortfolio: () =>
    set({
      portfolio: emptyPortfolio(),
      selectedTheme: "dark",
      currentLayout: "minimal",
      isReady: false,
    }),
}));
