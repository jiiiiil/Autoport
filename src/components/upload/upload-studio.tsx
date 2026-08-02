"use client";

import { useEffect } from "react";
import { FileText, Palette, Zap, Sparkles } from "lucide-react";
import { ResumeDropzone } from "./resume-dropzone";
import { ParsedPreview } from "./parsed-preview";
import { ThemeSelector } from "./theme-selector";
import { AnimationSelector } from "./animation-selector";
import { GeneratePanel } from "./generate-panel";
import { FadeIn } from "@/components/common/fade-in";
import { useResumeStore } from "@/lib/resume-store";

const STEPS = [
  { label: "Upload", icon: FileText },
  { label: "Customize", icon: Palette },
  { label: "Generate", icon: Zap },
];

function StepBadge({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const active = i === current;
        const done = i < current;
        return (
          <div key={step.label} className="flex items-center gap-3">
            {i > 0 && <div className={`w-10 h-px ${done ? "bg-primary" : "bg-white/15"}`} />}
            <div
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 border transition-all duration-300 ${
                active
                  ? "border-primary bg-primary/10 text-white"
                  : done
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/[0.03] text-text-muted"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{step.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function UploadStudio() {
  const stage = useResumeStore((s) => s.stage);
  const generationError = useResumeStore((s) => s.generationError);
  const setStage = useResumeStore((s) => s.setStage);

  const currentStep = stage === "upload" || stage === "parsing" ? 0 : stage === "customize" || stage === "generating" ? 1 : 2;

  useEffect(() => {
    useResumeStore.getState().reset();
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-bg-dark overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08)_0%,_transparent_60%)]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-20 md:pb-28">
        <FadeIn className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Resume Intelligence Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight text-white">
            Upload your resume.
            <br />
            <span className="gradient-text bg-gradient-to-r from-blue-400 via-purple-400 to-accent">
              Get a portfolio.
            </span>
          </h1>
          <p className="mt-4 text-text-muted text-base max-w-xl mx-auto">
            No prompts. No forms. Drop your LinkedIn Resume PDF, pick a theme and animation
            level, and our AI builds a premium portfolio automatically.
          </p>
        </FadeIn>

        <StepBadge current={currentStep} />

        {stage === "complete" ? (
          <FadeIn className="text-center py-16">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your portfolio is ready</h2>
            <p className="text-sm text-text-muted mb-6">Opening the live preview...</p>
          </FadeIn>
        ) : (
          <>
            {stage === "upload" && <ResumeDropzone />}
            {stage === "parsing" && <ResumeDropzone />}

            {(stage === "customize" || stage === "generating") && (
              <div className="space-y-8">
                <FadeIn>
                  <ParsedPreview />
                </FadeIn>
                <FadeIn delay={0.1}>
                  <ThemeSelector />
                </FadeIn>
                <FadeIn delay={0.2}>
                  <AnimationSelector />
                </FadeIn>
                <FadeIn delay={0.3}>
                  <GeneratePanel />
                </FadeIn>
              </div>
            )}

            {stage === "error" && (
              <FadeIn className="text-center">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 max-w-xl mx-auto">
                  <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
                  <p className="text-sm text-red-300 mb-6">{generationError ?? "An unexpected error occurred."}</p>
                  <button
                    type="button"
                    onClick={() => setStage("upload")}
                    className="inline-flex items-center justify-center rounded-xl bg-primary text-white text-sm font-medium px-6 py-3 hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    Start over
                  </button>
                </div>
              </FadeIn>
            )}
          </>
        )}
      </div>
    </section>
  );
}
