import { NextRequest } from "next/server";
import { requireAuth } from "@/server/middleware";
import { userService } from "@/server/services";
import { successResponse, errorResponse } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { ChangePasswordSchema, type ChangePasswordInput } from "@/server/validators";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = (await req.json().catch(() => null)) as Partial<ChangePasswordInput> | null;

    const validation = ChangePasswordSchema.safeParse(body ?? {});
    if (!validation.success) {
      return Response.json(
        errorResponse("Validation failed", validation.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    await userService.changePassword(user.id, validation.data.currentPassword, validation.data.newPassword);
    return Response.json(successResponse(null, "Password changed successfully"));
  } catch (error) {
    return handleError(error);
  }
}
