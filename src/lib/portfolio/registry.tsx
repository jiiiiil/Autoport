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
  | "contact";

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
};

export function getSectionComponent(key: SectionKey): SectionComponent | null {
  return REGISTRY[key] ?? null;
}

export function renderSection(
  key: SectionKey,
  portfolio: PortfolioObject
): React.ReactNode {
  const Component = getSectionComponent(key);
  if (!Component) return null;
  return <Component portfolio={portfolio} sectionKey={key} />;
}
