"use client";

import { FadeIn } from "@/components/common/fade-in";
import { TerminalWindow } from "./terminal-window";
import { FileTree } from "./file-tree";
import { PreviewSkeleton } from "./preview-skeleton";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface WorkspaceCanvasProps {
  className?: string;
}

export function WorkspaceCanvas({ className }: WorkspaceCanvasProps) {
  const isComplete = useAppStore((s) => s.isComplete);

  return (
    <FadeIn delay={0.2} y={20} className={className}>
      <div
        className={cn(
          "relative w-full h-full min-h-[500px] rounded-2xl",
          "bg-bg-card border border-white/[0.06] overflow-hidden",
          "shadow-2xl"
        )}
      >
        <div className="absolute inset-0 p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="flex gap-3 mb-2">
            <div className="w-24 h-3 rounded bg-white/5" />
            <div className="w-16 h-3 rounded bg-white/5" />
            <div className="w-20 h-3 rounded bg-white/5" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PreviewSkeleton />
            <FileTree />
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
              isComplete
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-primary/20 bg-primary/10"
            )}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isComplete ? "bg-emerald-400" : "bg-primary animate-pulse"
              )}
            />
            <span
              className={cn(
                "text-[10px] font-medium",
                isComplete ? "text-emerald-400" : "text-primary"
              )}
            >
              {isComplete ? "Complete" : "Generating..."}
            </span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <TerminalWindow />
        </div>
      </div>
    </FadeIn>
  );
}
