import { NextRequest } from "next/server";
import { requireAuth, requirePortfolioOwnership } from "@/server/middleware";
import { prisma } from "@/server/config";
import { portfolioRepository } from "@/server/repositories";
import { successResponse, errorResponse } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { UpdatePortfolioSchema, type UpdatePortfolioInput } from "@/server/validators";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest,   ctx: RouteContext<"/api/portfolios/[id]">) {
  try {
    const user = await requireAuth();
    const { id } = await ctx.params;

    const portfolio = await requirePortfolioOwnership(user.id, id);
    const versions = await prisma.portfolioVersion.findMany({
      where: { portfolioId: id },
      orderBy: { version: "desc" },
    });

    return Response.json(successResponse({ portfolio, versions }, "Portfolio retrieved"));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest,   ctx: RouteContext<"/api/portfolios/[id]">) {
  try {
    const user = await requireAuth();
    const { id } = await ctx.params;

    await requirePortfolioOwnership(user.id, id);

    const body = (await req.json().catch(() => null)) as Partial<UpdatePortfolioInput> | null;
    const validation = UpdatePortfolioSchema.safeParse(body ?? {});
    if (!validation.success) {
      return Response.json(
        errorResponse("Validation failed", validation.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    const portfolio = await portfolioRepository.update(id, validation.data);
    return Response.json(successResponse({ portfolio }, "Portfolio updated"));
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_req: NextRequest,   ctx: RouteContext<"/api/portfolios/[id]">) {
  try {
    const user = await requireAuth();
    const { id } = await ctx.params;

    await requirePortfolioOwnership(user.id, id);
    await portfolioRepository.delete(id);

    return Response.json(successResponse(null, "Portfolio deleted"));
  } catch (error) {
    return handleError(error);
  }
}
