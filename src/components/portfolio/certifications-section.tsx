"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function CertificationsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const certifications = portfolio.sections?.certifications;
  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">
        Certifications
      </h2>
      <div className="space-y-3">
        {certifications.map((cert, i) => (
          <div
            key={cert.name + i}
            className="flex items-center justify-between rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-4"
          >
            <div>
              <h3 className="text-sm font-semibold text-[var(--p-text)]">{cert.name}</h3>
              {cert.issuer && (
                <p className="text-xs text-[var(--p-text-muted)]">{cert.issuer}</p>
              )}
            </div>
            <div className="text-right">
              {cert.date && (
                <p className="text-[10px] text-[var(--p-text-muted)] font-mono">{cert.date}</p>
              )}
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[var(--p-primary)] hover:underline"
                >
                  View
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
