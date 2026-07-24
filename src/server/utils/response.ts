import type { ApiResponse } from "@/server/types";

export function successResponse<T>(data: T, message = "Success", meta?: Record<string, unknown>): ApiResponse<T> {
  return { success: true, message, data, meta };
}

export function errorResponse(message: string, data?: unknown): ApiResponse {
  return { success: false, message, data };
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = "Success"
): ApiResponse<T[]> {
  return {
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
