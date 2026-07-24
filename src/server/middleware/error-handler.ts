import { NextResponse } from "next/server";
import { AppError, ValidationError, logger } from "@/server/utils";

export function handleError(error: unknown): NextResponse {
  if (error instanceof ValidationError) {
    logger.error(`Validation error: ${error.message}`, "ErrorHandler", error.errors);
    return NextResponse.json(
      { success: false, message: error.message, data: error.errors },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    logger.error(`App error: ${error.message}`, "ErrorHandler");
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode }
    );
  }

  logger.error("Unknown error", "ErrorHandler", error);
  return NextResponse.json(
    { success: false, message: "Internal server error" },
    { status: 500 }
  );
}
