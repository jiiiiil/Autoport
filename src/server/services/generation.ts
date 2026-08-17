import { portfolioRepository, generationRepository } from "@/server/repositories";
import { runPromptPipeline } from "@/server/pipeline";
import { logger } from "@/server/utils";
import type { PortfolioData } from "@/server/types";
import { getAIProvider } from "@/server/ai";
import { validateCode } from "./code-validator";
import { sanitizeCode } from "./code-sanitizer";
import { buildSandpackResponse } from "./sandpack-builder";
import type { SandpackResponse } from "./sandpack-builder";

export interface GenerateResult {
  portfolioId: string;
  portfolioData: PortfolioData;
  generationId: string;
  duration: number;
  sandpack: SandpackResponse;
}

export const generationService = {
  async generate(prompt: string, template?: string, userId?: string): Promise<GenerateResult> {
    const startTime = Date.now();

    try {
      const result = await runPromptPipeline({ prompt, template });

      const portfolio = await portfolioRepository.create({ userId });
      await portfolioRepository.createVersion(
        portfolio.id,
        1,
        result.normalizedPrompt,
        result.portfolioData,
        (result.portfolioData.theme as Record<string, unknown>)?.mode as string ?? "dark",
        (result.portfolioData.layout as Record<string, unknown>)?.style as string ?? "minimal"
      );

      const generation = await generationRepository.create({ prompt, portfolioId: portfolio.id, userId });
      const duration = Date.now() - startTime;
      await generationRepository.complete(generation.id, result.portfolioData, duration);

      const sandpack = buildSandpackResponse(result.portfolioData);

      logger.info(`Generation completed in ${duration}ms`, "GenerationService");

      return {
        portfolioId: portfolio.id,
        portfolioData: result.portfolioData,
        generationId: generation.id,
        duration,
        sandpack,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Generation failed: ${message}`, "GenerationService");
      throw error;
    }
  },

  async improve(portfolioId: string, instruction: string, userId?: string): Promise<GenerateResult> {
    const startTime = Date.now();
    const generation = await generationRepository.create({
      prompt: instruction,
      portfolioId,
      userId,
    });

    try {
      const existing = await portfolioRepository.getLatestVersion(portfolioId);
      if (!existing) {
        throw new Error("Portfolio not found");
      }

      const ai = getAIProvider();
      const portfolioData = existing.portfolioData as PortfolioData;
      const improved = await ai.improvePortfolio(portfolioData, instruction);

      await portfolioRepository.createVersion(
        portfolioId,
        existing.version + 1,
        instruction,
        improved,
        existing.theme,
        existing.layout
      );

      const duration = Date.now() - startTime;
      await generationRepository.complete(generation.id, improved, duration);

      const sandpack = buildSandpackResponse(improved);

      return {
        portfolioId,
        portfolioData: improved,
        generationId: generation.id,
        duration,
        sandpack,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      await generationRepository.fail(generation.id, message);
      throw error;
    }
  },

  async regenerate(portfolioId: string, section: string, instruction?: string, userId?: string): Promise<GenerateResult> {
    const startTime = Date.now();
    const generation = await generationRepository.create({
      prompt: `Regenerate ${section}`,
      portfolioId,
      userId,
    });

    try {
      const existing = await portfolioRepository.getLatestVersion(portfolioId);
      if (!existing) {
        throw new Error("Portfolio not found");
      }

      const ai = getAIProvider();
      const portfolioData = existing.portfolioData as PortfolioData;
      const regenerated = await ai.regenerateSection(portfolioData, section, instruction);

      await portfolioRepository.createVersion(
        portfolioId,
        existing.version + 1,
        `Regenerate ${section}`,
        regenerated,
        existing.theme,
        existing.layout
      );

      const duration = Date.now() - startTime;
      await generationRepository.complete(generation.id, regenerated, duration);

      const sandpack = buildSandpackResponse(regenerated);

      return {
        portfolioId,
        portfolioData: regenerated,
        generationId: generation.id,
        duration,
        sandpack,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      await generationRepository.fail(generation.id, message);
      throw error;
    }
  },

  async count() {
    return generationRepository.count();
  },

  validateAndSanitize(code: string): { clean: string; validation: ReturnType<typeof validateCode> } {
    const clean = sanitizeCode(code);
    const validation = validateCode(clean);
    return { clean, validation };
  },
};
