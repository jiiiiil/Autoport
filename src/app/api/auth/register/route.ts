import { NextRequest } from "next/server";
import { authService } from "@/server/services";
import { successResponse, errorResponse, rateLimit, getClientIp, logger } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { RegisterSchema, type RegisterInput } from "@/server/validators";
import { getEnv } from "@/server/config/env";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    rateLimit(`register:${getClientIp(req)}`, {
      limit: getEnv().NODE_ENV === "test" ? 500 : 20,
      windowMs: 15 * 60 * 1000,
    });

    const body = (await req.json().catch(() => null)) as Partial<RegisterInput> | null;

    const validation = RegisterSchema.safeParse(body ?? {});
    if (!validation.success) {
      return Response.json(
        errorResponse("Validation failed", validation.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    const user = await authService.register(validation.data);

    logger.info(`Register success: ${user.email}`, "API");

    return Response.json(
      successResponse({ user }, "Account created successfully"),
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
