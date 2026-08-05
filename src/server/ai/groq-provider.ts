import type { AIProvider } from "./provider";
import type { PortfolioData } from "@/server/types";
import type { CompositionGraph } from "./composition/types";
import type { AIContextObject } from "./intelligence/types";
import { getEnv } from "@/server/config";
import { AIServiceError, logger } from "@/server/utils";

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 2000;
const TIMEOUT_MS = 60_000;
const MODEL = "llama-3.3-70b-versatile";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function getApiKey(): string {
  const env = getEnv();
  if (!env.GROQ_API_KEY) throw new AIServiceError("GROQ_API_KEY not configured");
  return env.GROQ_API_KEY;
}

function isRateLimitError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("429") || msg.includes("rate_limit") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota");
}

function parseRetryDelay(err: unknown): number | null {
  const msg = err instanceof Error ? err.message : String(err);
  const match = msg.match(/retry[_-]?after["\s:]+(\d+)/i);
  return match ? parseInt(match[1], 10) * 1000 : null;
}

async function chatCompletion(prompt: string, options: { temperature?: number; maxTokens?: number; jsonMode?: boolean } = {}): Promise<string> {
  const apiKey = getApiKey();
  const { temperature = 0.7, maxTokens = 8192, jsonMode = true } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const payload: Record<string, unknown> = {
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: maxTokens,
    };
    if (jsonMode) {
      payload.response_format = { type: "json_object" };
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new AIServiceError(`Groq API error ${response.status}: ${body}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new AIServiceError("Empty response from Groq");
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      logger.warn(`${label} attempt ${attempt}/${MAX_RETRIES} failed: ${lastError.message}`, "GroqProvider");

      if (attempt < MAX_RETRIES) {
        let waitMs: number;
        if (isRateLimitError(err)) {
          waitMs = parseRetryDelay(err) ?? Math.min(15000 * Math.pow(2, attempt - 1), 60000);
          logger.warn(`${label} rate limited, waiting ${Math.round(waitMs / 1000)}s before retry`, "GroqProvider");
        } else {
          waitMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        }
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }
  throw new AIServiceError(`${label} failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}

function extractJson(text: string): Record<string, unknown> {
  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned) as Record<string, unknown>;
}

function buildPortfolioPrompt(prompt: string): string {
  return `You are an expert React developer. Generate a complete portfolio website as a JSON object.

USER PROMPT: "${prompt}"

Return ONLY a valid JSON object (no markdown, no code fences, no explanations) with this exact structure:
{
  "personalInfo": {
    "name": "string",
    "role": "string",
    "tagline": "string",
    "bio": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "tech": ["string"]
  },
  "sections": {
    "hero": { "headline": "string", "subheadline": "string", "ctaText": "string", "ctaLink": "#projects" },
    "about": {
      "title": "About Me",
      "content": "string",
      "intro": "string",
      "highlights": ["string"],
      "strengths": [{ "label": "string", "detail": "string" }],
      "metrics": [{ "label": "string", "value": "string" }]
    },
    "skills": [{ "name": "string", "level": "advanced", "category": "string" }],
    "projects": [{ "title": "string", "description": "string", "tags": ["string"], "link": "string", "githubUrl": "string", "features": ["string"] }],
    "experience": [{ "company": "string", "role": "string", "startDate": "string", "endDate": "string", "description": "string", "highlights": ["string"], "technologies": ["string"] }],
    "education": [{ "institution": "string", "degree": "string", "field": "string", "startDate": "string", "endDate": "string", "achievements": ["string"] }],
    "achievements": [{ "title": "string", "description": "string", "metric": "string" }],
    "certifications": [{ "name": "string", "issuer": "string", "date": "string" }],
    "socialLinks": [{ "platform": "string", "url": "string" }],
    "contact": { "email": "string", "location": "string", "availableFor": "string" }
  },
  "theme": { "mode": "dark" },
  "layout": { "style": "minimal" },
  "navigation": { "links": [{ "label": "string", "href": "#section" }], "style": "pills" },
  "seo": { "title": "string", "description": "string", "keywords": ["string"] }
}

RULES (strict):
- FAITHFULLY EXTRACT: Use the user's EXACT name, role, email, skills, projects, experience, and education from the prompt. Never invent personal details.
- If the user provides specific skills/projects/experience, use them EXACTLY as given. Do not add fictional items.
- Only generate supplementary content (bio, about, tagline) that is consistent with the user's actual details.
- All strings must be meaningful and contextually relevant to the user's actual data.
- Return ONLY the JSON object, nothing else`;
}

function buildImprovePrompt(portfolioData: PortfolioData, instruction: string): string {
  return `You are an expert React developer. Modify the following portfolio JSON based on the instruction.

CURRENT PORTFOLIO DATA:
${JSON.stringify(portfolioData, null, 2)}

INSTRUCTION: "${instruction}"

Return the COMPLETE updated portfolio JSON object (same structure). Apply the instruction to modify the relevant parts. Return ONLY the JSON object, nothing else.`;
}

function buildRegeneratePrompt(portfolioData: PortfolioData, section: string, instruction?: string): string {
  return `You are an expert React developer. Regenerate the "${section}" section of this portfolio.

CURRENT PORTFOLIO DATA:
${JSON.stringify(portfolioData, null, 2)}

${instruction ? `ADDITIONAL INSTRUCTION: "${instruction}"` : "Generate fresh content for this section."}

Return the COMPLETE updated portfolio JSON object with the regenerated "${section}" section. Keep all other sections unchanged. Return ONLY the JSON object, nothing else.`;
}

function buildCompositionGraphPrompt(prompt: string, aiContext: AIContextObject): string {
  return `You are an expert, highly adaptive Portfolio Architect and Design Systems Lead. Analyze the USER PROMPT and AI CONTEXT to generate a dynamically tailored, architecturally unique CompositionGraph JSON object.

USER PROMPT: "${prompt}"

AI CONTEXT DETECTED:
- Profession: ${aiContext.profession}
- Theme: ${aiContext.theme}
- Design Language: ${aiContext.designLanguage.map(d => d.name).join(", ") || "inferred from prompt"}
- Animations: ${aiContext.animations.intensity}
- Suggested Sections: ${aiContext.sections.map(s => s.name).join(", ") || "autodetect"}

DYNAMIC DESIGN & STRUCTURE INSTRUCTIONS:
1. Profession-Centric Layout: Match layout dynamically to the domain.
   - Developers/DevOps -> "bento", "grid", or "dashboard"
   - Designers/Animators/Photographers -> "gallery", "masonry", "cinematic", "creative"
   - Writers/Journalists/Marketers -> "editorial", "magazine", "storytelling"
   - Executive/Corporate -> "minimal", "split", "portfolio-landing"
2. Dynamic Styling & Palette: Derive color tokens and typography that aesthetically match the user's domain and requested tone (e.g., Cyberpunk -> Neon/Dark; Luxury -> Serif/Gold Accents; Minimalist -> Clean Monochrome).
3. Contextual Section Hierarchy: Dynamically pick relevant sections (e.g., photographers get "gallery", engineers get "skills" and "projects", researchers get "publications").

VALID OPTIONS (pick from these — do NOT invent new values):

LAYOUT: "portfolio-landing", "split", "magazine", "editorial", "creative", "gallery", "timeline", "storytelling", "grid", "bento", "dashboard", "landing-sections", "minimal", "horizontal-scroll", "asymmetric", "cinematic", "newspaper", "card-stack", "immersive", "masonry"

NAVIGATION: "sticky", "floating", "transparent", "glass", "sidebar", "minimal", "hidden-scroll", "dock", "bottom", "pills", "underline", "magazine-toc", "none"

MOTION STYLE: "minimal", "apple", "editorial", "gsap-heavy", "physics", "scroll-storytelling", "parallax", "3d", "micro-interactions", "experimental", "none"

MOTION INTENSITY: "none", "subtle", "moderate", "heavy"

SECTION TYPES: "hero", "about", "projects", "skills", "experience", "education", "testimonials", "timeline", "gallery", "publications", "awards", "certifications", "openSource", "speaking", "community", "services", "clients", "products", "metrics", "faq", "roadmap", "contact", "socialLinks", "achievements", "articles", "experiments", "resume"

SECTION VARIANTS:
- hero: "centered", "split", "minimal", "typewriter", "glass", "animated-gradient", "full-screen"
- about: "split", "card", "minimal", "editorial", "asymmetric"
- projects: "card", "masonry", "showcase", "case-study", "horizontal-scroll", "bento", "magazine"
- skills: "pills", "bars", "icon-grid", "radar", "minimal", "bubble"
- experience: "timeline", "card", "minimal", "detailed", "compact"
- contact: "card", "split", "centered", "minimal", "glass"
- testimonials: "carousel", "card", "masonry", "minimal"
- gallery: "masonry", "grid", "lightbox", "carousel", "justified", "polaroid"
- services: "card", "list", "magazine", "bento"
- metrics: "counter", "animated", "minimal", "dashboard"
- faq: "accordion", "card", "minimal", "tabbed"
- default: "card", "minimal", "default"

THEME MODE: "dark", "light", "red", "futuristic"
RESPONSIVE STRATEGY: "mobile-first", "desktop-first", "adaptive", "fluid", "container-queries", "hybrid"
STORY FLOW: "linear", "narrative", "problem-journey-impact", "magazine", "editorial-grid", "timeline-scroll", "interactive-landing", "horizontal-journey", "cinematic-reveal", "modular-cards", "asymmetric-canvas", "newspaper-spread", "dark-to-light", "chronological", "portfolio-showcase", "case-study"

RETURN EXACTLY THIS JSON STRUCTURE:
{
  "prompt": "${prompt.replace(/"/g, '\\"')}",
  "aiContext": ${JSON.stringify(aiContext)},
  "blueprint": { "portfolioType": "...", "targetAudience": "...", "framework": "react", "language": "typescript", "styling": "tailwind", "designLanguage": [], "profession": "${aiContext.profession}", "theme": "${aiContext.theme}", "libraries": { "ui": "tailwind", "animation": "framer-motion", "icons": "lucide", "charts": "recharts" }, "folderStrategy": ["src/components", "src/sections", "src/lib", "src/hooks"], "layout": { "type": "LAYOUT_STYLE_HERE", "sectionHierarchy": [], "gridStrategy": "...", "containerWidth": "...", "verticalRhythm": "1.6" }, "navigation": { "variant": "NAV_STYLE_HERE", "sections": [], "position": "...", "mobileBehavior": "...", "scrollBehavior": "..." }, "sections": [], "animations": { "library": "framer-motion", "intensity": "INTENSITY_HERE", "enabled": true, "pageTransitions": false, "scrollAnimations": true, "microInteractions": true }, "content": { "intent": "...", "tone": "professional", "voice": "first-person", "storytelling": "STORY_FLOW_HERE", "sections": {} }, "seo": { "title": "...", "description": "...", "keywords": [], "canonical": "", "openGraph": { "title": "...", "description": "...", "image": "" }, "twitter": { "card": "summary_large_image", "title": "...", "description": "..." } }, "accessibility": { "level": "AA", "semanticHTML": true, "ariaLabels": true, "keyboardNavigation": true, "focusManagement": true, "reducedMotion": false, "colorContrast": true, "screenReader": true }, "performance": { "lazyLoading": true, "dynamicImports": true, "imageOptimization": true, "codeSplitting": true, "treeShaking": true, "prefetching": true, "bundleAnalysis": false }, "designSystem": { "tokens": { "colors": {}, "typography": { "heading": "...", "body": "..." }, "spacing": {}, "radius": {}, "shadows": {}, "animation": {}, "breakpoints": {} }, "components": {} }, "metadata": { "createdAt": "...", "version": "1.0.0", "confidence": 0.9, "uniqueness": 0.95 } },
  "layout": { "style": "LAYOUT_STYLE_HERE", "sectionOrder": [], "gridStrategy": "...", "containerWidth": "...", "verticalRhythm": "1.6", "sectionSpacing": "...", "padding": { "desktop": "...", "tablet": "...", "mobile": "..." }, "maxWidth": "...", "backgroundStrategy": "...", "visualHierarchy": [] },
  "sections": [ { "id": "hero", "name": "Hero", "componentName": "HeroSection", "type": "required", "storytellingRole": "...", "priority": 1, "variant": "VARIANT_HERE", "layout": "...", "interaction": "...", "animation": "...", "accessibility": "...", "responsive": { "desktop": "full", "tablet": "stacked", "mobile": "stacked-compact" }, "contentRequirements": [], "visualWeight": "primary", "metadata": {} } ],
  "navigation": { "style": "NAV_STYLE_HERE", "position": "...", "sections": [], "mobileBehavior": "...", "scrollBehavior": "...", "visualStyle": {}, "overlay": false, "transparent": false, "backdropFilter": "..." },
  "theme": { "mode": "THEME_MODE_HERE", "colors": { "primary": "#HEX", "secondary": "#HEX", "accent": "#HEX", "background": "#HEX", "surface": "#HEX", "surfaceElevated": "#HEX", "text": "#HEX", "textSecondary": "#HEX", "textMuted": "#HEX", "border": "#HEX", "borderSubtle": "#HEX", "success": "#22c55e", "warning": "#f59e0b", "error": "#ef4444", "info": "#3b82f6", "overlay": "rgba(0,0,0,0.8)" }, "typography": { "headingFont": "FONT_NAME", "bodyFont": "FONT_NAME", "monoFont": "'JetBrains Mono', monospace", "scale": { "xs": "0.75rem", "sm": "0.875rem", "base": "1rem", "lg": "1.125rem", "xl": "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem", "6xl": "3.75rem", "7xl": "4.5rem", "8xl": "6rem" }, "lineHeights": { "tight": "1.15", "snug": "1.3", "normal": "1.5", "relaxed": "1.625", "loose": "2" }, "letterSpacings": { "tighter": "-0.05em", "tight": "-0.025em", "normal": "0", "wide": "0.025em", "wider": "0.05em", "widest": "0.1em" }, "fontWeights": { "normal": 400, "medium": 500, "semibold": 600, "bold": 700, "extrabold": 800 } }, "spacing": { "0": "0", "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem", "6": "1.5rem", "8": "2rem", "10": "2.5rem", "12": "3rem", "16": "4rem", "20": "5rem", "24": "6rem", "32": "8rem" }, "radius": { "none": "0", "sm": "0.25rem", "md": "0.5rem", "lg": "0.75rem", "xl": "1rem", "2xl": "1.5rem", "full": "9999px" }, "shadows": { "sm": "0 1px 2px rgba(0,0,0,0.05)", "md": "0 4px 6px rgba(0,0,0,0.1)", "lg": "0 10px 15px rgba(0,0,0,0.1)", "xl": "0 20px 25px rgba(0,0,0,0.1)" }, "borders": { "thin": "1px solid", "medium": "2px solid", "thick": "3px solid" }, "transitionDurations": { "fast": "150ms", "normal": "300ms", "slow": "500ms", "slower": "700ms" }, "zIndex": { "base": 0, "dropdown": 10, "sticky": 20, "overlay": 30, "modal": 40, "popover": 50, "tooltip": 60 } },
  "motion": { "style": "MOTION_STYLE_HERE", "library": "framer-motion", "intensity": "INTENSITY_HERE", "hero": { "type": "...", "duration": "...", "easing": "...", "stagger": "..." }, "sections": { "enter": "...", "exit": "...", "stagger": "..." }, "cards": { "hover": "...", "focus": "...", "tap": "..." }, "scroll": { "enabled": true, "type": "...", "trigger": "...", "offset": "..." }, "pageTransitions": { "enabled": false, "type": "...", "duration": "..." }, "microInteractions": [], "reducedMotionFallback": "..." },
  "components": [ { "name": "...", "purpose": "...", "priority": 1, "variant": "...", "elements": [], "behavior": "...", "animation": "...", "accessibility": "...", "responsive": {}, "visualWeight": "primary", "interactionType": "static", "contentRules": {} } ],
  "responsive": { "strategy": "STRATEGY_HERE", "breakpoints": [ { "name": "mobile", "minWidth": "0px", "maxWidth": "639px", "columns": 4, "gutter": "1rem", "sectionPadding": "3rem 1rem", "fontSize": { "heading": "1.875rem", "subheading": "1.25rem", "body": "1rem", "small": "0.875rem" }, "layout": "stacked", "navigation": "bottom", "gridColumns": 4 } ], "containerMaxWidth": "...", "mobileFirst": true, "fluidTypography": true, "adaptiveLayouts": {} },
  "accessibility": { "semanticHTML": true, "ariaLabels": true, "keyboardNavigation": true, "focusManagement": true, "reducedMotion": false, "colorContrast": "AA", "screenReader": true, "skipLinks": true, "headingHierarchy": true, "altTextRequired": true, "landmarkRegions": true },
  "story": { "flow": "STORY_FLOW_HERE", "narrativeArc": [], "sectionTransitions": {}, "storytellingDevices": [] },
  "tokens": {},
  "metadata": { "composedAt": "...", "version": "1.0.0", "promptHash": "...", "confidence": 0.9, "uniquenessScore": 0.95, "constraintOverrides": [], "compositionTime": "...", "refinementApplied": false, "validationPassed": true }
}

CRITICAL RULES:
1. The layout MUST match the profession and design language. A photographer gets "gallery" or "masonry". A developer gets "bento" or "grid". A magazine gets "magazine" or "editorial".
2. Colors MUST be unique per profession/design. Cyberpunk = neon green/magenta. Luxury = gold tones. Minimal = monochrome.
3. **If the user explicitly specifies a specific color for a specific role (e.g., "dark red background", "white text", "background is #0a0a0a", "primary blue") then those EXACT user-specified colors MUST be used and MUST override any preset scheme.** Extract the exact hex, rgb, or named color the user requested and apply it to the correct CSS role (background, text, primary, accent, surface, border).
4. Fonts MUST match the design language. Magazine = serif fonts. Brutalist = monospace. Cyberpunk = Orbitron. Minimal = Inter.
5. Sections MUST be relevant to the profession. Photographer = gallery, about, services, contact. Developer = hero, skills, projects, experience, contact.
6. Navigation MUST match the layout style. Magazine = magazine-toc. Minimal = minimal. Terminal = dock.
7. Motion MUST match the animation intensity. Heavy = parallax, scroll-storytelling. Subtle = apple, minimal.
8. NO TWO portfolios should look the same. Use different combinations for different prompts.
9. Every section MUST have a unique variant that makes visual sense for the prompt.
10. Return ONLY the JSON object, nothing else.`;
}

function buildPortfolioDataPrompt(prompt: string, composition: CompositionGraph): string {
  const sectionNames = composition.sections.map(s => s.id);
  const layoutType = composition.layout.style;
  const themeMode = composition.theme.mode;

  return `You are an expert Portfolio Content Writer and Domain Specialist. Generate a fully populated professional PortfolioData JSON object based on the user's prompt and composition plan.

USER PROMPT: "${prompt}"

COMPOSITION CONTEXT:
- Layout Style: ${layoutType}
- Theme Mode: ${themeMode}
- Sections Required: ${sectionNames.join(", ")}
- Profession/Domain: ${composition.aiContext.profession}
- Design Language: ${composition.aiContext.designLanguage.map(d => d.name).join(", ")}

CRITICAL EXTRACTION RULES:
1. FAITHFULLY EXTRACT user-provided details. Use the user's EXACT name, role, email, skills, projects, experience, and education from the prompt. Never invent personal details.
2. If the user provides specific projects, skills, or experience, use them EXACTLY as given. Do NOT add fictional items.
3. Never replace user data with plausible-sounding alternatives. If the user says "Trozzi E-commerce", use "Trozzi E-commerce", not "E-Commerce Platform".
4. Zero Placeholders: Strictly NO 'Lorem Ipsum', 'John Doe', or vague text.
5. Tone Matching: Align language tone (e.g., confident for founders, technical for backend engineers, creative for visual artists) with the user prompt.
6. Section Parity: Populate ALL requested sections: ${sectionNames.join(", ")}. For sections the user didn't provide specific data for, generate plausible filler content.

JSON STRUCTURE:
{
  "personalInfo": { "name": "string", "role": "string", "tagline": "string", "bio": "string (2-3 sentences)", "email": "string", "location": "string" },
  "sections": {
    "hero": { "headline": "string", "subheadline": "string", "ctaText": "string", "ctaLink": "#section-id" },
    "about": { "title": "About Me", "content": "string (2-3 paragraphs about the person)", "intro": "string (one punchy lead sentence)", "highlights": ["string (top achievements/impact, 2-4)"], "strengths": [{ "label": "string", "detail": "string" }], "metrics": [{ "label": "string", "value": "string" }] },
    "skills": [{ "name": "string", "level": "beginner|intermediate|advanced|expert", "category": "string" }],
    "projects": [{ "title": "string", "description": "string (1-2 sentences)", "tags": ["string"], "link": "string", "githubUrl": "string", "features": ["string (key outcomes/features, 2-4)"] }],
    "experience": [{ "company": "string", "role": "string", "startDate": "string", "endDate": "string", "description": "string", "current": boolean, "highlights": ["string (concrete achievements, 2-4)"], "technologies": ["string"] }],
    "education": [{ "institution": "string", "degree": "string", "field": "string", "startDate": "string", "endDate": "string", "achievements": ["string"] }],
    "achievements": [{ "title": "string", "description": "string" }],
    "certifications": [{ "name": "string", "issuer": "string", "date": "string" }],
    "socialLinks": [{ "platform": "GitHub|LinkedIn|Twitter|Dribbble|Behance|Medium|Dev.to", "url": "https://..." }],
    "contact": { "email": "string", "location": "string", "availableFor": "string" },
    "testimonials": [{ "author": "string", "role": "string", "content": "string", "rating": 5 }],
    "services": [{ "name": "string", "description": "string", "price": "string" }],
    "metrics": [{ "label": "string", "value": "string", "icon": "string" }],
    "publications": [{ "title": "string", "publisher": "string", "date": "string", "link": "string" }],
    "faq": [{ "question": "string", "answer": "string" }],
    "products": [{ "name": "string", "description": "string", "link": "string", "status": "live|beta|coming-soon" }],
    "gallery": [{ "title": "string", "description": "string", "category": "string" }],
    "clients": [{ "name": "string", "industry": "string", "project": "string" }],
    "awards": [{ "title": "string", "organization": "string", "date": "string", "description": "string" }],
    "roadmap": [{ "milestone": "string", "date": "string", "status": "completed|in-progress|upcoming" }],
    "articles": [{ "title": "string", "excerpt": "string", "date": "string", "link": "string" }],
    "speaking": [{ "event": "string", "topic": "string", "date": "string", "link": "string" }]
  },
  "theme": { "mode": "${themeMode}" },
  "layout": { "style": "${composition.blueprint.layout.type}" },
  "navigation": { "links": [{ "label": "string", "href": "#section-id" }], "style": "pills" },
  "seo": { "title": "string", "description": "string", "keywords": ["string"] }
}

IMPORTANT: Only include sections that are in the composition plan. Return ONLY the JSON object, nothing else.`;
}

export class GroqProvider implements AIProvider {
  async generatePortfolio(prompt: string): Promise<PortfolioData> {
    logger.info(`Groq generatePortfolio: "${prompt.slice(0, 80)}..."`, "GroqProvider");
    const text = await withRetry(
      () => chatCompletion(buildPortfolioPrompt(prompt), { temperature: 0.3, maxTokens: 8192 }),
      "generatePortfolio"
    );
    return extractJson(text) as PortfolioData;
  }

  async generateCompositionGraph(prompt: string, aiContext: AIContextObject): Promise<CompositionGraph> {
    logger.info(`Groq generateCompositionGraph: "${prompt.slice(0, 80)}..."`, "GroqProvider");
    const text = await withRetry(
      () => chatCompletion(buildCompositionGraphPrompt(prompt, aiContext), { temperature: 0.9, maxTokens: 16384 }),
      "generateCompositionGraph"
    );
    return extractJson(text) as unknown as CompositionGraph;
  }

  async generatePortfolioData(prompt: string, composition: CompositionGraph): Promise<PortfolioData> {
    logger.info(`Groq generatePortfolioData: "${prompt.slice(0, 80)}..."`, "GroqProvider");
    const text = await withRetry(
      () => chatCompletion(buildPortfolioDataPrompt(prompt, composition), { temperature: 0.3, maxTokens: 8192 }),
      "generatePortfolioData"
    );
    return extractJson(text) as PortfolioData;
  }

  async improvePortfolio(portfolioData: PortfolioData, instruction: string): Promise<PortfolioData> {
    logger.info(`Groq improvePortfolio: "${instruction.slice(0, 80)}..."`, "GroqProvider");
    const text = await withRetry(
      () => chatCompletion(buildImprovePrompt(portfolioData, instruction), { temperature: 0.7, maxTokens: 8192 }),
      "improvePortfolio"
    );
    return extractJson(text) as PortfolioData;
  }

  async regenerateSection(portfolioData: PortfolioData, section: string, instruction?: string): Promise<PortfolioData> {
    logger.info(`Groq regenerateSection: "${section}"`, "GroqProvider");
    const text = await withRetry(
      () => chatCompletion(buildRegeneratePrompt(portfolioData, section, instruction), { temperature: 0.8, maxTokens: 8192 }),
      "regenerateSection"
    );
    return extractJson(text) as PortfolioData;
  }

  async generateProject(description: string): Promise<Record<string, unknown>> {
    logger.info(`Groq generateProject: "${description.slice(0, 50)}..."`, "GroqProvider");
    const text = await withRetry(
      () => chatCompletion(
        `You are a technical product editor. Dynamically generate a realistic project entry based on the user input: "${description}". Return ONLY a pure valid JSON object in this exact schema: { "title": "Contextually relevant project name", "description": "Engaging 1-2 sentence description detailing problem solved and impact", "tags": ["Array of actual tools/technologies used"], "link": "https://..." }`,
        { temperature: 0.7, maxTokens: 1024 }
      ),
      "generateProject"
    );
    return extractJson(text);
  }

  async analyzePrompt(prompt: string): Promise<import("@/server/discovery/types").DiscoveryAnalysis> {
    logger.info(`Groq analyzePrompt: "${prompt.slice(0, 80)}..."`, "GroqProvider");
    const text = await withRetry(
      () => chatCompletion(
        `You are a Senior Portfolio Consultant AI. Analyze this user's initial prompt for portfolio generation.

USER PROMPT: "${prompt}"

Extract everything you can from the prompt and identify what's missing.

Return a JSON object with this EXACT structure:
{
  "confidence": 0-100 (integer),
  "known": { "field_name": "value or []" },
  "missing": ["field_name", "field_name"],
  "profession": "detected profession or null",
  "experience": "detected experience level or null",
  "portfolioObjective": "what they want to achieve or null"
}

Rules:
- confidence is 0-100 based on how much information the user provided
- known should include every extractable field, e.g.: name, role, title, profession, experience, yearsOfExperience, education, degree, skills, technologies, techStack, tools, projects, achievements, awards, socialLinks, email, phone, location, city, designPreference, theme, colors, colorPalette, style, animationPreference, animations, motion, audience, targetAudience, careerGoal, objective, industry
- If the user mentions a theme (e.g. "dark blue theme") put it under "theme" AND "designPreference"
- If the user mentions animations (e.g. "GSAP") put it under "animationPreference" AND "animations"
- missing lists fields we still need to ask about
- Be honest — if the prompt only has a name, confidence should be very low (under 20%)
- If the prompt has substantial detail, confidence can be higher
- Return ONLY the JSON object, nothing else`,
        { temperature: 0.3, maxTokens: 2048 }
      ),
      "analyzePrompt"
    );
    return extractJson(text) as unknown as import("@/server/discovery/types").DiscoveryAnalysis;
  }

  async generateQuestions(profile: Partial<import("@/server/discovery/types").UserProfile>, missingFields: string[]): Promise<import("@/server/discovery/types").DiscoveryQuestion[]> {
    logger.info(`Groq generateQuestions: missing=[${missingFields.join(",")}]`, "GroqProvider");
    const profileStr = JSON.stringify(profile, null, 2);
    const text = await withRetry(
      () => chatCompletion(
        `You are a Senior Portfolio Consultant conducting a discovery conversation. You need to ask intelligent, context-aware questions to build the user's portfolio profile.

CURRENT PROFILE:
${profileStr}

MISSING INFORMATION:
${missingFields.join(", ")}

Generate 1-3 natural, conversational questions to ask the user next. Do NOT dump all questions at once — choose the MOST IMPORTANT missing fields first.

Return a JSON object with this EXACT structure:
{
  "questions": [
    {
      "id": "q1",
      "text": "Natural conversation question text",
      "type": "choice | text | multiselect",
      "options": [{ "label": "Option label", "value": "option_value" }],
      "field": "which_profile_field_this_updates"
    }
  ]
}

Rules:
- Ask 1-3 questions only — be strategic about which missing info is most important
- Use "choice" type when there are clear industry-standard options
- Use "multiselect" for skills/technologies
- Use "text" for open-ended answers (name, bio, etc.)
- Make questions feel conversational and professional
- Adapt questions to the user's profession if known
- For developers: ask about GitHub, tech stack, projects
- For designers: ask about Behance/Dribbble, tools, specialties
- Return ONLY the JSON object, nothing else`,
        { temperature: 0.7, maxTokens: 2048 }
      ),
      "generateQuestions"
    );
    const parsed = extractJson(text) as unknown as { questions: import("@/server/discovery/types").DiscoveryQuestion[] };
    return parsed.questions || [];
  }

  async processAnswer(profile: Partial<import("@/server/discovery/types").UserProfile>, question: import("@/server/discovery/types").DiscoveryQuestion, answer: string | string[]): Promise<Partial<import("@/server/discovery/types").UserProfile>> {
    logger.info(`Groq processAnswer: field=${question.field}`, "GroqProvider");
    const profileStr = JSON.stringify(profile, null, 2);
    const answerStr = Array.isArray(answer) ? answer.join(", ") : answer;
    const text = await withRetry(
      () => chatCompletion(
        `You are a Portfolio Profile Builder. Update the user profile with the new answer.

CURRENT PROFILE:
${profileStr}

QUESTION: "${question.text}"
ANSWER: "${answerStr}"

Return the COMPLETE updated profile JSON. Infer additional relevant details from the answer. For example:
- If the user says they're a "MERN Developer", add relevant skills/technologies
- If the user mentions a company, add to experience
- If the user provides a GitHub URL, set the social link

Return ONLY the JSON object, nothing else.`,
        { temperature: 0.5, maxTokens: 2048 }
      ),
      "processAnswer"
    );
    return extractJson(text) as unknown as Partial<import("@/server/discovery/types").UserProfile>;
  }

  async generateStrategy(profile: Partial<import("@/server/discovery/types").UserProfile>): Promise<import("@/server/strategy/types").PortfolioStrategy> {
    logger.info(`Groq generateStrategy: profile=${JSON.stringify(profile).slice(0, 100)}...`, "GroqProvider");
    const profileStr = JSON.stringify(profile, null, 2);
    const text = await withRetry(
      () => chatCompletion(
        `You are a Senior Creative Director and Design Strategist. Based on the user's complete profile, design a premium, unique portfolio strategy.

USER PROFILE:
${profileStr}

Design a portfolio strategy that would impress at Awwwards and feel like it was built by a premium creative agency.

Return a JSON object with this EXACT structure:
{
  "designLanguage": "one of: Apple / Linear / Framer / Stripe / Raycast / Vercel / Editorial / Brutalist / Luxury / Cyberpunk / Minimal / Glass / Neumorphism / Playful / Corporate / Artistic",
  "style": "short style description",
  "theme": "theme name",
  "themeMode": "dark" or "light",
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "typography": { "heading": "Google Font name", "body": "Google Font name" },
  "spacing": "generous" or "compact" or "comfortable",
  "layout": "layout style name",
  "layoutArchitecture": "description of layout approach",
  "visualHierarchy": "description of visual hierarchy",
  "cardStyle": "glass / bordered / filled / minimal / neumorphic / elevated",
  "interactionModel": "description of interaction approach",
  "backgroundSystem": "solid / gradient / mesh / noise / particles / grid / dots",
  "animation": "GSAP / Framer Motion / CSS / ScrollTrigger / Three.js",
  "motionLanguage": ["motion tech 1", "motion tech 2", "motion tech 3"],
  "storytellingFlow": ["page section 1", "page section 2", ...],
  "componentTree": ["UniqueComponent1", "UniqueComponent2", ...],
  "sections": 6-12,
  "audience": "target audience description",
  "careerGoal": "user's career goal",
  "estimatedBuildTime": "Xs"
}

Rules:
- Design language MUST match the user's profession, industry, and taste
- Color palette must be cohesive and premium
- Typography must pair well (e.g., heading + body font combination)
- Storytelling flow must be a UNIQUE narrative, NOT the default Hero-About-Projects-Contact
- Component tree must have unique, memorable component names
- The layout must match their profession (developer → bento/grid, designer → gallery/creative)
- Return ONLY the JSON object, nothing else`,
        { temperature: 0.8, maxTokens: 4096 }
      ),
      "generateStrategy"
    );
    return extractJson(text) as unknown as import("@/server/strategy/types").PortfolioStrategy;
  }

  async selfReview(strategy: import("@/server/strategy/types").PortfolioStrategy, profile: Partial<import("@/server/discovery/types").UserProfile>): Promise<import("@/server/strategy/types").SelfReviewResult> {
    logger.info("Groq selfReview", "GroqProvider");
    const text = await withRetry(
      () => chatCompletion(
        `You are an Awwwards Jury Member and Design Critic. Review this portfolio strategy.

PORTFOLIO STRATEGY:
${JSON.stringify(strategy, null, 2)}

USER PROFILE:
${JSON.stringify(profile, null, 2)}

Evaluate on these criteria (score 1-10):
1. MEMORABLE — Would recruiters remember this portfolio?
2. HANDCRAFTED — Would this feel handcrafted, not templated?
3. AWARD-WORTHY — Would this impress Awwwards?
4. PREMIUM AGENCY — Would this look like a premium agency built it?

Return a JSON object with this EXACT structure:
{
  "passed": true/false,
  "memorable": 1-10,
  "handcrafted": 1-10,
  "awardWorthy": 1-10,
  "premiumAgency": 1-10,
  "issues": ["issue 1", "issue 2"],
  "improvements": ["improvement 1", "improvement 2"]
}

A strategy PASSES if all scores are 7+ and there are no critical issues.
If it doesn't pass, list specific issues and improvements.
Return ONLY the JSON object, nothing else.`,
        { temperature: 0.5, maxTokens: 2048 }
      ),
      "selfReview"
    );
    return extractJson(text) as unknown as import("@/server/strategy/types").SelfReviewResult;
  }
}
