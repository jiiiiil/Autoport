import { NextRequest } from "next/server";
import { requireAuth } from "@/server/middleware";
import { portfolioRepository } from "@/server/repositories";
import { successResponse, errorResponse, generateSlug } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { CreatePortfolioSchema, type CreatePortfolioInput } from "@/server/validators";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const user = await requireAuth();
    const portfolios = await portfolioRepository.listByUserWithDetails(user.id);
    return Response.json(successResponse({ portfolios }, "Portfolios retrieved"));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = (await req.json().catch(() => null)) as Partial<CreatePortfolioInput> | null;

    const validation = CreatePortfolioSchema.safeParse(body ?? {});
    if (!validation.success) {
      return Response.json(
        errorResponse("Validation failed", validation.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    const data = validation.data;
    const portfolio = await portfolioRepository.create({
      userId: user.id,
      name: data.name ?? "Untitled Portfolio",
      slug: data.slug ?? generateSlug(),
    });

    return Response.json(successResponse({ portfolio }, "Portfolio created"), { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
