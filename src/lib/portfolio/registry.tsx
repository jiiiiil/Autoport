"use client";

import React from "react";
import type { PortfolioObject } from "./types";

import { HeroSection } from "@/components/portfolio/hero-section";
import { AboutSection } from "@/components/portfolio/about-section";
import { SkillsSection } from "@/components/portfolio/skills-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { EducationSection } from "@/components/portfolio/education-section";
import { AchievementsSection } from "@/components/portfolio/achievements-section";
import { CertificationsSection } from "@/components/portfolio/certifications-section";
import { SocialLinksSection } from "@/components/portfolio/social-links-section";
import { ContactSection } from "@/components/portfolio/contact-section";
import { TestimonialsSection } from "@/components/portfolio/testimonials-section";
import { GallerySection } from "@/components/portfolio/gallery-section";
import { ServicesSection } from "@/components/portfolio/services-section";
import { MetricsSection } from "@/components/portfolio/metrics-section";
import { PublicationsSection } from "@/components/portfolio/publications-section";
import { FaqSection } from "@/components/portfolio/faq-section";
import { ProductsSection } from "@/components/portfolio/products-section";
import { ClientsSection } from "@/components/portfolio/clients-section";
import { AwardsSection } from "@/components/portfolio/awards-section";
import { RoadmapSection } from "@/components/portfolio/roadmap-section";
import { ArticlesSection } from "@/components/portfolio/articles-section";
import { SpeakingSection } from "@/components/portfolio/speaking-section";
import { LanguagesSection } from "@/components/portfolio/languages-section";
import { OrganizationsSection } from "@/components/portfolio/organizations-section";

export type SectionKey =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "achievements"
  | "certifications"
  | "socialLinks"
  | "contact"
  | "testimonials"
  | "gallery"
  | "services"
  | "metrics"
  | "publications"
  | "faq"
  | "products"
  | "clients"
  | "awards"
  | "roadmap"
  | "articles"
  | "speaking"
  | "timeline"
  | "openSource"
  | "community"
  | "experiments"
  | "resume"
  | "languages"
  | "organizations";

type SectionComponent = React.FC<{
  portfolio: PortfolioObject;
  sectionKey: SectionKey;
}>;

const REGISTRY: Record<SectionKey, SectionComponent> = {
  hero: HeroSection,
  about: AboutSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  education: EducationSection,
  achievements: AchievementsSection,
  certifications: CertificationsSection,
  socialLinks: SocialLinksSection,
  contact: ContactSection,
  testimonials: TestimonialsSection,
  gallery: GallerySection,
  services: ServicesSection,
  metrics: MetricsSection,
  publications: PublicationsSection,
  faq: FaqSection,
  products: ProductsSection,
  clients: ClientsSection,
  awards: AwardsSection,
  roadmap: RoadmapSection,
  articles: ArticlesSection,
  speaking: SpeakingSection,
  timeline: ExperienceSection,
  openSource: ProjectsSection,
  community: AchievementsSection,
  experiments: ProjectsSection,
  resume: ExperienceSection,
  languages: LanguagesSection,
  organizations: OrganizationsSection,
};

export function getSectionComponent(key: string): SectionComponent | null {
  return (REGISTRY as Record<string, SectionComponent>)[key] ?? null;
}

export function renderSection(
  key: string,
  portfolio: PortfolioObject
): React.ReactNode {
  const Component = getSectionComponent(key);
  if (!Component) return null;
  return <Component portfolio={portfolio} sectionKey={key as SectionKey} />;
}
