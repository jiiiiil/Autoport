"use client";

import React from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import type { CompositionGraph } from "@/server/ai/composition/types";
import { getThemeStylesFromComposition, getGoogleFontsUrl, getBackgroundStyles } from "@/lib/portfolio/themes";
import { getLayoutContainerClass, getSectionSpacing } from "@/lib/portfolio/layouts";
import { DynamicNavigation } from "./dynamic-navigation";
import { renderSection } from "@/lib/portfolio/registry";
import { CompositionAnimator } from "./composition-animator";

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

function BackgroundDecorations({ theme }: { theme: CompositionGraph["theme"] }) {
  const style = theme.backgroundStyle || "flat";
  const colors = theme.colors;

  if (style === "flat") return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      {style === "mesh-gradient" && (
        <>
          <div
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-20 blur-[120px] animate-[mesh-drift_20s_ease-in-out_infinite]"
            style={{ background: colors.primary }}
          />
          <div
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-15 blur-[120px] animate-[mesh-drift_25s_ease-in-out_infinite_5s]"
            style={{ background: colors.accent }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-1/3 h-1/3 rounded-full opacity-10 blur-[100px] animate-[mesh-drift_30s_ease-in-out_infinite_10s]"
            style={{ background: colors.secondary }}
          />
        </>
      )}
      {style === "aurora" && (
        <>
          <div
            className="absolute top-0 left-0 w-full h-1/2 opacity-[0.03]"
            style={{
              background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.accent} 50%, transparent 100%)`,
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-1/3 opacity-[0.02]"
            style={{
              background: `linear-gradient(0deg, ${colors.secondary} 0%, transparent 100%)`,
              filter: "blur(60px)",
            }}
          />
        </>
      )}
      {style === "grid" && (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, ${colors.primary} 1px, transparent 1px),
              linear-gradient(0deg, ${colors.accent} 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      )}
      {(style === "floating-blobs" || style === "noise") && (
        <>
          <div
            className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full opacity-10 blur-[100px] animate-[blob_30s_ease-in-out_infinite]"
            style={{ background: `radial-gradient(circle, ${colors.primary}, transparent)` }}
          />
          <div
            className="absolute bottom-1/3 right-1/5 w-96 h-96 rounded-full opacity-8 blur-[120px] animate-[blob_35s_ease-in-out_infinite_10s]"
            style={{ background: `radial-gradient(circle, ${colors.accent}, transparent)` }}
          />
        </>
      )}
      {style === "noise" && (
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
            opacity: 0.04,
          }}
        />
      )}
    </div>
  );
}

function CompositionRenderer({ portfolio, composition, className }: PortfolioRendererProps & { composition: CompositionGraph }) {
  const themeStyles = getThemeStylesFromComposition(composition.theme);
  const bgStyles = getBackgroundStyles(composition.theme);
  const containerClass = getLayoutContainerClass(composition.layout);
  const spacing = getSectionSpacing(composition.layout);
  const sectionOrder = composition.sections.map((s) => s.id);
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
    <div className={className} style={combinedStyles}>
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}

      <BackgroundDecorations theme={composition.theme} />

      <DynamicNavigation
        navigation={composition.navigation}
        theme={composition.theme}
        portfolioName={portfolio.personalInfo?.name || "Portfolio"}
      />

      <main
        className={containerClass}
        style={{ paddingTop: composition.navigation.style === "sidebar" ? "0" : undefined }}
      >
        {isSplitLayout ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {sectionOrder.map((key, i) => (
              <div
                key={key}
                id={key}
                style={{
                  padding: spacing,
                  gridColumn: i % 3 === 0 ? "1 / -1" : undefined,
                }}
                className={i % 3 === 0 ? "md:col-span-2" : ""}
              >
                {renderSectionWithVariant(key, portfolio, sectionVariants.get(key), composition)}
              </div>
            ))}
          </div>
        ) : isMagazineLayout ? (
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {sectionOrder.map((key, i) => {
              const spanClass = getMagazineSpan(key, i);
              return (
                <div
                  key={key}
                  id={key}
                  className={spanClass}
                  style={{ padding: spacing }}
                >
                  {renderSectionWithVariant(key, portfolio, sectionVariants.get(key), composition)}
                </div>
              );
            })}
          </div>
        ) : isGalleryLayout ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 px-4">
            {sectionOrder.map((key) => (
              <div
                key={key}
                id={key}
                className="break-inside-avoid mb-4"
                style={{ padding: `0 0 ${spacing} 0` }}
              >
                {renderSectionWithVariant(key, portfolio, sectionVariants.get(key), composition)}
              </div>
            ))}
          </div>
        ) : isBentoLayout ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4">
            {sectionOrder.map((key, i) => {
              const span = getBentoSpan(key, i);
              return (
                <div
                  key={key}
                  id={key}
                  className={span}
                  style={{ padding: spacing }}
                >
                  {renderSectionWithVariant(key, portfolio, sectionVariants.get(key), composition)}
                </div>
              );
            })}
          </div>
        ) : isTimelineLayout ? (
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block" style={{ background: composition.theme.colors.border }} />
            {sectionOrder.map((key, i) => (
              <div
                key={key}
                id={key}
                className={`relative ${i % 2 === 0 ? "md:pr-[52%]" : "md:pl-[52%]"} ${i % 2 === 0 ? "md:text-right" : ""}`}
                style={{ padding: spacing }}
              >
                <div className={`${i % 2 === 0 ? "md:ml-auto md:mr-8" : "md:ml-8"} max-w-lg`}>
                  {renderSectionWithVariant(key, portfolio, sectionVariants.get(key), composition)}
                </div>
              </div>
            ))}
          </div>
        ) : isFullBleed ? (
          <div>
            {sectionOrder.map((key) => (
              <div
                key={key}
                id={key}
                className="w-full"
                style={{ minHeight: key === "hero" ? "100vh" : undefined }}
              >
                {renderSectionWithVariant(key, portfolio, sectionVariants.get(key), composition)}
              </div>
            ))}
          </div>
        ) : (
          <div>
            {sectionOrder.map((key) => (
              <div
                key={key}
                id={key}
                style={{ padding: spacing }}
              >
                {renderSectionWithVariant(key, portfolio, sectionVariants.get(key), composition)}
              </div>
            ))}
          </div>
        )}
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
  const sectionData = composition.sections.find((s) => s.id === key);
  if (!sectionData) return null;

  return (
    <CompositionAnimator motion={composition.motion}>
      <div data-section={key} data-variant={variant} className="portfolio-section">
        {renderSection(key as Parameters<typeof renderSection>[0], portfolio)}
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
    <div className={className} style={themeStyles}>
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
