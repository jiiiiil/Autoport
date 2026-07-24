"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function GenerateButton({
  onClick,
  disabled,
  loading,
  className,
}: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label="Generate portfolio"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl",
        "bg-primary text-white font-medium text-sm",
        "px-6 py-3",
        "hover:bg-primary-hover transition-all duration-200",
        "shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card",
        "cursor-pointer",
        (disabled || loading) && "opacity-60 cursor-not-allowed hover:bg-primary hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]",
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
      {loading ? "Generating..." : "Generate"}
    </button>
  );
}
