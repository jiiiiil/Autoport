"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { Check } from "lucide-react";
import { useSectionGrid } from "@/hooks/use-layout-fit";

export function ServicesSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const services = portfolio.sections?.services;
  if (!services || services.length === 0) return null;

  const { gridClass, clampClass } = useSectionGrid(portfolio, "services", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5");

  return (
    <section id="services" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Services</h2>
      <div className={gridClass}>
        {services.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6 transition-all hover:border-[var(--p-primary)]"
          >
            <h3 className="text-base font-semibold text-[var(--p-text)] mb-2">{s.name}</h3>
            {s.description && (
              <p className={`text-sm text-[var(--p-text-muted)] mb-4 leading-relaxed break-words ${clampClass ?? ""}`}>{s.description}</p>
            )}
            {s.features && s.features.length > 0 && (
              <ul className="space-y-1.5 mb-4">
                {s.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-[var(--p-text-muted)]">
                    <Check className="w-3.5 h-3.5 text-[var(--p-primary)] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {s.price && (
              <p className="text-sm font-semibold text-[var(--p-primary)]">{s.price}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
