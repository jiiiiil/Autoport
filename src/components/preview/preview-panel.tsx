"use client";

import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/common/fade-in";
import { StatusBadge } from "./status-badge";
import { PortfolioGallery } from "./portfolio-gallery";
import { WorkspaceActions } from "./workspace-actions";
import { usePortfolioStore } from "@/lib/portfolio/store";
import { PortfolioRenderer } from "@/components/portfolio/portfolio-renderer";

interface PreviewPanelProps {
  className?: string;
  onBack?: () => void;
}

export function PreviewPanel({ className, onBack }: PreviewPanelProps) {
  const isReady = usePortfolioStore((s) => s.isReady);
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const composition = usePortfolioStore((s) => s.composition);

  return (
    <div className={className}>
      <FadeIn delay={0.1} y={15}>
        <div className="flex items-center gap-3 mb-5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to Generation Lab"
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-white/10 bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <StatusBadge />
        </div>
      </FadeIn>

      {isReady ? (
        <FadeIn delay={0.2} y={15}>
          <div className="w-full h-full overflow-y-auto">
            <PortfolioRenderer portfolio={portfolio} composition={composition} />
          </div>
        </FadeIn>
      ) : (
        <>
          <FadeIn delay={0.2} y={15}>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] tracking-tight text-white mb-4">
              Your portfolio, built
              <br />
              by AI, perfected for
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                humans.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} y={15}>
            <p className="text-text-muted text-sm leading-relaxed max-w-md mb-8">
              A fully functional, beautifully designed portfolio generated from your
              prompt. Edit the code, tweak the design, and ship it live.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} y={15}>
            <PortfolioGallery className="mb-8" />
          </FadeIn>
        </>
      )}

      <FadeIn delay={0.5} y={15}>
        <WorkspaceActions />
      </FadeIn>
    </div>
  );
}
