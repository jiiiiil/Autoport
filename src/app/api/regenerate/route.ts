import { NextRequest } from "next/server";
import { generationService } from "@/server/services";
import { successResponse, errorResponse, logger } from "@/server/utils";
import { handleError } from "@/server/middleware";

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json();
    const { portfolioId, section, instruction } = body as {
      portfolioId?: string;
      section?: string;
      instruction?: string;
    };

    if (!portfolioId || typeof portfolioId !== "string") {
      return Response.json(errorResponse("Portfolio ID is required"), { status: 400 });
    }

    if (!section || typeof section !== "string") {
      return Response.json(errorResponse("Section is required"), { status: 400 });
    }

    logger.info(`Regenerate request for portfolio ${portfolioId}, section: ${section}`, "API");

    const result = await generationService.regenerate(portfolioId, section, instruction);

    const duration = Date.now() - start;
    logger.info(`Regenerate completed in ${duration}ms`, "API");

    return Response.json(
      successResponse(
        {
          portfolioId: result.portfolioId,
          portfolioData: result.portfolioData,
          generationId: result.generationId,
          sandpack: result.sandpack,
        },
        "Section regenerated successfully",
        { duration }
      )
    );
  } catch (error) {
    return handleError(error);
  }
}
