import type { DetectedDesignLanguage, DesignLanguage, ThemeMode, Profession } from "./types";

interface DesignPattern {
  pattern: RegExp;
  name: DesignLanguage;
  keywords: string[];
}

const DESIGN_PATTERNS: DesignPattern[] = [
  { pattern: /\bapple\b/i, name: "apple", keywords: ["apple", "ios", "macos", "clean", "minimal"] },
  { pattern: /\blinear\b/i, name: "linear", keywords: ["linear", "clean", "modern"] },
  { pattern: /\braycast\b/i, name: "raycast", keywords: ["raycast", "command palette", "spotlight"] },
  { pattern: /\bstripe\b/i, name: "stripe", keywords: ["stripe", "payment", "modern", "clean"] },
  { pattern: /\bvercel\b/i, name: "vercel", keywords: ["vercel", "next.js", "modern", "minimal"] },
  { pattern: /\bgoogle\b/i, name: "google", keywords: ["google", "material", "clean"] },
  { pattern: /\bglassmorphism\b|\bglass\b/i, name: "glassmorphism", keywords: ["glass", "frosted", "blur", "transparent"] },
  { pattern: /\bneumorphism\b|\bneumorphic\b/i, name: "neumorphism", keywords: ["neumorphism", "soft", "embossed"] },
  { pattern: /\bcyberpunk\b|\bcyber\b/i, name: "cyberpunk", keywords: ["cyberpunk", "neon", "futuristic", "glitch"] },
  { pattern: /\bluxury\b|\bluxurious\b/i, name: "luxury", keywords: ["luxury", "premium", "elegant", "sophisticated"] },
  { pattern: /\bminimal\b|\bminimalism\b/i, name: "minimal", keywords: ["minimal", "minimalist", "clean", "simple"] },
  { pattern: /\beditorial\b/i, name: "editorial", keywords: ["editorial", "magazine", "typography"] },
  { pattern: /\bmagazine\b/i, name: "magazine", keywords: ["magazine", "editorial", "grid"] },
  { pattern: /\bbrutalist\b|\bbrutalism\b/i, name: "brutalist", keywords: ["brutalist", "raw", "industrial"] },
  { pattern: /\bdashboard\b/i, name: "dashboard", keywords: ["dashboard", "admin", "panel", "analytics"] },
  { pattern: /\bcreative\b/i, name: "creative", keywords: ["creative", "artistic", "unique"] },
  { pattern: /\bgallery\b/i, name: "gallery", keywords: ["gallery", "portfolio", "grid", "images"] },
  { pattern: /\bretro\b|\bvintage\b/i, name: "retro", keywords: ["retro", "vintage", "nostalgic"] },
  { pattern: /\bcorporate\b/i, name: "corporate", keywords: ["corporate", "professional", "business"] },
  { pattern: /\bplayful\b/i, name: "playful", keywords: ["playful", "fun", "colorful"] },
  { pattern: /\bdark.?academic\b/i, name: "dark-academic", keywords: ["dark academic", "scholarly", "bookish"] },
  { pattern: /\bcottagecore\b/i, name: "cottagecore", keywords: ["cottagecore", "rustic", "nature"] },
];

const PROFESSION_PATTERNS: { pattern: RegExp; name: Profession }[] = [
  { pattern: /\b(full.?stack|fullstack)\b/i, name: "fullstack-developer" },
  { pattern: /\bfront.?end|frontend\b/i, name: "frontend-developer" },
  { pattern: /\bback.?end|backend\b/i, name: "backend-developer" },
  { pattern: /\bdeveloper\b/i, name: "developer" },
  { pattern: /\b(ai|artificial intelligence)\b/i, name: "ai-engineer" },
  { pattern: /\b(ml|machine learning)\b/i, name: "ml-engineer" },
  { pattern: /\bdata.?scientist\b/i, name: "data-scientist" },
  { pattern: /\bdata.?engineer\b/i, name: "data-engineer" },
  { pattern: /\bdevops\b/i, name: "devops-engineer" },
  { pattern: /\bmobile\b/i, name: "mobile-developer" },
  { pattern: /\bui\b/i, name: "ui-designer" },
  { pattern: /\bux\b/i, name: "ux-designer" },
  { pattern: /\bproduct.?designer\b/i, name: "product-designer" },
  { pattern: /\bgraphic.?designer\b/i, name: "graphic-designer" },
  { pattern: /\bphotographer\b/i, name: "photographer" },
  { pattern: /\barchitect\b/i, name: "architect" },
  { pattern: /\bdoctor\b|\bphysician\b/i, name: "doctor" },
  { pattern: /\blawyer\b|\battorney\b/i, name: "lawyer" },
  { pattern: /\bresearcher\b/i, name: "researcher" },
  { pattern: /\bagency\b/i, name: "agency" },
  { pattern: /\bstartup\b/i, name: "startup" },
  { pattern: /\bfreelancer\b|\bfreelance\b/i, name: "freelancer" },
  { pattern: /\bstudent\b/i, name: "student" },
  { pattern: /\bcreator\b/i, name: "creator" },
  { pattern: /\bteacher\b|\beducator\b/i, name: "teacher" },
  { pattern: /\bconsultant\b/i, name: "consultant" },
  { pattern: /\bwriter\b|\bauthor\b/i, name: "writer" },
  { pattern: /\bmusician\b/i, name: "musician" },
];

export function detectDesignLanguages(prompt: string): DetectedDesignLanguage[] {
  const results: DetectedDesignLanguage[] = [];
  const lower = prompt.toLowerCase();

  for (const dp of DESIGN_PATTERNS) {
    if (dp.pattern.test(lower)) {
      const explicit = dp.keywords.some(
        (kw) => new RegExp(`\\b${kw}\\b`, "i").test(prompt)
      );
      results.push({
        name: dp.name,
        confidence: explicit ? 0.9 : 0.65,
        explicit,
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

export function detectProfession(prompt: string): { profession: Profession; confidence: number; explicit: boolean } {
  const lower = prompt.toLowerCase();

  for (const pp of PROFESSION_PATTERNS) {
    if (pp.pattern.test(lower)) {
      const explicit = pp.pattern.test(prompt);
      return { profession: pp.name, confidence: explicit ? 0.9 : 0.6, explicit };
    }
  }

  return { profession: "other", confidence: 0.1, explicit: false };
}

export function detectTheme(prompt: string): ThemeMode {
  const lower = prompt.toLowerCase();
  if (/\blight\b/i.test(lower) && !/\bdark\b/i.test(lower)) return "light";
  if (/\bdark\b/i.test(lower) && !/\blight\b/i.test(lower)) return "dark";
  if (/\bboth\b/i.test(lower) || /\bsystem\b/i.test(lower)) return "system";
  if (/\btheme\b/i.test(lower) && /\bboth\b|\bswitch\b|\btoggle\b/i.test(lower)) return "both";
  return "dark";
}
