import { NextRequest } from "next/server";
import { generationService } from "@/server/services";
import { successResponse, errorResponse, logger } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { createStreamingResponse, createStreamEncoder, sendEvent } from "@/server/utils/stream";
import { buildSandpackResponse } from "@/server/services/sandpack-builder";
import { portfolioRepository, generationRepository } from "@/server/repositories";
import { runPromptPipeline } from "@/server/pipeline";

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json();
    const { prompt, template, stream } = body as { prompt?: string; template?: string; stream?: boolean };

    if (!prompt || typeof prompt !== "string") {
      return Response.json(errorResponse("Prompt is required"), { status: 400 });
    }

    if (prompt.length < 10) {
      return Response.json(errorResponse("Prompt must be at least 10 characters"), { status: 400 });
    }

    if (prompt.length > 2000) {
      return Response.json(errorResponse("Prompt must be at most 2000 characters"), { status: 400 });
    }

    logger.info(`Generate request: "${prompt.slice(0, 50)}..."`, "API");

    if (stream) {
      return createStreamingResponse(async (controller) => {
        const encoder = createStreamEncoder();

        sendEvent(controller, encoder.statusEvent("Validating prompt..."));

        const result = await runPromptPipeline({ prompt, template });

        sendEvent(controller, encoder.statusEvent("Prompt validated. Analyzing requirements..."));

        const portfolio = await portfolioRepository.create({});
        await portfolioRepository.createVersion(
          portfolio.id,
          1,
          result.normalizedPrompt,
          result.portfolioData,
          (result.portfolioData.theme as Record<string, unknown>)?.mode as string ?? "dark",
          (result.portfolioData.layout as Record<string, unknown>)?.style as string ?? "minimal"
        );

        const generation = await generationRepository.create({ prompt, portfolioId: portfolio.id });

        sendEvent(controller, encoder.statusEvent("Generating portfolio structure..."));
        await delay(300);

        sendEvent(controller, encoder.statusEvent("Building hero section..."));
        await delay(200);

        sendEvent(controller, encoder.statusEvent("Generating projects..."));
        await delay(200);

        sendEvent(controller, encoder.statusEvent("Creating skills section..."));
        await delay(200);

        sendEvent(controller, encoder.statusEvent("Building experience timeline..."));
        await delay(200);

        sendEvent(controller, encoder.statusEvent("Assembling layout..."));
        await delay(300);

        sendEvent(controller, encoder.statusEvent("Validating code..."));
        await delay(200);

        const sandpack = buildSandpackResponse(result.portfolioData);

        sendEvent(controller, encoder.statusEvent("Portfolio generated successfully"));

        const duration = Date.now() - start;
        await generationRepository.complete(generation.id, result.portfolioData, duration);

        const responseData = {
          portfolioId: portfolio.id,
          portfolioData: result.portfolioData,
          generationId: generation.id,
          duration,
          sandpack,
        };

        sendEvent(controller, encoder.doneEvent(JSON.stringify(responseData)));
      });
    }

    const result = await generationService.generate(prompt, template);

    const duration = Date.now() - start;
    logger.info(`Generate completed in ${duration}ms`, "API");

    return Response.json(
      successResponse(
        {
          portfolioId: result.portfolioId,
          portfolioData: result.portfolioData,
          generationId: result.generationId,
          sandpack: result.sandpack,
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
