"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

export function OrganizationsSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const organizations = portfolio.sections?.organizations;
  if (!organizations || organizations.length === 0) return null;

  return (
    <section id="organizations" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">
        Organizations &amp; Community
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {organizations.map((org, i) => (
          <div
            key={(org.title ?? "org") + i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] p-5"
          >
            <h3 className="text-sm font-semibold text-[var(--p-text)]">{org.title ?? "Organization"}</h3>
            {org.description && (
              <p className="text-xs text-[var(--p-text-muted)] leading-relaxed mt-1">
                {org.description}
              </p>
            )}
            {org.date && (
              <p className="text-[10px] text-[var(--p-text-muted)] mt-2 font-mono">{org.date}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
