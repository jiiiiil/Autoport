import { prisma } from "@/server/config";
import { generateSlug } from "@/server/utils";
import type { PortfolioData } from "@/server/types";

export const portfolioRepository = {
  async create(data: { slug?: string }) {
    return prisma.portfolio.create({
      data: {
        slug: data.slug ?? generateSlug(),
      },
    });
  },

  async findById(id: string) {
    return prisma.portfolio.findUnique({ where: { id } });
  },

  async findBySlug(slug: string) {
    return prisma.portfolio.findUnique({ where: { slug } });
  },

  async createVersion(
    portfolioId: string,
    version: number,
    prompt: string,
    portfolioData: PortfolioData,
    theme: string,
    layout: string,
  ) {
    return prisma.portfolioVersion.create({
      data: {
        portfolioId,
        version,
        prompt,
        portfolioData: portfolioData as never,
        theme,
        layout,
      },
    });
  },

  async getLatestVersion(portfolioId: string) {
    return prisma.portfolioVersion.findFirst({
      where: { portfolioId },
      orderBy: { version: "desc" },
    });
  },

  async getVersions(portfolioId: string) {
    return prisma.portfolioVersion.findMany({
      where: { portfolioId },
      orderBy: { version: "desc" },
    });
  },

  async count() {
    return prisma.portfolio.count();
  },
};
