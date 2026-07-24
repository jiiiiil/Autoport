"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { getThemeStyles } from "@/lib/portfolio/themes";
import { getVisibleSections } from "@/lib/portfolio/layouts";
import { renderSection } from "@/lib/portfolio/registry";

interface PortfolioRendererProps {
  portfolio: PortfolioObject;
  className?: string;
}

export function PortfolioRenderer({ portfolio, className }: PortfolioRendererProps) {
  const themeMode = portfolio.theme?.mode ?? "dark";
  const layoutStyle = portfolio.layout?.style ?? "minimal";
  const sectionOrder = portfolio.layout?.sectionOrder;
  const themeStyles = getThemeStyles(themeMode);
  const visibleSections = getVisibleSections(portfolio.sections ?? {}, layoutStyle, sectionOrder);

  return (
    <div className={className} style={themeStyles}>
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-[var(--p-border)] bg-[var(--p-bg)]/80">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--p-text)]">
            {portfolio.personalInfo?.name ?? "Portfolio"}
          </span>
          <div className="flex gap-4">
            {(portfolio.navigation?.links ?? []).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-[var(--p-text-muted)] hover:text-[var(--p-text)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto">
        {visibleSections.map((key) => (
          <div key={key}>
            {renderSection(key, portfolio)}
          </div>
        ))}
      </main>

      <footer className="border-t border-[var(--p-border)] mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-xs text-[var(--p-text-muted)]">
            &copy; {new Date().getFullYear()} {portfolio.personalInfo?.name ?? "Developer"}
          </span>
          <div className="flex gap-3">
            {(portfolio.sections?.socialLinks ?? []).map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[var(--p-text-muted)] hover:text-[var(--p-text)] transition-colors"
              >
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
