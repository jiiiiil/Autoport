"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { ExternalLink } from "lucide-react";

export function ProductsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const products = portfolio.sections?.products;
  if (!products || products.length === 0) return null;

  const statusColors: Record<string, string> = {
    live: "bg-emerald-400/10 text-emerald-400",
    beta: "bg-amber-400/10 text-amber-400",
    "coming-soon": "bg-blue-400/10 text-blue-400",
  };

  return (
    <section id="products" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6 transition-all hover:border-[var(--p-primary)]"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-semibold text-[var(--p-text)]">{p.name}</h3>
              {p.status && (
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${statusColors[p.status] || ""}`}>
                  {p.status.replace("-", " ")}
                </span>
              )}
            </div>
            {p.description && (
              <p className="text-sm text-[var(--p-text-muted)] mb-4 leading-relaxed">{p.description}</p>
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
