"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppStore, type LogEntry, type FileNode } from "@/lib/store";
import { parsePrompt } from "@/lib/portfolio/parser";
import { usePortfolioStore } from "@/lib/portfolio/store";

const PROGRESS_STEPS = [
  0, 2, 4, 8, 12, 18, 24, 31, 39, 47, 56, 64, 71, 82, 90, 96, 100,
];

const THINKING_TEXTS = [
  "Understanding your prompt...",
  "Analyzing design style...",
  "Selecting animations...",
  "Generating component tree...",
  "Optimizing typography...",
  "Building responsive layout...",
  "Creating portfolio sections...",
  "Preparing production build...",
  "Checking dependencies...",
  "Resolving imports...",
  "Fixing TypeScript...",
  "Optimizing bundle...",
];

const AI_PHASES: { phase: "thinking" | "planning" | "coding" | "optimizing" | "compiling" | "complete"; at: number }[] = [
  { phase: "thinking", at: 0 },
  { phase: "planning", at: 12 },
  { phase: "coding", at: 24 },
  { phase: "optimizing", at: 64 },
  { phase: "compiling", at: 82 },
  { phase: "complete", at: 100 },
];

const LOG_ENTRIES: Omit<LogEntry, "id" | "timestamp">[] = [
  { filename: "hero.tsx", action: "created", color: "bg-emerald-400" },
  { filename: "navbar.tsx", action: "generated", color: "bg-blue-400" },
  { filename: "projects.tsx", action: "generated", color: "bg-emerald-400" },
  { filename: "skills.tsx", action: "generated", color: "bg-emerald-400" },
  { filename: "experience.tsx", action: "generated", color: "bg-blue-400" },
  { filename: "contact.tsx", action: "generated", color: "bg-emerald-400" },
  { filename: "footer.tsx", action: "generated", color: "bg-purple-400" },
  { filename: "animations.ts", action: "created", color: "bg-amber-400" },
  { filename: "theme.ts", action: "created", color: "bg-blue-400" },
  { filename: "portfolio.json", action: "generated", color: "bg-emerald-400" },
  { filename: "layout.tsx", action: "created", color: "bg-emerald-400" },
  { filename: "build completed", action: "done", color: "bg-emerald-400" },
];

const FILE_TREE: FileNode[] = [
  {
    name: "components",
    type: "folder",
    children: [
      { name: "Hero.tsx", type: "file" },
      { name: "Navbar.tsx", type: "file" },
      { name: "Projects.tsx", type: "file" },
      { name: "Skills.tsx", type: "file" },
      { name: "Experience.tsx", type: "file" },
      { name: "Contact.tsx", type: "file" },
      { name: "Footer.tsx", type: "file" },
    ],
  },
  {
    name: "lib",
    type: "folder",
    children: [
      { name: "animations.ts", type: "file" },
      { name: "theme.ts", type: "file" },
    ],
  },
  {
    name: "hooks",
    type: "folder",
    children: [{ name: "useScroll.ts", type: "file" }],
  },
  {
    name: "store",
    type: "folder",
    children: [{ name: "portfolio.ts", type: "file" }],
  },
];

const PREVIEW_SECTIONS = ["Header", "Hero", "Projects", "Skills", "Experience", "Contact"];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logId(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function useGenerationEngine() {
  const hasStarted = useRef(false);
  const thinkingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    setIsComplete,
    setProgress,
    setCurrentStepIndex,
    steps,
    setSteps,
    setIsGenerating,
    addLog,
    clearLogs,
    setFiles,
    setMetrics,
    setAiPhase,
    setThinkingText,
    addPreviewSection,
    prompt,
    isComplete,
  } = useAppStore();

  const { setPortfolio, setIsReady } = usePortfolioStore();

  const stopThinking = useCallback(() => {
    if (thinkingInterval.current) {
      clearInterval(thinkingInterval.current);
      thinkingInterval.current = null;
    }
  }, []);

  const startThinking = useCallback(() => {
    let idx = 0;
    setThinkingText(THINKING_TEXTS[0]);
    thinkingInterval.current = setInterval(() => {
      idx = (idx + 1) % THINKING_TEXTS.length;
      setThinkingText(THINKING_TEXTS[idx]);
    }, 2200);
  }, [setThinkingText]);

  const runGeneration = useCallback(async () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    setIsGenerating(true);
    clearLogs();
    setFiles([]);
    setMetrics({ components: 0, linesOfCode: 0, animations: 0, images: 0, sections: 0, speed: "0 files/s", compileTime: "0ms" });
    setAiPhase("thinking");
    startThinking();

    const totalSteps = steps.length;

    for (let p = 0; p < PROGRESS_STEPS.length; p++) {
      const prog = PROGRESS_STEPS[p];
      setProgress(prog);

      const stepIdx = Math.min(
        Math.floor((prog / 100) * totalSteps),
        totalSteps - 1
      );

      setSteps(
        steps.map((s, i) => ({
          ...s,
          status: i < stepIdx ? ("completed" as const) : i === stepIdx ? ("current" as const) : ("pending" as const),
        }))
      );
      setCurrentStepIndex(stepIdx);

      const phaseDef = AI_PHASES.find((a) => a.at === prog);
      if (phaseDef) setAiPhase(phaseDef.phase);

      if (prog <= 12) {
        setMetrics({ components: Math.floor(prog / 3), linesOfCode: prog * 12 });
      } else if (prog <= 47) {
        setMetrics({ components: Math.floor(prog / 3), linesOfCode: prog * 18, sections: Math.floor((prog - 12) / 6), animations: Math.floor((prog - 12) / 8) });
      } else if (prog <= 82) {
        setMetrics({ components: Math.floor(prog / 3), linesOfCode: prog * 24, sections: Math.floor((prog - 12) / 6), animations: Math.floor((prog - 12) / 8), images: Math.floor((prog - 47) / 12), speed: "3.2 files/s" });
      } else {
        setMetrics({ components: 28, linesOfCode: 1847, sections: 6, animations: 12, images: 3, speed: "5.1 files/s", compileTime: `${Math.floor((prog - 82) * 12)}ms` });
      }

      const logIdx = Math.min(
        Math.floor((prog / 100) * LOG_ENTRIES.length),
        LOG_ENTRIES.length - 1
      );
      for (let l = Math.max(0, logIdx - 1); l <= logIdx; l++) {
        if (LOG_ENTRIES[l]) {
          addLog({ ...LOG_ENTRIES[l], id: logId(), timestamp: Date.now() });
        }
      }

      const fileIdx = Math.min(
        Math.floor((prog / 100) * 12),
        12
      );
      const visibleFiles: FileNode[] = FILE_TREE.map((folder) => ({
        ...folder,
        children: folder.children?.slice(
          0,
          Math.ceil((fileIdx / 12) * (folder.children?.length ?? 0))
        ),
      })).filter((f) => f.children && f.children.length > 0);
      setFiles(visibleFiles);

      if (prog >= 56 && prog <= 82) {
        const sectionIdx = Math.floor(((prog - 56) / 26) * PREVIEW_SECTIONS.length);
        for (let s = 0; s <= Math.min(sectionIdx, PREVIEW_SECTIONS.length - 1); s++) {
          addPreviewSection(PREVIEW_SECTIONS[s]);
        }
      }

      const base = prog < 24 ? 900 : prog < 64 ? 1200 : prog < 90 ? 700 : 400;
      const jitter = Math.floor(Math.random() * 600);
      await delay(base + jitter);
    }

    stopThinking();
    setThinkingText("Build successful");
    setAiPhase("complete");

    setSteps(
      steps.map((s) => ({ ...s, status: "completed" as const }))
    );
    setCurrentStepIndex(steps.length - 1);

    addLog({ id: logId(), filename: "build completed", action: "done", color: "bg-emerald-400", timestamp: Date.now() });

    const portfolio = parsePrompt(prompt);
    setPortfolio(portfolio);
    setIsReady(true);

    setIsComplete(true);
    setIsGenerating(false);
  }, [
    steps, setSteps, setCurrentStepIndex, setProgress,
    setIsComplete, setIsGenerating, addLog, clearLogs,
    setFiles, setMetrics, setAiPhase, setThinkingText,
    addPreviewSection, startThinking, stopThinking,
    prompt, setPortfolio, setIsReady,
  ]);

  useEffect(() => {
    runGeneration();
    return () => stopThinking();
  }, [runGeneration, stopThinking]);

  return { isComplete };
}
