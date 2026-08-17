import { NextRequest } from "next/server";
import { RateLimitError } from "./errors";

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

const buckets = new Map<string, number[]>();

/** Sliding-window in-memory rate limiter. Throws 429 when exceeded. */
export function rateLimit(key: string, options: RateLimitOptions): void {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  const entries = (buckets.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

  if (entries.length >= options.limit) {
    throw new RateLimitError();
  }

  entries.push(now);
  buckets.set(key, entries);
}

/** Best-effort client IP extraction from the request. */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}
