import type { ResumeJSON } from "./types";
import type { PortfolioObject } from "@/lib/portfolio/types";

function collectResumeEntities(resume: ResumeJSON): string[] {
  const entities: string[] = [];

  if (resume.personal.name) entities.push(resume.personal.name.trim());
  if (resume.personal.email) entities.push(resume.personal.email.trim().toLowerCase());
  if (resume.personal.phone) entities.push(resume.personal.phone.trim());
  if (resume.personal.github) entities.push(resume.personal.github.trim().toLowerCase());
  if (resume.personal.linkedin) entities.push(resume.personal.linkedin.trim().toLowerCase());

  for (const e of resume.experience) {
    if (e.company) entities.push(e.company.trim());
    if (e.title) entities.push(e.title.trim());
    if (e.description) entities.push(e.description.trim());
    for (const h of e.highlights ?? []) entities.push(h.trim());
  }

  for (const e of resume.education) {
    if (e.institution) entities.push(e.institution.trim());
    if (e.degree) entities.push(e.degree.trim());
  }

  for (const p of resume.projects) {
    if (p.name) entities.push(p.name.trim());
    if (p.description) entities.push(p.description.trim());
  }

  for (const g of resume.skills) {
    for (const s of g.skills) entities.push(s.trim());
  }

  for (const t of resume.technologies) entities.push(t.trim());

  for (const c of resume.certifications) {
    if (c.name) entities.push(c.name.trim());
    if (c.issuer) entities.push(c.issuer.trim());
  }

  for (const a of resume.achievements) {
    if (a.title) entities.push(a.title.trim());
  }

  for (const a of resume.awards) {
    if (a.title) entities.push(a.title.trim());
  }

  for (const o of resume.organizations) {
    if (o.name) entities.push(o.name.trim());
  }

  for (const v of resume.volunteerExperience) {
    if (v.organization) entities.push(v.organization.trim());
  }

  for (const l of resume.languages) {
    if (l.language) entities.push(l.language.trim());
  }

  return entities.filter(Boolean);
}

function collectPortfolioEntities(portfolio: PortfolioObject): string[] {
  const entities: string[] = [];
  const s = portfolio.sections ?? {};
  const add = (value: unknown) => {
    if (typeof value === "string" && value.trim()) entities.push(value.trim());
  };

  add(portfolio.personalInfo?.name);
  add(portfolio.personalInfo?.role);
  add(portfolio.personalInfo?.tagline);
  add(portfolio.personalInfo?.bio);
  add(portfolio.personalInfo?.email);

  add(s.hero?.headline);
  add(s.hero?.subheadline);
  add(s.about?.title);
  add(s.about?.content);

  for (const item of s.experience ?? []) { add(item.company); add(item.role); add(item.description); }
  for (const item of s.education ?? []) { add(item.institution); add(item.degree); add(item.field); }
  for (const item of s.projects ?? []) { add(item.title); add(item.description); }
  for (const item of s.skills ?? []) { add(item.name); }
  for (const item of s.certifications ?? []) { add(item.name); add(item.issuer); }
  for (const item of s.achievements ?? []) { add(item.title); add(item.description); }
  for (const item of s.awards ?? []) { add(item.title); add(item.organization); }
  for (const item of s.publications ?? []) { add(item.title); add(item.publisher); }
  for (const item of s.languages ?? []) { add(item.name); }
  for (const item of s.organizations ?? []) { add(item.title); add(item.description); }
  for (const item of s.socialLinks ?? []) { add(item.url); }
  add(s.contact?.email);
  add(s.contact?.phone);

  return entities.filter(Boolean);
}

function normalizeForMatch(value: string): string {
  return value.toLowerCase().replace(/[\s\-._/]+/g, " ").trim();
}

export interface FidelityReport {
  score: number;
  preserved: number;
  total: number;
  missing: string[];
}

export function checkFidelity(resume: ResumeJSON, portfolio: PortfolioObject): FidelityReport {
  const resumeEntities = collectResumeEntities(resume);
  const portfolioEntities = collectPortfolioEntities(portfolio).map(normalizeForMatch);

  const missing: string[] = [];

  for (const entity of resumeEntities) {
    const normalized = normalizeForMatch(entity);
    const found = portfolioEntities.some((p) => p.includes(normalized) || normalized.includes(p));
    if (!found) missing.push(entity);
  }

  const preserved = resumeEntities.length - missing.length;
  const score = resumeEntities.length === 0 ? 100 : Math.round((preserved / resumeEntities.length) * 100);

  return { score, preserved, total: resumeEntities.length, missing };
}
