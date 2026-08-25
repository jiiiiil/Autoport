import { prisma } from "@/server/config";
import { portfolioRepository, generationRepository } from "@/server/repositories";
import type { SafeUser } from "@/server/types";

export const dashboardService = {
  async getOverview(user: SafeUser) {
    const [portfolioCount, portfolios, generationHistory] = await Promise.all([
      portfolioRepository.countForUser(user.id),
      portfolioRepository.listByUserWithDetails(user.id),
      generationRepository.listByUser(user.id, 20),
    ]);

    const completedGenerations = generationHistory.filter(g => g.status !== "pending");

    return {
      user,
      stats: {
        portfolioCount,
        generationCount: completedGenerations.length,
      },
      portfolios,
      generations: completedGenerations.map((generation) => ({
        id: generation.id,
        prompt: generation.prompt,
        status: generation.status,
        duration: generation.duration,
        createdAt: generation.createdAt,
        completedAt: generation.completedAt,
        portfolio: generation.portfolio
          ? { id: generation.portfolio.id, name: generation.portfolio.name, slug: generation.portfolio.slug }
          : null,
      })),
    };
  },
};
