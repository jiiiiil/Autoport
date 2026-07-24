"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  className?: string;
}

export function StatusBadge({ className }: StatusBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1",
        className
      )}
    >
      <Zap className="w-3 h-3 text-accent" />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
        AI Generated
      </span>
    </div>
  );
}
