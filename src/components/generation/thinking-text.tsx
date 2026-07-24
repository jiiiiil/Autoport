"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface ThinkingTextProps {
  className?: string;
}

export function ThinkingText({ className }: ThinkingTextProps) {
  const thinkingText = useAppStore((s) => s.thinkingText);

  return (
    <div className={cn("h-5 overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.p
          key={thinkingText}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="text-[11px] text-text-muted font-mono"
        >
          {thinkingText}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
