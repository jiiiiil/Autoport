"use client";

import type { PortfolioObject } from "@/lib/portfolio/types";
import { Mail, MapPin } from "lucide-react";

export function ContactSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const contact = portfolio.sections?.contact;
  if (!contact?.email) return null;

  return (
    <section id="contact" className="px-6 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--p-text)] mb-4">
        Get in Touch
      </h2>
      <p className="text-[var(--p-text-muted)] text-sm mb-8 max-w-lg">
        {contact.availableFor
          ? `Available for: ${contact.availableFor}`
          : "Feel free to reach out for opportunities or just to say hi."}
      </p>
      <div className="flex flex-wrap gap-4">
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105"
          style={{ background: "linear-gradient(135deg, var(--p-gradient-from), var(--p-gradient-via))" }}
        >
          <Mail className="w-4 h-4" />
          {contact.email}
        </a>
        {contact.location && (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--p-border)] text-sm text-[var(--p-text-muted)]">
            <MapPin className="w-4 h-4" />
            {contact.location}
          </div>
        )}
      </div>
    </section>
  );
}
