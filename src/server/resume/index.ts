import type { ResumeJSON, AnimationLevel, ThemeName, ResumeParseReport } from "./types";
import { extractResumeFromPdf } from "./parser";
import { normalizeResume } from "./normalizer";
import { validateResume } from "./validator";
import { generatePortfolioStrategy } from "./strategy";
import { buildResumeBlueprint, type PortfolioBlueprintResult } from "./blueprint";
import { validateDesign, improveFidelity, type DesignValidationReport } from "./validation";
import type { PortfolioObject } from "@/lib/portfolio/types";
import type { CompositionGraph } from "@/server/ai/composition/types";

export * from "./types";
export * from "./themes";
export * from "./normalizer";
export * from "./validator";
export * from "./strategy";
export * from "./parser";
export * from "./blueprint";
export * from "./fidelity";
export * from "./validation";

export async function parseResumePdf(
  buffer: Buffer,
  filename: string,
  size: number
): Promise<ResumeParseReport> {
  const start = Date.now();

  const { resume, detectedAsLinkedIn, pages } = await extractResumeFromPdf(buffer, filename, size);
  resume.source.detectedAsLinkedIn = detectedAsLinkedIn;
  resume.source.pages = pages;

  const normalization = normalizeResume(resume);
  const validation = validateResume(normalization.resume);
  const strategy = generatePortfolioStrategy(normalization.resume);

  return {
    resume: normalization.resume,
    strategy,
    validation,
    normalized: {
      mergedSkills: normalization.mergedSkills,
      mergedCompanies: normalization.mergedCompanies,
      normalizedTech: normalization.normalizedTech,
      dateNormalized: normalization.dateNormalized,
    },
    durationMs: Date.now() - start,
  };
}

export interface GenerationInput {
  resume: ResumeJSON;
  theme: ThemeName;
  animationLevel: AnimationLevel;
  customColors?: { primary?: string; secondary?: string; accent?: string; background?: string; surface?: string; text?: string };
}

export interface GenerationOutput {
  composition: CompositionGraph;
  portfolioData: PortfolioObject;
  validationReport: DesignValidationReport;
  improved: string[];
}

export function generatePortfolioFromResume(input: GenerationInput): GenerationOutput {
  const blueprint: PortfolioBlueprintResult = buildResumeBlueprint(
    input.resume,
    input.theme,
    input.animationLevel,
    input.customColors
  );

  let portfolioData = blueprint.portfolioData;

  const fidelityImprovement = improveFidelity(input.resume, portfolioData);
  portfolioData = fidelityImprovement.portfolio;

  const validationReport = validateDesign(
    input.resume,
    portfolioData,
    blueprint.composition,
    input.animationLevel
  );

  return {
    composition: blueprint.composition,
    portfolioData,
    validationReport,
    improved: fidelityImprovement.improved,
  };
}
