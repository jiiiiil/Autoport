import { prisma } from "@/server/config";
import type { ServerUser, SafeUser } from "@/server/types";

export type PublicUserFields = SafeUser;

function toSafeUser(user: ServerUser): PublicUserFields {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: { name: string; email: string; passwordHash: string }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        settings: {
          create: {},
        },
      },
    });
  },

  async update(id: string, data: { name?: string; email?: string }) {
    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
      },
    });
  },

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  toSafeUser,
};
