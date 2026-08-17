import { prisma } from "@/server/config";

export interface ProjectCreateInput {
  portfolioId: string;
  title: string;
  description?: string;
  image?: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export const projectRepository = {
  async listByPortfolio(portfolioId: string) {
    return prisma.project.findMany({
      where: { portfolioId },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.project.findUnique({ where: { id } });
  },

  async create(data: ProjectCreateInput) {
    return prisma.project.create({
      data: {
        portfolioId: data.portfolioId,
        title: data.title,
        description: data.description ?? null,
        image: data.image ?? null,
        technologies: data.technologies ?? [],
        githubUrl: data.githubUrl ?? null,
        liveUrl: data.liveUrl ?? null,
      },
    });
  },

  async update(id: string, data: Partial<Omit<ProjectCreateInput, "portfolioId">>) {
    return prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description ?? null } : {}),
        ...(data.image !== undefined ? { image: data.image ?? null } : {}),
        ...(data.technologies !== undefined ? { technologies: data.technologies } : {}),
        ...(data.githubUrl !== undefined ? { githubUrl: data.githubUrl ?? null } : {}),
        ...(data.liveUrl !== undefined ? { liveUrl: data.liveUrl ?? null } : {}),
      },
    });
  },

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  },
};
