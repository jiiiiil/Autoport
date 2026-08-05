export type ThemeName =
  | "black"
  | "white"
  | "dark-blue"
  | "minimal-light"
  | "custom";

export type AnimationLevel = "minimal" | "medium" | "heavy";

export type MotionStylePreset = "quantum" | "glitch" | "magnetic" | "parallax" | "stagger" | "apple" | "roll3d" | "minimal";
export type CardStylePreset = "tilt3d" | "cyber-glass" | "shimmer-beam" | "magnetic-glow" | "holographic" | "soft-shadow" | "dual-ring" | "minimal";
export type ButtonStylePreset = "liquid-gradient" | "magnetic-pill" | "neon-pulse" | "glass-reflect" | "shimmer-border" | "elastic-bounce" | "underline-glow";
export type CanvasStylePreset = "three-particles" | "cosmic-mesh" | "aurora" | "grid-matrix" | "blobs" | "minimal";
export type MascotOptionPreset = "enabled-byte" | "enabled-minimal" | "disabled";

export interface AnimationPresetOptions {
  motionStyle: MotionStylePreset;
  cardStyle: CardStylePreset;
  buttonStyle: ButtonStylePreset;
  canvasStyle: CanvasStylePreset;
  mascotOption: MascotOptionPreset;
}

export type PortfolioType =
  | "developer"
  | "designer"
  | "ai-engineer"
  | "founder"
  | "researcher"
  | "student"
  | "general";

export type CareerLevel =
  | "student"
  | "intern"
  | "junior"
  | "mid"
  | "senior"
  | "lead";

export type Audience =
  | "recruiters"
  | "clients"
  | "hiring-managers"
  | "founders"
  | "community";

export interface ResumeDate {
  month?: string;
  year?: string;
  raw?: string;
}

export interface ResumeExperience {
  company: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  highlights?: string[];
  technologies?: string[];
}

export interface ResumeEducation {
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  description?: string;
  achievements?: string[];
}

export interface ResumeProject {
  name: string;
  description?: string;
  link?: string;
  githubUrl?: string;
  technologies?: string[];
  highlights?: string[];
}

export interface ResumeSkillGroup {
  name: string;
  skills: string[];
}

export interface ResumeCertification {
  name: string;
  issuer?: string;
  date?: string;
  link?: string;
}

export interface ResumeAchievement {
  title: string;
  description?: string;
  date?: string;
}

export interface ResumeAward {
  title: string;
  organization?: string;
  date?: string;
  description?: string;
}

export interface ResumeLanguage {
  language: string;
  proficiency?: string;
}

export interface ResumeOrganization {
  name: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ResumeVolunteer {
  organization: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ResumePublication {
  title: string;
  publisher?: string;
  date?: string;
  link?: string;
}

export interface ResumePersonal {
  name?: string;
  headline?: string;
  role?: string;
  location?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

export interface ResumeSourceInfo {
  filename: string;
  format: string;
  size: number;
  detectedAsLinkedIn: boolean;
  pages: number;
  rawTextLength: number;
}

export interface ResumeJSON {
  source: ResumeSourceInfo;
  personal: ResumePersonal;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkillGroup[];
  technologies: string[];
  languages: ResumeLanguage[];
  certifications: ResumeCertification[];
  achievements: ResumeAchievement[];
  awards: ResumeAward[];
  organizations: ResumeOrganization[];
  volunteerExperience: ResumeVolunteer[];
  publications: ResumePublication[];
  courses: string[];
  interests: string[];
  rawText: string;
}

export interface ResumeValidationResult {
  valid: boolean;
  score: number;
  checks: {
    name: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    contact: boolean;
  };
  missing: string[];
}

export interface PortfolioStrategy {
  portfolioType: PortfolioType;
  careerLevel: CareerLevel;
  audience: Audience;
  rationale: string;
  suggestedSections: string[];
  emphasis: string[];
}

export interface ResumeParseReport {
  resume: ResumeJSON;
  strategy: PortfolioStrategy;
  validation: ResumeValidationResult;
  normalized: {
    mergedSkills: number;
    mergedCompanies: number;
    normalizedTech: number;
    dateNormalized: number;
  };
  durationMs: number;
}
