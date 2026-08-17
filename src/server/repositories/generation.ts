import { prisma } from "@/server/config";

export const generationRepository = {
  async create(data: { prompt: string; portfolioId?: string; userId?: string }) {
    return prisma.generation.create({
      data: {
        prompt: data.prompt,
        portfolioId: data.portfolioId ?? null,
        userId: data.userId ?? null,
        status: "pending",
      },
    });
  },

  async findById(id: string) {
    return prisma.generation.findUnique({ where: { id } });
  },

  /** Find a generation owned by the given user, or null. */
  async findOwnedById(id: string, userId: string) {
    return prisma.generation.findFirst({
      where: { id, userId },
    });
  },

  async complete(id: string, aiResponse: unknown, duration: number) {
    return prisma.generation.update({
      where: { id },
      data: {
        status: "completed",
        aiResponse: aiResponse as never,
        generatedCode: (aiResponse as never) ?? undefined,
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

  async listByUser(userId: string, take = 50) {
    return prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
      include: {
        portfolio: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  },

  async count(where?: { status?: string; portfolioId?: string; userId?: string }) {
    return prisma.generation.count({ where });
  },

  async findMany(options?: { skip?: number; take?: number; orderBy?: { createdAt: "asc" | "desc" }; userId?: string }) {
    const { userId, ...rest } = options ?? {};
    return prisma.generation.findMany({
      ...rest,
      where: userId ? { userId } : undefined,
    });
  },
};
