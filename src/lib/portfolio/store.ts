"use client";

import { create } from "zustand";
import type { PortfolioObject, ThemeMode, LayoutStyle } from "./types";
import type { CompositionGraph } from "@/server/ai/composition/types";
import { emptyPortfolio } from "./schemas";

const SESSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = "portfolio-session";

interface StoredSession {
  portfolio: PortfolioObject;
  composition: CompositionGraph | null;
  timestamp: number;
}

function loadSession(): { portfolio: PortfolioObject; composition: CompositionGraph | null } | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: StoredSession = JSON.parse(raw);
    if (Date.now() - data.timestamp > SESSION_EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { portfolio: data.portfolio, composition: data.composition };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveSession(portfolio: PortfolioObject, composition: CompositionGraph | null) {
  try {
    if (typeof window === "undefined") return;
    const data: StoredSession = { portfolio, composition, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

function clearSession() {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function getInitialState() {
  const session = loadSession();
  return {
    portfolio: session?.portfolio ?? emptyPortfolio(),
    composition: session?.composition ?? null,
    isReady: session !== null,
  };
}

interface PortfolioState {
  portfolio: PortfolioObject;
  setPortfolio: (p: PortfolioObject) => void;
  updatePortfolio: (patch: Partial<PortfolioObject>) => void;

  composition: CompositionGraph | null;
  setComposition: (c: CompositionGraph | null) => void;

  selectedTheme: ThemeMode;
  setSelectedTheme: (t: ThemeMode) => void;

  currentLayout: LayoutStyle;
  setCurrentLayout: (l: LayoutStyle) => void;

  isReady: boolean;
  setIsReady: (v: boolean) => void;

  sessionId: string | null;
  setSessionId: (id: string | null) => void;

  resetPortfolio: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => {
  const initial = getInitialState();

  return {
    portfolio: initial.portfolio,
    setPortfolio: (portfolio) => {
      set({ portfolio });
      saveSession(portfolio, get().composition);
    },
    updatePortfolio: (patch) => {
      set((state) => ({ portfolio: { ...state.portfolio, ...patch } }));
      const updated = get().portfolio;
      saveSession(updated, get().composition);
    },

    composition: initial.composition,
    setComposition: (composition) => {
      set({ composition });
      saveSession(get().portfolio, composition);
    },

    selectedTheme: (initial.composition?.theme?.mode as ThemeMode) ?? "dark",
    setSelectedTheme: (selectedTheme) => set({ selectedTheme }),

    currentLayout: (initial.composition?.layout?.style as LayoutStyle) ?? "minimal",
    setCurrentLayout: (currentLayout) => set({ currentLayout }),

    isReady: initial.isReady,
    setIsReady: (isReady) => set({ isReady }),

    sessionId: null,
    setSessionId: (sessionId) => set({ sessionId }),

    resetPortfolio: () => {
      clearSession();
      set({
        portfolio: emptyPortfolio(),
        composition: null,
        selectedTheme: "dark",
        currentLayout: "minimal",
        isReady: false,
        sessionId: null,
      });
    },
  };
});
