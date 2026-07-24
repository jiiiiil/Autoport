import { normalizePrompt, sanitizePrompt, extractKeywords } from "@/server/utils";
import { GenerateSchema } from "@/server/validators";
import { ValidationError } from "@/server/utils";
import { getAIProvider } from "@/server/ai";
import type { PortfolioData } from "@/server/types";

export interface PipelineResult {
  portfolioData: PortfolioData;
  keywords: string[];
  normalizedPrompt: string;
}

export async function runPromptPipeline(input: { prompt: string; template?: string }): Promise<PipelineResult> {
  const validation = GenerateSchema.safeParse(input);
  if (!validation.success) {
    throw new ValidationError(validation.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const normalized = normalizePrompt(validation.data.prompt);
  const sanitized = sanitizePrompt(normalized);
  const keywords = extractKeywords(sanitized);

  const ai = getAIProvider();
  const portfolioData = await ai.generatePortfolio(sanitized);

  return {
    portfolioData,
    keywords,
    normalizedPrompt: sanitized,
  };
}
