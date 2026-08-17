import { NextRequest } from "next/server";
import { requireAuth, requirePortfolioOwnership, requireProjectAccess } from "@/server/middleware";
import { projectRepository } from "@/server/repositories";
import { successResponse, errorResponse } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { UpdateProjectSchema, type UpdateProjectInput } from "@/server/validators";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/portfolios/[id]/projects/[projectId]">
) {
  try {
    const user = await requireAuth();
    const { id: portfolioId, projectId } = await ctx.params;

    await requirePortfolioOwnership(user.id, portfolioId);
    const project = await requireProjectAccess(user.id, projectId);

    return Response.json(successResponse({ project }, "Project retrieved"));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/portfolios/[id]/projects/[projectId]">
) {
  try {
    const user = await requireAuth();
    const { id: portfolioId, projectId } = await ctx.params;

    await requirePortfolioOwnership(user.id, portfolioId);
    await requireProjectAccess(user.id, projectId);

    const body = (await req.json().catch(() => null)) as Partial<UpdateProjectInput> | null;
    const validation = UpdateProjectSchema.safeParse(body ?? {});
    if (!validation.success) {
      return Response.json(
        errorResponse("Validation failed", validation.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    const project = await projectRepository.update(projectId, validation.data);
    return Response.json(successResponse({ project }, "Project updated"));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/portfolios/[id]/projects/[projectId]">
) {
  try {
    const user = await requireAuth();
    const { id: portfolioId, projectId } = await ctx.params;

    await requirePortfolioOwnership(user.id, portfolioId);
    await requireProjectAccess(user.id, projectId);
    await projectRepository.delete(projectId);

    return Response.json(successResponse(null, "Project deleted"));
  } catch (error) {
    return handleError(error);
  }
}
