import { NextRequest } from "next/server";
import { authService } from "@/server/services";
import { successResponse } from "@/server/utils";
import { handleError } from "@/server/middleware";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  try {
    await authService.logout();
    return Response.json(successResponse(null, "Signed out successfully"), { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
