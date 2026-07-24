import type {
  PortfolioObject,
  PortfolioSkill,
  PortfolioProject,
  PortfolioExperience,
  PortfolioEducation,
  ThemeMode,
  LayoutStyle,
} from "./types";

const SKILL_MAP: Record<string, string[]> = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "HTML", "CSS"],
  backend: ["Node.js", "Python", "Express", "FastAPI", "PostgreSQL", "MongoDB"],
  fullstack: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
  mobile: ["React Native", "Flutter", "Swift", "Kotlin"],
  devops: ["Docker", "AWS", "CI/CD", "Kubernetes", "Terraform"],
  design: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
};

const ROLE_KEYWORDS: Record<string, string> = {
  react: "React Developer",
  next: "Next.js Developer",
  node: "Full Stack Developer",
  python: "Backend Developer",
  full: "Full Stack Developer",
  front: "Frontend Developer",
  back: "Backend Developer",
  mobile: "Mobile Developer",
  devops: "DevOps Engineer",
  design: "UI/UX Designer",
  ai: "AI Engineer",
  data: "Data Engineer",
};

const PROJECT_TEMPLATES: PortfolioProject[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with real-time inventory, payment processing, and admin dashboard.",
    tags: ["React", "Node.js", "Stripe", "PostgreSQL"],
  },
  {
    title: "AI Content Generator",
    description: "An intelligent content generation tool powered by machine learning for automated copywriting.",
    tags: ["Next.js", "Python", "OpenAI", "Tailwind"],
  },
  {
    title: "Real-Time Chat App",
    description: "A scalable real-time messaging application with WebSocket support and end-to-end encryption.",
    tags: ["React", "Socket.io", "Express", "Redis"],
  },
  {
    title: "Portfolio CMS",
    description: "A headless CMS for managing portfolio content with a visual editor and API endpoints.",
    tags: ["Next.js", "TypeScript", "Sanity", "Vercel"],
  },
  {
    title: "Task Management System",
    description: "A collaborative project management tool with Kanban boards, time tracking, and reporting.",
    tags: ["Vue.js", "Node.js", "MongoDB", "Docker"],
  },
  {
    title: "Analytics Dashboard",
    description: "A real-time analytics dashboard with interactive charts, data filtering, and export capabilities.",
    tags: ["React", "D3.js", "Python", "FastAPI"],
  },
];

const EXPERIENCE_TEMPLATES: PortfolioExperience[] = [
  {
    company: "TechCorp",
    role: "Senior Developer",
    startDate: "2022",
    endDate: "Present",
    description: "Leading development of scalable web applications and mentoring junior developers.",
    current: true,
  },
  {
    company: "StartupXYZ",
    role: "Full Stack Developer",
    startDate: "2020",
    endDate: "2022",
    description: "Built and maintained core product features serving 100K+ users.",
  },
  {
    company: "DigitalAgency",
    role: "Frontend Developer",
    startDate: "2018",
    endDate: "2020",
    description: "Developed responsive web applications for enterprise clients.",
  },
];

const EDUCATION_TEMPLATES: PortfolioEducation[] = [
  {
    institution: "State University",
    degree: "Bachelor of Science",
    field: "Computer Science",
    startDate: "2014",
    endDate: "2018",
  },
];

function extractSkills(prompt: string): PortfolioSkill[] {
  const lower = prompt.toLowerCase();
  const skills: PortfolioSkill[] = [];
  let detected = false;

  for (const [category, skillList] of Object.entries(SKILL_MAP)) {
    if (lower.includes(category)) {
      detected = true;
      for (const skill of skillList) {
        skills.push({ name: skill, level: "advanced", category });
      }
    }
  }

  if (!detected) {
    for (const skill of SKILL_MAP.fullstack) {
      skills.push({ name: skill, level: "advanced", category: "fullstack" });
    }
  }

  return skills;
}

function detectRole(prompt: string): string {
  const lower = prompt.toLowerCase();
  for (const [keyword, role] of Object.entries(ROLE_KEYWORDS)) {
    if (lower.includes(keyword)) return role;
  }
  return "Software Developer";
}

function detectTheme(prompt: string): ThemeMode {
  const lower = prompt.toLowerCase();
  if (lower.includes("light")) return "light";
  if (lower.includes("red")) return "red";
  if (lower.includes("futur")) return "futuristic";
  return "dark";
}

function detectLayout(prompt: string): LayoutStyle {
  const lower = prompt.toLowerCase();
  if (lower.includes("minimal")) return "minimal";
  if (lower.includes("creative")) return "creative";
  if (lower.includes("agency")) return "agency";
  if (lower.includes("startup")) return "startup";
  return "developer";
}

function selectProjects(skills: PortfolioSkill[]): PortfolioProject[] {
  const techSet = new Set(skills.map((s) => s.name.toLowerCase()));
  const scored = PROJECT_TEMPLATES.map((p) => {
    const matchCount = (p.tags ?? []).filter((t) =>
      techSet.has(t.toLowerCase())
    ).length;
    return { project: p, score: matchCount };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.project);
}

export function parsePrompt(prompt: string): PortfolioObject {
  const skills = extractSkills(prompt);
  const role = detectRole(prompt);
  const theme = detectTheme(prompt);
  const layout = detectLayout(prompt);
  const projects = selectProjects(skills);

  const name = prompt.match(/(?:I'm|I am|my name is|call me)\s+(\w+(?:\s+\w+)?)/i)?.[1] ?? "Developer";

  return {
    personalInfo: {
      name,
      role,
      tagline: `Crafting digital experiences with ${role.toLowerCase()} expertise`,
      bio: prompt.length > 20 ? prompt : `Passionate ${role.toLowerCase()} building modern web applications with cutting-edge technologies.`,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
      location: "San Francisco, CA",
    },
    sections: {
      hero: {
        headline: `Hi, I'm ${name}`,
        subheadline: `${role} building exceptional digital products`,
        ctaText: "View My Work",
        ctaLink: "#projects",
      },
      about: {
        title: "About Me",
        content: prompt.length > 20 ? prompt : `I'm a ${role} with a passion for building beautiful, functional applications. With expertise in modern technologies, I create solutions that make a difference.`,
      },
      skills,
      projects,
      experience: EXPERIENCE_TEMPLATES,
      education: EDUCATION_TEMPLATES,
      achievements: [
        { title: "Open Source Contributor", description: "Active contributor to popular open-source projects" },
        { title: "Hackathon Winner", description: "1st place at regional tech hackathon" },
      ],
      certifications: [
        { name: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2023" },
      ],
      socialLinks: [
        { platform: "GitHub", url: "https://github.com" },
        { platform: "LinkedIn", url: "https://linkedin.com" },
        { platform: "Twitter", url: "https://twitter.com" },
      ],
      contact: {
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
        location: "San Francisco, CA",
        availableFor: "Full-time, Freelance, Consulting",
      },
    },
    theme: { mode: theme },
    layout: { style: layout },
    navigation: {
      links: [
        { label: "About", href: "#about" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#projects" },
        { label: "Experience", href: "#experience" },
        { label: "Contact", href: "#contact" },
      ],
      style: "pills",
    },
    seo: {
      title: `${name} - ${role}`,
      description: `Portfolio of ${name}, a ${role} building modern web applications.`,
      keywords: skills.map((s) => s.name),
    },
  };
}
