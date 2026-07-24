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
    <section id="social-links" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">
        Connect
      </h2>
      <div className="flex flex-wrap gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] text-sm text-[var(--p-text-muted)] hover:border-[var(--p-primary)] hover:text-[var(--p-text)] transition-all duration-300"
          >
            <span className="w-6 h-6 rounded-md bg-[var(--p-primary)]/10 text-[var(--p-primary)] text-[10px] font-bold flex items-center justify-center">
              {ICONS[link.platform] ?? link.platform.slice(0, 2).toUpperCase()}
            </span>
            {link.platform}
          </a>
        ))}
      </div>
    </section>
  );
}
