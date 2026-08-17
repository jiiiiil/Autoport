import { NextRequest } from "next/server";
import { authService } from "@/server/services";
import { successResponse, errorResponse, rateLimit, getClientIp } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { ForgotPasswordSchema, type ForgotPasswordInput } from "@/server/validators";
import { getEnv } from "@/server/config/env";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    rateLimit(`forgot-password:${getClientIp(req)}`, {
      limit: getEnv().NODE_ENV === "test" ? 500 : 5,
      windowMs: 60 * 60 * 1000,
    });

    const body = (await req.json().catch(() => null)) as Partial<ForgotPasswordInput> | null;

    const validation = ForgotPasswordSchema.safeParse(body ?? {});
    if (!validation.success) {
      return Response.json(
        errorResponse("Validation failed", validation.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    // Generic response — never reveals whether the account exists.
    await authService.forgotPassword(validation.data);

    return Response.json(
      successResponse(null, "If an account exists for that email, a password reset link has been sent"),
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
