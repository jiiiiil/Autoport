"use client";

import { useMemo, useRef } from "react";
import { LayoutDashboard, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { scorePortfolio } from "@/lib/portfolio/quality-score";
import { useLayoutValidator } from "@/hooks/use-layout-validator";
import type { PortfolioObject } from "@/lib/portfolio/types";

interface LayoutQualityPanelProps {
  portfolio: PortfolioObject;
  active: boolean;
  onClose: () => void;
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 95 ? "text-emerald-400" : score >= 80 ? "text-amber-400" : "text-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className={`text-3xl font-bold ${color}`}>{score}</div>
      <div className="text-[10px] text-zinc-400 uppercase tracking-wider leading-tight">
        Pixel
        <br />
        Perfect
      </div>
    </div>
  );
}

export function LayoutQualityPanel({ portfolio, active, onClose }: LayoutQualityPanelProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const staticReport = useMemo(() => scorePortfolio(portfolio), [portfolio]);
  const measured = useLayoutValidator(rootRef, [portfolio, active]);

  if (!active) return null;

  return (
    <>
      <div ref={rootRef} className="hidden" aria-hidden="true" />
      <div className="fixed inset-y-0 right-0 z-[60] w-[min(22rem,calc(100vw-1.5rem))] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-zinc-300">Layout Quality Engine</span>
          </div>
          <div className="flex items-center gap-1">
            {staticReport.passed && measured.clean ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" /> NEEDS FIX
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              aria-label="Close quality panel"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-zinc-800 flex items-center justify-between">
          <ScoreRing score={Math.min(staticReport.overall, measured.clean ? measured.score : Math.min(measured.score, staticReport.overall))} />
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Rendered audit</div>
            <div className="flex items-center gap-1 text-xs text-zinc-400 mt-0.5">
              <RefreshCw className="w-3 h-3" />
              {measured.checkedAt ? new Date(measured.checkedAt).toLocaleTimeString() : "measuring..."}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Composition Score (10 categories)</div>
            <div className="space-y-2">
              {staticReport.categories.map((cat) => (
                <div key={cat.key} className="flex items-center gap-2">
                  <span className="w-32 text-[11px] text-zinc-400 truncate">{cat.label}</span>
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.score >= 95 ? "bg-emerald-500" : cat.score >= 80 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] tabular-nums text-zinc-400">{cat.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Rendered DOM Audit</div>
            {measured.clean ? (
              <div className="flex items-start gap-2 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>No overflow, no horizontal scroll, no text clipping detected.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {measured.violations.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-zinc-200">{v.selector}</span>
                      <span className="text-zinc-500 block mt-0.5">{v.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {staticReport.issues.length > 0 && (
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Content Warnings</div>
              <div className="space-y-1.5">
                {staticReport.issues.slice(0, 6).map((issue, i) => (
                  <p key={i} className="text-[11px] text-amber-400/90">• {issue}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-zinc-800 text-[10px] text-zinc-600">
          Phase 17 — AI Layout Constraint &amp; Pixel Perfect Composition Engine
        </div>
      </div>
    </>
  );
}
