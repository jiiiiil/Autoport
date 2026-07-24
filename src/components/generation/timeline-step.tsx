"use client";

import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStepProps {
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
  isLast?: boolean;
}

export function TimelineStep({
  title,
  description,
  status,
  isLast = false,
}: TimelineStepProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
            status === "completed" && "bg-blue-500/20 border border-blue-500/30",
            status === "current" && "bg-blue-500/20 border border-blue-500/40",
            status === "pending" && "bg-white/5 border border-white/10"
          )}
        >
          {status === "completed" && (
            <Check className="w-3.5 h-3.5 text-blue-400" />
          )}
          {status === "current" && (
            <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          )}
          {status === "pending" && (
            <Circle className="w-3 h-3 text-text-muted/40" />
          )}
        </div>
        {!isLast && (
          <div
            className={cn(
              "w-px flex-1 min-h-[2rem]",
              status === "completed" ? "bg-blue-500/30" : "bg-white/10"
            )}
          />
        )}
      </div>

      <div className={cn("pb-6", isLast && "pb-0")}>
        <p
          className={cn(
            "text-xs font-medium",
            status === "pending" ? "text-text-muted/60" : "text-white"
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "text-[10px] mt-0.5",
            status === "pending" ? "text-text-muted/40" : "text-text-muted"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
