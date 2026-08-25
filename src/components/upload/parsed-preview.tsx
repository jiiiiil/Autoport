"use client";

import { FileText, RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { useResumeStore } from "@/lib/resume-store";

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white px-4 py-3 text-center">
      <p className="text-xl font-bold text-text-primary">{value}</p>
      <p className="text-[10px] text-text-primary uppercase tracking-wider mt-0.5 font-semibold">{label}</p>
    </div>
  );
}

export function ParsedPreview() {
  const { resume, strategy, validation, normalized, detectedAsLinkedIn, detectedPages, setStage } = useResumeStore();

  if (!resume) return null;

  const personal = resume.personal;
  const skillCount = resume.skills.reduce((acc, g) => acc + g.skills.length, 0) + resume.technologies.length;

  return (
    <div className="w-full">
      <div className="flex items-start sm:items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">Resume parsed successfully</h3>
            <p className="text-xs text-text-primary font-semibold">
              {resume.source.filename} · {detectedPages} page{detectedPages !== 1 ? "s" : ""} · parsed in {(resume.source.rawTextLength / 1024).toFixed(1)} KB of text
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setStage("upload")}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-primary hover:text-primary transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Upload a different resume
        </button>
      </div>

      {detectedAsLinkedIn && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          LinkedIn Resume automatically detected
        </div>
      )}

      {validation && !validation.valid && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          Some fields missing — generation continues with what was found
        </div>
      )}

      <div className="rounded-2xl border border-black/10 bg-white p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-2xl font-bold text-text-primary">{personal.name ?? "Unknown"}</h4>
            {(personal.role || personal.headline) && (
              <p className="text-sm text-primary mt-1 font-semibold">{personal.role ?? personal.headline}</p>
            )}
            {personal.location && (
              <p className="text-xs text-text-primary mt-1 font-semibold">{personal.location}</p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {personal.email && (
              <span className="text-[10px] text-text-primary bg-black/5 rounded-full px-2.5 py-1">{personal.email}</span>
            )}
            {personal.linkedin && (
              <span className="text-[10px] text-text-muted bg-white/5 rounded-full px-2.5 py-1">LinkedIn</span>
            )}
            {personal.github && (
              <span className="text-[10px] text-text-muted bg-white/5 rounded-full px-2.5 py-1">GitHub</span>
            )}
          </div>
        </div>
        {personal.summary && (
          <p className="text-sm text-text-primary leading-relaxed mt-3 line-clamp-3 font-semibold">{personal.summary}</p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        <Stat label="Experience" value={resume.experience.length} />
        <Stat label="Education" value={resume.education.length} />
        <Stat label="Projects" value={resume.projects.length} />
        <Stat label="Skills" value={skillCount} />
        <Stat label="Certs" value={resume.certifications.length} />
        <Stat label="Achievements" value={resume.achievements.length} />
      </div>

      {strategy && (
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-[10px] text-text-primary uppercase tracking-wider mb-2 font-semibold">Portfolio Strategy</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-text-primary bg-primary/15 border border-primary/30 rounded-full px-3 py-1">
              {strategy.portfolioType.replace("-", " ")}
            </span>
            <span className="text-xs font-medium text-text-primary bg-black/5 border border-black/10 rounded-full px-3 py-1">
              {strategy.careerLevel} level
            </span>
            <span className="text-xs font-medium text-text-primary bg-black/5 border border-black/10 rounded-full px-3 py-1">
              for {strategy.audience.replace("-", " ")}
            </span>
          </div>
          {normalized && (
            <p className="text-[10px] text-text-primary mt-3 font-semibold">
              {normalized.mergedSkills > 0 ? `${normalized.mergedSkills} duplicate skills merged · ` : ""}
              {normalized.normalizedTech > 0 ? `${normalized.normalizedTech} technologies normalized · ` : ""}
              {normalized.mergedCompanies > 0 ? `${normalized.mergedCompanies} duplicate entries merged` : "data fully preserved"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
