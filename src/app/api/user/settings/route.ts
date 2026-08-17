import { NextRequest } from "next/server";
import { requireAuth } from "@/server/middleware";
import { userService } from "@/server/services";
import { successResponse, errorResponse } from "@/server/utils";
import { handleError } from "@/server/middleware";
import { UpdateSettingsSchema, type UpdateSettingsInput } from "@/server/validators";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const user = await requireAuth();
    const settings = await userService.getSettings(user.id);
    return Response.json(successResponse({ settings }, "Settings retrieved"));
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = (await req.json().catch(() => null)) as Partial<UpdateSettingsInput> | null;

    const validation = UpdateSettingsSchema.safeParse(body ?? {});
    if (!validation.success) {
      return Response.json(
        errorResponse("Validation failed", validation.error.flatten().fieldErrors),
        { status: 400 }
      );
    }

    const settings = await userService.updateSettings(user.id, validation.data);
    return Response.json(successResponse({ settings }, "Settings updated"));
  } catch (error) {
    return handleError(error);
  }
}
