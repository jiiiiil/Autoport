"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function EducationSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const education = portfolio.sections?.education;
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">
        Education
      </h2>
      <div className="space-y-4">
        {education.map((edu, i) => (
          <div
            key={edu.institution + i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
              <h3 className="text-base font-semibold text-[var(--p-text)]">
                {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
              </h3>
              <span className="text-xs text-[var(--p-text-muted)] font-mono">
                {edu.startDate} {edu.endDate ? `\u2013 ${edu.endDate}` : ""}
              </span>
            </div>
            <p className="text-sm text-[var(--p-text-muted)]">{edu.institution}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
