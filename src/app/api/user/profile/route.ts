import { NextRequest } from "next/server";
import { requireAuth } from "@/server/middleware";
import { userService } from "@/server/services";
import { successResponse, errorResponse } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { UpdateProfileSchema, type UpdateProfileInput } from "@/server/validators";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const user = await requireAuth();
    const profile = await userService.getProfile(user.id);
    return Response.json(successResponse({ user: profile }, "Profile retrieved"));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = (await req.json().catch(() => null)) as Partial<UpdateProfileInput> | null;

    const validation = UpdateProfileSchema.safeParse(body ?? {});
    if (!validation.success) {
      return Response.json(
        errorResponse("Validation failed", validation.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    const profile = await userService.updateProfile(user.id, validation.data);
    return Response.json(successResponse({ user: profile }, "Profile updated"));
  } catch (error) {
    return handleError(error);
  }
}
