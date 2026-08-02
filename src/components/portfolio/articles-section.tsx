"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { ExternalLink, BookOpen } from "lucide-react";

export function ArticlesSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const articles = portfolio.sections?.articles;
  if (!articles || articles.length === 0) return null;

  return (
    <section id="articles" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {articles.map((a, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--p-primary)]/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[var(--p-primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[var(--p-text)] mb-1">{a.title}</h3>
              {a.excerpt && (
                <p className="text-sm text-[var(--p-text-muted)] leading-relaxed mb-2">{a.excerpt}</p>
              )}
              <div className="flex items-center gap-3">
                {a.date && <span className="text-xs text-[var(--p-text-muted)]">{a.date}</span>}
                {a.link && (
                  <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--p-primary)] hover:underline inline-flex items-center gap-1">
                    Read <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
