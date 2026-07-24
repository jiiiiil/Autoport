import type { GeneratorContext, GeneratedFile } from "./types";

function generateThemeProvider(ctx: GeneratorContext): GeneratedFile {
  const { manifest } = ctx;
  const isDark = manifest.blueprint.theme === "dark";

  const content = `"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("${isDark ? "dark" : "light"}");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
`;
  return { path: `${ctx.libDir}/providers/theme-provider.tsx`, content, type: "provider" };
}

function generateAnimationProvider(ctx: GeneratorContext): GeneratedFile {
  const lib = ctx.manifest.blueprint.animations.library;
  const intensity = ctx.manifest.blueprint.animations.intensity;

  if (intensity === "none") {
    const content = `"use client";

import { type ReactNode } from "react";

export function AnimationProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
`;
    return { path: `${ctx.libDir}/providers/animation-provider.tsx`, content, type: "provider" };
  }

  let content: string;

  if (lib === "framer-motion") {
    content = `"use client";

import { LazyMotion, domAnimation, type ReactNode } from "framer-motion";

export function AnimationProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
`;
  } else if (lib === "gsap") {
    content = `"use client";

import { type ReactNode, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AnimationProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
`;
  } else {
    content = `"use client";

import { type ReactNode } from "react";

export function AnimationProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
`;
  }

  return { path: `${ctx.libDir}/providers/animation-provider.tsx`, content, type: "provider" };
}

function generateProvidersIndex(ctx: GeneratorContext): GeneratedFile {
  const hasAnimation = ctx.manifest.blueprint.animations.intensity !== "none";
  const imports = [`import { ThemeProvider } from "./theme-provider";`];
  const wrappers: string[] = ["<ThemeProvider>"];

  if (hasAnimation) {
    imports.push(`import { AnimationProvider } from "./animation-provider";`);
    wrappers.push("<AnimationProvider>");
  }

  const closeWrappers = [...wrappers].reverse().map((w) => w.replace("<", "</").replace(/>$/, ">"));

  const content = `"use client";

import { type ReactNode } from "react";
${imports.join("\n")}

export function Providers({ children }: { children: ReactNode }) {
  return (
    ${wrappers.join("\n      ")}
      {children}
    ${closeWrappers.join("\n      ")}
  );
}
`;

  return { path: `${ctx.libDir}/providers/index.tsx`, content, type: "provider" };
}

export function generateAllProviders(ctx: GeneratorContext): GeneratedFile[] {
  return [generateThemeProvider(ctx), generateAnimationProvider(ctx), generateProvidersIndex(ctx)];
}
