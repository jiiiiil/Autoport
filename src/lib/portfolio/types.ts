export interface PortfolioPersonalInfo {
  name?: string;
  role?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  location?: string;
  avatar?: string;
}

export interface PortfolioHero {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface PortfolioSkill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  category?: string;
}

export interface PortfolioProject {
  title: string;
  description?: string;
  tags?: string[];
  link?: string;
  image?: string;
}

export interface PortfolioExperience {
  company: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  current?: boolean;
}

export interface PortfolioEducation {
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
}

export interface PortfolioAchievement {
  title: string;
  date?: string;
  description?: string;
}

export interface PortfolioCertification {
  name: string;
  issuer?: string;
  date?: string;
  link?: string;
}

export interface PortfolioSocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface PortfolioContact {
  email?: string;
  phone?: string;
  location?: string;
  availableFor?: string;
}

export type ThemeMode = "dark" | "light" | "red" | "futuristic";

export interface PortfolioTheme {
  mode: ThemeMode;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  headingFont?: string;
  bodyFont?: string;
}

export type LayoutStyle = "minimal" | "creative" | "developer" | "agency" | "startup";

export interface PortfolioLayout {
  style: LayoutStyle;
  sectionOrder?: string[];
  gridColumns?: number;
}

export interface PortfolioNavigation {
  links?: { label: string; href: string }[];
  style?: "pills" | "underline" | "minimal";
}

export interface PortfolioSEO {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface PortfolioSections {
  hero?: PortfolioHero;
  about?: { title?: string; content?: string };
  skills?: PortfolioSkill[];
  projects?: PortfolioProject[];
  experience?: PortfolioExperience[];
  education?: PortfolioEducation[];
  achievements?: PortfolioAchievement[];
  certifications?: PortfolioCertification[];
  socialLinks?: PortfolioSocialLink[];
  contact?: PortfolioContact;
}

export interface PortfolioObject {
  personalInfo?: PortfolioPersonalInfo;
  sections?: PortfolioSections;
  theme?: PortfolioTheme;
  layout?: PortfolioLayout;
  navigation?: PortfolioNavigation;
  seo?: PortfolioSEO;
}
