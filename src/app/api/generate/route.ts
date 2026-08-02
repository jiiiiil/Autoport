import { NextRequest } from "next/server";
import { getAIProvider } from "@/server/ai";
import { analyzePrompt } from "@/server/ai/intelligence/prompt-analyzer";
import { successResponse, errorResponse, logger } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { createStreamingResponse, createStreamEncoder, sendEvent } from "@/server/utils/stream";
import { buildSandpackResponse } from "@/server/services/sandpack-builder";
import { portfolioRepository, generationRepository } from "@/server/repositories";
import { GenerateSchema } from "@/server/validators";
import { buildCompositionGraph } from "@/server/ai/composition/composition-graph-builder";
import { applyExplicitColorOverrides } from "@/server/ai/composition/theme-composer";
import { extractUserDetails, injectUserDetails } from "@/server/ai/composition/content-extractor";
import { refineComposition } from "@/server/ai/composition/adaptive-refinement-engine";
import { validateComposition } from "@/server/ai/composition/validation-engine";
import { reviewAndImprove } from "@/server/ai/pipeline/self-review";
import { generatePortfolioFromResume } from "@/server/resume";
import type { ResumeJSON, ThemeName, AnimationLevel } from "@/server/resume/types";

function isRateLimitError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("429") || msg.includes("rate_limit") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota");
}

function parseRetryDelay(err: unknown): number | null {
  const msg = err instanceof Error ? err.message : String(err);
  const match = msg.match(/retry[_-]?after["\s:]+(\d+)/i) ?? msg.match(/retryDelay["\s:]+(\d+)s/i);
  return match ? parseInt(match[1], 10) * 1000 : null;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForRateLimit(err: unknown): Promise<boolean> {
  if (!isRateLimitError(err)) return false;
  const waitMs = parseRetryDelay(err) ?? 20000;
  logger.warn(`Rate limited by AI provider, waiting ${Math.round(waitMs / 1000)}s`, "API");
  await delay(waitMs);
  return true;
}

function isResumeRequest(body: Record<string, unknown>): body is { resume: ResumeJSON; theme?: ThemeName; animationLevel?: AnimationLevel; stream?: boolean; customColors?: Record<string, string> } {
  return !!body.resume && typeof body.resume === "object";
}

async function runResumeGeneration(body: { resume: ResumeJSON; theme?: ThemeName; animationLevel?: AnimationLevel; customColors?: Record<string, string> }) {
  const theme: ThemeName = body.theme ?? "dark-blue";
  const animationLevel: AnimationLevel = body.animationLevel ?? "medium";

  const result = generatePortfolioFromResume({
    resume: body.resume,
    theme,
    animationLevel,
    customColors: body.customColors as GenerationCustomColors,
  });

  const name = body.resume.personal?.name ?? "User";
  const sourcePrompt = `[Resume] ${name} — theme: ${theme}, animation: ${animationLevel}`;

  const sandpack = buildSandpackResponse(result.portfolioData as unknown as import("@/server/types").PortfolioData, result.composition);

  const portfolio = await portfolioRepository.create({});
  await portfolioRepository.createVersion(
    portfolio.id,
    1,
    sourcePrompt,
    result.portfolioData as unknown as import("@/server/types").PortfolioData,
    result.composition.theme.mode,
    result.composition.layout.style,
  );

  const generation = await generationRepository.create({ prompt: sourcePrompt, portfolioId: portfolio.id });

  return {
    portfolioId: portfolio.id,
    generationId: generation.id,
    portfolioData: result.portfolioData,
    composition: result.composition,
    sandpack,
    sectionOrder: result.composition.sections.map((s) => s.id),
    strategy: result.composition.blueprint.portfolioType,
    validationReport: result.validationReport,
    reviewReport: result.validationReport,
    improved: result.improved,
  };
}

interface GenerationCustomColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  surface?: string;
  text?: string;
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json() as Record<string, unknown>;

    if (isResumeRequest(body)) {
      const { resume, theme = "dark-blue", animationLevel = "medium", stream, customColors } = body;

      logger.info(`Resume generation: "${(resume.personal?.name ?? "user").slice(0, 40)}" theme=${theme} animation=${animationLevel}`, "API");

      if (stream) {
        return createStreamingResponse(async (controller) => {
          const encoder = createStreamEncoder();

          sendEvent(controller, encoder.statusEvent("Validating resume data..."));
          sendEvent(controller, encoder.statusEvent("Resume validated. Detecting portfolio strategy..."));

          await delay(150);
          sendEvent(controller, encoder.statusEvent("Strategy detected. Composing portfolio blueprint..."));

          await delay(200);
          sendEvent(controller, encoder.statusEvent("Blueprint composed. Applying design tokens..."));

          await delay(150);
          sendEvent(controller, encoder.statusEvent("Design tokens applied. Building live preview..."));

          const payload = await runResumeGeneration({ resume, theme, animationLevel, customColors: customColors as Record<string, string> | undefined });

          await delay(150);
          sendEvent(controller, encoder.statusEvent("Portfolio generated successfully!"));

          const responseData = {
            ...payload,
            duration: Date.now() - start,
          };

          sendEvent(controller, encoder.doneEvent(JSON.stringify(responseData)));
        });
      }

      const payload = await runResumeGeneration({ resume, theme, animationLevel, customColors: customColors as Record<string, string> | undefined });
      const duration = Date.now() - start;
      await generationRepository.complete(payload.generationId, payload.portfolioData, duration);

      return Response.json(
        successResponse(
          { ...payload, duration },
          "Portfolio generated successfully",
          { duration }
        ),
        { status: 201 }
      );
    }

    const { prompt, stream, strategy, profile } = body as { prompt?: string; stream?: boolean; strategy?: unknown; profile?: unknown };

    if (!prompt || typeof prompt !== "string") {
      return Response.json(errorResponse("Prompt is required"), { status: 400 });
    }

    const validation = GenerateSchema.safeParse({ prompt });
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return Response.json(errorResponse(errors.prompt?.join(", ") || "Invalid prompt"), { status: 400 });
    }

    const enhancedPrompt = strategy && profile
      ? `[PORTFOLIO STRATEGY]\n${JSON.stringify(strategy)}\n\n[USER PROFILE]\n${JSON.stringify(profile)}\n\n[USER PROMPT]\n${prompt}`
      : prompt;

    logger.info(`Generate request: "${prompt.slice(0, 80)}..."`, "API");

    if (stream) {
      return createStreamingResponse(async (controller) => {
        const encoder = createStreamEncoder();
        const ai = getAIProvider();

        sendEvent(controller, encoder.statusEvent("Validating prompt..."));

        const aiContext = analyzePrompt(prompt);
        sendEvent(controller, encoder.statusEvent("Prompt analyzed. Detecting design language..."));

        await delay(200);
        sendEvent(controller, encoder.statusEvent("Analyzing prompt intelligence..."));

        await delay(300);
        sendEvent(controller, encoder.statusEvent("Generating composition graph with AI..."));

        let composition;
        try {
          composition = await ai.generateCompositionGraph(enhancedPrompt, aiContext);
        } catch (compErr) {
          if (isRateLimitError(compErr)) {
            sendEvent(controller, encoder.statusEvent("AI rate limited. Waiting before retry..."));
            await waitForRateLimit(compErr);
            try {
              composition = await ai.generateCompositionGraph(enhancedPrompt, aiContext);
            } catch {
              composition = buildCompositionGraph(prompt, aiContext, Date.now());
            }
          } else {
            composition = buildCompositionGraph(prompt, aiContext, Date.now());
          }
        }

        sendEvent(controller, encoder.statusEvent("Applying explicit color overrides from prompt..."));

        composition.theme = applyExplicitColorOverrides(composition.theme, prompt);

        sendEvent(controller, encoder.statusEvent("Composition graph generated. Running refinement..."));

        const refinement = refineComposition(composition);
        validateComposition(refinement.composition);

        sendEvent(controller, encoder.statusEvent("Composition refined and validated. Generating content..."));

        await delay(200);
        sendEvent(controller, encoder.statusEvent("Generating unique portfolio content..."));

        let portfolioData;
        try {
          portfolioData = await ai.generatePortfolioData(enhancedPrompt, refinement.composition);
        } catch (contentErr) {
          if (isRateLimitError(contentErr)) {
            sendEvent(controller, encoder.statusEvent("AI rate limited. Waiting before retry..."));
            await waitForRateLimit(contentErr);
            try {
              portfolioData = await ai.generatePortfolioData(enhancedPrompt, refinement.composition);
            } catch {
              portfolioData = await ai.generatePortfolio(enhancedPrompt);
            }
          } else {
            portfolioData = await ai.generatePortfolio(enhancedPrompt);
          }
        }

        sendEvent(controller, encoder.statusEvent("Injecting exact user details from prompt..."));

        const extracted = extractUserDetails(prompt);
        portfolioData = injectUserDetails(portfolioData, extracted);

        sendEvent(controller, encoder.statusEvent("Content generated. Running design self-review..."));

        await delay(200);
        const review = reviewAndImprove(refinement.composition, portfolioData, prompt);

        sendEvent(controller, encoder.statusEvent("Self-review complete. Applying auto-fixes..."));

        await delay(150);
        const reviewedData = review.portfolioData;
        const reviewedComposition = review.composition;

        sendEvent(controller, encoder.statusEvent("Building live preview..."));

        const sandpack = buildSandpackResponse(reviewedData, reviewedComposition);

        sendEvent(controller, encoder.statusEvent("Saving to database..."));

        const portfolio = await portfolioRepository.create({});
        await portfolioRepository.createVersion(
          portfolio.id,
          1,
          prompt,
          reviewedData,
          reviewedComposition.theme.mode,
          reviewedComposition.layout.style,
        );

        const generation = await generationRepository.create({ prompt, portfolioId: portfolio.id });

        const duration = Date.now() - start;
        await generationRepository.complete(generation.id, reviewedData, duration);

        sendEvent(controller, encoder.statusEvent("Portfolio generated successfully!"));

        const responseData = {
          portfolioId: portfolio.id,
          portfolioData: reviewedData,
          composition: reviewedComposition,
          generationId: generation.id,
          duration,
          sandpack,
          reviewReport: review.report,
        };

        sendEvent(controller, encoder.doneEvent(JSON.stringify(responseData)));
      });
    }

    const ai = getAIProvider();
    const aiContext = analyzePrompt(prompt);

    let composition;
    try {
      composition = await ai.generateCompositionGraph(enhancedPrompt, aiContext);
    } catch (compErr) {
      if (isRateLimitError(compErr)) {
        await waitForRateLimit(compErr);
        try {
          composition = await ai.generateCompositionGraph(enhancedPrompt, aiContext);
        } catch {
          composition = buildCompositionGraph(prompt, aiContext, Date.now());
        }
      } else {
        composition = buildCompositionGraph(prompt, aiContext, Date.now());
      }
    }

    composition.theme = applyExplicitColorOverrides(composition.theme, prompt);

    const refinement = refineComposition(composition);

    let portfolioData;
    try {
      portfolioData = await ai.generatePortfolioData(enhancedPrompt, refinement.composition);
    } catch (contentErr) {
      if (isRateLimitError(contentErr)) {
        await waitForRateLimit(contentErr);
        try {
          portfolioData = await ai.generatePortfolioData(enhancedPrompt, refinement.composition);
        } catch {
          portfolioData = await ai.generatePortfolio(enhancedPrompt);
        }
      } else {
        portfolioData = await ai.generatePortfolio(enhancedPrompt);
      }
    }

    const extracted = extractUserDetails(prompt);
    portfolioData = injectUserDetails(portfolioData, extracted);

    const review = reviewAndImprove(refinement.composition, portfolioData, prompt);
    const reviewedData = review.portfolioData;
    const reviewedComposition = review.composition;

    const sandpack = buildSandpackResponse(reviewedData, reviewedComposition);

    const portfolio = await portfolioRepository.create({});
    await portfolioRepository.createVersion(
      portfolio.id,
      1,
      prompt,
      reviewedData,
      reviewedComposition.theme.mode,
      reviewedComposition.layout.style,
    );

    const generation = await generationRepository.create({ prompt, portfolioId: portfolio.id });
    const duration = Date.now() - start;
    await generationRepository.complete(generation.id, reviewedData, duration);

    logger.info(`Generate completed in ${duration}ms`, "API");

    return Response.json(
      successResponse(
        {
          portfolioId: portfolio.id,
          portfolioData: reviewedData,
          composition: reviewedComposition,
          generationId: generation.id,
          sandpack,
          reviewReport: review.report,
        },
        "Portfolio generated successfully",
        { duration }
      ),
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
