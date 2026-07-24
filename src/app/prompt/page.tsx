"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PromptStudio } from "@/components/prompt/prompt-studio";
import { useAppStore } from "@/lib/store";

export default function PromptPage() {
  const {
    setIsComplete,
    setIsGenerating,
    setProgress,
    setCurrentStepIndex,
    setSteps,
    clearLogs,
    setFiles,
    setMetrics,
    setAiPhase,
    setThinkingText,
  } = useAppStore();

  useEffect(() => {
    setIsComplete(false);
    setIsGenerating(false);
    setProgress(0);
    setCurrentStepIndex(0);
    clearLogs();
    setFiles([]);
    setMetrics({ components: 0, linesOfCode: 0, animations: 0, images: 0, sections: 0, speed: "0 files/s", compileTime: "0ms" });
    setAiPhase("idle");
    setThinkingText("");
    setSteps(
      useAppStore.getState().steps.map((s) => ({
        ...s,
        status: "pending" as const,
      }))
    );
  }, [
    setIsComplete, setIsGenerating, setProgress, setCurrentStepIndex,
    setSteps, clearLogs, setFiles, setMetrics, setAiPhase, setThinkingText,
  ]);

  return (
    <>
      <Navbar />
      <main>
        <PromptStudio />
      </main>
      <Footer />
    </>
  );
}
