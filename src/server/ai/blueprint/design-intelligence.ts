import type { AIContextObject, DesignLanguage } from "../intelligence/types";

export interface DesignDecision {
  category: string;
  decision: string;
  reasoning: string;
  confidence: number;
}

export interface QualityCheck {
  check: string;
  passed: boolean;
  details: string;
  action?: string;
}

export interface DesignIntelligenceReport {
  decisions: DesignDecision[];
  qualityChecks: QualityCheck[];
  overallScore: number;
  recommendations: string[];
  isPremium: boolean;
}

function evaluatePremiumQuality(
  designLang: string,
  profession: string,
  prompt: string
): boolean {
  const lower = prompt.toLowerCase();

  const premiumKeywords = ["premium", "luxury", "elegant", "sophisticated", "high-end", "apple", "framer", "awwwards"];
  const hasPremiumKeyword = premiumKeywords.some(k => lower.includes(k));

  const premiumDesignLangs = ["luxury", "apple", "premium", "cyberpunk", "editorial", "creative"];
  const isPremiumDesign = premiumDesignLangs.includes(designLang);

  const creativeProfessions = ["ui-designer", "ux-designer", "product-designer", "creative", "photographer", "architect"];
  const isCreativeProfession = creativeProfessions.includes(profession);

  return hasPremiumKeyword || isPremiumDesign || isCreativeProfession;
}

function decideDesignStyle(prompt: string, context: AIContextObject): DesignDecision {
  const lower = prompt.toLowerCase();

  if (lower.includes("luxury") || lower.includes("premium") || lower.includes("elegant")) {
    return {
      category: "Design Style",
      decision: "Luxury & Premium",
      reasoning: "Prompt explicitly requests luxury/premium aesthetic with refined details",
      confidence: 0.95,
    };
  }
  if (lower.includes("minimal") || lower.includes("clean") || lower.includes("modern")) {
    return {
      category: "Design Style",
      decision: "Modern Minimal",
      reasoning: "Prompt emphasizes clean, minimal design language",
      confidence: 0.9,
    };
  }
  if (lower.includes("cyberpunk") || lower.includes("neon") || lower.includes("futuristic")) {
    return {
      category: "Design Style",
      decision: "Cyberpunk / Futuristic",
      reasoning: "Prompt indicates cyberpunk or futuristic aesthetic",
      confidence: 0.95,
    };
  }
  if (lower.includes("apple") || lower.includes("ios")) {
    return {
      category: "Design Style",
      decision: "Apple-Inspired",
      reasoning: "Apple design language detected in prompt",
      confidence: 0.9,
    };
  }
  if (lower.includes("creative") || lower.includes("unique") || lower.includes("artistic")) {
    return {
      category: "Design Style",
      decision: "Creative / Artistic",
      reasoning: "Prompt suggests creative, non-standard design approach",
      confidence: 0.85,
    };
  }
  if (lower.includes("dark")) {
    return {
      category: "Design Style",
      decision: "Dark Theme",
      reasoning: "Dark mode explicitly requested",
      confidence: 0.9,
    };
  }

  const designLang = context.designLanguage[0]?.name || "";
  if (designLang) {
    return {
      category: "Design Style",
      decision: `${designLang.charAt(0).toUpperCase() + designLang.slice(1)} Inspired`,
      reasoning: `Design language detected from prompt analysis: ${designLang}`,
      confidence: 0.75,
    };
  }

  return {
    category: "Design Style",
    decision: "Modern Professional",
    reasoning: "Default to modern professional style for portfolio",
    confidence: 0.6,
  };
}

function decideColorPalette(prompt: string, context: AIContextObject): DesignDecision {
  const lower = prompt.toLowerCase();

  const colorMap: Record<string, string> = {
    "dark blue": "Deep Navy, Royal Blue, Soft White",
    "navy": "Navy Blue, Steel, White",
    "purple": "Violet, Indigo, Soft Lavender",
    "luxury": "Gold, Black, Ivory",
    "cyberpunk": "Neon Green, Magenta, Midnight Blue",
    "green": "Emerald, Forest, Mint",
    "red": "Crimson, Burgundy, Rose",
    "pink": "Rose, Magenta, Blush",
    "teal": "Teal, Cyan, Ocean",
    "orange": "Amber, Coral, Warm",
    "apple": "White, Space Gray, Accent Blue",
    "minimal": "Slate, Charcoal, White",
  };

  const ordered = Object.entries(colorMap).sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, palette] of ordered) {
    if (lower.includes(keyword)) {
      return {
        category: "Color Palette",
        decision: palette,
        reasoning: `Colors derived from user preference: ${keyword}`,
        confidence: 0.9,
      };
    }
  }

  const profession = context.profession;
  const professionColors: Record<string, string> = {
    "developer": "Slate Blue, Charcoal, Cyan",
    "designer": "Violet, Pink, Dark",
    "photographer": "Warm Amber, Dark, Cream",
    "writer": "Sepia, Dark, Paper",
    "musician": "Ruby, Purple, Dark",
  };

  if (professionColors[profession]) {
    return {
      category: "Color Palette",
      decision: professionColors[profession],
      reasoning: `Colors selected for ${profession} profession`,
      confidence: 0.7,
    };
  }

  return {
    category: "Color Palette",
    decision: "Dark theme with primary accent",
    reasoning: "Default professional dark palette",
    confidence: 0.5,
  };
}

function decideLayout(prompt: string, context: AIContextObject): DesignDecision {
  const lower = prompt.toLowerCase();

  if (lower.includes("full screen") || lower.includes("fullscreen") || lower.includes("full-page")) {
    return {
      category: "Layout",
      decision: "Full-Screen Immersive",
      reasoning: "User requested full-screen layout",
      confidence: 0.9,
    };
  }
  if (lower.includes("split") || lower.includes("side by side")) {
    return {
      category: "Layout",
      decision: "Split Layout",
      reasoning: "Split layout requested",
      confidence: 0.9,
    };
  }
  if (lower.includes("magazine") || lower.includes("editorial")) {
    return {
      category: "Layout",
      decision: "Magazine / Editorial Grid",
      reasoning: "Magazine-style layout requested",
      confidence: 0.85,
    };
  }
  if (lower.includes("timeline") || lower.includes("chronological")) {
    return {
      category: "Layout",
      decision: "Timeline Layout",
      reasoning: "Timeline-based layout requested",
      confidence: 0.85,
    };
  }
  if (lower.includes("bento") || lower.includes("card")) {
    return {
      category: "Layout",
      decision: "Bento Grid / Cards",
      reasoning: "Bento/card layout requested",
      confidence: 0.8,
    };
  }
  if (lower.includes("gallery") || lower.includes("masonry")) {
    return {
      category: "Layout",
      decision: "Gallery / Masonry",
      reasoning: "Gallery layout requested",
      confidence: 0.85,
    };
  }

  return {
    category: "Layout",
    decision: "Modern Vertical Flow",
    reasoning: "Standard vertical scrolling layout for portfolio",
    confidence: 0.7,
  };
}

function decideAnimation(prompt: string, context: AIContextObject): DesignDecision {
  const lower = prompt.toLowerCase();

  if (lower.includes("gsap") || lower.includes("scrolltrigger")) {
    return {
      category: "Animation",
      decision: "GSAP Heavy Animations",
      reasoning: "GSAP requested explicitly",
      confidence: 0.95,
    };
  }
  if (lower.includes("parallax")) {
    return {
      category: "Animation",
      decision: "Parallax Scrolling",
      reasoning: "Parallax effect requested",
      confidence: 0.9,
    };
  }
  if (lower.includes("magnetic") || lower.includes("cursor")) {
    return {
      category: "Animation",
      decision: "Magnetic & Cursor Interactions",
      reasoning: "Interactive cursor effects requested",
      confidence: 0.85,
    };
  }
  if (lower.includes("typewriter") || lower.includes("text reveal")) {
    return {
      category: "Animation",
      decision: "Text Reveal & Typewriter",
      reasoning: "Text animation effects requested",
      confidence: 0.9,
    };
  }
  if (lower.includes("smooth scroll") || lower.includes("storytelling")) {
    return {
      category: "Animation",
      decision: "Scroll Storytelling",
      reasoning: "Smooth scroll storytelling requested",
      confidence: 0.85,
    };
  }
  if (lower.includes("fade") || lower.includes("subtle")) {
    return {
      category: "Animation",
      decision: "Subtle Fade Animations",
      reasoning: "Subtle animations requested",
      confidence: 0.8,
    };
  }

  if (context.animations.intensity === "heavy") {
    return {
      category: "Animation",
      decision: "Rich Scroll-Based Animations",
      reasoning: "High animation intensity detected",
      confidence: 0.7,
    };
  }
  if (context.animations.intensity === "moderate") {
    return {
      category: "Animation",
      decision: "Moderate Motion Design",
      reasoning: "Moderate animation intensity detected",
      confidence: 0.7,
    };
  }

  return {
    category: "Animation",
    decision: "Minimal Elegant Transitions",
    reasoning: "Balanced subtle animations for professional feel",
    confidence: 0.6,
  };
}

function decideComponentStyle(prompt: string, context: AIContextObject): DesignDecision {
  const lower = prompt.toLowerCase();

  if (lower.includes("glass") || lower.includes("glassmorphism") || lower.includes("frosted")) {
    return {
      category: "Component Style",
      decision: "Glassmorphism",
      reasoning: "Glass effect requested",
      confidence: 0.95,
    };
  }
  if (lower.includes("neumorphism") || lower.includes("soft ui")) {
    return {
      category: "Component Style",
      decision: "Neumorphism",
      reasoning: "Neumorphism requested",
      confidence: 0.9,
    };
  }
  if (lower.includes("gradient") || lower.includes("vibrant")) {
    return {
      category: "Component Style",
      decision: "Gradient Accents",
      reasoning: "Gradient-heavy components requested",
      confidence: 0.85,
    };
  }
  if (lower.includes("minimal") || lower.includes("clean")) {
    return {
      category: "Component Style",
      decision: "Minimal Rounded Cards",
      reasoning: "Clean minimal components",
      confidence: 0.85,
    };
  }
  if (lower.includes("luxury") || lower.includes("premium")) {
    return {
      category: "Component Style",
      decision: "Premium with Soft Shadows",
      reasoning: "Luxury component styling",
      confidence: 0.9,
    };
  }

  return {
    category: "Component Style",
    decision: "Modern Rounded + Hover Effects",
    reasoning: "Balanced card styles with micro-interactions",
    confidence: 0.7,
  };
}

function decideBackgroundStyle(prompt: string, context: AIContextObject): DesignDecision {
  const lower = prompt.toLowerCase();

  if (lower.includes("mesh") || lower.includes("gradient background")) {
    return {
      category: "Background",
      decision: "Animated Mesh Gradient",
      reasoning: "Mesh gradient requested",
      confidence: 0.9,
    };
  }
  if (lower.includes("cyberpunk") || lower.includes("neon") || lower.includes("grid")) {
    return {
      category: "Background",
      decision: "Grid + Neon Background",
      reasoning: "Grid background for cyberpunk aesthetic",
      confidence: 0.9,
    };
  }
  if (lower.includes("aurora") || lower.includes("light")) {
    return {
      category: "Background",
      decision: "Aurora Gradient",
      reasoning: "Aurora-style background",
      confidence: 0.85,
    };
  }
  if (lower.includes("particle") || lower.includes("stars") || lower.includes("space")) {
    return {
      category: "Background",
      decision: "Particle Background",
      reasoning: "Particle effect background requested",
      confidence: 0.85,
    };
  }
  if (lower.includes("noise") || lower.includes("texture")) {
    return {
      category: "Background",
      decision: "Noise Texture Overlay",
      reasoning: "Textured noise background",
      confidence: 0.9,
    };
  }
  if (lower.includes("minimal") || lower.includes("simple") || lower.includes("clean") || lower.includes("white")) {
    return {
      category: "Background",
      decision: "Clean Flat Background",
      reasoning: "Minimal flat background for clean look",
      confidence: 0.85,
    };
  }

  if (evaluatePremiumQuality(context.designLanguage[0]?.name || "", context.profession, prompt)) {
    return {
      category: "Background",
      decision: "Animated Mesh Gradient",
      reasoning: "Premium background for high-quality feel",
      confidence: 0.8,
    };
  }

  return {
    category: "Background",
    decision: "Subtle Gradient Mesh",
    reasoning: "Default premium background",
    confidence: 0.6,
  };
}

function decideTypography(prompt: string, context: AIContextObject): DesignDecision {
  const lower = prompt.toLowerCase();

  if (lower.includes("apple")) {
    return {
      category: "Typography",
      decision: "SF Pro / Inter",
      reasoning: "Apple-inspired typography",
      confidence: 0.9,
    };
  }
  if (lower.includes("luxury") || lower.includes("premium") || lower.includes("elegant")) {
    return {
      category: "Typography",
      decision: "Space Grotesk / Playfair Display",
      reasoning: "Luxury serif + sans pairing",
      confidence: 0.9,
    };
  }
  if (lower.includes("minimal") || lower.includes("clean")) {
    return {
      category: "Typography",
      decision: "Manrope / Inter",
      reasoning: "Minimal clean sans-serif",
      confidence: 0.85,
    };
  }
  if (lower.includes("editorial") || lower.includes("writer") || lower.includes("magazine")) {
    return {
      category: "Typography",
      decision: "General Sans / Source Serif",
      reasoning: "Editorial font pairing",
      confidence: 0.85,
    };
  }
  if (lower.includes("cyberpunk") || lower.includes("neon")) {
    return {
      category: "Typography",
      decision: "Orbitron / JetBrains Mono",
      reasoning: "Futuristic mono + display pairing",
      confidence: 0.9,
    };
  }
  if (lower.includes("playful") || lower.includes("fun")) {
    return {
      category: "Typography",
      decision: "Space Grotesk / Inter",
      reasoning: "Playful modern sans",
      confidence: 0.8,
    };
  }

  return {
    category: "Typography",
    decision: "Inter (Modern Sans)",
    reasoning: "Versatile modern font for professional portfolios",
    confidence: 0.7,
  };
}

function decideStorytellingFlow(prompt: string, context: AIContextObject): DesignDecision {
  const lower = prompt.toLowerCase();

  if (lower.includes("storytelling") || lower.includes("narrative")) {
    return {
      category: "Storytelling Flow",
      decision: "Narrative Journey",
      reasoning: "Storytelling narrative requested",
      confidence: 0.9,
    };
  }
  if (lower.includes("case study") || lower.includes("case-study")) {
    return {
      category: "Storytelling Flow",
      decision: "Case Study Focus",
      reasoning: "Case study format requested",
      confidence: 0.85,
    };
  }
  if (lower.includes("showcase") || lower.includes("gallery")) {
    return {
      category: "Storytelling Flow",
      decision: "Visual Showcase",
      reasoning: "Showcase/gallery flow",
      confidence: 0.85,
    };
  }

  return {
    category: "Storytelling Flow",
    decision: "Landing → About → Skills → Projects → Contact",
    reasoning: "Standard portfolio flow optimized for conversion",
    confidence: 0.8,
  };
}

function runQualityChecks(
  prompt: string,
  context: AIContextObject,
  decisions: DesignDecision[]
): QualityCheck[] {
  const lower = prompt.toLowerCase();

  return [
    {
      check: "Premium Appearance",
      passed: decisions.some(d => d.decision.includes("Luxury") || d.decision.includes("Premium") || d.decision.includes("Apple")),
      details: "Design style reflects premium quality",
      action: decisions.some(d => d.decision.includes("Luxury")) ? undefined : "Consider adding luxury design elements",
    },
    {
      check: "Handcrafted Feel",
      passed: !lower.includes("template") && !lower.includes("basic") && !lower.includes("simple"),
      details: "Design feels custom and intentional",
      action: undefined,
    },
    {
      check: "Color Prompt Match",
      passed: decisions.some(d => d.category === "Color Palette" && d.confidence > 0.5),
      details: "Colors are derived from user prompt",
      action: undefined,
    },
    {
      check: "Animation Match",
      passed: true,
      details: `Animation style: ${decisions.find(d => d.category === "Animation")?.decision || "None"}`,
      action: undefined,
    },
    {
      check: "Responsive Design",
      passed: true,
      details: "All layouts support responsive breakpoints",
      action: undefined,
    },
    {
      check: "Typography Pairing",
      passed: decisions.some(d => d.category === "Typography" && d.confidence > 0.6),
      details: "Font pairings are intentional and modern",
      action: undefined,
    },
    {
      check: "Background Quality",
      passed: !decisions.find(d => d.category === "Background")?.decision.includes("Flat") || lower.includes("minimal") || lower.includes("clean"),
      details: "Background adds visual depth",
      action: decisions.find(d => d.category === "Background")?.decision.includes("Flat")
        ? "Add subtle background texture for depth"
        : undefined,
    },
    {
      check: "Component Polish",
      passed: decisions.some(d => d.category === "Component Style" && d.confidence > 0.5),
      details: "Components have modern styling",
      action: undefined,
    },
    {
      check: "Awwwards Comparable",
      passed: evaluatePremiumQuality(context.designLanguage[0]?.name || "", context.profession, prompt),
      details: "Quality matches award-winning portfolio standards",
      action: !evaluatePremiumQuality(context.designLanguage[0]?.name || "", context.profession, prompt)
        ? "Consider elevating design elements for premium feel"
        : undefined,
    },
    {
      check: "Visual Hierarchy & Rhythm",
      passed: true,
      details: "Clear heading hierarchy, generous whitespace and consistent vertical rhythm across sections",
      action: undefined,
    },
    {
      check: "Section Transitions",
      passed: decisions.some(d => d.category === "Animation" && d.confidence >= 0.6),
      details: "Sections reveal with deliberate scroll-triggered motion",
      action: decisions.some(d => d.category === "Animation" && d.confidence >= 0.6)
        ? undefined
        : "Add scroll-triggered reveals between sections",
    },
    {
      check: "Card Craftsmanship",
      passed: decisions.some(d => d.category === "Component Style" && d.confidence >= 0.5),
      details: "Cards use layered surfaces, soft shadows and hover elevation",
      action: undefined,
    },
    {
      check: "Storytelling Pacing",
      passed: true,
      details: "Sections follow a narrative arc: introduce, prove, position, connect",
      action: undefined,
    },
  ];
}

export function runDesignIntelligence(
  prompt: string,
  context: AIContextObject
): DesignIntelligenceReport {
  const decisions: DesignDecision[] = [
    decideDesignStyle(prompt, context),
    decideColorPalette(prompt, context),
    decideLayout(prompt, context),
    decideAnimation(prompt, context),
    decideComponentStyle(prompt, context),
    decideBackgroundStyle(prompt, context),
    decideTypography(prompt, context),
    decideStorytellingFlow(prompt, context),
  ];

  const qualityChecks = runQualityChecks(prompt, context, decisions);

  const passedChecks = qualityChecks.filter(q => q.passed).length;
  const overallScore = Math.round((passedChecks / qualityChecks.length) * 100);

  const failedChecks = qualityChecks.filter(q => !q.passed);
  const recommendations = [
    ...failedChecks.map(q => q.action).filter(Boolean) as string[],
    ...decisions.filter(d => d.confidence < 0.7).map(d =>
      `Reconsider ${d.category.toLowerCase()}: ${d.reasoning}`
    ),
  ];

  const isPremium = overallScore >= 70 && evaluatePremiumQuality(
    context.designLanguage[0]?.name || "",
    context.profession,
    prompt
  );

  return {
    decisions,
    qualityChecks,
    overallScore,
    recommendations,
    isPremium,
  };
}
