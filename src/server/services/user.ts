import { prisma } from "@/server/config";
import { hashPassword, verifyPassword } from "@/server/auth";
import { userRepository } from "@/server/repositories";
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  NotFoundError,
} from "@/server/utils";
import type { SafeUser } from "@/server/types";

function toSafeUser(user: { id: string; name: string; email: string; createdAt: Date; updatedAt: Date }): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const userService = {
  async getProfile(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    return toSafeUser(user);
  },

  async updateProfile(
    userId: string,
    data: { name?: string; email?: string }
  ): Promise<SafeUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    const update: { name?: string; email?: string } = {};
    if (data.name !== undefined) update.name = data.name;

    if (data.email !== undefined) {
      const email = data.email.trim().toLowerCase();
      if (email !== user.email) {
        const existing = await userRepository.findByEmail(email);
        if (existing && existing.id !== userId) {
          throw new EmailAlreadyExistsError();
        }
      }
      update.email = email;
    }

    const updated = await userRepository.update(userId, update);
    return toSafeUser(updated);
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    if (!verifyPassword(currentPassword, user.passwordHash)) {
      throw new InvalidCredentialsError();
    }

    await userRepository.updatePassword(userId, hashPassword(newPassword));
  },

  async getSettings(userId: string) {
    let settings = await prisma.userSettings.findUnique({ where: { userId } });
    if (!settings) {
      settings = await prisma.userSettings.create({ data: { userId } });
    }
    return settings;
  },

  async updateSettings(
    userId: string,
    data: { theme?: string; language?: string; notifications?: Record<string, unknown> }
  ) {
    const existing = await prisma.userSettings.findUnique({ where: { userId } });
    if (!existing) {
      return prisma.userSettings.create({
        data: {
          userId,
          ...(data.theme !== undefined ? { theme: data.theme } : {}),
          ...(data.language !== undefined ? { language: data.language } : {}),
          ...(data.notifications !== undefined ? { notifications: data.notifications as never } : {}),
        },
      });
    }
    return prisma.userSettings.update({
      where: { userId },
      data: {
        ...(data.theme !== undefined ? { theme: data.theme } : {}),
        ...(data.language !== undefined ? { language: data.language } : {}),
        ...(data.notifications !== undefined ? { notifications: data.notifications as never } : {}),
      },
    });
  },
};
