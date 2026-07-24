"use client";

import { Download, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceActionsProps {
  className?: string;
}

export function WorkspaceActions({ className }: WorkspaceActionsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5",
          "px-5 py-2.5 text-xs font-medium text-white",
          "hover:bg-white/10 hover:border-white/20 transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark",
          "cursor-pointer"
        )}
      >
        <Download className="w-3.5 h-3.5" />
        Download Code
      </button>

      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-2 rounded-lg",
          "bg-primary text-white px-5 py-2.5 text-xs font-medium",
          "hover:bg-primary-hover transition-all duration-200",
          "shadow-[0_0_16px_rgba(124,58,237,0.25)] hover:shadow-[0_0_24px_rgba(124,58,237,0.4)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark",
          "cursor-pointer"
        )}
      >
        <Globe className="w-3.5 h-3.5" />
        Publish Portfolio
      </button>
    </div>
  );
}
