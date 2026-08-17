import { NextRequest } from "next/server";
import { requireAuth } from "@/server/middleware";
import { userService } from "@/server/services";
import { successResponse } from "@/server/utils";
import { handleError } from "@/server/middleware";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const user = await requireAuth();
    const profile = await userService.getProfile(user.id);
    return Response.json(successResponse({ user: profile }, "Current user"));
  } catch (error) {
    return handleError(error);
  }
}
