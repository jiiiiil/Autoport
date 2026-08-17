import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";

const KEY_LENGTH = 64;
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };
const SALT_BYTES = 16;

/**
 * Hash a plaintext password using scrypt with a random salt.
 * Stored format: `salt:hash` (both hex) so no separate salt column is needed.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH, SCRYPT_PARAMS).toString("hex");
  return `${salt}:${hash}`;
}

/** Verify a plaintext password against a stored `salt:hash` value (timing-safe). */
export function verifyPassword(password: string, stored: string): boolean {
  const separator = stored.indexOf(":");
  if (separator === -1) return false;
  const salt = stored.slice(0, separator);
  const expectedHash = stored.slice(separator + 1);
  if (!salt || !expectedHash) return false;

  const candidate = scryptSync(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
  const expected = Buffer.from(expectedHash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

/** Generate a cryptographically secure random token for password resets. */
export function generateSecureToken(byteLength = 32): string {
  return randomBytes(byteLength).toString("hex");
}

/** Hash a token so only the digest is stored server-side. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
