import type { ResumeJSON, ResumeValidationResult } from "./types";

function hasEmail(resume: ResumeJSON): boolean {
  return !!resume.personal.email || !!resume.personal.linkedin || !!resume.personal.github || !!resume.personal.phone;
}

export function validateResume(resume: ResumeJSON): ResumeValidationResult {
  const checks = {
    name: !!resume.personal.name && resume.personal.name.trim().length > 0,
    experience: resume.experience.length > 0,
    education: resume.education.length > 0,
    skills: resume.skills.length > 0 || resume.technologies.length > 0,
    contact: hasEmail(resume),
  };

  const missing: string[] = [];
  if (!checks.name) missing.push("name");
  if (!checks.experience) missing.push("experience");
  if (!checks.education) missing.push("education");
  if (!checks.skills) missing.push("skills");
  if (!checks.contact) missing.push("contact");

  const passed = Object.values(checks).filter(Boolean).length;
  const score = Math.round((passed / Object.keys(checks).length) * 100);

  return {
    valid: checks.name && checks.experience && checks.skills,
    score,
    checks,
    missing,
  };
}
