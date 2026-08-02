"use client";

import { create } from "zustand";

export type GenerationStep = {
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
};

export type LogEntry = {
  id: string;
  filename: string;
  action: string;
  color: string;
  timestamp: number;
};

export type FileNode = {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};

export type AiPhase =
  | "idle"
  | "thinking"
  | "planning"
  | "validating"
  | "composing"
  | "refining"
  | "coding"
  | "optimizing"
  | "compiling"
  | "complete";

export type Metrics = {
  components: number;
  linesOfCode: number;
  animations: number;
  images: number;
  sections: number;
  speed: string;
  compileTime: string;
};

interface AppState {
  prompt: string;
  setPrompt: (prompt: string) => void;

  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;

  generationTriggered: boolean;
  setGenerationTriggered: (v: boolean) => void;

  generationError: string | null;
  setGenerationError: (e: string | null) => void;

  progress: number;
  setProgress: (v: number) => void;

  currentStepIndex: number;
  setCurrentStepIndex: (v: number) => void;

  steps: GenerationStep[];
  setSteps: (steps: GenerationStep[]) => void;

  isComplete: boolean;
  setIsComplete: (v: boolean) => void;

  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;

  files: FileNode[];
  setFiles: (files: FileNode[]) => void;

  metrics: Metrics;
  setMetrics: (m: Partial<Metrics>) => void;

  aiPhase: AiPhase;
  setAiPhase: (phase: AiPhase) => void;

  thinkingText: string;
  setThinkingText: (text: string) => void;

  previewSections: string[];
  addPreviewSection: (section: string) => void;
  setPreviewSections: (sections: string[]) => void;

  reset: () => void;
}

const makeSteps = (): GenerationStep[] => [
  { title: "Validating Prompt", description: "Checking prompt constraints and requirements", status: "pending" },
  { title: "Analyzing Intelligence", description: "Understanding context, intent, and design language", status: "pending" },
  { title: "Composing Layout", description: "AI-dynamic layout architecture generation", status: "pending" },
  { title: "Composing Sections", description: "Dynamic section hierarchy and storytelling flow", status: "pending" },
  { title: "Composing Theme", description: "Generative color palette and typography", status: "pending" },
  { title: "Composing Motion", description: "Animation strategy and micro-interactions", status: "pending" },
  { title: "Adaptive Refinement", description: "Optimizing visual hierarchy and spacing", status: "pending" },
  { title: "Validating Composition", description: "Running quality gates and accessibility checks", status: "pending" },
  { title: "Finalizing", description: "Preparing composition graph for generation", status: "pending" },
  { title: "Complete", description: "Your unique portfolio is ready", status: "pending" },
];

const initialMetrics: Metrics = {
  components: 0,
  linesOfCode: 0,
  animations: 0,
  images: 0,
  sections: 0,
  speed: "0 files/s",
  compileTime: "0ms",
};

export const useAppStore = create<AppState>((set) => ({
  prompt: "",
  setPrompt: (prompt) => set({ prompt }),

  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),

  generationTriggered: false,
  setGenerationTriggered: (generationTriggered) => set({ generationTriggered }),

  generationError: null,
  setGenerationError: (generationError) => set({ generationError }),

  progress: 0,
  setProgress: (progress) => set({ progress }),

  currentStepIndex: 0,
  setCurrentStepIndex: (currentStepIndex) => set({ currentStepIndex }),

  steps: makeSteps(),
  setSteps: (steps) => set({ steps }),

  isComplete: false,
  setIsComplete: (isComplete) => set({ isComplete }),

  logs: [],
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  clearLogs: () => set({ logs: [] }),

  files: [],
  setFiles: (files) => set({ files }),

  metrics: { ...initialMetrics },
  setMetrics: (m) => set((state) => ({ metrics: { ...state.metrics, ...m } })),

  aiPhase: "idle",
  setAiPhase: (aiPhase) => set({ aiPhase }),

  thinkingText: "",
  setThinkingText: (thinkingText) => set({ thinkingText }),

  previewSections: [],
  addPreviewSection: (section) =>
    set((state) => ({ previewSections: [...state.previewSections, section] })),
  setPreviewSections: (previewSections) => set({ previewSections }),

  reset: () =>
    set({
      prompt: "",
      isGenerating: false,
      generationTriggered: false,
      generationError: null,
      progress: 0,
      currentStepIndex: 0,
      steps: makeSteps(),
      isComplete: false,
      logs: [],
      files: [],
      metrics: { ...initialMetrics },
      aiPhase: "idle",
      thinkingText: "",
      previewSections: [],
    }),
}));
