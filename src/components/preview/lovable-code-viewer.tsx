"use client";

import React, { useState, useMemo } from "react";
import { usePortfolioStore } from "@/lib/portfolio/store";
import { generatePortfolioCodeFiles, downloadPortfolioZip, type CodeFile } from "@/lib/portfolio/code-generator";
import { Code2, Copy, Check, FileCode, Download, Folder, ChevronRight, X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LovableCodeViewer({ onClose }: { onClose?: () => void }) {
  const portfolio = usePortfolioStore((s) => s.portfolio);
  const composition = usePortfolioStore((s) => s.composition);

  const files = useMemo(() => {
    return generatePortfolioCodeFiles(portfolio, composition);
  }, [portfolio, composition]);

  const [activeFilePath, setActiveFilePath] = useState<string>("App.tsx");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeFile = files.find((f) => f.path === activeFilePath) || files[0];

  const handleCopyFile = (file: CodeFile) => {
    navigator.clipboard.writeText(file.content);
    setCopiedPath(file.path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleCopyAll = () => {
    const fullProjectBundle = files
      .map((f) => `// ==========================================\n// FILE: ${f.path}\n// ==========================================\n\n${f.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(fullProjectBundle);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div
      className={cn(
        "bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 select-none",
        isFullscreen ? "fixed inset-2 sm:inset-4 z-50 rounded-3xl" : "w-full h-[50vh] sm:h-[620px]"
      )}
    >
      {/* Lovable Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              Generated React TypeScript Code
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Production Ready
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-mono">{files.length} React & TypeScript files generated</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
          <button
            onClick={() => downloadPortfolioZip(portfolio, composition)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border border-indigo-400/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP</span>
          </button>

          <button
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer border border-zinc-700"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? "Copied All!" : "Copy Full Project"}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Body: File Tree + Code Editor */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar: File Tree */}
        <div className="hidden sm:block w-48 md:w-56 shrink-0 border-r border-zinc-800 bg-zinc-950/80 p-3 overflow-y-auto space-y-1">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 px-2 mb-2 flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-indigo-400" />
            <span>Project Explorer</span>
          </div>

          {files.map((file) => {
            const isActive = file.path === activeFilePath;
            return (
              <button
                key={file.path}
                onClick={() => setActiveFilePath(file.path)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-all cursor-pointer",
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-indigo-400" : "text-zinc-500")} />
                  <span className="truncate">{file.filename}</span>
                </div>
                {isActive && <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Right Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
          {/* Active File Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/30 text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-300">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-white">{activeFile.path}</span>
            </div>

            <button
              onClick={() => handleCopyFile(activeFile)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-700"
            >
              {copiedPath === activeFile.path ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPath === activeFile.path ? "Copied File!" : "Copy File"}</span>
            </button>
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-200 bg-zinc-950">
            <pre className="whitespace-pre-wrap">
              {activeFile.content.split("\n").map((line, i) => (
                <div key={i} className="flex hover:bg-zinc-900/50 rounded px-1 -mx-1">
                  <span className="w-8 text-zinc-600 shrink-0 select-none text-right pr-3 font-mono text-[11px]">
                    {i + 1}
                  </span>
                  <span className="flex-1 min-w-0">{line || "\u00A0"}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
