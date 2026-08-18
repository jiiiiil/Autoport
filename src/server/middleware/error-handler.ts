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

  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error("Unknown error", "ErrorHandler", error);
  
  // In development, send full error details for debugging
  if (process.env.NODE_ENV === "development") {
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        code: "INTERNAL_SERVER_ERROR",
        error: { code: "INTERNAL_SERVER_ERROR", message: errorMessage },
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }

  // In production, send generic message but log full details
  return NextResponse.json(
    {
      success: false,
      message: "An unexpected error occurred. Please try again or contact support if the issue persists.",
      code: "INTERNAL_SERVER_ERROR",
      error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" },
    },
    { status: 500 }
  );
}
