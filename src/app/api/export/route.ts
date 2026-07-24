import { NextRequest, NextResponse } from "next/server";
import { exportService } from "@/server/services";
import { successResponse, errorResponse, logger } from "@/server/utils";
import { handleError } from "@/server/middleware";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { portfolioId, format } = body as { portfolioId?: string; format?: string };

    if (!portfolioId || typeof portfolioId !== "string") {
      return NextResponse.json(
        errorResponse("Portfolio ID is required"),
        { status: 400 }
      );
    }

    const validFormats = ["html", "json", "zip"];
    if (format && !validFormats.includes(format)) {
      return NextResponse.json(
        errorResponse(`Invalid format. Must be one of: ${validFormats.join(", ")}`),
        { status: 400 }
      );
    }

    logger.info(`Export request for portfolio ${portfolioId}`, "API");

    const job = await exportService.createExport(portfolioId, format ?? "html");

    return NextResponse.json(
      successResponse(
        { exportId: job.id, status: job.status },
        "Export job created"
      ),
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        errorResponse("Export ID is required"),
        { status: 400 }
      );
    }

    const job = await exportService.getExport(id);

    return NextResponse.json(
      successResponse(job, "Export status retrieved")
    );
  } catch (error) {
    return handleError(error);
  }
}
