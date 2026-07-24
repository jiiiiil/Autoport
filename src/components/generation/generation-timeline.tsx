"use client";

import { FadeIn } from "@/components/common/fade-in";
import { TimelineStep } from "./timeline-step";
import { useAppStore } from "@/lib/store";

interface GenerationTimelineProps {
  className?: string;
}

export function GenerationTimeline({ className }: GenerationTimelineProps) {
  const steps = useAppStore((s) => s.steps);

  return (
    <FadeIn delay={0.3} y={15} className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-4">
        AI Generation Timeline
      </p>
      <div className="flex flex-col">
        {steps.map((step, i) => (
          <TimelineStep
            key={step.title}
            title={step.title}
            description={step.description}
            status={step.status}
            isLast={i === steps.length - 1}
          />
        ))}
      </div>
    </FadeIn>
  );
}
