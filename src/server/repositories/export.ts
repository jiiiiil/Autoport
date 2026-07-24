import { prisma } from "@/server/config";

export const exportRepository = {
  async create(data: { portfolioId: string; format: string; versionId?: string }) {
    return prisma.exportJob.create({
      data: {
        portfolioId: data.portfolioId,
        format: data.format,
        versionId: data.versionId ?? null,
        status: "pending",
      },
    });
  },

  async findById(id: string) {
    return prisma.exportJob.findUnique({ where: { id } });
  },

  async complete(id: string, fileUrl: string) {
    return prisma.exportJob.update({
      where: { id },
      data: {
        status: "completed",
        fileUrl,
        completedAt: new Date(),
      },
    });
  },

  async fail(id: string, error: string) {
    return prisma.exportJob.update({
      where: { id },
      data: {
        status: "failed",
        error,
        completedAt: new Date(),
      },
    });
  },

  async count(where?: { status?: string; portfolioId?: string }) {
    return prisma.exportJob.count({ where });
  },
};
