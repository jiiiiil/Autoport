"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function CertificationsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const certifications = portfolio.sections?.certifications;
  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-12 md:py-16">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--p-primary)]">
          Credentials & Verification
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--p-text)] tracking-tight">
          Certifications
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, i) => (
          <div
            key={(cert.name || "") + i}
            className="flex flex-col justify-between rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5 sm:p-6 transition-all duration-300 hover:border-[var(--p-primary)] hover:bg-[var(--p-bg-card-hover)] shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-[var(--p-text)] min-w-0 leading-snug">
                  {cert.name}
                </h3>
                {cert.date && (
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-[var(--p-primary-soft)] text-[var(--p-primary)] shrink-0">
                    {cert.date}
                  </span>
                )}
              </div>

              {cert.issuer && (
                <p className="text-xs font-semibold text-[var(--p-primary)]">
                  {cert.issuer}
                </p>
              )}
            </div>

            {cert.link && (
              <div className="mt-4 pt-3 border-t border-[var(--p-border)]/40 flex justify-end">
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--p-primary)] hover:underline"
                >
                  Verify Credential &rarr;
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
