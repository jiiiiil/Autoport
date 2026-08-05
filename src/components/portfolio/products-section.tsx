"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { ExternalLink } from "lucide-react";
import { useSectionGrid } from "@/hooks/use-layout-fit";

export function ProductsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const products = portfolio.sections?.products;
  if (!products || products.length === 0) return null;

  const { gridClass, clampClass } = useSectionGrid(portfolio, "products", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5");

  const statusColors: Record<string, string> = {
    live: "bg-[var(--p-success-soft)] text-[var(--p-success)]",
    beta: "bg-[var(--p-warning-soft)] text-[var(--p-warning)]",
    "coming-soon": "bg-[var(--p-info-soft)] text-[var(--p-info)]",
  };

  return (
    <section id="products" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Products</h2>
      <div className={gridClass}>
        {products.map((p, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6 transition-all hover:border-[var(--p-primary)]"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-base font-semibold text-[var(--p-text)] min-w-0 break-words">{p.name}</h3>
              {p.status && (
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0 ${statusColors[p.status] || ""}`}>
                  {p.status.replace("-", " ")}
                </span>
              )}
            </div>
            {p.description && (
              <p className={`text-sm text-[var(--p-text-muted)] mb-4 leading-relaxed break-words ${clampClass ?? ""}`}>{p.description}</p>
            )}
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[var(--p-primary)] hover:underline"
              >
                View Product <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
