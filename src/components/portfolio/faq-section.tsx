"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FaqSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const faq = portfolio.sections?.faq;
  if (!faq || faq.length === 0) return null;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-8">FAQ</h2>
      <div className="space-y-3 max-w-2xl mx-auto">
        {faq.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg-card)] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
            >
              <span className="text-sm font-medium text-[var(--p-text)]">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--p-text-muted)] transition-transform ${openIndex === i ? "rotate-180" : ""}`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5">
                <p className="text-sm text-[var(--p-text-muted)] leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
