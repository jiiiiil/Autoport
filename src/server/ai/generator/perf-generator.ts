// @ts-nocheck
import type { GeneratorContext, GeneratedFile } from "./types";

export function generatePerformanceFiles(ctx: GeneratorContext): GeneratedFile[] {
  const { manifest } = ctx;
  const perf = manifest.blueprint.performance;
  const files: GeneratedFile[] = [];

  if (perf.dynamicImports) {
    files.push(generateLazyLoad(ctx));
  }

  if (perf.prefetching) {
    files.push(generatePrefetch(ctx));
  }

  files.push(generatePerformanceUtils(ctx));

  return files;
}

function generateLazyLoad(ctx: GeneratorContext): GeneratedFile {
  const content = `"use client";

import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";

interface LazyComponentProps {
  fallback?: React.ReactNode;
}

export function withLazy<P extends object>(
  factory: () => Promise<{ default: ComponentType<P> }>,
  fallback: React.ReactNode = null
) {
  const LazyComponent = lazy(factory);

  return function WrappedComponent(props: P) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

export function LazySection({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <Suspense fallback={fallback ?? <div className="h-40 animate-pulse bg-surface" />}>
      {children}
    </Suspense>
  );
}
`;
  return { path: `${ctx.hooksDir}/use-lazy-load.tsx`, content, type: "util" };
}

function generatePrefetch(_ctx: GeneratorContext): GeneratedFile {
  const content = `"use client";

export function prefetchRoute(href: string) {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  document.head.appendChild(link);
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}
`;
  return { path: `${_ctx.utilsDir}/prefetch.ts`, content, type: "util" };
}

function generatePerformanceUtils(_ctx: GeneratorContext): GeneratedFile {
  const content = `export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function requestIdleCallbackShim(callback: (deadline: IdleDeadline) => void) {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    return window.requestIdleCallback(callback);
  }
  return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 0 }), 1);
}
`;
  return { path: `${_ctx.utilsDir}/performance.ts`, content, type: "util" };
}
