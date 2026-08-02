import type { ResumeJSON, PortfolioStrategy, PortfolioType, CareerLevel, Audience } from "./types";

const ROLE_PATTERNS: Array<{ type: PortfolioType; pattern: RegExp }> = [
  { type: "developer", pattern: /(full[- ]stack|front[- ]end|back[- ]end|web|software|mobile|devops|android|ios|data engineer|backend|frontend|swe|\.?net)/i },
  { type: "ai-engineer", pattern: /(ai engineer|machine learning|ml engineer|data scientist|deep learning|nlp|artificial intelligence|llm|prompt engineer|generative ai|computer vision)/i },
  { type: "designer", pattern: /(ui\/?ux|product design|graphic design|visual design|designer|art director|creative|illustrator|photograph)/i },
  { type: "founder", pattern: /(founder|co-?founder|ceo|cto|startup|entrepreneur|own startup|chief )/i },
  { type: "researcher", pattern: /(researcher|research assistant|ph\.?d|professor|scientist|postdoctoral|academic|paper|publication)/i },
  { type: "student", pattern: /(student|bachelor|master'?s|undergraduate|graduate|intern|fresh graduate)/i },
];

const AUDIENCE_KEYWORDS: Array<{ audience: Audience; pattern: RegExp }> = [
  { audience: "recruiters", pattern: /(recruit|hiring|job|resume|career)/i },
  { audience: "hiring-managers", pattern: /(engineering manager|hiring manager|team lead)/i },
  { audience: "clients", pattern: /(client|freelance|consult|agency|service)/i },
  { audience: "founders", pattern: /(investor|startup|co-founder|venture)/i },
  { audience: "community", pattern: /(community|open source|speak|talk|meetup|mentor|teaching)/i },
];

export function detectPortfolioType(resume: ResumeJSON): PortfolioType {
  const signals = [
    resume.personal.role ?? "",
    resume.personal.headline ?? "",
    ...resume.experience.map((e) => `${e.title} ${e.description ?? ""}`),
    ...resume.projects.map((p) => p.description ?? ""),
  ].join("\n");

  const matches: Record<PortfolioType, number> = {
    developer: 0, designer: 0, "ai-engineer": 0, founder: 0, researcher: 0, student: 0, general: 0,
  };

  for (const { type, pattern } of ROLE_PATTERNS) {
    const count = (signals.match(pattern) ?? []).length;
    matches[type] += count;
  }

  const tech = (resume.technologies ?? []).map((t) => t.toLowerCase()).join(" ");
  if (/(javascript|typescript|python|java|react|node|sql|aws|docker|go\b|rust\b|c\#|c\+\+)/i.test(tech)) {
    matches.developer += 2;
  }
  if (/(tensorflow|pytorch|pandas|numpy|scikit|machine learning|nlp|deep learning)/i.test(tech)) {
    matches["ai-engineer"] += 2;
  }
  if (/(figma|sketch|photoshop|illustrator|design)/i.test(tech)) {
    matches.designer += 2;
  }

  const entries = Object.entries(matches).filter(([k]) => k !== "general") as [PortfolioType, number][];
  entries.sort((a, b) => b[1] - a[1]);

  if (entries[0][1] === 0) return "general";
  if (entries[0][1] - (entries[1]?.[1] ?? 0) <= 1) {
    return "general";
  }
  return entries[0][0];
}

export function detectCareerLevel(resume: ResumeJSON): CareerLevel {
  const years = estimateYearsOfExperience(resume);

  const titleSignals = [
    resume.personal.role ?? "",
    resume.personal.headline ?? "",
    ...resume.experience.map((e) => e.title),
  ].join("\n");

  const eduSignals = resume.education.map((e) => e.degree ?? "").join("\n");

  if (/(director|vp|vice president|cto|chief|head of|principal|staff)/i.test(titleSignals)) return "lead";
  if (/(senior|sr\.?|lead engineer|staff engineer)/i.test(titleSignals)) return "senior";
  if (/(junior|entry[- ]level|trainee|associate)/i.test(titleSignals)) return years <= 1 ? "intern" : "junior";

  if (/intern/i.test(titleSignals)) return "intern";
  if (/(student|undergraduate|fresh graduate|b\.?tech|b\.?sc|m\.?sc|master)/i.test(eduSignals) && years < 2) return "student";

  if (years <= 0) return "junior";
  if (years < 2) return "junior";
  if (years < 5) return "mid";
  if (years < 8) return "senior";
  return "lead";
}

function estimateYearsOfExperience(resume: ResumeJSON): number {
  const currentYear = new Date().getFullYear();
  let totalYears = 0;

  for (const exp of resume.experience) {
    const start = extractYear(exp.startDate);
    if (!start) continue;
    const end = extractYear(exp.endDate) ?? (exp.current ? currentYear : start);
    totalYears += Math.max(0, end - start);
  }

  return Math.round(totalYears);
}

function extractYear(date?: string): number | null {
  if (!date) return null;
  const match = date.match(/\d{4}/);
  return match ? parseInt(match[1], 10) : null;
}

export function detectAudience(resume: ResumeJSON): Audience {
  const signals = [
    resume.personal.summary ?? "",
    resume.personal.headline ?? "",
    resume.personal.role ?? "",
    ...resume.achievements.map((a) => a.title),
    ...resume.experience.map((e) => `${e.description ?? ""} ${(e.highlights ?? []).join(" ")}`),
  ].join("\n");

  for (const { audience, pattern } of AUDIENCE_KEYWORDS) {
    if (pattern.test(signals)) return audience;
  }

  const type = detectPortfolioType(resume);
  if (type === "founder") return "founders";
  if (type === "designer") return "clients";
  return "recruiters";
}

export function generatePortfolioStrategy(resume: ResumeJSON): PortfolioStrategy {
  const portfolioType = detectPortfolioType(resume);
  const careerLevel = detectCareerLevel(resume);
  const audience = detectAudience(resume);

  const suggestedSections: string[] = ["hero"];
  if (resume.personal.summary) suggestedSections.push("about");
  if (resume.experience.length > 0) suggestedSections.push("experience");
  if (resume.skills.length > 0 || resume.technologies.length > 0) suggestedSections.push("skills");
  if (resume.projects.length > 0) suggestedSections.push("projects");
  if (resume.education.length > 0) suggestedSections.push("education");
  if (resume.certifications.length > 0) suggestedSections.push("certifications");
  if (resume.achievements.length > 0) suggestedSections.push("achievements");
  if (resume.awards.length > 0) suggestedSections.push("awards");
  if (resume.publications.length > 0) suggestedSections.push("publications");
  if (resume.organizations.length > 0 || resume.volunteerExperience.length > 0) suggestedSections.push("organizations");
  if (resume.languages.length > 0) suggestedSections.push("languages");
  if (resume.personal.github || resume.personal.linkedin || resume.personal.website) suggestedSections.push("socialLinks");
  suggestedSections.push("contact");

  const emphasis: string[] = [];
  if (portfolioType === "developer") emphasis.push("technical depth", "project outcomes", "stack proficiency");
  if (portfolioType === "ai-engineer") emphasis.push("modeling expertise", "AI outcomes", "technical innovation");
  if (portfolioType === "designer") emphasis.push("visual craft", "design process", "portfolio pieces");
  if (portfolioType === "founder") emphasis.push("vision", "leadership", "business impact");
  if (portfolioType === "researcher") emphasis.push("publications", "research impact", "academic rigor");
  if (portfolioType === "student") emphasis.push("potential", "learning velocity", "projects");

  return {
    portfolioType,
    careerLevel,
    audience,
    rationale:
      `${careerLevel}-level ${portfolioType} portfolio optimized for ${audience}. ` +
      `Highlighting: ${emphasis.join(", ")}.`,
    suggestedSections,
    emphasis,
  };
}
