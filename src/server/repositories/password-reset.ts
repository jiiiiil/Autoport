import { prisma } from "@/server/config";

export const passwordResetRepository = {
  async create(data: { userId: string; tokenHash: string; expiresAt: Date }) {
    return prisma.passwordResetToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  },

  async findByTokenHash(tokenHash: string) {
    return prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  },

  async markUsed(id: string, usedAt: Date = new Date()) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt },
    });
  },

  async deleteForUser(userId: string) {
    return prisma.passwordResetToken.deleteMany({ where: { userId } });
  },

  async deleteExpired(now: Date = new Date()) {
    return prisma.passwordResetToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: now } }, { usedAt: { not: null } }],
      },
    });
  },
};
