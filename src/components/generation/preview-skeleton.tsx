"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface PreviewSkeletonProps {
  className?: string;
}

const sections = [
  { name: "Header", height: "h-12" },
  { name: "Hero", height: "h-32" },
  { name: "Projects", height: "h-28" },
  { name: "Skills", height: "h-20" },
  { name: "Experience", height: "h-24" },
  { name: "Contact", height: "h-16" },
];

export function PreviewSkeleton({ className }: PreviewSkeletonProps) {
  const previewSections = useAppStore((s) => s.previewSections);
  const isComplete = useAppStore((s) => s.isComplete);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-1">
        Live Preview
      </p>
      <div className="rounded-xl bg-bg-card border border-white/[0.06] p-3 space-y-2 overflow-hidden">
        {sections.map((section) => {
          const isVisible = isComplete || previewSections.includes(section.name);
          return (
            <div key={section.name} className="relative">
              <AnimatePresence>
                {isVisible ? (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0.8 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="origin-top"
                  >
                    <div
                      className={cn(
                        "rounded-lg border border-white/[0.04] p-2.5",
                        isComplete
                          ? "bg-white/[0.04]"
                          : "bg-gradient-to-r from-primary/5 to-accent/5"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[9px] text-text-muted font-medium">
                          {section.name}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full h-1 rounded bg-white/5" />
                        <div className="w-3/4 h-1 rounded bg-white/[0.03]" />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div
                    className={cn(
                      "rounded-lg border border-dashed border-white/[0.04] bg-white/[0.01]",
                      section.height
                    )}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
