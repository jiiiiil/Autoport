import { prisma, getEnv } from "@/server/config";
import { portfolioRepository, generationRepository } from "@/server/repositories";

export const healthService = {
  async check() {
    const env = getEnv();
    const dbHealthy = await this.checkDatabase();
    const portfolioCount = await portfolioRepository.count();
    const generationCount = await generationRepository.count();

    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: "0.1.0",
      database: {
        status: dbHealthy ? "connected" : "disconnected",
      },
      stats: {
        portfolios: portfolioCount,
        generations: generationCount,
      },
    };
  },

  async checkDatabase(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  },
};
