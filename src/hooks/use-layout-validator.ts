"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";

/**
 * Phase 17 — Pixel Perfect Validation (STEP 9)
 *
 * Runtime audit of the rendered portfolio DOM. Detects:
 *  - horizontal overflow inside any container (content spilling out of cards)
 *  - elements extending past the viewport edge
 *  - page-level horizontal scroll
 *
 * Any violation is reported so the affected component can be redesigned.
 */

export interface LayoutViolation {
  kind: "card-overflow" | "viewport-overflow" | "page-scroll";
  selector: string;
  detail: string;
}

export interface LayoutValidationResult {
  violations: LayoutViolation[];
  score: number;
  clean: boolean;
  checkedAt: number;
}

const IGNORED_TAGS = new Set(["SCRIPT", "STYLE", "LINK", "META", "TITLE", "HEAD"]);

function isDecorNode(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el);
  if (style.position === "fixed") return true;
  if (el.getAttribute("aria-hidden") === "true") return true;
  if (el.closest('[aria-hidden="true"]')) return true;
  return false;
}

function describe(el: HTMLElement): string {
  const id = el.id ? `#${el.id}` : "";
  const cls = typeof el.className === "string" && el.className.trim() ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `${el.tagName.toLowerCase()}${id}${cls}`;
}

export function auditLayout(root: HTMLElement): LayoutValidationResult {
  const violations: LayoutViolation[] = [];
  const viewportWidth = window.innerWidth;
  const maxBySelector = new Map<string, number>();

  if (root.scrollWidth > root.clientWidth + 1) {
    violations.push({
      kind: "page-scroll",
      selector: "document",
      detail: `Horizontal scroll detected (${root.scrollWidth}px > ${root.clientWidth}px).`,
    });
  }

  const elements = Array.from(root.querySelectorAll<HTMLElement>("*"));
  for (const el of elements) {
    if (IGNORED_TAGS.has(el.tagName)) continue;
    if (isDecorNode(el)) continue;

    const style = window.getComputedStyle(el);
    if (style.position === "fixed") continue;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;

    // Content overflowing the element's own box (text spilling out of cards).
    if (el.scrollWidth > el.clientWidth + 2) {
      const hasText = el.textContent && el.textContent.trim().length > 0;
      const isContainer = style.overflow === "hidden" || style.overflowX === "hidden";
      if (hasText && !isContainer) {
        const key = `overflow:${describe(el)}`;
        const prev = maxBySelector.get(key) ?? 0;
        const gap = el.scrollWidth - el.clientWidth;
        if (gap > prev) {
          maxBySelector.set(key, gap);
          violations.push({
            kind: "card-overflow",
            selector: describe(el),
            detail: `Content overflows its container by ${gap}px (${el.scrollWidth}px > ${el.clientWidth}px).`,
          });
        }
      }
    }

    // Element extending beyond the right/left viewport edge.
    if (rect.right > viewportWidth + 1) {
      const key = `right:${describe(el)}`;
      if (!maxBySelector.has(key)) {
        maxBySelector.set(key, 1);
        violations.push({
          kind: "viewport-overflow",
          selector: describe(el),
          detail: `Element extends ${Math.round(rect.right - viewportWidth)}px past the viewport edge.`,
        });
      }
    }
    if (rect.left < -1) {
      const key = `left:${describe(el)}`;
      if (!maxBySelector.has(key)) {
        maxBySelector.set(key, 1);
        violations.push({
          kind: "viewport-overflow",
          selector: describe(el),
          detail: `Element starts ${Math.round(Math.abs(rect.left))}px before the viewport edge.`,
        });
      }
    }
  }

  // Cap the report so it stays readable.
  const capped = violations.slice(0, 12);
  const score = Math.max(0, 100 - capped.reduce((acc, v) => acc + (v.kind === "page-scroll" ? 12 : v.kind === "viewport-overflow" ? 8 : 6), 0));

  return {
    violations: capped,
    score,
    clean: capped.length === 0,
    checkedAt: Date.now(),
  };
}

export function useLayoutValidator(
  rootRef: React.RefObject<HTMLElement | null>,
  deps: unknown[]
): LayoutValidationResult {
  const [result, setResult] = useState<LayoutValidationResult>({
    violations: [],
    score: 100,
    clean: true,
    checkedAt: 0,
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const run = () => {
      if (cancelled || !rootRef.current) return;
      setResult(auditLayout(rootRef.current));
    };

    // Wait for fonts + layout to settle before measuring.
    timer = setTimeout(() => {
      run();
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (!cancelled) {
            setResult(auditLayout(rootRef.current as HTMLElement));
          }
        });
      }
    }, 350);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef, deps]);

  return result;
}
