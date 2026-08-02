export interface DiscoveryAnalysis {
  confidence: number;
  known: Record<string, string | string[]>;
  missing: string[];
  profession: string | null;
  experience: string | null;
  portfolioObjective: string | null;
}

export interface UserProfile {
  name: string;
  role: string;
  experience: string;
  education: string;
  projects: { name: string; description: string; technologies: string[]; url?: string }[];
  skills: string[];
  technologies: string[];
  achievements: string[];
  socialLinks: { platform: string; url: string }[];
  designPreference: string;
  animationPreference: string;
  audience: string;
  careerGoal: string;
  industry: string;
  email: string;
  phone: string;
  location: string;
}

export interface DiscoveryQuestion {
  id: string;
  text: string;
  type: "choice" | "text" | "multiselect";
  options?: { label: string; value: string }[];
  field: keyof UserProfile;
}

export interface DiscoveryState {
  stage: "analyzing" | "questioning" | "strategizing" | "ready";
  analysis: DiscoveryAnalysis | null;
  profile: Partial<UserProfile>;
  questions: DiscoveryQuestion[];
  questionHistory: { question: DiscoveryQuestion; answer: string | string[] }[];
  confidence: number;
}
