"use client";

import { motion } from "framer-motion";
import { Brain, Code2, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore, type AiPhase } from "@/lib/store";

const phaseConfig: Record<AiPhase, { label: string; icon: typeof Brain; color: string }> = {
  idle: { label: "Idle", icon: Brain, color: "text-text-muted" },
  thinking: { label: "Thinking...", icon: Brain, color: "text-blue-400" },
  validating: { label: "Validating...", icon: Sparkles, color: "text-blue-300" },
  planning: { label: "Planning...", icon: Sparkles, color: "text-amber-400" },
  composing: { label: "Composing...", icon: Sparkles, color: "text-purple-400" },
  refining: { label: "Refining...", icon: Loader2, color: "text-cyan-400" },
  coding: { label: "Coding...", icon: Code2, color: "text-emerald-400" },
  optimizing: { label: "Optimizing...", icon: Loader2, color: "text-primary" },
  compiling: { label: "Compiling...", icon: Loader2, color: "text-blue-400" },
  complete: { label: "Completed", icon: CheckCircle2, color: "text-emerald-400" },
};

interface AiStatusCardProps {
  className?: string;
}

export function AiStatusCard({ className }: AiStatusCardProps) {
  const aiPhase = useAppStore((s) => s.aiPhase);
  const config = phaseConfig[aiPhase];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-bg-card px-4 py-2.5 shadow-lg",
        className
      )}
    >
      <div className="relative">
        <Icon
          className={cn(
            "w-4 h-4",
            config.color,
            (aiPhase === "thinking" || aiPhase === "optimizing" || aiPhase === "compiling") && "animate-spin"
          )}
        />
        {aiPhase !== "idle" && aiPhase !== "complete" && (
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </div>
      <span className={cn("text-xs font-medium", config.color)}>
        {config.label}
      </span>
    </motion.div>
  );
}
