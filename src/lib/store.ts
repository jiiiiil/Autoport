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

  reset: () => void;
}

const makeSteps = (): GenerationStep[] => [
  { title: "Analyze Prompt", description: "Understanding your input and context", status: "pending" },
  { title: "Understanding Skills", description: "Mapping expertise to portfolio sections", status: "pending" },
  { title: "Selecting Template", description: "Choosing the best layout for your profile", status: "pending" },
  { title: "Generating Components", description: "Building reusable UI elements", status: "pending" },
  { title: "Generating Animations", description: "Adding smooth transitions and effects", status: "pending" },
  { title: "Generating Layout", description: "Assembling the full page structure", status: "pending" },
  { title: "Creating Theme", description: "Designing color palette and typography", status: "pending" },
  { title: "Compiling React", description: "Bundling components into production build", status: "pending" },
  { title: "Optimizing", description: "Performance tuning and asset compression", status: "pending" },
  { title: "Complete", description: "Your portfolio is ready", status: "pending" },
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

  reset: () =>
    set({
      prompt: "",
      isGenerating: false,
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
