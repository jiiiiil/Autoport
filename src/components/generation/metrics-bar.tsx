"use client";

import { motion } from "framer-motion";
import {
  Layers,
  Code2,
  Sparkles,
  Image,
  LayoutGrid,
  Zap,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface MetricsBarProps {
  className?: string;
}

const metricItems = [
  { key: "components" as const, label: "Components", icon: Layers },
  { key: "linesOfCode" as const, label: "Lines", icon: Code2 },
  { key: "animations" as const, label: "Animations", icon: Sparkles },
  { key: "sections" as const, label: "Sections", icon: LayoutGrid },
  { key: "images" as const, label: "Images", icon: Image },
  { key: "speed" as const, label: "Speed", icon: Zap },
  { key: "compileTime" as const, label: "Compile", icon: Timer },
];

export function MetricsBar({ className }: MetricsBarProps) {
  const metrics = useAppStore((s) => s.metrics);

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {metricItems.map((item) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-bg-card px-2.5 py-1.5"
        >
          <item.icon className="w-3 h-3 text-text-muted" />
          <span className="text-[10px] text-text-muted">{item.label}</span>
          <span className="text-[10px] font-semibold text-white">
            {metrics[item.key]}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
