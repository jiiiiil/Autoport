"use client";

import { FadeIn } from "@/components/common/fade-in";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface CompilationCardProps {
  className?: string;
}

export function CompilationCard({ className }: CompilationCardProps) {
  const progress = useAppStore((s) => s.progress);
  const aiPhase = useAppStore((s) => s.aiPhase);

  const phaseText: Record<string, string> = {
    idle: "Waiting to start...",
    thinking: "Analyzing your prompt and context...",
    planning: "Designing portfolio structure...",
    coding: "Generating React components...",
    optimizing: "Optimizing bundle and assets...",
    compiling: "Running production build...",
    complete: "Build complete — ready to preview",
  };

  return (
    <FadeIn delay={0.4} y={15} className={className}>
      <div
        className={cn(
          "rounded-xl bg-bg-card border border-white/[0.06] p-5",
          className
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-white">Compilation Progress</p>
          <span className="text-xs font-medium text-blue-400">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mb-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-primary transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-[10px] text-text-muted">{phaseText[aiPhase]}</p>
      </div>
    </FadeIn>
  );
}
