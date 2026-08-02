// @ts-nocheck
import type { GeneratorContext, GeneratedFile } from "./types";

export function generateContentFiles(ctx: GeneratorContext): GeneratedFile[] {
  const contentFile: GeneratedFile = {
    path: `${ctx.libDir}/content.ts`,
    content: generateContentData(ctx),
    type: "content",
  };
  return [contentFile];
}

function generateContentData(ctx: GeneratorContext): string {
  const { manifest } = ctx;
  const blueprint = manifest.blueprint;
  const contentSections = blueprint.content.sections;

  const content: Record<string, unknown> = {
    site: {
      title: blueprint.seo.title,
      description: blueprint.seo.description,
      url: blueprint.seo.canonical,
    },
    hero: contentSections?.hero || {
      heading: `Hello, I'm ${blueprint.portfolioType}`,
      subheading: blueprint.content.intent,
      body: blueprint.content.storytelling,
      cta: [],
    },
    about: contentSections?.about || {
      heading: "About Me",
      subheading: blueprint.content.tone,
      body: blueprint.content.voice,
      cta: [],
    },
    projects: contentSections?.projects || {
      heading: "Featured Projects",
      subheading: "Some of my recent work",
      body: "",
      cta: [],
      data: { items: [] },
    },
    experience: contentSections?.experience || {
      heading: "Work Experience",
      subheading: "My professional journey",
      body: "",
      cta: [],
      data: { items: [] },
    },
    contact: contentSections?.contact || {
      heading: "Get in Touch",
      subheading: "Have a project in mind? Let's work together.",
      body: "",
      cta: [],
      data: { email: "", location: "" },
    },
  };

  const contentJson = JSON.stringify(content, null, 2);

  return `export interface ContentData {
  site: { title: string; description: string; url: string };
  hero: { heading: string; subheading: string; body: string; cta: { label: string; href: string }[] };
  about: { heading: string; subheading: string; body: string; cta: { label: string; href: string }[] };
  projects: { heading: string; subheading: string; body: string; cta: { label: string; href: string }[]; data: Record<string, unknown> };
  experience: { heading: string; subheading: string; body: string; cta: { label: string; href: string }[]; data: Record<string, unknown> };
  contact: { heading: string; subheading: string; body: string; cta: { label: string; href: string }[]; data: Record<string, unknown> };
}

export const content: ContentData = ${contentJson};
`;
}
