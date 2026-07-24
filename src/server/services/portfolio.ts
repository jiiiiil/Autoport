import { portfolioRepository } from "@/server/repositories";
import { NotFoundError } from "@/server/utils";
import type { PortfolioData } from "@/server/types";

export const portfolioService = {
  async create() {
    return portfolioRepository.create({});
  },

  async getById(id: string) {
    const portfolio = await portfolioRepository.findById(id);
    if (!portfolio) throw new NotFoundError("Portfolio");
    return portfolio;
  },

  async getBySlug(slug: string) {
    const portfolio = await portfolioRepository.findBySlug(slug);
    if (!portfolio) throw new NotFoundError("Portfolio");
    return portfolio;
  },

  async saveVersion(portfolioId: string, prompt: string, portfolioData: PortfolioData, theme: string, layout: string) {
    const latest = await portfolioRepository.getLatestVersion(portfolioId);
    const nextVersion = (latest?.version ?? 0) + 1;

    return portfolioRepository.createVersion(
      portfolioId,
      nextVersion,
      prompt,
      portfolioData,
      theme,
      layout
    );
  },

  async getLatestData(portfolioId: string): Promise<{ data: PortfolioData; version: number } | null> {
    const version = await portfolioRepository.getLatestVersion(portfolioId);
    if (!version) return null;
    return {
      data: version.portfolioData as PortfolioData,
      version: version.version,
    };
  },

  async getVersions(portfolioId: string) {
    return portfolioRepository.getVersions(portfolioId);
  },

  async count() {
    return portfolioRepository.count();
  },
};
