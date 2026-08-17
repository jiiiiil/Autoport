import { createHmac, timingSafeEqual } from "node:crypto";
import { getEnv } from "@/server/config/env";

export interface AuthTokenPayload {
  /** User id (JWT `sub`) */
  sub: string;
  /** Issued at (seconds) */
  iat?: number;
  /** Expiry (seconds) */
  exp?: number;
}

interface TokenParts {
  header: string;
  payload: string;
  signature: string;
}

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="), "base64");
}

function sign(data: string): string {
  return createHmac("sha256", getEnv().JWT_SECRET).update(data).digest("base64url").replace(/=+$/g, "");
}

function splitToken(token: string): TokenParts | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  if (!header || !payload || !signature) return null;
  return { header, payload, signature };
}

/**
 * Sign a JWT containing only the user id (minimal payload).
 * The token is HMAC-SHA256 signed with the existing JWT_SECRET.
 */
export function signAuthToken(userId: string): string {
  const env = getEnv();
  const now = Math.floor(Date.now() / 1000);
  const expiresInSeconds = parseExpiry(env.JWT_EXPIRES_IN);

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: userId,
      iat: now,
      exp: now + expiresInSeconds,
    })
  );

  return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
}

/** Verify and decode a JWT. Returns null when invalid or expired. */
export function verifyAuthToken(token: string): AuthTokenPayload | null {
  const parts = splitToken(token);
  if (!parts) return null;

  const expectedSignature = sign(`${parts.header}.${parts.payload}`);
  const actualSignature = Buffer.from(parts.signature, "base64url");
  const expectedBuffer = Buffer.from(expectedSignature, "base64url");

  if (actualSignature.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(actualSignature, expectedBuffer)) return null;

  let payload: AuthTokenPayload;
  try {
    payload = JSON.parse(base64UrlDecode(parts.payload).toString("utf8")) as AuthTokenPayload;
  } catch {
    return null;
  }

  if (!payload.sub || typeof payload.sub !== "string") return null;

  if (typeof payload.exp === "number" && payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

export function getTokenExpirySeconds(payload: AuthTokenPayload): number {
  if (typeof payload.exp !== "number" || typeof payload.iat !== "number") {
    return parseExpiry(getEnv().JWT_EXPIRES_IN);
  }
  return Math.max(0, payload.exp - payload.iat);
}

function parseExpiry(value: string): number {
  const match = value.trim().match(/^(\d+)([smhdw])?$/i);
  if (!match) return 7 * 24 * 60 * 60;
  const amount = parseInt(match[1], 10);
  const unit = (match[2] ?? "d").toLowerCase();
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
    w: 7 * 24 * 60 * 60,
  };
  return amount * (multipliers[unit] ?? 24 * 60 * 60);
}
