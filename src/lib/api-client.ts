"use client";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string | undefined;
  public readonly data: unknown;

  constructor(message: string, status: number, code?: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  error?: { code: string; message: string };
}

export function emitUnauthorized(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
  headers?: Record<string, string>;
}

/**
 * Centralized API client.
 * - Sends credentials (HttpOnly cookie) with every request.
 * - Parses JSON and normalizes errors to ApiError.
 * - Fires a global `auth:unauthorized` event on 401 responses.
 */
export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = "GET", body, query, headers } = options;

  const url = new URL(path, window.location.origin);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url.toString(), {
    method,
    credentials: "same-origin",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await response.json()) as ApiEnvelope<T>;
  } catch {
    envelope = null;
  }

  if (!response.ok) {
    const message = envelope?.error?.message ?? envelope?.message ?? `Request failed (${response.status})`;
    const code = envelope?.error?.code;

    if (response.status === 401) {
      emitUnauthorized();
    }

    throw new ApiError(message, response.status, code, envelope?.data);
  }

  return envelope?.data as T;
}
