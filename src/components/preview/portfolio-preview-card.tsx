"use client";

import { cn } from "@/lib/utils";

interface PortfolioPreviewCardProps {
  className?: string;
}

export function PortfolioPreviewCard({ className }: PortfolioPreviewCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-bg-card border border-white/[0.06] overflow-hidden",
        className
      )}
    >
      <div className="relative aspect-[16/10] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                Portfolio
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Your Name
            </h3>
            <p className="text-xs text-white/50 max-w-[200px]">
              Developer &amp; Designer
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 rounded-lg bg-white/[0.05] border border-white/[0.06] p-3">
              <div className="w-full h-2 rounded bg-white/10 mb-2" />
              <div className="w-3/4 h-2 rounded bg-white/5" />
            </div>
            <div className="flex-1 rounded-lg bg-white/[0.05] border border-white/[0.06] p-3">
              <div className="w-full h-2 rounded bg-white/10 mb-2" />
              <div className="w-1/2 h-2 rounded bg-white/5" />
            </div>
            <div className="flex-1 rounded-lg bg-white/[0.05] border border-white/[0.06] p-3">
              <div className="w-full h-2 rounded bg-white/10 mb-2" />
              <div className="w-2/3 h-2 rounded bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
