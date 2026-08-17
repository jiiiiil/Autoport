import { NextRequest } from "next/server";
import { authService } from "@/server/services";
import { successResponse, errorResponse, rateLimit, getClientIp } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { ResetPasswordSchema, type ResetPasswordInput } from "@/server/validators";
import { getEnv } from "@/server/config/env";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    rateLimit(`reset-password:${getClientIp(req)}`, {
      limit: getEnv().NODE_ENV === "test" ? 500 : 5,
      windowMs: 60 * 60 * 1000,
    });

    const body = (await req.json().catch(() => null)) as Partial<ResetPasswordInput> | null;

    const validation = ResetPasswordSchema.safeParse(body ?? {});
    if (!validation.success) {
      return Response.json(
        errorResponse("Validation failed", validation.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    await authService.resetPassword(validation.data);

    return Response.json(successResponse(null, "Password reset successfully"), { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
