"use client";

import { cn } from "@/lib/utils";
import { PortfolioPreviewCard } from "./portfolio-preview-card";

interface PortfolioGalleryProps {
  className?: string;
}

export function PortfolioGallery({ className }: PortfolioGalleryProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PortfolioPreviewCard />

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-bg-card border border-white/[0.06] overflow-hidden">
          <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary/30 flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">A</span>
              </div>
              <span className="text-[10px] text-white/40 font-medium">
                About
              </span>
            </div>
            <div>
              <div className="w-3/4 h-2 rounded bg-white/10 mb-1.5" />
              <div className="w-1/2 h-2 rounded bg-white/5" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-bg-card border border-white/[0.06] overflow-hidden">
          <div className="aspect-[4/3] bg-gradient-to-br from-[#16213e] to-[#1a1a2e] p-4 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 rounded-md bg-white/[0.05] border border-white/[0.06]" />
              <div className="h-8 rounded-md bg-white/[0.05] border border-white/[0.06]" />
              <div className="h-8 rounded-md bg-white/[0.05] border border-white/[0.06]" />
              <div className="h-8 rounded-md bg-white/[0.05] border border-white/[0.06]" />
            </div>
            <div>
              <div className="w-2/3 h-2 rounded bg-white/10 mb-1.5" />
              <div className="w-1/3 h-2 rounded bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
