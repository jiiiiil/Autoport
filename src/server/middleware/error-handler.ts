import { NextResponse } from "next/server";
import { AppError, ValidationError, logger, type ErrorCode } from "@/server/utils";

export interface ApiErrorBody {
  success: false;
  message: string;
  code: ErrorCode;
  error: { code: ErrorCode; message: string };
  data?: unknown;
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof ValidationError) {
    logger.error(`Validation error: ${error.message}`, "ErrorHandler", error.errors);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        code: error.code,
        error: { code: error.code, message: error.message },
        data: error.errors,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof AppError) {
    logger.error(`App error: ${error.message}`, "ErrorHandler");
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        code: error.code,
        error: { code: error.code, message: error.message },
      },
      { status: error.statusCode }
    );
  }

  logger.error("Unknown error", "ErrorHandler", error);
  return NextResponse.json(
    {
      success: false,
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" },
    },
    { status: 500 }
  );
}
