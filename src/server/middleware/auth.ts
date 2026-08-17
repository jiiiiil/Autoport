import { verifyAuthToken } from "@/server/auth";
import { getAuthCookieValue } from "@/server/auth";
import { prisma } from "@/server/config";
import { AuthenticationError, ForbiddenError, NotFoundError } from "@/server/utils";
import type { ServerUser } from "@/server/types";

/**
 * Resolve the authenticated user from the HttpOnly auth cookie.
 * Returns null when no valid session exists.
 */
export async function getCurrentUser(): Promise<ServerUser | null> {
  const token = await getAuthCookieValue();
  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) return null;

  return user as ServerUser;
}

/** Require an authenticated user. Throws 401 when absent. */
export async function requireAuth(): Promise<ServerUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
}

/** Resolve the current user without rejecting (used for optional auth). */
export async function optionalAuth(): Promise<ServerUser | null> {
  return getCurrentUser();
}

/**
 * Authorization: verify the portfolio exists AND belongs to the user.
 * Returns the portfolio. Throws 404 to avoid resource enumeration.
 */
export async function requirePortfolioOwnership(userId: string, portfolioId: string) {
  const portfolio = await prisma.portfolio.findFirst({
    where: { id: portfolioId, userId },
  });
  if (!portfolio) {
    throw new NotFoundError("Portfolio");
  }
  return portfolio;
}

/**
 * Authorization: verify the project exists AND belongs to the user
 * through its portfolio.
 */
export async function requireProjectAccess(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      portfolio: { userId },
    },
  });
  if (!project) {
    throw new NotFoundError("Project");
  }
  return project;
}

/**
 * Authorization: verify the generation exists AND belongs to the user.
 */
export async function requireGenerationOwnership(userId: string, generationId: string) {
  const generation = await prisma.generation.findFirst({
    where: { id: generationId, userId },
  });
  if (!generation) {
    throw new NotFoundError("Generation");
  }
  return generation;
}

export { ForbiddenError };
