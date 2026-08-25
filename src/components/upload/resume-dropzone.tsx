"use client";

import { useCallback, useRef, useState } from "react";
import { FileUp, Loader2, CheckCircle2, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/lib/resume-store";

export function ResumeDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { stage, file, detectedAsLinkedIn, setStage, setFile, setParseReport, setGenerationError } = useResumeStore();

  const isParsing = stage === "parsing";

  const parseFile = useCallback(async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("PDF file exceeds the 10MB limit.");
      return;
    }

    setError(null);
    setGenerationError(null);
    setFile({ name: file.name, size: file.size });
    setStage("parsing");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        const message = result?.message ?? "Failed to parse resume. Make sure the PDF is a text-based resume.";
        setError(message);
        setStage("error");
        return;
      }

      setParseReport(result.data);
      setStage("customize");
    } catch {
      setError("Network error while parsing the resume. Please try again.");
      setStage("error");
    }
  }, [setStage, setFile, setParseReport, setGenerationError]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) void parseFile(dropped);
  }, [parseFile]);

  const handlePick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) void parseFile(picked);
    e.target.value = "";
  }, [parseFile]);

  if (isParsing) {
    return (
      <div className="w-full max-w-xl mx-auto rounded-3xl border border-black/10 bg-white p-6 sm:p-10 text-center">
        <div className="flex items-center justify-center gap-3 text-text-primary">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-sm font-medium text-text-primary">Extracting intelligence from your resume...</p>
        </div>
        <div className="mt-6 space-y-2 text-left">
          {[
            "Extracting PDF text",
            "Detecting LinkedIn resume structure",
            "Structuring personal information",
            "Extracting experience, education, skills",
            "Normalizing and validating data",
          ].map((step) => (
            <div key={step} className="flex items-center gap-2 text-xs text-text-primary">
              <Loader2 className="w-3 h-3 animate-spin text-primary/60" />
              <span className="animate-pulse">{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "cursor-pointer rounded-3xl border-2 border-dashed p-6 sm:p-10 text-center transition-all duration-300",
          dragOver
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-black/15 bg-white hover:border-black/30 hover:bg-black/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handlePick}
        />

        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5">
          <FileUp className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Drop your LinkedIn Resume PDF here
        </h3>
        <p className="text-sm text-text-primary mb-2 font-semibold">
          or click to browse your files
        </p>
        <p className="text-xs text-text-primary/70 font-medium">
          PDF · up to 10MB · your resume is never shared
        </p>
      </div>

      {file && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl border border-black/10 bg-white px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate max-w-[240px] sm:max-w-[280px]">{file.name}</p>
              <p className="text-xs text-text-primary font-semibold">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          {detectedAsLinkedIn ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">LinkedIn Resume detected</span>
              <span className="sm:hidden">LinkedIn</span>
            </span>
          ) : (
            <span className="text-xs text-text-primary font-semibold">PDF detected</span>
          )}
          <button
            type="button"
            onClick={() => useResumeStore.setState({ file: null })}
            className="ml-auto p-1.5 rounded-full text-text-primary hover:text-primary hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-text-primary font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
}
