"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { Star } from "lucide-react";

export function TestimonialsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const testimonials = portfolio.sections?.testimonials;
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6"
          >
            {t.rating && (
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-[var(--p-primary)] text-[var(--p-primary)]" />
                ))}
              </div>
            )}
            <p className="text-sm text-[var(--p-text-muted)] mb-4 leading-relaxed italic">
              &ldquo;{t.content}&rdquo;
            </p>
            <div>
              <p className="text-sm font-semibold text-[var(--p-text)]">{t.author}</p>
              <p className="text-xs text-[var(--p-text-muted)]">{t.role}{t.company ? ` at ${t.company}` : ""}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
