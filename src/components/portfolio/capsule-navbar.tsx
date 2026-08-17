"use client";

import React, { useState, useEffect } from "react";

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface CapsuleNavbarProps {
  portfolioName?: string;
  links?: NavLinkItem[];
  className?: string;
  isLight?: boolean;
}

export function CapsuleNavbar({
  portfolioName = "Portfolio",
  links = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],
  className = "",
}: CapsuleNavbarProps) {
  const isLight = false;
  const [activeHref, setActiveHref] = useState<string>(links[0]?.href || "#hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const link of links) {
        const id = link.href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveHref(link.href);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [links]);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isLight ? "bg-white/40 backdrop-blur-md border-b border-slate-200/50" : "bg-[#080b11]/60 backdrop-blur-md border-b border-white/10"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Brand / Portfolio Name */}
        <a href="#hero" className="flex items-center gap-2 group">
          <span
            className={`text-xl sm:text-2xl font-black tracking-tight transition-colors ${
              isLight ? "text-slate-900 group-hover:text-sky-600" : "text-white group-hover:text-sky-400"
            }`}
          >
            {portfolioName}
          </span>
        </a>

        {/* Right: Floating Capsule Pill Navbar */}
        <div
          className={`flex items-center gap-1 p-1.5 rounded-full backdrop-blur-xl transition-all shadow-lg overflow-x-auto scrollbar-none max-w-[60vw] sm:max-w-none ${
            isLight
              ? "bg-white/80 border border-slate-200/90 shadow-slate-200/50"
              : "bg-[#141b27]/80 border border-white/15 shadow-black/40"
          }`}
        >
          {links.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveHref(link.href)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 select-none whitespace-nowrap ${
                  isActive
                    ? isLight
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                      : "bg-[#253246] text-white shadow-md shadow-black/40 border border-white/10"
                    : isLight
                    ? "text-slate-700 hover:text-slate-950 hover:bg-slate-100/80"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default CapsuleNavbar;
