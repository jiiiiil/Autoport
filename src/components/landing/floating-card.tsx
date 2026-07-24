"use client";

import { motion } from "framer-motion";

export function FloatingCard() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-72 h-72 rounded-2xl bg-bg-card shadow-2xl overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="rounded-lg bg-white/5 backdrop-blur-sm border border-white/5 p-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-white/60 text-[10px] font-medium">
              Generating...
            </span>
          </div>
          <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
