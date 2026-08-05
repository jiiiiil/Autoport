"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { useSectionGrid } from "@/hooks/use-layout-fit";

export function MetricsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const metrics = portfolio.sections?.metrics;
  if (!metrics || metrics.length === 0) return null;

  return (
    <section id="metrics" className="py-12 md:py-16">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--p-primary)]">
          Key Highlights
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--p-text)] tracking-tight">
          Impact & Achievements
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6 text-center transition-all duration-300 hover:border-[var(--p-primary)] hover:bg-[var(--p-bg-card-hover)] flex flex-col justify-center items-center shadow-xs"
          >
            <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--p-primary)] mb-2 tracking-tight">
              {m.value}
            </p>
            <p className="text-sm font-semibold text-[var(--p-text)] mb-1">
              {m.label}
            </p>
            {m.description && (
              <p className="text-xs text-[var(--p-text-muted)] leading-normal mt-1">
                {m.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
