"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { ImageIcon } from "lucide-react";

export function GallerySection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const gallery = portfolio.sections?.gallery;
  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="gallery" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">Gallery</h2>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {gallery.map((item, i) => (
          <div
            key={i}
            className="break-inside-avoid mb-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] overflow-hidden group"
          >
            <div className="aspect-[4/3] bg-[var(--p-bg-card-hover)] flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-[var(--p-text-muted)] opacity-50" />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-[var(--p-text)] mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-[var(--p-text-muted)] leading-relaxed">{item.description}</p>
              )}
              {item.category && (
                <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded-md bg-[var(--p-primary)]/10 text-[var(--p-primary)]">
                  {item.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
