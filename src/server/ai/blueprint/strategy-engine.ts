import type { AIContextObject } from "../intelligence/types";

export interface PortfolioStrategy {
  goal: string;
  personalBranding: string;
  targetAudience: string;
  hiringFocus: boolean;
  businessFocus: boolean;
  visualStorytelling: boolean;
  ctaStrategy: string;
  contentPriority: string[];
}

const PROFESSION_GOALS: Record<string, { goal: string; branding: string; cta: string; priorities: string[] }> = {
  "developer": {
    goal: "Demonstrate technical expertise and project capabilities",
    branding: "Technical proficiency and problem-solving ability",
    cta: "View my projects and get in touch",
    priorities: ["skills", "projects", "experience", "about"],
  },
  "fullstack-developer": {
    goal: "Showcase end-to-end development capabilities",
    branding: "Versatile full-stack expertise",
    cta: "Let's build something together",
    priorities: ["projects", "skills", "experience", "about"],
  },
  "frontend-developer": {
    goal: "Display UI/UX skills and visual design capability",
    branding: "Pixel-perfect frontend craftsmanship",
    cta: "See my work in action",
    priorities: ["projects", "skills", "gallery", "about"],
  },
  "backend-developer": {
    goal: "Highlight system design and API expertise",
    branding: "Scalable architecture specialist",
    cta: "Discuss your next project",
    priorities: ["skills", "projects", "experience", "about"],
  },
  "ai-engineer": {
    goal: "Showcase AI/ML projects and research",
    branding: "AI innovation and practical ML applications",
    cta: "Explore my research and projects",
    priorities: ["projects", "skills", "research", "about"],
  },
  "ml-engineer": {
    goal: "Demonstrate machine learning implementation skills",
    branding: "ML systems that solve real problems",
    cta: "View my ML projects",
    priorities: ["projects", "skills", "experience", "about"],
  },
  "data-scientist": {
    goal: "Present analytical skills and data projects",
    branding: "Data-driven insights and solutions",
    cta: "See my analysis work",
    priorities: ["projects", "skills", "experience", "about"],
  },
  "ui-designer": {
    goal: "Showcase design portfolio and visual creativity",
    branding: "Design thinking and visual excellence",
    cta: "View my design portfolio",
    priorities: ["gallery", "projects", "about", "testimonials"],
  },
  "ux-designer": {
    goal: "Present user research and design process",
    branding: "User-centered design approach",
    cta: "See my case studies",
    priorities: ["projects", "case-studies", "about", "testimonials"],
  },
  "product-designer": {
    goal: "Demonstrate end-to-end product thinking",
    branding: "Design that drives business results",
    cta: "Explore my product work",
    priorities: ["projects", "case-studies", "about", "process"],
  },
  "photographer": {
    goal: "Display photography portfolio visually",
    branding: "Visual storytelling through photography",
    cta: "Book a session or view galleries",
    priorities: ["gallery", "collections", "about", "contact"],
  },
  "architect": {
    goal: "Present architectural projects and vision",
    branding: "Innovative architectural design",
    cta: "Discuss your project",
    priorities: ["projects", "gallery", "about", "contact"],
  },
  "agency": {
    goal: "Attract clients and showcase team capabilities",
    branding: "Full-service creative agency",
    cta: "Start your project with us",
    priorities: ["services", "projects", "team", "contact"],
  },
  "startup": {
    goal: "Attract investors and early customers",
    branding: "Innovation and market opportunity",
    cta: "Join our journey",
    priorities: ["about", "products", "team", "contact"],
  },
  "freelancer": {
    goal: "Attract new clients and projects",
    branding: "Reliable freelance professional",
    cta: "Hire me for your project",
    priorities: ["services", "projects", "testimonials", "contact"],
  },
  "student": {
    goal: "Land internships and entry-level positions",
    branding: "Ambitious learner with practical skills",
    cta: "View my projects and resume",
    priorities: ["projects", "skills", "education", "about"],
  },
  "creator": {
    goal: "Build personal brand and audience",
    branding: "Creative content creator",
    cta: "Follow my journey",
    priorities: ["about", "projects", "gallery", "contact"],
  },
  "writer": {
    goal: "Showcase writing portfolio and publications",
    branding: "Compelling storytelling and expertise",
    cta: "Read my work",
    priorities: ["blog", "publications", "about", "contact"],
  },
  "musician": {
    goal: "Display music portfolio and upcoming events",
    branding: "Musical artistry and performances",
    cta: "Listen and connect",
    priorities: ["gallery", "events", "about", "contact"],
  },
};

const AUDIENCE_STRATEGIES: Record<string, string> = {
  "Potential clients": "Focus on services, testimonials, and clear CTAs for hiring",
  "Potential employers": "Highlight skills, experience, and project depth",
  "Recruiters": "Emphasize technical skills, career progression, and quick overview",
  "Investors": "Focus on traction, team, market opportunity, and vision",
};

export function planStrategy(context: AIContextObject): PortfolioStrategy {
  const professionData = PROFESSION_GOALS[context.profession] ?? PROFESSION_GOALS["developer"];
  const audience = context.intent.targetAudience ?? "General audience";
  const audienceStrategy = AUDIENCE_STRATEGIES[audience] ?? "Present work clearly with strong CTAs";

  const hiringFocus = ["developer", "fullstack-developer", "frontend-developer", "backend-developer",
    "ai-engineer", "ml-engineer", "data-scientist", "mobile-developer", "devops-engineer",
    "student", "freelancer"].includes(context.profession);

  const businessFocus = ["agency", "startup", "consultant"].includes(context.profession);

  const visualStorytelling = ["ui-designer", "ux-designer", "product-designer", "graphic-designer",
    "photographer", "architect", "creative", "gallery"].includes(context.profession) ||
    context.designLanguage.some((d) => ["gallery", "creative", "editorial", "magazine"].includes(d.name));

  const contentPriority = professionData.priorities;

  return {
    goal: context.intent.portfolioGoal || professionData.goal,
    personalBranding: professionData.branding,
    targetAudience: `${audience}: ${audienceStrategy}`,
    hiringFocus,
    businessFocus,
    visualStorytelling,
    ctaStrategy: professionData.cta,
    contentPriority,
  };
}
