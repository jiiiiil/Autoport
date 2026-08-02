"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppStore, type LogEntry, type FileNode } from "@/lib/store";
import { usePortfolioStore } from "@/lib/portfolio/store";
import { useDiscoveryStore } from "@/lib/discovery-store";
import type { CompositionGraph } from "@/server/ai/composition/types";

function logId(): string {
  return Math.random().toString(36).slice(2, 8);
}

function buildDynamicLogEntries(composition: CompositionGraph): Omit<LogEntry, "id" | "timestamp">[] {
  const entries: Omit<LogEntry, "id" | "timestamp">[] = [];
  const sectionNames = composition.sections.map((s) => s.id);

  entries.push({ filename: "layout.tsx", action: "composed", color: "bg-purple-400" });
  entries.push({ filename: "navigation.tsx", action: "composed", color: "bg-blue-400" });

  for (const name of sectionNames) {
    const filename = `${name.charAt(0).toUpperCase() + name.slice(1)}.tsx`;
    entries.push({ filename, action: "composed", color: "bg-emerald-400" });
  }

  entries.push({ filename: "theme.ts", action: "generated", color: "bg-amber-400" });
  entries.push({ filename: "animations.ts", action: "generated", color: "bg-purple-400" });
  entries.push({ filename: "responsive.ts", action: "generated", color: "bg-blue-400" });
  entries.push({ filename: "tokens.css", action: "generated", color: "bg-cyan-400" });
  entries.push({ filename: "composition.json", action: "finalized", color: "bg-emerald-400" });
  entries.push({ filename: "build completed", action: "done", color: "bg-emerald-400" });

  return entries;
}

function buildDynamicFileTree(sectionNames: string[]): FileNode[] {
  const sectionFiles = sectionNames.map(name => ({
    name: `${name.charAt(0).toUpperCase() + name.slice(1)}.tsx`,
    type: "file" as const,
  }));

  return [
    {
      name: "components",
      type: "folder",
      children: [
        { name: "Navigation.tsx", type: "file" },
        ...sectionFiles,
        { name: "Footer.tsx", type: "file" },
      ],
    },
    {
      name: "composition",
      type: "folder",
      children: [
        { name: "layout.ts", type: "file" },
        { name: "theme.ts", type: "file" },
        { name: "tokens.css", type: "file" },
        { name: "responsive.ts", type: "file" },
      ],
    },
    {
      name: "lib",
      type: "folder",
      children: [
        { name: "animations.ts", type: "file" },
        { name: "accessibility.ts", type: "file" },
      ],
    },
    {
      name: "hooks",
      type: "folder",
      children: [
        { name: "useScrollAnimation.ts", type: "file" },
        { name: "useReducedMotion.ts", type: "file" },
      ],
    },
  ];
}

function buildPreviewSections(sectionNames: string[]): string[] {
  return ["Header", ...sectionNames.map(n => n.charAt(0).toUpperCase() + n.slice(1))];
}

export function useGenerationEngine() {
  const hasStarted = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);

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
    generationTriggered,
    setGenerationTriggered,
    setGenerationError,
  } = useAppStore();

  const { setPortfolio, setIsReady, setComposition, setSessionId } = usePortfolioStore();

  const runGeneration = useCallback(async () => {
    if (hasStarted.current) return;

    if (!generationTriggered) return;

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setGenerationError("Prompt cannot be empty");
      setThinkingText("Error: Prompt cannot be empty");
      setAiPhase("idle");
      setIsGenerating(false);
      return;
    }

    if (trimmedPrompt.length < 5) {
      setGenerationError("Prompt must be at least 5 characters");
      setThinkingText("Error: Prompt must be at least 5 characters");
      setAiPhase("idle");
      setIsGenerating(false);
      hasStarted.current = false;
      return;
    }

    hasStarted.current = true;
    setIsGenerating(true);
    clearLogs();
    setFiles([]);
    setMetrics({
      components: 0, linesOfCode: 0, animations: 0,
      images: 0, sections: 0, speed: "0 files/s", compileTime: "0ms",
    });
    setAiPhase("thinking");
    setThinkingText("Starting generation...");

    const PHASE_MAP: Record<string, { progress: number; aiPhase: "thinking" | "planning" | "coding" | "optimizing" | "compiling" | "complete" }> = {
      "Validating prompt": { progress: 5, aiPhase: "thinking" },
      "Prompt analyzed": { progress: 12, aiPhase: "thinking" },
      "Analyzing prompt intelligence": { progress: 18, aiPhase: "thinking" },
      "Generating composition graph": { progress: 30, aiPhase: "planning" },
      "Composition graph generated": { progress: 50, aiPhase: "planning" },
      "Composition refined": { progress: 60, aiPhase: "optimizing" },
      "Generating unique portfolio": { progress: 70, aiPhase: "coding" },
      "Content generated": { progress: 80, aiPhase: "coding" },
      "Self-review": { progress: 84, aiPhase: "optimizing" },
      "Building live preview": { progress: 88, aiPhase: "compiling" },
      "Saving to database": { progress: 95, aiPhase: "compiling" },
      "Portfolio generated": { progress: 100, aiPhase: "complete" },
    };

    const totalSteps = steps.length;

    try {
      const discoveryStore = useDiscoveryStore.getState();
      const strategy = discoveryStore.strategy;
      const profile = discoveryStore.profile;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          stream: true,
          ...(strategy ? { strategy } : {}),
          ...(profile && Object.keys(profile).length > 0 ? { profile } : {}),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Generation failed" }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          try {
            const event = JSON.parse(trimmed.slice(6));

            if (event.type === "status") {
              const statusText = event.data as string;
              setThinkingText(statusText);

              for (const [keyword, phaseDef] of Object.entries(PHASE_MAP)) {
                if (statusText.includes(keyword)) {
                  setProgress(phaseDef.progress);
                  setAiPhase(phaseDef.aiPhase);

                  const stepIdx = Math.min(
                    Math.floor((phaseDef.progress / 100) * totalSteps),
                    totalSteps - 1
                  );
                  setSteps(
                    steps.map((s, i) => ({
                      ...s,
                      status: i < stepIdx ? ("completed" as const) : i === stepIdx ? ("current" as const) : ("pending" as const),
                    }))
                  );
                  setCurrentStepIndex(stepIdx);

                  if (phaseDef.progress <= 15) {
                    setMetrics({ components: 2, linesOfCode: phaseDef.progress * 8 });
                  } else if (phaseDef.progress <= 55) {
                    setMetrics({
                      components: Math.floor(phaseDef.progress / 5),
                      linesOfCode: phaseDef.progress * 15,
                      sections: Math.floor((phaseDef.progress - 15) / 6),
                      animations: Math.floor((phaseDef.progress - 15) / 10),
                    });
                  } else {
                    setMetrics({
                      components: 12,
                      linesOfCode: phaseDef.progress * 20,
                      sections: 8,
                      animations: 10,
                    });
                  }
                  break;
                }
              }
            } else if (event.type === "done") {
              const result = JSON.parse(event.data);

              if (result.composition) {
                setComposition(result.composition);

                const logEntries = buildDynamicLogEntries(result.composition);
                clearLogs();
                for (const entry of logEntries) {
                  addLog({ ...entry, id: logId(), timestamp: Date.now() });
                }

                const fileTree = buildDynamicFileTree(result.composition.sections.map((s: { id: string }) => s.id));
                setFiles(fileTree);

                clearPreviewSections();
                const previewSections = buildPreviewSections(result.composition.sections.map((s: { id: string }) => s.id));
                for (const section of previewSections) {
                  addPreviewSection(section);
                }

                setMetrics({
                  components: result.composition.components?.length || 12,
                  linesOfCode: 800 + result.composition.sections.length * 120,
                  sections: result.composition.sections.length,
                  animations: (result.composition.motion?.microInteractions?.length || 0) + 5,
                  images: 3,
                  compileTime: `${result.duration || 0}ms`,
                });

                setSessionId(result.generationId);
              }

              if (result.portfolioData) {
                setPortfolio(result.portfolioData);
              }

              if (result.reviewReport) {
                const report = result.reviewReport as {
                  overall?: number;
                  scores?: Array<{ axis: string; score: number }>;
                  improvements?: string[];
                };
                const worst = (report.scores ?? []).slice().sort((a, b) => a.score - b.score)[0];
                setThinkingText(
                  `Self-review: ${report.overall ?? 0}% overall${worst ? ` · weakest: ${worst.axis} (${worst.score})` : ""}${report.improvements?.length ? ` · ${report.improvements.length} auto-fix(es)` : ""}`
                );
                addLog({
                  id: logId(),
                  filename: "self-review",
                  action: `${report.overall ?? 0}% · ${report.improvements?.length ?? 0} auto-fix(es)`,
                  color: "bg-cyan-400",
                  timestamp: Date.now(),
                });
              }

              setThinkingText("Build successful");
              setAiPhase("complete");
              setProgress(100);
              setSteps(steps.map((s) => ({ ...s, status: "completed" as const })));
              setCurrentStepIndex(steps.length - 1);
              addLog({ id: logId(), filename: "build completed", action: "done", color: "bg-emerald-400", timestamp: Date.now() });

              setIsReady(true);
              setIsComplete(true);
              setIsGenerating(false);
              setGenerationTriggered(false);
              hasStarted.current = false;

            } else if (event.type === "error") {
              throw new Error(event.data);
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && !parseErr.message.includes("JSON")) {
              throw parseErr;
            }
          }
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setGenerationError(error instanceof Error ? error.message : "Generation failed");
      setThinkingText("Build failed");
      setAiPhase("idle");
      setSteps(steps.map((s) => ({ ...s, status: "completed" as const })));
      setCurrentStepIndex(steps.length - 1);
      addLog({ id: logId(), filename: "fallback completed", action: "done", color: "bg-amber-400", timestamp: Date.now() });

      setIsReady(true);
      setIsComplete(true);
      setIsGenerating(false);
      setGenerationTriggered(false);
      hasStarted.current = false;
    }
  }, [
    steps, setSteps, setCurrentStepIndex, setProgress,
    setIsComplete, setIsGenerating, addLog, clearLogs,
    setFiles, setMetrics, setAiPhase, setThinkingText,
    addPreviewSection, prompt, setPortfolio, setIsReady,
    setComposition, setSessionId, generationTriggered,
    setGenerationTriggered, setGenerationError,
  ]);

  useEffect(() => {
    runGeneration();
  }, [runGeneration]);

  return { isComplete: useAppStore((s) => s.isComplete) };
}

function clearPreviewSections() {
  const store = useAppStore.getState();
  store.setSteps(store.steps.map(s => ({ ...s, status: "pending" as const })));
  store.setPreviewSections([]);
}
