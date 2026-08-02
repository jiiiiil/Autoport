import type { UserProfile, DiscoveryQuestion, DiscoveryAnalysis } from "./types";
import {
  extractName,
  extractEmail,
  extractRole,
  extractSkills,
  extractExperience,
  extractEducation,
  extractProjects,
} from "@/server/ai/composition/content-extractor";

export function updateProfile(
  profile: Partial<UserProfile>,
  question: DiscoveryQuestion,
  answer: string | string[]
): Partial<UserProfile> {
  const field = question.field;

  if (field === "skills" || field === "technologies" || field === "achievements") {
    const existing = (profile[field] as string[]) || [];
    const newValues = Array.isArray(answer) ? answer : [answer];
    return { ...profile, [field]: [...new Set([...existing, ...newValues])] };
  }

  if (field === "projects") {
    if (typeof answer === "string") {
      try {
        const parsed = JSON.parse(answer);
        const existing = profile.projects || [];
        return { ...profile, projects: [...existing, ...(Array.isArray(parsed) ? parsed : [parsed])] };
      } catch {
        const existing = profile.projects || [];
        return { ...profile, projects: [...existing, { name: answer, description: "", technologies: [] }] };
      }
    }
  }

  if (field === "socialLinks") {
    if (typeof answer === "string") {
      const existing = profile.socialLinks || [];
      return { ...profile, socialLinks: [...existing, { platform: "custom", url: answer }] };
    }
  }

  return { ...profile, [field]: answer };
}

export function profileToPrompt(profile: Partial<UserProfile>): string {
  const parts: string[] = [];
  if (profile.name) parts.push(`Name: ${profile.name}`);
  if (profile.role) parts.push(`Role: ${profile.role}`);
  if (profile.experience) parts.push(`Experience: ${profile.experience}`);
  if (profile.education) parts.push(`Education: ${profile.education}`);
  if (profile.skills?.length) parts.push(`Skills: ${profile.skills.join(", ")}`);
  if (profile.technologies?.length) parts.push(`Technologies: ${profile.technologies.join(", ")}`);
  if (profile.achievements?.length) parts.push(`Achievements: ${profile.achievements.join(", ")}`);
  if (profile.designPreference) parts.push(`Design Preference: ${profile.designPreference}`);
  if (profile.animationPreference) parts.push(`Animation Preference: ${profile.animationPreference}`);
  if (profile.audience) parts.push(`Target Audience: ${profile.audience}`);
  if (profile.careerGoal) parts.push(`Career Goal: ${profile.careerGoal}`);
  if (profile.industry) parts.push(`Industry: ${profile.industry}`);
  if (profile.email) parts.push(`Email: ${profile.email}`);
  if (profile.phone) parts.push(`Phone: ${profile.phone}`);
  if (profile.location) parts.push(`Location: ${profile.location}`);
  if (profile.projects?.length) {
    parts.push("Projects:");
    profile.projects.forEach((p) => parts.push(`  - ${p.name}: ${p.description} [${p.technologies.join(", ")}]`));
  }
  if (profile.socialLinks?.length) {
    parts.push(`Social: ${profile.socialLinks.map((l) => `${l.platform}: ${l.url}`).join(", ")}`);
  }
  return parts.join("\n");
}

function firstString(known: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = known[key];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (Array.isArray(v) && v.length) {
      const first = v[0];
      if (typeof first === "string" && first.trim()) return first.trim();
    }
  }
  return "";
}

function collectStrings(known: Record<string, unknown>, keys: string[]): string[] {
  const out: string[] = [];
  for (const key of keys) {
    const v = known[key];
    if (typeof v === "string") {
      out.push(...v.split(",").map((s) => s.trim()).filter(Boolean));
    } else if (Array.isArray(v)) {
      for (const item of v) {
        if (typeof item === "string" && item.trim()) out.push(item.trim());
      }
    }
  }
  return [...new Set(out)];
}

function parseProjects(known: Record<string, unknown>): UserProfile["projects"] {
  const raw = known["projects"] ?? known["portfolio"] ?? known["projectList"];
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr
    .map((item) => {
      if (typeof item === "string") return { name: item, description: "", technologies: [] };
      if (typeof item === "object" && item !== null) {
        const obj = item as Record<string, unknown>;
        const name = String(obj.name ?? obj.title ?? obj.project ?? "").trim();
        if (!name) return null;
        const tech = obj.technologies ?? obj.techStack ?? obj.tags ?? obj.stack ?? [];
        return {
          name,
          description: String(obj.description ?? obj.summary ?? "").trim(),
          technologies: Array.isArray(tech) ? tech.map(String) : [],
          url: typeof obj.url === "string" ? obj.url : undefined,
        };
      }
      return null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
}

function parseSocialLinks(known: Record<string, unknown>): UserProfile["socialLinks"] {
  const raw = known["socialLinks"] ?? known["social"] ?? known["socials"];
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr
    .map((item) => {
      if (typeof item === "string") {
        return item.includes("://") ? { platform: "custom", url: item } : null;
      }
      if (typeof item === "object" && item !== null) {
        const obj = item as Record<string, unknown>;
        const url = String(obj.url ?? obj.link ?? "").trim();
        if (!url) return null;
        return { platform: String(obj.platform ?? "custom").trim(), url };
      }
      return null;
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);
}

/**
 * Build a user profile from the AI's prompt analysis (`known` map) plus the
 * deterministic regex extractors, so every piece of information present in the
 * prompt is captured and never re-asked.
 */
export function buildProfileFromAnalysis(analysis: DiscoveryAnalysis): Partial<UserProfile> {
  const known = (analysis.known || {}) as Record<string, unknown>;
  const profile: Partial<UserProfile> = {};

  const name = firstString(known, ["name", "fullName"]);
  if (name) profile.name = name;

  const role = firstString(known, ["role", "title", "profession"]) || analysis.profession || "";
  if (role) profile.role = role;

  const experience = firstString(known, ["experience", "experienceLevel", "yearsOfExperience"]);
  if (experience) profile.experience = experience;

  const education = firstString(known, ["education", "degree", "qualification"]);
  if (education) profile.education = education;

  const skills = collectStrings(known, ["skills", "techStack"]);
  const technologies = collectStrings(known, ["technologies", "techStack", "tools", "stack"]);
  if (skills.length) profile.skills = skills;
  if (technologies.length) profile.technologies = technologies;
  if (!technologies.length && skills.length) profile.technologies = skills;

  const projects = parseProjects(known);
  if (projects.length) profile.projects = projects;

  const socialLinks = parseSocialLinks(known);
  if (socialLinks.length) profile.socialLinks = socialLinks;

  const designPreference =
    firstString(known, ["designPreference", "theme", "colorPalette", "colors", "style", "design"]);
  if (designPreference) profile.designPreference = designPreference;

  const animationPreference =
    firstString(known, ["animationPreference", "animations", "motion", "animation"]);
  if (animationPreference) profile.animationPreference = animationPreference;

  const audience = firstString(known, ["audience", "targetAudience"]);
  if (audience) profile.audience = audience;

  const careerGoal = firstString(known, ["careerGoal", "objective"]) || analysis.portfolioObjective || "";
  if (careerGoal) profile.careerGoal = careerGoal;

  const industry = firstString(known, ["industry"]);
  if (industry) profile.industry = industry;

  const email = firstString(known, ["email", "emailAddress"]);
  if (email) profile.email = email;

  const phone = firstString(known, ["phone", "phoneNumber", "contact"]);
  if (phone) profile.phone = phone;

  const location = firstString(known, ["location", "city", "address"]);
  if (location) profile.location = location;

  const achievements = collectStrings(known, ["achievements", "awards"]);
  if (achievements.length) profile.achievements = achievements;

  return profile;
}

/**
 * Build a complete profile from the raw prompt using the AI analysis enriched
 * with deterministic regex extraction (name, email, role, skills, experience,
 * education, projects, theme, animations). Fills gaps the AI may have missed.
 */
export function buildProfileFromPrompt(
  prompt: string,
  analysis: DiscoveryAnalysis
): Partial<UserProfile> {
  const profile = buildProfileFromAnalysis(analysis);

  const name = extractName(prompt);
  if (!profile.name && name) profile.name = name;

  const email = extractEmail(prompt);
  if (!profile.email && email) profile.email = email;

  const role = extractRole(prompt);
  if (!profile.role && role) profile.role = role;

  const skills = extractSkills(prompt);
  if (skills.length) {
    if (!profile.skills?.length) profile.skills = skills;
    if (!profile.technologies?.length) profile.technologies = skills;
  }

  const experience = extractExperience(prompt);
  if (experience.length && !profile.experience) {
    profile.experience = experience.map((e) => e.description).join("; ");
  }

  const education = extractEducation(prompt);
  if (education.length && !profile.education) {
    profile.education = education
      .map((e) => [e.degree, e.field, e.institution].filter(Boolean).join(", "))
      .join("; ");
  }

  const projects = extractProjects(prompt);
  if (projects.length && !profile.projects?.length) {
    profile.projects = projects.map((p) => ({
      name: p.title,
      description: p.description,
      technologies: p.tags,
    }));
  }

  if (!profile.designPreference) {
    const themeM = prompt.match(/(dark\s+blue|light|dark|minimal|cyberpunk|glass|neon|futuristic|violet|purple|emerald|teal|navy|charcoal)/i);
    if (themeM) profile.designPreference = themeM[1].toLowerCase();
  }

  if (!profile.animationPreference) {
    const animM = prompt.match(/(GSAP|framer\s+motion|three\.?js|scrolltrigger|scroll\s+trigger|aos|animate\s+on\s+scroll|lottie)/i);
    if (animM) profile.animationPreference = animM[1];
  }

  return profile;
}
