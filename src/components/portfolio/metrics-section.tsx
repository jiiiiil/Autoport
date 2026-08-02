"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function MetricsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const metrics = portfolio.sections?.metrics;
  if (!metrics || metrics.length === 0) return null;

  return (
    <section id="metrics" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Impact</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6 text-center"
          >
            <p className="text-3xl md:text-4xl font-bold text-[var(--p-primary)] mb-2">{m.value}</p>
            <p className="text-sm font-medium text-[var(--p-text)] mb-1">{m.label}</p>
            {m.description && (
              <p className="text-xs text-[var(--p-text-muted)]">{m.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
