"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { ExternalLink } from "lucide-react";

export function PublicationsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const publications = portfolio.sections?.publications;
  if (!publications || publications.length === 0) return null;

  return (
    <section id="publications" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Publications</h2>
      <div className="space-y-4">
        {publications.map((p, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5 flex items-start justify-between gap-4"
          >
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[var(--p-text)] mb-1">{p.title}</h3>
              {p.publisher && (
                <p className="text-xs text-[var(--p-primary)] mb-1">{p.publisher}</p>
              )}
              {p.excerpt && (
                <p className="text-sm text-[var(--p-text-muted)] leading-relaxed">{p.excerpt}</p>
              )}
              {p.date && (
                <p className="text-xs text-[var(--p-text-muted)] mt-2">{p.date}</p>
              )}
            </div>
            {p.link && (
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-[var(--p-text-muted)] hover:text-[var(--p-primary)] transition-colors shrink-0">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
