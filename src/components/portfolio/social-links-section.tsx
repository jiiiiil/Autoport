"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";

const ICONS: Record<string, string> = {
  GitHub: "GH",
  LinkedIn: "LI",
  Twitter: "TW",
  Dribbble: "DR",
  CodePen: "CP",
};

export function SocialLinksSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const socialLinks = portfolio.sections?.socialLinks;
  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <section id="social-links" className="py-10">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] text-xs md:text-sm font-medium text-[var(--p-text-secondary)] hover:border-[var(--p-primary)] hover:text-[var(--p-text)] hover:bg-[var(--p-bg-card-hover)] transition-all duration-300 shadow-xs"
          >
            <span className="w-6 h-6 rounded-md bg-[var(--p-primary-soft)] text-[var(--p-primary)] text-[11px] font-mono font-bold flex items-center justify-center">
              {ICONS[link.platform] ?? link.platform.slice(0, 2).toUpperCase()}
            </span>
            <span>{link.platform}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
