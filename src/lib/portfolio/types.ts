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

export interface PortfolioTestimonial {
  author?: string;
  role?: string;
  content?: string;
  rating?: number;
  company?: string;
}

export interface PortfolioService {
  name?: string;
  description?: string;
  price?: string;
  features?: string[];
}

export interface PortfolioMetric {
  label?: string;
  value?: string;
  icon?: string;
  description?: string;
}

export interface PortfolioPublication {
  title?: string;
  publisher?: string;
  date?: string;
  link?: string;
  excerpt?: string;
}

export interface PortfolioFaq {
  question?: string;
  answer?: string;
}

export interface PortfolioProduct {
  name?: string;
  description?: string;
  link?: string;
  status?: "live" | "beta" | "coming-soon";
}

export interface PortfolioClient {
  name?: string;
  industry?: string;
  project?: string;
}

export interface PortfolioAward {
  title?: string;
  organization?: string;
  date?: string;
  description?: string;
}

export interface PortfolioRoadmap {
  milestone?: string;
  date?: string;
  status?: "completed" | "in-progress" | "upcoming";
}

export interface PortfolioArticle {
  title?: string;
  excerpt?: string;
  date?: string;
  link?: string;
}

export interface PortfolioSpeaking {
  event?: string;
  topic?: string;
  date?: string;
  link?: string;
}

export interface PortfolioLanguage {
  name?: string;
  proficiency?: string;
}

export interface PortfolioOrganization {
  title?: string;
  organization?: string;
  role?: string;
  date?: string;
  description?: string;
}

export interface PortfolioGalleryItem {
  title?: string;
  description?: string;
  category?: string;
  image?: string;
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
  testimonials?: PortfolioTestimonial[];
  gallery?: PortfolioGalleryItem[];
  services?: PortfolioService[];
  metrics?: PortfolioMetric[];
  publications?: PortfolioPublication[];
  faq?: PortfolioFaq[];
  products?: PortfolioProduct[];
  clients?: PortfolioClient[];
  awards?: PortfolioAward[];
  roadmap?: PortfolioRoadmap[];
  articles?: PortfolioArticle[];
  speaking?: PortfolioSpeaking[];
  timeline?: PortfolioExperience[];
  openSource?: PortfolioProject[];
  community?: PortfolioAchievement[];
  experiments?: PortfolioProject[];
  resume?: PortfolioExperience[];
  languages?: PortfolioLanguage[];
  organizations?: PortfolioOrganization[];
}

export interface PortfolioObject {
  personalInfo?: PortfolioPersonalInfo;
  sections?: PortfolioSections;
  theme?: PortfolioTheme;
  layout?: PortfolioLayout;
  navigation?: PortfolioNavigation;
  seo?: PortfolioSEO;
}
