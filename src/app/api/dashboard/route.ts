import { NextRequest } from "next/server";
import { requireAuth } from "@/server/middleware";
import { dashboardService } from "@/server/services";
import { successResponse } from "@/server/utils";
import { handleError } from "@/server/middleware";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const user = await requireAuth();
    const overview = await dashboardService.getOverview(user);
    return Response.json(successResponse(overview, "Dashboard overview"));
  } catch (error) {
    return handleError(error);
  }
}
