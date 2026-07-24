"use client";

import { Code2, Copy, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorHeaderProps {
  className?: string;
}

export function EditorHeader({ className }: EditorHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 border-b border-white/[0.06]",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-medium text-white">Generated Code</span>
        </div>
        <span className="text-[10px] text-text-muted bg-white/5 rounded px-2 py-0.5 font-medium">
          TSX
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Copy code"
          className="p-1.5 rounded-md text-text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          aria-label="Expand editor"
          className="p-1.5 rounded-md text-text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
