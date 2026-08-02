"use client";

import { cn } from "@/lib/utils";

interface ConfidenceIndicatorProps {
  confidence: number;
  className?: string;
}

export function ConfidenceIndicator({ confidence, className }: ConfidenceIndicatorProps) {
  const getColor = (val: number) => {
    if (val >= 80) return "bg-green-500";
    if (val >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", getColor(confidence))}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className="text-xs font-medium text-text-muted tabular-nums shrink-0">
        {confidence}%
      </span>
    </div>
  );
}
