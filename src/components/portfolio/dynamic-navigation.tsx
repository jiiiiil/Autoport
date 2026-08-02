"use client";

import React from "react";
import type { ComposedNavigation, ComposedTheme } from "@/server/ai/composition/types";

interface DynamicNavigationProps {
  navigation: ComposedNavigation;
  theme: ComposedTheme;
  portfolioName: string;
  className?: string;
}

export function DynamicNavigation({ navigation, theme, portfolioName, className }: DynamicNavigationProps) {
  const links = navigation.sections.map((s) => ({
    label: s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, " $1"),
    href: `#${s}`,
  }));

  const baseStyle: React.CSSProperties = {
    fontFamily: theme.typography.bodyFont,
    color: theme.colors.text,
  };

  const navStyle = navigation.style;

  if (navStyle === "none") return null;

  if (navStyle === "sidebar") {
    return (
      <nav
        className={`fixed left-0 top-0 h-full w-64 z-50 flex flex-col py-8 px-6 ${className || ""}`}
        style={{
          ...baseStyle,
          background: theme.colors.surface,
          borderRight: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className="mb-8">
          <span className="text-lg font-bold" style={{ fontFamily: theme.typography.headingFont }}>
            {portfolioName}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-80"
              style={{
                color: theme.colors.textSecondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.colors.surfaceElevated;
                e.currentTarget.style.color = theme.colors.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = theme.colors.textSecondary;
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    );
  }

  if (navStyle === "dock") {
    return (
      <nav
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${className || ""}`}
        style={baseStyle}
      >
        <div
          className="flex items-center gap-1 px-4 py-2 rounded-2xl"
          style={{
            background: `${theme.colors.surface}cc`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${theme.colors.borderSubtle}`,
            boxShadow: `0 8px 32px ${theme.colors.overlay}`,
          }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
              style={{
                color: theme.colors.textSecondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.colors.surfaceElevated;
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = theme.colors.textSecondary;
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    );
  }

  if (navStyle === "bottom") {
    return (
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 ${className || ""}`}
        style={{
          ...baseStyle,
          background: theme.colors.surface,
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] transition-colors"
              style={{ color: theme.colors.textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.textMuted;
              }}
            >
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </nav>
    );
  }

  if (navStyle === "glass" || navigation.transparent) {
    return (
      <nav
        className={`sticky top-0 z-50 ${className || ""}`}
        style={{
          ...baseStyle,
          background: `${theme.colors.background}99`,
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${theme.colors.borderSubtle}`,
        }}
      >
        <div className="flex items-center justify-between px-6 h-12" style={{ maxWidth: theme.typography.headingFont ? "1200px" : "1200px", margin: "0 auto" }}>
          <span className="text-sm font-semibold" style={{ fontFamily: theme.typography.headingFont }}>
            {portfolioName}
          </span>
          <div className="flex items-center gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs transition-colors"
                style={{ color: theme.colors.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.textMuted;
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  if (navStyle === "floating") {
    return (
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 ${className || ""}`}
        style={baseStyle}
      >
        <div
          className="flex items-center gap-1 px-3 py-1.5 rounded-full"
          style={{
            background: `${theme.colors.surface}dd`,
            backdropFilter: "blur(12px)",
            border: `1px solid ${theme.colors.borderSubtle}`,
            boxShadow: `0 4px 16px ${theme.colors.overlay}`,
          }}
        >
          <span className="text-xs font-semibold px-3 py-1" style={{ fontFamily: theme.typography.headingFont }}>
            {portfolioName}
          </span>
          <div className="w-px h-4" style={{ background: theme.colors.border }} />
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1 rounded-full text-xs transition-all"
              style={{ color: theme.colors.textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.colors.surfaceElevated;
                e.currentTarget.style.color = theme.colors.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = theme.colors.textMuted;
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    );
  }

  if (navStyle === "pills" || navStyle === "underline") {
    return (
      <nav
        className={`sticky top-0 z-50 ${className || ""}`}
        style={{
          ...baseStyle,
          background: `${theme.colors.background}ee`,
          backdropFilter: "blur(12px)",
          borderBottom: navStyle === "underline" ? `1px solid ${theme.colors.border}` : "none",
        }}
      >
        <div className="flex items-center justify-between px-6 h-12" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <span className="text-sm font-semibold" style={{ fontFamily: theme.typography.headingFont }}>
            {portfolioName}
          </span>
          <div className="flex items-center gap-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1 text-xs transition-all"
                style={{
                  color: theme.colors.textMuted,
                  borderRadius: navStyle === "pills" ? theme.radius.full : "0",
                  borderBottom: navStyle === "underline" ? `2px solid transparent` : undefined,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.primary;
                  if (navStyle === "pills") {
                    e.currentTarget.style.background = theme.colors.surfaceElevated;
                  }
                  if (navStyle === "underline") {
                    e.currentTarget.style.borderBottomColor = theme.colors.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.textMuted;
                  if (navStyle === "pills") {
                    e.currentTarget.style.background = "transparent";
                  }
                  if (navStyle === "underline") {
                    e.currentTarget.style.borderBottomColor = "transparent";
                  }
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  if (navStyle === "minimal") {
    return (
      <nav
        className={`sticky top-0 z-50 ${className || ""}`}
        style={{
          ...baseStyle,
          background: theme.colors.background,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className="flex items-center justify-between px-6 h-12" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <span className="text-sm font-semibold" style={{ fontFamily: theme.typography.headingFont }}>
            {portfolioName}
          </span>
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs transition-colors"
                style={{ color: theme.colors.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.textMuted;
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  if (navStyle === "magazine-toc") {
    return (
      <nav
        className={`sticky top-0 z-50 ${className || ""}`}
        style={{
          ...baseStyle,
          background: `${theme.colors.background}ee`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className="px-6 py-3" style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold" style={{ fontFamily: theme.typography.headingFont }}>
              {portfolioName}
            </span>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs whitespace-nowrap transition-colors"
                style={{ color: theme.colors.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.textMuted;
                }}
              >
                <span className="mr-1 font-mono" style={{ color: theme.colors.textMuted, fontSize: "10px" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  // Default: sticky
  return (
    <nav
      className={`sticky top-0 z-50 ${className || ""}`}
      style={{
        ...baseStyle,
        background: `${theme.colors.background}ee`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${theme.colors.borderSubtle}`,
      }}
    >
      <div className="flex items-center justify-between px-6 h-12" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <span className="text-sm font-semibold" style={{ fontFamily: theme.typography.headingFont }}>
          {portfolioName}
        </span>
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs transition-colors"
              style={{ color: theme.colors.textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.colors.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.textMuted;
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
