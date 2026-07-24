"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface StatusBadgeProps {
  className?: string;
}

export function StatusBadge({ className }: StatusBadgeProps) {
  const aiPhase = useAppStore((s) => s.aiPhase);
  const isComplete = useAppStore((s) => s.isComplete);

  const label = isComplete ? "Complete" : aiPhase === "idle" ? "Ready" : "In Progress";
  const color = isComplete
    ? "border-emerald-500/20 bg-emerald-500/10"
    : "border-blue-500/20 bg-blue-500/10";
  const dotColor = isComplete ? "bg-emerald-400" : "bg-blue-400";
  const textColor = isComplete ? "text-emerald-400" : "text-blue-400";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1",
        color,
        className
      )}
    >
      <div className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />
      <span className={cn("text-[10px] font-semibold uppercase tracking-wider", textColor)}>
        {label}
      </span>
    </div>
  );
}
