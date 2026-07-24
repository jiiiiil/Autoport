import { prisma } from "@/server/config";

export const generationRepository = {
  async create(data: { prompt: string; portfolioId?: string }) {
    return prisma.generation.create({
      data: {
        prompt: data.prompt,
        portfolioId: data.portfolioId ?? null,
        status: "pending",
      },
    });
  },

  async findById(id: string) {
    return prisma.generation.findUnique({ where: { id } });
  },

  async complete(id: string, aiResponse: unknown, duration: number) {
    return prisma.generation.update({
      where: { id },
      data: {
        status: "completed",
        aiResponse: aiResponse as never,
        duration,
        completedAt: new Date(),
      },
    });
  },

  async fail(id: string, error: string) {
    return prisma.generation.update({
      where: { id },
      data: {
        status: "failed",
        error,
        completedAt: new Date(),
      },
    });
  },

  async count(where?: { status?: string; portfolioId?: string }) {
    return prisma.generation.count({ where });
  },

  async findMany(options?: { skip?: number; take?: number; orderBy?: { createdAt: "asc" | "desc" } }) {
    return prisma.generation.findMany(options);
  },
};
