"use client";

import { Sparkles, Zap, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/lib/resume-store";
import type { AnimationLevel } from "@/server/resume/types";

const LEVELS: { id: AnimationLevel; label: string; description: string; icon: typeof Zap }[] = [
  {
    id: "minimal",
    label: "Minimal",
    description: "Subtle fades and hover lifts. Clean, fast, distraction-free.",
    icon: Wind,
  },
  {
    id: "medium",
    label: "Medium",
    description: "Scroll reveals, magnetic buttons, smooth scroll. Balanced and premium.",
    icon: Zap,
  },
  {
    id: "heavy",
    label: "Heavy",
    description: "Split text, parallax, pinned sections, custom cursor. Cinematic impact.",
    icon: Sparkles,
  },
];

export function AnimationSelector() {
  const { animationLevel, setAnimationLevel } = useResumeStore();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-white">Animation Level</h3>
        <span className="text-[10px] text-text-muted">default: Medium</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LEVELS.map((level) => {
          const Icon = level.icon;
          const active = animationLevel === level.id;
          return (
            <button
              key={level.id}
              type="button"
              onClick={() => setAnimationLevel(level.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer",
                active
                  ? "border-primary bg-primary/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors",
                  active ? "bg-primary/20 text-primary" : "bg-white/5 text-text-muted"
                )}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-sm font-medium text-white">{level.label}</p>
              <p className="text-[10px] text-text-muted leading-snug mt-1">{level.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
