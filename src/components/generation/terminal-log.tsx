"use client";

import { cn } from "@/lib/utils";

interface TerminalLogProps {
  filename: string;
  status: "done" | "active" | "pending";
  color?: string;
}

export function TerminalLog({ filename, status, color = "bg-emerald-400" }: TerminalLogProps) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      <div
        className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          status === "done" && color,
          status === "active" && "bg-blue-400 animate-pulse",
          status === "pending" && "bg-white/10"
        )}
      />
      <span
        className={cn(
          "text-[10px] font-mono",
          status === "pending" ? "text-text-muted/40" : "text-text-muted"
        )}
      >
        {filename}
      </span>
      <span className="text-[9px] text-text-muted/40 ml-auto">
        {status === "done" && "✓ done"}
        {status === "active" && "⏳ generating..."}
        {status === "pending" && "queued"}
      </span>
    </div>
  );
}
