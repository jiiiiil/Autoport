import type { CompositionGraph, RefinementResult, RefinementChange } from "./types";

export function refineComposition(composition: CompositionGraph): RefinementResult {
  const changes: RefinementChange[] = [];
  if (!composition.theme) {
    composition.theme = {
      mode: "spatial-3d" as any,
      colors: { primary: "#7c3aed", secondary: "#1e1b4b", accent: "#06b6d4", background: "#0a0a0a", surface: "#141414", surfaceElevated: "#1a1a1a", text: "#fafafa", textSecondary: "#a1a1aa", textMuted: "#71717a", border: "#27272a", borderSubtle: "#1f1f23", success: "#22c55e", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6", overlay: "rgba(0,0,0,0.8)" },
      typography: { headingFont: "Inter", bodyFont: "Inter", monoFont: "'JetBrains Mono', 'Fira Code', monospace", scale: { base: "1.25" }, lineHeights: { tight: "1.1", snug: "1.25", normal: "1.5", relaxed: "1.625", loose: "2" }, letterSpacings: { tighter: "-0.05em", tight: "-0.025em", normal: "0", wide: "0.025em", wider: "0.05em", widest: "0.1em" }, fontWeights: { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 } },
      spacing: { unit: "4px", sectionPadding: "5rem", containerPadding: "1.5rem", elementGap: "1.5rem" },
      radius: { sm: "0.25rem", md: "0.5rem", lg: "0.75rem", xl: "1rem", "2xl": "1.5rem", "3xl": "2rem", full: "9999px" },
      shadows: { sm: "0 1px 2px 0 rgba(0,0,0,0.05)", md: "0 4px 6px -1px rgba(0,0,0,0.1)", lg: "0 10px 15px -3px rgba(0,0,0,0.1)", xl: "0 20px 25px -5px rgba(0,0,0,0.1)", "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)" },
      backgroundStyle: "mesh-gradient",
      gradients: {
        primary: "linear-gradient(135deg, #7c3aed, #06b6d4)",
        secondary: "linear-gradient(135deg, #1e1b4b, #06b6d4)",
        hero: "linear-gradient(135deg, #7c3aed, #06b6d4)",
        card: "linear-gradient(135deg, #1a1a1a, #222222)",
        text: "linear-gradient(135deg, #7c3aed, #06b6d4)",
      },
      borders: { thin: "1px solid", medium: "2px solid", thick: "3px solid" },
      transitionDurations: { fast: "150ms", normal: "300ms", slow: "500ms", slower: "700ms" },
      zIndex: { base: 0, dropdown: 10, sticky: 20, overlay: 30, modal: 40, popover: 50, tooltip: 60 },
    };
    changes.push({ type: "theme-fix", target: "theme", before: null, after: composition.theme, reason: "Theme was missing, applied fallback" });
  }
  const refined = JSON.parse(JSON.stringify(composition)) as CompositionGraph;

  const hierarchyChanges = refineVisualHierarchy(refined);
  changes.push(...hierarchyChanges);

  const spacingChanges = refineSpacing(refined);
  changes.push(...spacingChanges);

  const alignmentChanges = refineAlignment(refined);
  changes.push(...alignmentChanges);

  const densityChanges = refineInformationDensity(refined);
  changes.push(...densityChanges);

  const navChanges = refineNavigation(refined);
  changes.push(...navChanges);

  const motionChanges = refineMotionConflicts(refined);
  changes.push(...motionChanges);

  const redundantChanges = removeRedundantComponents(refined);
  changes.push(...redundantChanges);

  const orderChanges = optimizeSectionOrder(refined);
  changes.push(...orderChanges);

  const accessibilityChanges = refineAccessibility(refined);
  changes.push(...accessibilityChanges);

  const premiumChanges = refinePremiumFeatures(refined);
  changes.push(...premiumChanges);

  refined.metadata.refinementApplied = true;
  refined.metadata.uniquenessScore = Math.min(
    1,
    refined.metadata.uniquenessScore + changes.length * 0.02
  );

  const score = Math.min(1, 0.7 + changes.length * 0.03);

  return { composition: refined, changes, score };
}

function refineVisualHierarchy(composition: CompositionGraph): RefinementChange[] {
  const changes: RefinementChange[] = [];
  const { sections } = composition;

  const primarySections = sections.filter(s => s.visualWeight === "primary");
  if (primarySections.length === 0 && sections.length > 0) {
    sections[0].visualWeight = "primary";
    changes.push({
      type: "hierarchy-fix",
      target: `section:${sections[0].id}`,
      before: "none",
      after: "primary",
      reason: "At least one section must have primary visual weight",
    });
  }

  if (primarySections.length > 3) {
    const excess = primarySections.slice(3);
    for (const section of excess) {
      section.visualWeight = "secondary";
      changes.push({
        type: "hierarchy-optimization",
        target: `section:${section.id}`,
        before: "primary",
        after: "secondary",
        reason: "Too many primary sections reduce visual clarity",
      });
    }
  }

  const contactSection = sections.find(s => s.id === "contact");
  if (contactSection && contactSection.priority > 50) {
    const oldPriority = contactSection.priority;
    contactSection.priority = sections.length + 1;
    changes.push({
      type: "priority-fix",
      target: "section:contact",
      before: oldPriority,
      after: contactSection.priority,
      reason: "Contact section should always be last",
    });
  }

  return changes;
}

function refineSpacing(composition: CompositionGraph): RefinementChange[] {
  const changes: RefinementChange[] = [];
  const { layout } = composition;

  const sectionCount = composition.sections.length;
  if (sectionCount > 8) {
    const currentSpacing = parseFloat(layout.sectionSpacing);
    if (currentSpacing > 5) {
      layout.sectionSpacing = `${Math.max(3, currentSpacing * 0.8)}rem`;
      changes.push({
        type: "spacing-optimization",
        target: "layout.sectionSpacing",
        before: `${currentSpacing}rem`,
        after: layout.sectionSpacing,
        reason: "Reduce spacing for many sections to improve scroll experience",
      });
    }
  }

  return changes;
}

function refineAlignment(composition: CompositionGraph): RefinementChange[] {
  const changes: RefinementChange[] = [];
  const { layout, sections } = composition;

  if (layout.style === "split") {
    const hasOddContent = sections.some(s => s.visualWeight === "accent");
    if (hasOddContent && layout.gridStrategy !== "2-col-asymmetric") {
      layout.gridStrategy = "2-col-asymmetric";
      changes.push({
        type: "alignment-fix",
        target: "layout.gridStrategy",
        before: layout.gridStrategy,
        after: "2-col-asymmetric",
        reason: "Split layout with accent sections benefits from asymmetric grid",
      });
    }
  }

  return changes;
}

function refineInformationDensity(composition: CompositionGraph): RefinementChange[] {
  const changes: RefinementChange[] = [];
  const { sections } = composition;

  const secondaryAndBelow = sections.filter(
    s => s.visualWeight === "tertiary" || s.visualWeight === "accent"
  );

  if (secondaryAndBelow.length > 4) {
    for (const section of secondaryAndBelow.slice(4)) {
      section.responsive.mobile = "hidden";
      changes.push({
        type: "density-optimization",
        target: `section:${section.id}.responsive.mobile`,
        before: "stacked-compact",
        after: "hidden",
        reason: "Too many low-priority sections on mobile reduces readability",
      });
    }
  }

  return changes;
}

function refineNavigation(composition: CompositionGraph): RefinementChange[] {
  const changes: RefinementChange[] = [];
  const { navigation, sections } = composition;

  if (navigation.sections.length > 7 && navigation.style !== "magazine-toc") {
    const excessSections = navigation.sections.slice(5);
    navigation.sections = navigation.sections.slice(0, 5);
    navigation.sections.push("more");
    changes.push({
      type: "navigation-optimization",
      target: "navigation.sections",
      before: `${excessSections.length + 5} items`,
      after: "6 items (with 'more' dropdown)",
      reason: "Navigation should have at most 6 visible items for usability",
    });
  }

  if (sections.length <= 3 && navigation.style === "magazine-toc") {
    const oldStyle = navigation.style;
    navigation.style = "minimal";
    changes.push({
      type: "navigation-simplification",
      target: "navigation.style",
      before: oldStyle,
      after: "minimal",
      reason: "Few sections don't need a magazine TOC navigation",
    });
  }

  return changes;
}

function refineMotionConflicts(composition: CompositionGraph): RefinementChange[] {
  const changes: RefinementChange[] = [];
  const { motion, sections } = composition;

  if (motion.intensity === "heavy" && sections.length > 10) {
    motion.intensity = "moderate";
    motion.microInteractions = motion.microInteractions.slice(0, 4);
    changes.push({
      type: "motion-optimization",
      target: "motion.intensity",
      before: "heavy",
      after: "moderate",
      reason: "Heavy motion with many sections may cause performance issues",
    });
  }

  if (motion.style === "3d" && composition.responsive.breakpoints.length > 0) {
    const mobileBp = composition.responsive.breakpoints.find(bp => bp.name === "mobile");
    if (mobileBp) {
      motion.reducedMotionFallback = "fade-in";
      changes.push({
        type: "motion-a11y",
        target: "motion.reducedMotionFallback",
        before: motion.reducedMotionFallback,
        after: "fade-in",
        reason: "3D animations should have fallback for reduced motion / mobile",
      });
    }
  }

  return changes;
}

function removeRedundantComponents(composition: CompositionGraph): RefinementChange[] {
  const changes: RefinementChange[] = [];
  const { components, sections } = composition;

  const sectionNames = new Set(sections.map(s => s.componentName));
  const redundant = components.filter(
    c => !sectionNames.has(c.name) && c.name !== "Navigation" && c.name !== "Footer"
  );

  for (const comp of redundant) {
    const idx = components.indexOf(comp);
    if (idx > -1) {
      components.splice(idx, 1);
      changes.push({
        type: "redundancy-removal",
        target: `component:${comp.name}`,
        before: "present",
        after: "removed",
        reason: "Component has no matching section",
      });
    }
  }

  return changes;
}

function optimizeSectionOrder(composition: CompositionGraph): RefinementChange[] {
  const changes: RefinementChange[] = [];
  const { sections } = composition;

  const contactIdx = sections.findIndex(s => s.id === "contact");
  if (contactIdx >= 0 && contactIdx < sections.length - 1) {
    const contact = sections.splice(contactIdx, 1)[0];
    sections.push(contact);
    changes.push({
      type: "order-optimization",
      target: "sections.order",
      before: "contact not last",
      after: "contact moved to last position",
      reason: "Contact section should always be the final section",
    });
  }

  const socialIdx = sections.findIndex(s => s.id === "socialLinks");
  const contactLast = sections[sections.length - 1];
  if (socialIdx >= 0 && contactLast && contactLast.id === "contact") {
    const social = sections.splice(socialIdx, 1)[0];
    const newContactIdx = sections.findIndex(s => s.id === "contact");
    sections.splice(newContactIdx, 0, social);
    changes.push({
      type: "order-optimization",
      target: "sections.order",
      before: "socialLinks position",
      after: "socialLinks before contact",
      reason: "Social links should appear just before contact",
    });
  }

  return changes;
}

function refineAccessibility(composition: CompositionGraph): RefinementChange[] {
  const changes: RefinementChange[] = [];
  const { accessibility } = composition;

  if (!accessibility.headingHierarchy) {
    accessibility.headingHierarchy = true;
    changes.push({
      type: "a11y-fix",
      target: "accessibility.headingHierarchy",
      before: false,
      after: true,
      reason: "Heading hierarchy is essential for screen readers",
    });
  }

  if (!accessibility.skipLinks) {
    accessibility.skipLinks = true;
    changes.push({
      type: "a11y-fix",
      target: "accessibility.skipLinks",
      before: false,
      after: true,
      reason: "Skip links improve keyboard navigation",
    });
  }

  if (!accessibility.landmarkRegions) {
    accessibility.landmarkRegions = true;
    changes.push({
      type: "a11y-fix",
      target: "accessibility.landmarkRegions",
      before: false,
      after: true,
      reason: "Landmark regions help screen reader users navigate",
    });
  }

  return changes;
}

function refinePremiumFeatures(composition: CompositionGraph): RefinementChange[] {
  const changes: RefinementChange[] = [];

  if (!composition.theme.gradients) {
    const colors = composition.theme.colors;
    composition.theme.gradients = {
      primary: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
      secondary: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
      hero: `linear-gradient(180deg, ${colors.background}, ${colors.surface})`,
      card: `linear-gradient(135deg, ${colors.surface}, ${colors.surfaceElevated})`,
      text: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
    };
    changes.push({
      type: "premium-fix",
      target: "theme.gradients",
      before: null,
      after: composition.theme.gradients,
      reason: "Added gradient system for premium visual depth",
    });
  }

  if (!composition.theme.backgroundStyle) {
    const lower = composition.prompt.toLowerCase();
    if (lower.includes("luxury") || lower.includes("premium")) {
      composition.theme.backgroundStyle = "mesh-gradient";
    } else if (lower.includes("cyberpunk") || lower.includes("neon")) {
      composition.theme.backgroundStyle = "grid";
    } else if (lower.includes("apple")) {
      composition.theme.backgroundStyle = "aurora";
    } else if (lower.includes("minimal") || lower.includes("clean")) {
      composition.theme.backgroundStyle = "flat";
    } else {
      composition.theme.backgroundStyle = "mesh-gradient";
    }
    changes.push({
      type: "premium-fix",
      target: "theme.backgroundStyle",
      before: null,
      after: composition.theme.backgroundStyle,
      reason: "Applied premium background style matching design language",
    });
  }

  if (composition.motion && !composition.motion.gsap) {
    composition.motion.gsap = {
      textReveal: false, fadeReveal: false, imageReveal: false,
      sectionPinning: false, parallax: false, floatingElements: false,
      magneticButtons: false, cursorInteraction: false,
      cardHoverMotion: false, smoothScroll: false,
    };
    changes.push({
      type: "premium-fix",
      target: "motion.gsap",
      before: null,
      after: composition.motion.gsap,
      reason: "Initialized GSAP animation flags for motion system",
    });
  }

  return changes;
}
