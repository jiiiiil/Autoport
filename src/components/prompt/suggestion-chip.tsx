"use client";

import { cn } from "@/lib/utils";

interface SuggestionChipProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export function SuggestionChip({ label, onClick, className }: SuggestionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5",
        "text-xs font-medium text-text-muted hover:text-white hover:bg-white/10 hover:border-white/20",
        "transition-all duration-200 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card",
        className
      )}
    >
      {label}
    </button>
  );
}
