"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wand2, CheckCircle2 } from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";
import { usePortfolioStore } from "@/lib/portfolio/store";

const PHASES: { label: string; progress: number }[] = [
  { label: "Validating resume data", progress: 10 },
  { label: "Detecting portfolio strategy", progress: 25 },
  { label: "Composing portfolio blueprint", progress: 50 },
  { label: "Applying design tokens", progress: 70 },
  { label: "Building live preview", progress: 85 },
  { label: "Portfolio generated", progress: 100 },
];

export function GeneratePanel() {
  const router = useRouter();
  const generating = useResumeStore((s) => s.stage === "generating");
  const { resume, theme, animationLevel, customColors, setGenerationProgress, setGenerationStatus, setGenerationError, setStage } = useResumeStore();
  const { setPortfolio, setComposition, setIsReady, setSessionId } = usePortfolioStore();
  const [phaseIndex, setPhaseIndex] = useState(0);

  const hasStarted = useRef(false);

  const handleGenerate = useCallback(async () => {
    if (!resume || hasStarted.current) return;

    hasStarted.current = true;
    setGenerationError(null);
    setStage("generating");
    setPhaseIndex(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          theme,
          animationLevel,
          customColors: theme === "custom" ? customColors : undefined,
          stream: true,
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

          const event = JSON.parse(trimmed.slice(6));

          if (event.type === "status") {
            const statusText = event.data as string;
            setGenerationStatus(statusText);
            const idx = PHASES.findIndex((p) => statusText.toLowerCase().includes(p.label.split(" ")[0].toLowerCase()));
            if (idx !== -1) {
              setPhaseIndex(idx);
              setGenerationProgress(PHASES[idx].progress);
            }
          } else if (event.type === "done") {
            const result = JSON.parse(event.data);

            if (result.composition) setComposition(result.composition);
            if (result.portfolioData) setPortfolio(result.portfolioData);
            if (result.generationId) setSessionId(result.generationId);

            setGenerationProgress(100);
            setGenerationStatus("Portfolio generated successfully!");
            setPhaseIndex(PHASES.length - 1);

            setIsReady(true);
            setStage("complete");

            setTimeout(() => {
              router.push("/preview");
            }, 700);
          } else if (event.type === "error") {
            throw new Error(event.data);
          }
        }
      }
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Generation failed");
      setStage("error");
    } finally {
      hasStarted.current = false;
    }
  }, [resume, theme, animationLevel, customColors, router, setGenerationProgress, setGenerationStatus, setGenerationError, setStage, setPortfolio, setComposition, setIsReady, setSessionId]);

  const activePhase = PHASES[phaseIndex] ?? PHASES[0];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Wand2 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-text-primary">Generate Portfolio</h3>
      </div>

      {generating ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-sm text-text-primary font-medium">{activePhase.label}</p>
          </div>

          <div className="h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${activePhase.progress}%` }}
            />
          </div>

          <div className="mt-4 space-y-1.5">
            {PHASES.map((phase, i) => (
              <div key={phase.label} className="flex items-center gap-2 text-xs">
                {i < phaseIndex ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : i === phaseIndex ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-black/15" />
                )}
                <span className={i <= phaseIndex ? "text-text-primary" : "text-text-primary/60"}>{phase.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!resume}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-text-primary text-sm font-semibold px-6 py-4 hover:bg-primary-hover transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-primary/20"
        >
          <Wand2 className="w-4 h-4" />
          Generate Portfolio
        </button>
      )}

      <p className="text-[10px] text-text-primary mt-3 leading-relaxed font-semibold">
        Every detail from your resume — name, experience, education, skills, projects,
        certifications, achievements, languages — is preserved exactly as extracted.
      </p>
    </div>
  );
}
