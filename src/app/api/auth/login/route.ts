import { NextRequest } from "next/server";
import { authService } from "@/server/services";
import { successResponse, errorResponse, rateLimit, getClientIp, logger } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { LoginSchema, type LoginInput } from "@/server/validators";
import { getEnv } from "@/server/config/env";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    rateLimit(`login:${getClientIp(req)}`, {
      limit: getEnv().NODE_ENV === "test" ? 500 : 15,
      windowMs: 15 * 60 * 1000,
    });

    const body = (await req.json().catch(() => null)) as Partial<LoginInput> | null;

    const validation = LoginSchema.safeParse(body ?? {});
    if (!validation.success) {
      return Response.json(
        errorResponse("Validation failed", validation.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    const user = await authService.login(validation.data);

    logger.info(`Login success: ${user.email}`, "API");

    return Response.json(successResponse({ user }, "Signed in successfully"), { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
