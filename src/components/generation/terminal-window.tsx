"use client";

import { Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface TerminalWindowProps {
  className?: string;
}

export function TerminalWindow({ className }: TerminalWindowProps) {
  const logs = useAppStore((s) => s.logs);

  return (
    <div
      className={cn(
        "w-full max-w-xs rounded-xl bg-bg-card border border-white/[0.06] overflow-hidden",
        "shadow-2xl",
        className
      )}
    >
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-white/[0.06]">
        <Terminal className="w-3 h-3 text-text-muted" />
        <span className="text-[10px] font-medium text-text-muted">
          AI Generator
        </span>
        <div className="flex items-center gap-1 ml-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
        </div>
      </div>

      <div className="p-3 space-y-0.5 max-h-40 overflow-y-auto">
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5 py-0.5"
            >
              <div
                className={cn("w-1.5 h-1.5 rounded-full shrink-0", log.color)}
              />
              <span className="text-[10px] font-mono text-text-muted truncate">
                {log.filename}
              </span>
              <span className="text-[9px] text-text-muted/40 ml-auto shrink-0">
                {i === logs.length - 1 ? "⏳" : "✓"} {log.action}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {logs.length === 0 && (
          <p className="text-[10px] text-text-muted/40 py-2">Initializing...</p>
        )}
      </div>
    </div>
  );
}
