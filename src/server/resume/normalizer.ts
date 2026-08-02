import type { ResumeJSON, ResumeSkillGroup } from "./types";

const TECH_ALIASES: Record<string, string> = {
  reactjs: "React.js",
  react_js: "React.js",
  "react native": "React Native",
  node: "Node.js",
  nodejs: "Node.js",
  node_js: "Node.js",
  mongo: "MongoDB",
  mongodb: "MongoDB",
  "java script": "JavaScript",
  javascripts: "JavaScript",
  typescript: "TypeScript",
  "type script": "TypeScript",
  tailwindcss: "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  "next js": "Next.js",
  nextjs: "Next.js",
  "next.js": "Next.js",
  "vue js": "Vue.js",
  vuejs: "Vue.js",
  "nuxt js": "Nuxt.js",
  nuxtjs: "Nuxt.js",
  "express js": "Express.js",
  expressjs: "Express.js",
  "express.js": "Express.js",
  "nestjs": "NestJS",
  "three js": "Three.js",
  threejs: "Three.js",
  "chart js": "Chart.js",
  chartjs: "Chart.js",
  "pwa": "PWA",
  "webpack": "Webpack",
  "vite": "Vite",
  "go": "Go",
  "golang": "Go",
  "postgres": "PostgreSQL",
  "postgresql": "PostgreSQL",
  "mysql": "MySQL",
  "sql server": "SQL Server",
  "sqlserver": "SQL Server",
  "graphql": "GraphQL",
  "rest api": "REST API",
  "restapis": "REST API",
  "docker": "Docker",
  "kubernetes": "Kubernetes",
  "k8s": "Kubernetes",
  "aws": "AWS",
  "amazon web services": "AWS",
  "azure": "Azure",
  "gcp": "Google Cloud",
  "google cloud platform": "Google Cloud",
  "firebase": "Firebase",
  "python": "Python",
  "java": "Java",
  "c++": "C++",
  "c sharp": "C#",
  "c#": "C#",
  "c": "C",
  "kotlin": "Kotlin",
  "swift": "Swift",
  "ruby": "Ruby",
  "rails": "Ruby on Rails",
  "ruby on rails": "Ruby on Rails",
  "php": "PHP",
  "laravel": "Laravel",
  "django": "Django",
  "flask": "Flask",
  "fastapi": "FastAPI",
  "rust": "Rust",
  "cobol": "COBOL",
  "scala": "Scala",
  "haskell": "Haskell",
  "r": "R",
  "matlab": "MATLAB",
  "tensorflow": "TensorFlow",
  "keras": "Keras",
  "pytorch": "PyTorch",
  "scikit-learn": "scikit-learn",
  "scikit learn": "scikit-learn",
  "pandas": "pandas",
  "numpy": "NumPy",
  "jupyter": "Jupyter",
  "jenkins": "Jenkins",
  "ci/cd": "CI/CD",
  "git": "Git",
  "github": "GitHub",
  "gitlab": "GitLab",
  "bitbucket": "Bitbucket",
  "jira": "Jira",
  "confluence": "Confluence",
  "figma": "Figma",
  "sketch": "Sketch",
  "adobe xd": "Adobe XD",
  "photoshop": "Photoshop",
  "illustrator": "Illustrator",
  "blender": "Blender",
  "unity": "Unity",
  "unreal engine": "Unreal Engine",
  "unreal": "Unreal Engine",
  "html5": "HTML5",
  "css3": "CSS3",
  "sass": "Sass",
  "scss": "SCSS",
  "less": "Less",
  "bootstrap": "Bootstrap",
  "tailwind": "Tailwind CSS",
  "material ui": "Material UI",
  "material-ui": "Material UI",
  "mui": "Material UI",
  "chakra ui": "Chakra UI",
  "ant design": "Ant Design",
  "antd": "Ant Design",
  "redux": "Redux",
  "redux toolkit": "Redux Toolkit",
  "zustand": "Zustand",
  "react query": "React Query",
  "react-query": "React Query",
  "nextauth": "NextAuth.js",
  "next auth": "NextAuth.js",
  "prisma": "Prisma",
  "sequelize": "Sequelize",
  "typeorm": "TypeORM",
  "mongoose": "Mongoose",
  "redis": "Redis",
  "elasticsearch": "Elasticsearch",
  "rabbitmq": "RabbitMQ",
  "kafka": "Apache Kafka",
  "nginx": "Nginx",
  "web sockets": "WebSockets",
  "websockets": "WebSockets",
  "socket.io": "Socket.io",
  "microservices": "Microservices",
  "micro services": "Microservices",
  "machine learning": "Machine Learning",
  "ml": "Machine Learning",
  "deep learning": "Deep Learning",
  "nlp": "NLP",
  "computer vision": "Computer Vision",
  "data science": "Data Science",
  "data engineering": "Data Engineering",
  "data analysis": "Data Analysis",
  "data structures": "Data Structures",
  "algorithms": "Algorithms",
  "ai": "AI",
  "artificial intelligence": "AI",
  "generative ai": "Generative AI",
  "llm": "LLM",
  "large language models": "LLM",
  "langchain": "LangChain",
  "openai": "OpenAI",
  "chatgpt": "OpenAI",
  "hugging face": "Hugging Face",
  "transformers": "Transformers",
  "rag": "RAG",
  "prompt engineering": "Prompt Engineering",
  "responsive design": "Responsive Design",
  "ui design": "UI Design",
  "ux design": "UX Design",
  "ux/ui": "UI/UX Design",
  "ui/ux": "UI/UX Design",
  "user research": "User Research",
  "wireframing": "Wireframing",
  "prototyping": "Prototyping",
  "design thinking": "Design Thinking",
  "design systems": "Design Systems",
  "product design": "Product Design",
  "graphic design": "Graphic Design",
  "agile": "Agile",
  "scrum": "Scrum",
  "kanban": "Kanban",
  "saas": "SaaS",
  "e-commerce": "E-commerce",
  "seo": "SEO",
  "a/b testing": "A/B Testing",
  "unit testing": "Unit Testing",
  "testing": "Testing",
  "jest": "Jest",
  "cypress": "Cypress",
  "playwright": "Playwright",
  "selenium": "Selenium",
  "postman": "Postman",
  "swagger": "Swagger",
  "openapi": "OpenAPI",
  "figma tokens": "Figma Tokens",
};

const MONTH_ALIASES: Record<string, string> = {
  jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun",
  jul: "Jul", aug: "Aug", sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec",
  january: "Jan", february: "Feb", march: "Mar", april: "Apr", june: "Jun",
  july: "Jul", august: "Aug", september: "Sep", october: "Oct", november: "Nov",
  december: "Dec",
};

function titleCase(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => (word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ")
    .replace(/\b(Ai|Api|Ui|Ux|Seo|Ci|Cd)\b/g, (m) => m.toUpperCase());
}

export function normalizeTechnology(tech: string): string {
  const trimmed = tech.trim().toLowerCase();
  const alias = TECH_ALIASES[trimmed];
  if (alias) return alias;
  return titleCase(tech);
}

function normalizeDate(date?: string): string | undefined {
  if (!date) return undefined;
  const trimmed = date.trim();
  if (!trimmed) return undefined;

  const parsed = trimmed.toLowerCase();
  const yearMatch = parsed.match(/(\d{4})/);
  const year = yearMatch ? yearMatch[1] : null;
  const monthMatch = parsed.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)/);
  const month = monthMatch ? MONTH_ALIASES[monthMatch[1]] : null;

  if (month && year) return `${month} ${year}`;
  if (year) return year;
  return trimmed;
}

function mergeSkillGroups(groups: ResumeSkillGroup[]): ResumeSkillGroup[] {
  const grouped = new Map<string, Map<string, string>>();
  const order: string[] = [];

  for (const group of groups) {
    const key = group.name.trim().toLowerCase();
    if (!grouped.has(key)) {
      grouped.set(key, new Map());
      order.push(group.name.trim());
    }
    const bucket = grouped.get(key)!;
    for (const skill of group.skills) {
      const normalized = normalizeTechnology(skill);
      const skey = normalized.toLowerCase();
      if (!bucket.has(skey)) bucket.set(skey, normalized);
    }
  }

  return order.map((name) => {
    const bucket = grouped.get(name.toLowerCase())!;
    return { name, skills: Array.from(bucket.values()) };
  });
}

function mergeFlatSkills(skills: string[]): string[] {
  const seen = new Map<string, string>();
  for (const skill of skills) {
    const normalized = normalizeTechnology(skill);
    const key = normalized.toLowerCase();
    if (!seen.has(key)) seen.set(key, normalized);
  }
  return Array.from(seen.values());
}

function mergeTechnologies(technologies: string[], groups: ResumeSkillGroup[]): string[] {
  const all = mergeFlatSkills([
    ...technologies,
    ...groups.flatMap((g) => g.skills),
  ]);
  return all.filter((t) => !t.toLowerCase().match(/^(experience|skills?|technologies?|tools?)$/));
}

function mergeCompanies<T extends { company: string }>(items: T[]): T[] {
  const merged = new Map<string, T>();
  for (const item of items) {
    const key = item.company.trim().toLowerCase();
    const existing = merged.get(key);
    if (existing) {
      merged.set(key, {
        ...existing,
        ...item,
        highlights: [
          ...((existing as { highlights?: string[] }).highlights ?? []),
          ...((item as { highlights?: string[] }).highlights ?? []),
        ],
        description:
          ((existing as { description?: string }).description) ||
          ((item as { description?: string }).description),
      });
    } else {
      merged.set(key, item);
    }
  }
  return Array.from(merged.values());
}

function mergeKeyed<T>(items: T[], keyFn: (t: T) => string): T[] {
  const merged = new Map<string, T>();
  for (const item of items) {
    const key = keyFn(item).trim().toLowerCase();
    const existing = merged.get(key);
    if (existing) {
      merged.set(key, {
        ...existing,
        ...item,
        description:
          ((existing as { description?: string }).description) ||
          ((item as { description?: string }).description),
      });
    } else {
      merged.set(key, item);
    }
  }
  return Array.from(merged.values());
}

export interface NormalizeReport {
  resume: ResumeJSON;
  mergedSkills: number;
  mergedCompanies: number;
  normalizedTech: number;
  dateNormalized: number;
}

export function normalizeResume(resume: ResumeJSON): NormalizeReport {
  let mergedSkills = 0;
  let mergedCompanies = 0;
  let normalizedTech = 0;
  let dateNormalized = 0;

  const beforeSkillCount = resume.skills.reduce((acc, g) => acc + g.skills.length, 0) + resume.technologies.length;
  const mergedGroups = mergeSkillGroups(resume.skills);
  const mergedTech = mergeTechnologies(resume.technologies, resume.skills);
  const afterSkillCount = mergedGroups.reduce((acc, g) => acc + g.skills.length, 0) + mergedTech.length;
  mergedSkills = beforeSkillCount - afterSkillCount;

  const normalizedGroups = mergedGroups.map((g) => ({
    name: g.name,
    skills: g.skills.map((s) => {
      const n = normalizeTechnology(s);
      if (n !== s) normalizedTech++;
      return n;
    }),
  }));

  const normalizedTechList = mergedTech.map((t) => {
    const n = normalizeTechnology(t);
    if (n !== t) normalizedTech++;
    return n;
  });

  const dedupTech = mergeFlatSkills(normalizedTechList);
  normalizedTech += normalizedTechList.length - dedupTech.length;

  const companiesBefore = resume.experience.map((e) => e.company.trim().toLowerCase()).length;
  const mergedExperience = mergeCompanies(resume.experience.map((e) => ({
    ...e,
    startDate: normalizeDate(e.startDate) ?? e.startDate,
    endDate: normalizeDate(e.endDate) ?? e.endDate,
  })));
  const companiesAfter = new Set(mergedExperience.map((e) => e.company.trim().toLowerCase())).size;
  mergedCompanies = companiesBefore - companiesAfter;

  for (const exp of mergedExperience) {
    if (exp.startDate !== undefined && exp.startDate !== (exp.startDate && normalizeDate(exp.startDate))) dateNormalized++;
  }

  const volunteerBefore = resume.volunteerExperience.length;
  const mergedVolunteer = mergeKeyed(
    resume.volunteerExperience.map((v) => ({
      ...v,
      startDate: normalizeDate(v.startDate) ?? v.startDate,
      endDate: normalizeDate(v.endDate) ?? v.endDate,
    })),
    (v) => v.organization
  );
  mergedCompanies += volunteerBefore - mergedVolunteer.length;

  const orgBefore = resume.organizations.length;
  const mergedOrganizations = mergeKeyed(
    resume.organizations.map((o) => ({
      ...o,
      startDate: normalizeDate(o.startDate) ?? o.startDate,
      endDate: normalizeDate(o.endDate) ?? o.endDate,
    })),
    (o) => o.name
  );
  mergedCompanies += orgBefore - mergedOrganizations.length;

  return {
    resume: {
      ...resume,
      skills: normalizedGroups,
      technologies: dedupTech,
      experience: mergedExperience,
      volunteerExperience: mergedVolunteer,
      organizations: mergedOrganizations,
      projects: resume.projects.map((p) => ({
        ...p,
        technologies: mergeFlatSkills((p.technologies ?? []).map((t) => normalizeTechnology(t))),
      })),
      courses: mergeFlatSkills(resume.courses),
      interests: mergeFlatSkills(resume.interests),
    },
    mergedSkills: Math.max(0, mergedSkills),
    mergedCompanies: Math.max(0, mergedCompanies),
    normalizedTech,
    dateNormalized,
  };
}
