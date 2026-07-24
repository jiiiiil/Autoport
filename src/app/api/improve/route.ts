import { NextRequest } from "next/server";
import { generationService } from "@/server/services";
import { successResponse, errorResponse, logger } from "@/server/utils";
import { handleError } from "@/server/middleware";

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json();
    const { portfolioId, instruction } = body as { portfolioId?: string; instruction?: string };

    if (!portfolioId || typeof portfolioId !== "string") {
      return Response.json(errorResponse("Portfolio ID is required"), { status: 400 });
    }

    if (!instruction || typeof instruction !== "string") {
      return Response.json(errorResponse("Instruction is required"), { status: 400 });
    }

    if (instruction.length < 5) {
      return Response.json(errorResponse("Instruction must be at least 5 characters"), { status: 400 });
    }

    if (instruction.length > 1000) {
      return Response.json(errorResponse("Instruction must be at most 1000 characters"), { status: 400 });
    }

    logger.info(`Improve request for portfolio ${portfolioId}`, "API");

    const result = await generationService.improve(portfolioId, instruction);

    const duration = Date.now() - start;
    logger.info(`Improve completed in ${duration}ms`, "API");

    return Response.json(
      successResponse(
        {
          portfolioId: result.portfolioId,
          portfolioData: result.portfolioData,
          generationId: result.generationId,
          sandpack: result.sandpack,
        },
        "Portfolio improved successfully",
        { duration }
      )
    );
  } catch (error) {
    return handleError(error);
  }
}
