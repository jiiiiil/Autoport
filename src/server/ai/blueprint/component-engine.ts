import type { AIContextObject } from "../intelligence/types";
import type {
  HeroVariant, NavbarVariant, ProjectVariant, SkillVariant,
  TimelineVariant, GalleryVariant, FooterVariant, FormVariant,
  ButtonVariant, CardVariant,
} from "./types";

export function selectHeroVariant(context: AIContextObject): HeroVariant {
  const lower = context.normalizedPrompt;

  if (/\bparticle\b|\bgalaxy\b|\bspace\b/i.test(lower)) return "particle";
  if (/\btypewriter\b|\btyping\b/i.test(lower)) return "typewriter";
  if (/\b3d\b|\bthree\b|\bwebgl\b/i.test(lower)) return "3d";
  if (/\bvideo\b|\bbackground video\b/i.test(lower)) return "video-bg";
  if (/\bglass\b|\bfrosted\b/i.test(lower)) return "glass";
  if (/\banimated gradient\b|\bgradient\b/i.test(lower)) return "animated-gradient";

  const designLang = context.designLanguage[0]?.name;
  if (designLang === "apple" || designLang === "minimal") return "minimal";
  if (designLang === "cyberpunk") return "animated-gradient";
  if (designLang === "luxury") return "split";

  const profession = context.profession;
  if (profession.includes("designer") || profession === "photographer") return "split";
  if (profession.includes("developer") || profession === "ai-engineer") return "centered";
  if (profession === "agency" || profession === "startup") return "full-screen";

  return "centered";
}

export function selectNavbarVariant(context: AIContextObject): NavbarVariant {
  const lower = context.normalizedPrompt;

  if (/\bfloating\b|\bfloat\b/i.test(lower)) return "floating";
  if (/\bsidebar\b/i.test(lower)) return "sidebar";
  if (/\bhamburger\b|\bmenu\b/i.test(lower)) return "hamburger";
  if (/\bpills\b/i.test(lower)) return "pills";
  if (/\bunderline\b/i.test(lower)) return "underline";
  if (/\bglass\b|\bblur\b/i.test(lower)) return "glass";
  if (/\bhidden\b|\bhide on scroll\b/i.test(lower)) return "hidden-scroll";

  const designLang = context.designLanguage[0]?.name;
  if (designLang === "minimal" || designLang === "apple") return "minimal";
  if (designLang === "glassmorphism") return "glass";

  return "sticky";
}

export function selectProjectVariant(context: AIContextObject): ProjectVariant {
  const lower = context.normalizedPrompt;

  if (/\bmasonry\b|\bmasonry layout\b/i.test(lower)) return "masonry";
  if (/\bshowcase\b/i.test(lower)) return "showcase";
  if (/\bcase.?study\b/i.test(lower)) return "case-study";
  if (/\bhorizontal\b|\bscroll\b/i.test(lower)) return "horizontal-scroll";
  if (/\bbento\b/i.test(lower)) return "bento";
  if (/\bmagazine\b/i.test(lower)) return "magazine";
  if (/\bvideo\b/i.test(lower)) return "video";

  const profession = context.profession;
  if (profession.includes("designer") || profession === "photographer") return "showcase";
  if (profession.includes("developer") || profession === "ai-engineer") return "card";

  const designLang = context.designLanguage[0]?.name;
  if (designLang === "gallery") return "masonry";
  if (designLang === "magazine" || designLang === "editorial") return "magazine";

  return "card";
}

export function selectSkillVariant(context: AIContextObject): SkillVariant {
  const lower = context.normalizedPrompt;

  if (/\bbar\b|\bprogress bar\b/i.test(lower)) return "bars";
  if (/\bradar\b|\bspider\b/i.test(lower)) return "radar";
  if (/\btag\b|\bpill\b/i.test(lower)) return "pills";
  if (/\bicon\b/i.test(lower)) return "icon-grid";
  if (/\bminimal\b/i.test(lower)) return "minimal";
  if (/\bbubble\b|\bcloud\b/i.test(lower)) return "bubble";

  const designLang = context.designLanguage[0]?.name;
  if (designLang === "minimal" || designLang === "linear") return "pills";
  if (designLang === "dashboard") return "icon-grid";

  return "pills";
}

export function selectTimelineVariant(context: AIContextObject): TimelineVariant {
  const lower = context.normalizedPrompt;

  if (/\bhorizontal\b/i.test(lower)) return "horizontal";
  if (/\balternating\b|\bzigzag\b/i.test(lower)) return "alternating";
  if (/\bminimal\b/i.test(lower)) return "minimal";
  if (/\bcard\b/i.test(lower)) return "card";
  if (/\bcompact\b/i.test(lower)) return "compact";
  if (/\bdetailed\b/i.test(lower)) return "detailed";
  if (/\bglass\b/i.test(lower)) return "glass";

  return "alternating";
}

export function selectGalleryVariant(context: AIContextObject): GalleryVariant {
  const lower = context.normalizedPrompt;

  if (/\bmasonry\b/i.test(lower)) return "masonry";
  if (/\blightbox\b/i.test(lower)) return "lightbox";
  if (/\bcarousel\b|\bslider\b/i.test(lower)) return "carousel";
  if (/\bjustified\b/i.test(lower)) return "justified";
  if (/\bfullscreen\b|\bfull screen\b/i.test(lower)) return "fullscreen";
  if (/\bpolaroid\b/i.test(lower)) return "polaroid";
  if (/\bminimal\b/i.test(lower)) return "minimal";

  const profession = context.profession;
  if (profession === "photographer") return "masonry";

  return "grid";
}

export function selectFooterVariant(context: AIContextObject): FooterVariant {
  const lower = context.normalizedPrompt;

  if (/\bno footer\b|\bwithout footer\b/i.test(lower)) return "none";
  if (/\bminimal\b/i.test(lower)) return "minimal";
  if (/\bnewsletter\b|\bsubscribe\b/i.test(lower)) return "newsletter";
  if (/\bsocial\b/i.test(lower)) return "social";
  if (/\bglass\b/i.test(lower)) return "glass";
  if (/\bcreative\b/i.test(lower)) return "creative";

  const profession = context.profession;
  if (profession === "agency" || profession === "startup") return "multi-column";

  return "minimal";
}

export function selectFormVariant(context: AIContextObject): FormVariant {
  const lower = context.normalizedPrompt;

  if (/\bmodal\b|\bpopup\b/i.test(lower)) return "modal";
  if (/\bmulti.?step\b/i.test(lower)) return "multi-step";
  if (/\bglass\b/i.test(lower)) return "glass";
  if (/\bgradient\b/i.test(lower)) return "gradient";
  if (/\bcard\b/i.test(lower)) return "card";
  if (/\bsplit\b/i.test(lower)) return "split";
  if (/\binline\b/i.test(lower)) return "inline";

  return "card";
}

export function selectButtonVariant(context: AIContextObject): ButtonVariant {
  const lower = context.normalizedPrompt;

  if (/\bgradient\b/i.test(lower)) return "gradient";
  if (/\bglass\b/i.test(lower)) return "glass";
  if (/\bneon\b|\bglow\b/i.test(lower)) return "neon";
  if (/\bpill\b|\brounded\b/i.test(lower)) return "pill";
  if (/\bghost\b|\btransparent\b/i.test(lower)) return "ghost";
  if (/\boutline\b|\bborder\b/i.test(lower)) return "outline";

  const designLang = context.designLanguage[0]?.name;
  if (designLang === "cyberpunk") return "neon";
  if (designLang === "glassmorphism") return "glass";
  if (designLang === "luxury") return "gradient";
  if (designLang === "minimal" || designLang === "apple") return "minimal";

  return "primary";
}

export function selectCardVariant(context: AIContextObject): CardVariant {
  const lower = context.normalizedPrompt;

  if (/\bglass\b|\bfrosted\b/i.test(lower)) return "glass";
  if (/\bgradient\b/i.test(lower)) return "gradient";
  if (/\bneon\b|\bglow\b/i.test(lower)) return "neon";
  if (/\belevated\b|\bshadow\b/i.test(lower)) return "elevated";
  if (/\boutlined\b|\bborder\b/i.test(lower)) return "outlined";
  if (/\bhover.?lift\b/i.test(lower)) return "hover-lift";
  if (/\bborder.?glow\b/i.test(lower)) return "border-glow";

  const designLang = context.designLanguage[0]?.name;
  if (designLang === "glassmorphism") return "glass";
  if (designLang === "cyberpunk") return "neon";
  if (designLang === "luxury") return "gradient";
  if (designLang === "minimal" || designLang === "apple") return "minimal";

  return "elevated";
}

export function planComponentVariants(context: AIContextObject) {
  return {
    hero: selectHeroVariant(context),
    navbar: selectNavbarVariant(context),
    project: selectProjectVariant(context),
    skill: selectSkillVariant(context),
    timeline: selectTimelineVariant(context),
    gallery: selectGalleryVariant(context),
    footer: selectFooterVariant(context),
    form: selectFormVariant(context),
    button: selectButtonVariant(context),
    card: selectCardVariant(context),
  };
}
