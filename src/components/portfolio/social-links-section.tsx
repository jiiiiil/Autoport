"use client";

import React from "react";
import type { PortfolioObject } from "@/lib/portfolio/types";
import { ExternalLink, Globe } from "lucide-react";

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("linkedin")) {
    return (
      <svg className="w-4 h-4 fill-current text-sky-600 group-hover:text-white" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
      </svg>
    );
  }
  if (p.includes("github")) {
    return (
      <svg className="w-4 h-4 fill-current text-slate-800 group-hover:text-white" viewBox="0 0 24 24">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
      </svg>
    );
  }
  return <Globe className="w-4 h-4 text-emerald-600 group-hover:text-white" />;
}

export function SocialLinksSection({ portfolio }: { portfolio: PortfolioObject; sectionKey: string }) {
  const socialLinks = portfolio.sections?.socialLinks;
  const isLight = portfolio.theme?.mode !== "dark" && portfolio.theme?.mode !== "black";

  if (!socialLinks || socialLinks.length === 0) return null;

  return (
    <section id="social-links" className="py-12 relative z-10">
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-600 font-mono">
          Connect & Network
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[var(--p-text,#1e293b)] mt-1">
          Social Profiles & Links
        </h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto px-4">
        {socialLinks.map((link) => {
          const isLinkedIn = link.platform.toLowerCase().includes("linkedin");
          return (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 select-none font-bold text-sm ${
                isLight
                  ? isLinkedIn
                    ? "bg-white border-sky-300 text-slate-900 hover:bg-sky-600 hover:text-white hover:border-sky-600"
                    : "bg-white border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900"
                  : "bg-white/10 border-white/20 text-white hover:bg-sky-500 hover:border-sky-400"
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center transition-colors group-hover:bg-transparent">
                {getPlatformIcon(link.platform)}
              </div>
              <span className="tracking-wide font-extrabold">{link.platform}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
