import { NextRequest } from "next/server";
import { requireAuth, requirePortfolioOwnership } from "@/server/middleware";
import { projectRepository } from "@/server/repositories";
import { successResponse, errorResponse } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { CreateProjectSchema, type CreateProjectInput } from "@/server/validators";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest,   ctx: RouteContext<"/api/portfolios/[id]/projects">) {
  try {
    const user = await requireAuth();
    const { id: portfolioId } = await ctx.params;

    await requirePortfolioOwnership(user.id, portfolioId);

    const projects = await projectRepository.listByPortfolio(portfolioId);
    return Response.json(successResponse({ projects }, "Projects retrieved"));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest,   ctx: RouteContext<"/api/portfolios/[id]/projects">) {
  try {
    const user = await requireAuth();
    const { id: portfolioId } = await ctx.params;

    await requirePortfolioOwnership(user.id, portfolioId);

    const body = (await req.json().catch(() => null)) as Partial<CreateProjectInput> | null;
    const validation = CreateProjectSchema.safeParse(body ?? {});
    if (!validation.success) {
      return Response.json(
        errorResponse("Validation failed", validation.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    const project = await projectRepository.create({
      portfolioId,
      ...validation.data,
    });

    return Response.json(successResponse({ project }, "Project created"), { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
