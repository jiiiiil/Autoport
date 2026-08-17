import {
  signAuthToken,
  setAuthCookie,
  clearAuthCookie,
  hashPassword,
  verifyPassword,
  generateSecureToken,
  hashToken,
} from "@/server/auth";
import { userRepository, passwordResetRepository } from "@/server/repositories";
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidResetTokenError,
  ExpiredResetTokenError,
  logger,
} from "@/server/utils";
import { getEnv } from "@/server/config/env";
import type { SafeUser } from "@/server/types";

const RESET_TOKEN_BYTES = 32;

function toSafeUser(user: SafeUser): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/** Email delivery stub — replace with a real provider (e.g. Resend/SMTP). */
async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const env = getEnv();
  if (env.NODE_ENV !== "production") {
    logger.info(`[dev] Password reset link for ${email}: ${resetUrl}`, "AuthService");
  }
}

export const authService = {
  async register(input: { name: string; email: string; password: string }): Promise<SafeUser> {
    const email = input.email.trim().toLowerCase();

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyExistsError();
    }

    const user = await userRepository.create({
      name: input.name,
      email,
      passwordHash: hashPassword(input.password),
    });

    const token = signAuthToken(user.id);
    await setAuthCookie(token);

    logger.info(`User registered: ${user.id}`, "AuthService");
    return toSafeUser(user);
  },

  async login(input: { email: string; password: string }): Promise<SafeUser> {
    const email = input.email.trim().toLowerCase();
    const user = await userRepository.findByEmail(email);

    if (!user || !verifyPassword(input.password, user.passwordHash)) {
      throw new InvalidCredentialsError();
    }

    const token = signAuthToken(user.id);
    await setAuthCookie(token);

    return toSafeUser(user);
  },

  async logout(): Promise<void> {
    await clearAuthCookie();
  },

  async me(user: SafeUser): Promise<SafeUser> {
    return toSafeUser(user);
  },

  async forgotPassword(input: { email: string }): Promise<void> {
    const email = input.email.trim().toLowerCase();
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return;
    }

    await passwordResetRepository.deleteForUser(user.id);

    const token = generateSecureToken(RESET_TOKEN_BYTES);
    const tokenHash = hashToken(token);
    const ttlMs = getEnv().PASSWORD_RESET_TOKEN_TTL_MS;
    const expiresAt = new Date(Date.now() + ttlMs);

    await passwordResetRepository.create({ userId: user.id, tokenHash, expiresAt });

    const resetUrl = `${getEnv().APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  },

  async resetPassword(input: { token: string; password: string }): Promise<void> {
    const tokenHash = hashToken(input.token.trim());
    const record = await passwordResetRepository.findByTokenHash(tokenHash);

    if (!record || record.usedAt !== null) {
      throw new InvalidResetTokenError();
    }

    if (record.expiresAt.getTime() < Date.now()) {
      throw new ExpiredResetTokenError();
    }

    await userRepository.updatePassword(record.userId, hashPassword(input.password));
    await passwordResetRepository.markUsed(record.id);
    await passwordResetRepository.deleteForUser(record.userId);
  },
};
