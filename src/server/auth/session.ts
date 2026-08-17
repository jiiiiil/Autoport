import { cookies } from "next/headers";
import { getEnv } from "@/server/config/env";

export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export interface AuthCookieOptions {
  maxAge?: number;
}

/**
 * Set the HttpOnly authentication cookie.
 * The cookie carries only the signed JWT — it is never readable from JS.
 */
export async function setAuthCookie(value: string, options: AuthCookieOptions = {}): Promise<void> {
  const store = await cookies();
  const isProduction = getEnv().NODE_ENV === "production";
  store.set(AUTH_COOKIE_NAME, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: options.maxAge ?? AUTH_COOKIE_MAX_AGE_SECONDS,
  });
}

/** Clear the authentication cookie (used on logout). */
export async function clearAuthCookie(): Promise<void> {
  const store = await cookies();
  store.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: getEnv().NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** Read the raw JWT from the auth cookie (or null when absent). */
export async function getAuthCookieValue(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(AUTH_COOKIE_NAME)?.value ?? null;
  return value && value.length > 0 ? value : null;
}
