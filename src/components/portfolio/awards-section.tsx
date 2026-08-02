"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { Trophy } from "lucide-react";

export function AwardsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const awards = portfolio.sections?.awards;
  if (!awards || awards.length === 0) return null;

  return (
    <section id="awards" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Awards</h2>
      <div className="space-y-4">
        {awards.map((a, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--p-primary)]/10 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-[var(--p-primary)]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--p-text)]">{a.title}</h3>
              {a.organization && (
                <p className="text-xs text-[var(--p-primary)]">{a.organization}</p>
              )}
              {a.description && (
                <p className="text-sm text-[var(--p-text-muted)] mt-1">{a.description}</p>
              )}
              {a.date && (
                <p className="text-xs text-[var(--p-text-muted)] mt-1">{a.date}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
