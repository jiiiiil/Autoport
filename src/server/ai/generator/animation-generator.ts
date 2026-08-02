// @ts-nocheck
import type { GeneratorContext, GeneratedFile } from "./types";

export function generateAnimationFiles(ctx: GeneratorContext): GeneratedFile[] {
  const { manifest } = ctx;
  const lib = manifest.blueprint.animations.library;
  const intensity = manifest.blueprint.animations.intensity;

  if (intensity === "none") return [];

  const files: GeneratedFile[] = [];

  files.push(generateScrollReveal(ctx));

  if (lib === "framer-motion") {
    files.push(generateFramerVariants(ctx));
  } else if (lib === "gsap") {
    files.push(generateGsapAnimations(ctx));
  }

  files.push(generateAnimationUtilities(ctx));

  return files;
}

function generateScrollReveal(ctx: GeneratorContext): GeneratedFile {
  const content = `"use client";

import { useEffect, useRef, type RefObject } from "react";

export function useScrollReveal(threshold = 0.1): RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={\`opacity-0 translate-y-8 transition-all duration-700 [\${delay}ms] [\${className}]\`}
      style={{ transitionDelay: \`\${delay}ms\` }}
      ref={(el) => {
        if (!el) return;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
              observer.unobserve(el);
            }
          },
          { threshold: 0.1 }
        );
        observer.observe(el);
      }}
    >
      {children}
    </div>
  );
}
`;
  return { path: `${ctx.hooksDir}/use-scroll-reveal.tsx`, content, type: "animation" };
}

function generateFramerVariants(_ctx: GeneratorContext): GeneratedFile {
  const content = `export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
};
`;
  return { path: `${_ctx.utilsDir}/animations.ts`, content, type: "animation" };
}

function generateGsapAnimations(_ctx: GeneratorContext): GeneratedFile {
  const content = `import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initGsap() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
}

export function fadeInUp(element: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay }
  );
}

export function fadeIn(element: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: "power2.out", delay }
  );
}

export function slideInLeft(element: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    element,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", delay }
  );
}

export function slideInRight(element: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    element,
    { opacity: 0, x: 30 },
    { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", delay }
  );
}

export function createScrollTrigger(
  trigger: string,
  animation: gsap.core.Timeline | gsap.core.Tween
) {
  return ScrollTrigger.create({
    trigger,
    start: "top 80%",
    animation,
    toggleActions: "play none none none",
  });
}
`;
  return { path: `${_ctx.utilsDir}/animations.ts`, content, type: "animation" };
}

function generateAnimationUtilities(_ctx: GeneratorContext): GeneratedFile {
  const content = `export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function onAnimate<T extends HTMLElement>(
  element: T | null,
  callback: (el: T) => void,
  options?: { threshold?: number; rootMargin?: string }
) {
  if (!element || typeof IntersectionObserver === "undefined") {
    element && callback(element);
    return () => {};
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        callback(element);
        observer.unobserve(element);
      }
    },
    { threshold: options?.threshold ?? 0.1, rootMargin: options?.rootMargin ?? "0px" }
  );

  observer.observe(element);
  return () => observer.disconnect();
}
`;
  return { path: `${_ctx.utilsDir}/animation-utils.ts`, content, type: "util" };
}
