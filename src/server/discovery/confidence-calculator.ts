import type { UserProfile } from "./types";

const WEIGHTS = {
  name: 12,
  role: 18,
  experience: 15,
  education: 8,
  projects: 15,
  skills: 15,
  technologies: 10,
  achievements: 5,
  socialLinks: 4,
  email: 3,
  phone: 2,
  location: 2,
  designPreference: 8,
  animationPreference: 6,
  audience: 4,
  careerGoal: 4,
};

export function calculateConfidence(profile: Partial<UserProfile>): number {
  let score = 0;
  let totalWeight = 0;

  for (const [field, weight] of Object.entries(WEIGHTS)) {
    totalWeight += weight;
    const value = profile[field as keyof UserProfile];
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      if (value.length > 0) score += weight;
    } else if (typeof value === "string") {
      if (value.trim().length > 0) score += weight;
    } else {
      score += weight;
    }
  }

  return Math.round((score / totalWeight) * 100);
}

export function getMostMissingFields(profile: Partial<UserProfile>): (keyof UserProfile)[] {
  const fields: (keyof UserProfile)[] = [
    "role", "experience", "skills", "technologies",
    "projects", "designPreference", "audience", "careerGoal",
    "education", "achievements", "socialLinks", "animationPreference"
  ];

  const weights: Record<string, number> = {
    role: 10, experience: 8, skills: 7, technologies: 6,
    projects: 9, designPreference: 5, audience: 4, careerGoal: 3,
    education: 3, achievements: 2, socialLinks: 1, animationPreference: 2,
  };

  return fields
    .filter((f) => {
      const v = profile[f];
      if (v === undefined || v === null) return true;
      if (Array.isArray(v)) return v.length === 0;
      if (typeof v === "string") return v.trim().length === 0;
      return false;
    })
    .sort((a, b) => (weights[b] || 0) - (weights[a] || 0));
}

function hasValue(profile: Partial<UserProfile>, field: keyof UserProfile): boolean {
  const v = profile[field];
  if (v === undefined || v === null) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim().length > 0;
  return true;
}

/**
 * Smart confidence gate: if the prompt (or the built profile) already contains
 * the essential identity information, the AI should NOT ask any follow-up
 * questions — it should generate the portfolio immediately.
 *
 * Essential = name + role + experience + (skills | technologies).
 */
export function isPromptSufficient(profile: Partial<UserProfile>): boolean {
  return (
    hasValue(profile, "name") &&
    hasValue(profile, "role") &&
    hasValue(profile, "experience") &&
    (hasValue(profile, "skills") || hasValue(profile, "technologies"))
  );
}
