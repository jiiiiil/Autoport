import { NextRequest } from "next/server";
import { requireAuth } from "@/server/middleware";
import { generationRepository } from "@/server/repositories";
import { successResponse } from "@/server/utils";
import { handleError } from "@/server/middleware";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "50", 10) || 50, 1), 200);

    const generations = await generationRepository.listByUser(user.id, limit);
    return Response.json(successResponse({ generations }, "Generations retrieved"));
  } catch (error) {
    return handleError(error);
  }
}
