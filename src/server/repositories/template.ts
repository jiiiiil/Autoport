import { prisma } from "@/server/config";

export const templateRepository = {
  async create(data: { name: string; description?: string; category?: string; promptTemplate: string }) {
    return prisma.template.create({ data });
  },

  async findByName(name: string) {
    return prisma.template.findUnique({ where: { name } });
  },

  async findActive(category?: string) {
    return prisma.template.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
    });
  },

  async findMany() {
    return prisma.template.findMany({ orderBy: { createdAt: "desc" } });
  },
};
