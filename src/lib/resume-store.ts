"use client";

import { create } from "zustand";
import type { ResumeJSON, ResumeParseReport, PortfolioStrategy, ResumeValidationResult, ThemeName, AnimationLevel, AnimationPresetOptions } from "@/server/resume/types";

export type UploadStage =
  | "upload"
  | "parsing"
  | "customize"
  | "generating"
  | "complete"
  | "error";

const DEFAULT_THEME: ThemeName = "3d-creator";

export interface ResumeState {
  stage: UploadStage;
  file: { name: string; size: number } | null;
  resume: ResumeJSON | null;
  strategy: PortfolioStrategy | null;
  validation: ResumeValidationResult | null;
  normalized: ResumeParseReport["normalized"] | null;
  parseDurationMs: number | null;
  detectedAsLinkedIn: boolean;
  detectedPages: number | null;

  theme: ThemeName;
  animationLevel: AnimationLevel;
  customColors: { primary?: string; secondary?: string; accent?: string; background?: string; surface?: string; text?: string };
  presets: AnimationPresetOptions;

  generationProgress: number;
  generationStatus: string;
  generationError: string | null;

  setStage: (stage: UploadStage) => void;
  setFile: (file: { name: string; size: number }) => void;
  setParseReport: (report: ResumeParseReport) => void;
  setTheme: (theme: ThemeName) => void;
  setAnimationLevel: (level: AnimationLevel) => void;
  setCustomColors: (colors: ResumeState["customColors"]) => void;
  setPresetOption: <K extends keyof AnimationPresetOptions>(key: K, value: AnimationPresetOptions[K]) => void;
  setGenerationProgress: (progress: number) => void;
  setGenerationStatus: (status: string) => void;
  setGenerationError: (error: string | null) => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  stage: "upload",
  file: null,
  resume: null,
  strategy: null,
  validation: null,
  normalized: null,
  parseDurationMs: null,
  detectedAsLinkedIn: false,
  detectedPages: null,

  theme: DEFAULT_THEME,
  animationLevel: "medium",
  customColors: {},
  presets: {
    motionStyle: "quantum",
    cardStyle: "tilt3d",
    buttonStyle: "liquid-gradient",
    canvasStyle: "three-particles",
    mascotOption: "enabled-byte",
  },

  generationProgress: 0,
  generationStatus: "idle",
  generationError: null,

  setStage: (stage) => set({ stage }),
  setFile: (file) => set({ file }),
  setParseReport: (report) =>
    set({
      resume: report.resume,
      strategy: report.strategy,
      validation: report.validation,
      normalized: report.normalized,
      parseDurationMs: report.durationMs,
      detectedAsLinkedIn: report.resume.source.detectedAsLinkedIn,
      detectedPages: report.resume.source.pages,
    }),
  setTheme: (theme) => set({ theme }),
  setAnimationLevel: (animationLevel) => set({ animationLevel }),
  setCustomColors: (customColors) => set({ customColors }),
  setPresetOption: (key, value) =>
    set((state) => ({
      presets: {
        ...state.presets,
        [key]: value,
      },
    })),
  setGenerationProgress: (generationProgress) => set({ generationProgress }),
  setGenerationStatus: (generationStatus) => set({ generationStatus }),
  setGenerationError: (generationError) => set({ generationError }),
  reset: () =>
    set({
      stage: "upload",
      file: null,
      resume: null,
      strategy: null,
      validation: null,
      normalized: null,
      parseDurationMs: null,
      detectedAsLinkedIn: false,
      detectedPages: null,
      theme: DEFAULT_THEME,
      animationLevel: "medium",
      customColors: {},
      presets: {
        motionStyle: "quantum",
        cardStyle: "tilt3d",
        buttonStyle: "liquid-gradient",
        canvasStyle: "three-particles",
        mascotOption: "enabled-byte",
      },
      generationProgress: 0,
      generationStatus: "idle",
      generationError: null,
    }),
}));
