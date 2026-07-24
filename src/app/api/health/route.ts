import { NextResponse } from "next/server";
import { healthService } from "@/server/services";
import { successResponse, logger } from "@/server/utils";
import { handleError } from "@/server/middleware";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = await healthService.check();

    const status = health.database.status === "connected" ? 200 : 503;

    logger.info("Health check completed", "API", { status: health.status });

    return NextResponse.json(
      successResponse(health, "Health check completed"),
      { status }
    );
  } catch (error) {
    return handleError(error);
  }
}
