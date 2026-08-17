import { prisma } from "@/server/config";
import { generateSlug } from "@/server/utils";
import type { PortfolioData } from "@/server/types";

export const portfolioRepository = {
  async create(data: { slug?: string; userId?: string; name?: string }) {
    return prisma.portfolio.create({
      data: {
        slug: data.slug ?? generateSlug(),
        userId: data.userId ?? null,
        name: data.name ?? "Untitled Portfolio",
      },
    });
  },

  async findById(id: string) {
    return prisma.portfolio.findUnique({ where: { id } });
  },

  async findBySlug(slug: string) {
    return prisma.portfolio.findUnique({ where: { slug } });
  },

  /** Find a portfolio that is owned by the given user, or null. */
  async findOwnedById(id: string, userId: string) {
    return prisma.portfolio.findFirst({
      where: { id, userId },
    });
  },

  async listByUser(userId: string) {
    return prisma.portfolio.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  },

  async listByUserWithDetails(userId: string) {
    return prisma.portfolio.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        versions: { orderBy: { version: "desc" }, take: 1 },
        _count: {
          select: { projects: true, generations: true },
        },
      },
    });
  },

  async update(
    id: string,
    data: { name?: string; slug?: string; status?: string; data?: PortfolioData | null }
  ) {
    return prisma.portfolio.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.data !== undefined ? { data: (data.data ?? null) as never } : {}),
      },
    });
  },

  async delete(id: string) {
    return prisma.portfolio.delete({ where: { id } });
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

  async countForUser(userId: string) {
    return prisma.portfolio.count({ where: { userId } });
  },
};
