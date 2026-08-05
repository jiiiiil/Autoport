"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { useSectionGrid } from "@/hooks/use-layout-fit";

export function ClientsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const clients = portfolio.sections?.clients;
  if (!clients || clients.length === 0) return null;

  const { gridClass } = useSectionGrid(portfolio, "clients", "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4");

  return (
    <section id="clients" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Clients</h2>
      <div className={gridClass}>
        {clients.map((c, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5 text-center"
          >
            <p className="text-base font-semibold text-[var(--p-text)] mb-1">{c.name}</p>
            {c.industry && (
              <p className="text-xs text-[var(--p-primary)] mb-1">{c.industry}</p>
            )}
            {c.project && (
              <p className="text-xs text-[var(--p-text-muted)]">{c.project}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
