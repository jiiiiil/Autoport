"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function EducationSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const education = portfolio.sections?.education;
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="py-12 md:py-16">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--p-primary)]">
          Academic Background
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--p-text)] tracking-tight">
          Education
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((edu, i) => (
          <div
            key={(edu.institution || "") + i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-6 transition-all duration-300 hover:border-[var(--p-primary)] hover:bg-[var(--p-bg-card-hover)] flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-[var(--p-text)] leading-snug">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </h3>
                  <p className="text-sm font-semibold text-[var(--p-primary)] mt-1">
                    {edu.institution}
                  </p>
                </div>

                {(edu.startDate || edu.endDate) && (
                  <span className="inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--p-primary-soft)] text-[var(--p-primary)] border border-[var(--p-primary)]/20 whitespace-nowrap shrink-0">
                    {edu.startDate || ""} {edu.endDate ? `\u2013 ${edu.endDate}` : ""}
                  </span>
                )}
              </div>

              {edu.description && (
                <p className="text-sm text-[var(--p-text-muted)] leading-relaxed mt-3">
                  {edu.description}
                </p>
              )}
            </div>

            {edu.grade && (
              <div className="mt-4 pt-3 border-t border-[var(--p-border)]/50 text-xs font-mono text-[var(--p-text-secondary)]">
                Grade / Score: <span className="font-semibold text-[var(--p-text)]">{edu.grade}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
