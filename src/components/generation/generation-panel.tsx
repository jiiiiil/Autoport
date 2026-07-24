"use client";

import { ArrowLeft, Eye } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { StatusBadge } from "./status-badge";
import { GenerationTimeline } from "./generation-timeline";
import { CompilationCard } from "./compilation-card";
import { AiStatusCard } from "./ai-status-card";
import { ThinkingText } from "./thinking-text";
import { MetricsBar } from "./metrics-bar";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface GenerationPanelProps {
  className?: string;
  onPreview?: () => void;
  onBack?: () => void;
}

export function GenerationPanel({
  className,
  onPreview,
  onBack,
}: GenerationPanelProps) {
  const isComplete = useAppStore((s) => s.isComplete);

  return (
    <div className={className}>
      <FadeIn delay={0.1} y={15}>
        <div className="flex items-center gap-3 mb-5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Prompt Studio"
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-white/10 bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <StatusBadge />
          <AiStatusCard />
        </div>
      </FadeIn>

      <FadeIn delay={0.15} y={15}>
        <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] tracking-tight text-white mb-2">
          Generation
          <br />
          Lab
        </h1>
        <ThinkingText className="mb-4" />
      </FadeIn>

      <FadeIn delay={0.2} y={15}>
        <p className="text-text-muted text-sm leading-relaxed max-w-sm mb-6">
          Watch as our AI engine analyzes your input and constructs a
          production-ready portfolio in real time. Every component is crafted
          with precision.
        </p>
      </FadeIn>

      <GenerationTimeline className="mb-5" />

      <CompilationCard className="mb-4" />

      <MetricsBar className="mb-5" />

      <FadeIn delay={0.5} y={15}>
        <button
          type="button"
          onClick={onPreview}
          disabled={!isComplete}
          aria-label="Preview generated portfolio"
          className={cn(
            "w-full inline-flex items-center justify-center gap-2 rounded-xl",
            "font-medium text-sm px-6 py-3",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark",
            "cursor-pointer",
            isComplete
              ? "bg-primary text-white hover:bg-primary-hover shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
              : "bg-white/5 text-text-muted/40 border border-white/5 cursor-not-allowed"
          )}
        >
          <Eye className="w-4 h-4" />
          {isComplete ? "Preview Portfolio" : "Generating..."}
        </button>
      </FadeIn>
    </div>
  );
}
