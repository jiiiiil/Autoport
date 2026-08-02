"use client";

import { create } from "zustand";
import type { DiscoveryAnalysis, DiscoveryQuestion, UserProfile } from "@/server/discovery/types";
import type { PortfolioStrategy, SelfReviewResult } from "@/server/strategy/types";

export type DiscoveryStage =
  | "idle"
  | "analyzing"
  | "questioning"
  | "strategizing"
  | "strategy-ready"
  | "generating"
  | "complete";

export interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  questions?: DiscoveryQuestion[];
  timestamp: number;
}

interface DiscoveryStore {
  stage: DiscoveryStage;
  setStage: (stage: DiscoveryStage) => void;

  prompt: string;
  setPrompt: (prompt: string) => void;
  startDiscovery: (prompt: string) => void;

  analysis: DiscoveryAnalysis | null;
  setAnalysis: (analysis: DiscoveryAnalysis | null) => void;

  profile: Partial<UserProfile>;
  setProfile: (profile: Partial<UserProfile>) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;

  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;

  activeQuestions: DiscoveryQuestion[];
  setActiveQuestions: (questions: DiscoveryQuestion[]) => void;

  confidence: number;
  setConfidence: (confidence: number) => void;

  strategy: PortfolioStrategy | null;
  setStrategy: (strategy: PortfolioStrategy | null) => void;

  review: SelfReviewResult | null;
  setReview: (review: SelfReviewResult | null) => void;

  reset: () => void;
}

const initialState = {
  stage: "idle" as DiscoveryStage,
  prompt: "",
  analysis: null,
  profile: {},
  messages: [],
  activeQuestions: [],
  confidence: 0,
  strategy: null,
  review: null,
};

export const useDiscoveryStore = create<DiscoveryStore>((set) => ({
  ...initialState,

  setStage: (stage) => set({ stage }),
  setPrompt: (prompt) => set({ prompt }),
  startDiscovery: (prompt) => set({ prompt, stage: "analyzing" }),
  setAnalysis: (analysis) => set({ analysis }),
  setProfile: (profile) => set({ profile }),
  updateProfile: (patch) =>
    set((state) => ({ profile: { ...state.profile, ...patch } })),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  setActiveQuestions: (questions) => set({ activeQuestions: questions }),
  setConfidence: (confidence) => set({ confidence }),
  setStrategy: (strategy) => set({ strategy }),
  setReview: (review) => set({ review }),

  reset: () => set({ ...initialState }),
}));
