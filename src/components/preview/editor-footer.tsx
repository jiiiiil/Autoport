"use client";

import { Settings, AlertCircle, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorFooterProps {
  className?: string;
}

const tabs = [
  { label: "Problems", icon: AlertCircle, count: 0 },
  { label: "Output", icon: Terminal, count: undefined },
  { label: "Settings", icon: Settings, count: undefined },
];

export function EditorFooter({ className }: EditorFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 border-t border-white/[0.06]",
        className
      )}
    >
      <div className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer",
              tab.label === "Problems"
                ? "text-white bg-white/5"
                : "text-text-muted hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="text-[9px] bg-primary/20 text-primary rounded px-1">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[10px] text-text-muted">Ready</span>
      </div>
    </div>
  );
}
