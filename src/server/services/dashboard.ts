import { prisma } from "@/server/config";
import { portfolioRepository, generationRepository } from "@/server/repositories";
import type { SafeUser } from "@/server/types";

export const dashboardService = {
  async getOverview(user: SafeUser) {
    const [portfolioCount, portfolios, recentProjects, generationHistory] = await Promise.all([
      portfolioRepository.countForUser(user.id),
      portfolioRepository.listByUserWithDetails(user.id),
      prisma.project.findMany({
        where: { portfolio: { userId: user.id } },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          portfolio: { select: { id: true, name: true, slug: true } },
        },
      }),
      generationRepository.listByUser(user.id, 20),
    ]);

    return {
      user,
      stats: {
        portfolioCount,
        projectCount: recentProjects.length,
        generationCount: generationHistory.length,
      },
      portfolios,
      recentProjects: recentProjects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        createdAt: project.createdAt,
        portfolio: project.portfolio,
      })),
      generations: generationHistory.map((generation) => ({
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
