"use client";

import React from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import type { CompositionGraph } from "@/server/ai/composition/types";
import { getThemeStylesFromComposition, getGoogleFontsUrl, getBackgroundStyles } from "@/lib/portfolio/themes";
import { getLayoutContainerClass, getSectionSpacing } from "@/lib/portfolio/layouts";
import { DynamicNavigation } from "./dynamic-navigation";
import { renderSection } from "@/lib/portfolio/registry";
import { CompositionAnimator } from "./composition-animator";
import { ThreeCanvasBackground } from "./interactive/three-canvas-background";

interface PortfolioRendererProps {
  portfolio: PortfolioObject;
  composition?: CompositionGraph | null;
  className?: string;
}

export function PortfolioRenderer({ portfolio, composition, className }: PortfolioRendererProps) {
  if (composition) {
    return <CompositionRenderer portfolio={portfolio} composition={composition} className={className} />;
  }

  return <LegacyRenderer portfolio={portfolio} className={className} />;
}

import { GBAfterlifeBackground } from "./interactive/gb-afterlife-canvas";
import { AnimeThreeCanvas } from "./interactive/anime-three-canvas";
import { SvgLiquidFilterProvider } from "./interactive/liquid-image";

function BackgroundDecorations({ theme }: { theme: CompositionGraph["theme"] }) {
  return (
    <>
      <AnimeThreeCanvas />
      <SvgLiquidFilterProvider />
    </>
  );
}

function CompositionRenderer({ portfolio, composition, className }: PortfolioRendererProps & { composition: CompositionGraph }) {
  const themeStyles = getThemeStylesFromComposition(composition.theme);
  const bgStyles = getBackgroundStyles(composition.theme);
  const containerClass = getLayoutContainerClass(composition.layout);
  const spacing = getSectionSpacing(composition.layout);

  const compositionSectionIds = composition.sections.map((s) => s.id);
  const ALL_KNOWN_KEYS = [
    "hero", "about", "skills", "projects", "experience", "education",
    "services", "certifications", "awards", "products", "contact",
    "languages", "metrics", "faq", "articles", "socialLinks", "gallery",
    "testimonials", "publications", "clients", "roadmap", "speaking",
    "organizations", "achievements"
  ];

  const extraPopulatedKeys = ALL_KNOWN_KEYS.filter((key) => {
    if (compositionSectionIds.includes(key)) return false;
    const sec = (portfolio.sections as any)?.[key];
    if (!sec) return false;
    if (Array.isArray(sec)) return sec.length > 0;
    if (typeof sec === "object") return Object.keys(sec).length > 0;
    return !!sec;
  });

  const sectionOrder = [...compositionSectionIds, ...extraPopulatedKeys];
  const fontsUrl = getGoogleFontsUrl(composition.theme);

  const layoutStyle = composition.layout.style;
  const isSplitLayout = layoutStyle === "split" || layoutStyle === "asymmetric";
  const isMagazineLayout = layoutStyle === "magazine" || layoutStyle === "editorial" || layoutStyle === "newspaper";
  const isGalleryLayout = layoutStyle === "gallery" || layoutStyle === "masonry";
  const isFullBleed = layoutStyle === "cinematic" || layoutStyle === "immersive" || layoutStyle === "landing-sections";
  const isBentoLayout = layoutStyle === "bento" || layoutStyle === "card-stack";
  const isTimelineLayout = layoutStyle === "timeline";

  const sectionVariants = new Map(composition.sections.map((s) => [s.id, s.variant]));

  const combinedStyles = { ...themeStyles, ...bgStyles } as React.CSSProperties;

  return (
    <div className={`ap-portfolio-root ${className ?? ""}`} style={combinedStyles}>
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}

      <BackgroundDecorations theme={composition.theme} />

      <DynamicNavigation
        navigation={composition.navigation}
        theme={composition.theme}
        portfolioName={portfolio.personalInfo?.name || "Portfolio"}
      />

      <main
        className={`${containerClass} flex flex-col gap-12 md:gap-16 pb-20`}
        style={{ paddingTop: composition.navigation.style === "sidebar" ? "0" : undefined }}
      >
        {sectionOrder.map((key) => (
          <div
            key={key}
            id={key}
            className="w-full min-w-0"
          >
            {renderSectionWithVariant(key, portfolio, sectionVariants.get(key), composition)}
          </div>
        ))}
      </main>

      <footer
        className="border-t py-8 px-6 text-center"
        style={{
          borderColor: composition.theme.colors.border,
          background: composition.theme.colors.background,
          color: composition.theme.colors.textMuted,
          fontFamily: composition.theme.typography.bodyFont,
        }}
      >
        <p className="text-xs">
          &copy; {new Date().getFullYear()} {portfolio.personalInfo?.name || "Developer"}
        </p>
      </footer>

      <style jsx global>{`
        @keyframes mesh-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 3%) scale(1.05); }
          66% { transform: translate(-3%, 5%) scale(0.95); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(5%, -3%) scale(1.05); }
          50% { transform: translate(-2%, 4%) scale(0.95); }
          75% { transform: translate(3%, -2%) scale(1.02); }
        }
      `}</style>
    </div>
  );
}

function renderSectionWithVariant(
  key: string,
  portfolio: PortfolioObject,
  variant: string | undefined,
  composition: CompositionGraph
): React.ReactNode {
  const node = renderSection(key as Parameters<typeof renderSection>[0], portfolio);
  if (!node) return null;

  return (
    <CompositionAnimator motion={composition.motion}>
      <div data-section={key} data-variant={variant ?? "default"} className="portfolio-section">
        {node}
      </div>
    </CompositionAnimator>
  );
}

function getMagazineSpan(key: string, index: number): string {
  if (key === "hero") return "col-span-12";
  if (key === "projects") return "col-span-12 md:col-span-8";
  if (key === "skills" || key === "metrics") return "col-span-12 md:col-span-4";
  if (key === "about") return "col-span-12 md:col-span-5";
  if (key === "experience") return "col-span-12 md:col-span-7";
  if (key === "gallery") return "col-span-12";
  if (index % 3 === 0) return "col-span-12";
  if (index % 3 === 1) return "col-span-12 md:col-span-7";
  return "col-span-12 md:col-span-5";
}

function getBentoSpan(key: string, index: number): string {
  if (key === "hero") return "col-span-2 md:col-span-3";
  if (key === "projects") return "col-span-2 md:col-span-2";
  if (key === "skills") return "col-span-1 md:col-span-1";
  if (key === "metrics") return "col-span-1 md:col-span-1";
  if (key === "contact") return "col-span-2 md:col-span-2";
  return "col-span-1 md:col-span-1";
}

function LegacyRenderer({ portfolio, className }: { portfolio: PortfolioObject; className?: string }) {
  const themeMode = portfolio.theme?.mode ?? "dark";
  const { getThemeStyles } = require("@/lib/portfolio/themes");
  const { getVisibleSections } = require("@/lib/portfolio/layouts");
  const { renderSection: legacyRenderSection } = require("@/lib/portfolio/registry");

  const themeStyles = getThemeStyles(themeMode);
  const layoutStyle = portfolio.layout?.style ?? "minimal";
  const sectionOrder = portfolio.layout?.sectionOrder;
  const visibleSections = getVisibleSections(portfolio.sections ?? {}, layoutStyle, sectionOrder);

  return (
    <div className={`ap-portfolio-root ${className ?? ""}`} style={themeStyles}>
      <GBAfterlifeBackground />
      <SvgLiquidFilterProvider />
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-[var(--p-border)] bg-[var(--p-bg)]/80">
        <div className="w-full px-6 h-12 flex items-center justify-between">
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

      <main className="w-full">
        {visibleSections.map((key: string) => (
          <div key={key}>
            {legacyRenderSection(key, portfolio)}
          </div>
        ))}
      </main>

      <footer className="border-t border-[var(--p-border)] mt-16">
        <div className="w-full px-6 py-8 flex items-center justify-between">
          <span className="text-xs text-[var(--p-text-muted)]">
            &copy; {new Date().getFullYear()} {portfolio.personalInfo?.name ?? "Developer"}
          </span>
        </div>
      </footer>
    </div>
  );
}
