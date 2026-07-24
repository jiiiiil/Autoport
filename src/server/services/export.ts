import { exportRepository, portfolioRepository } from "@/server/repositories";
import { NotFoundError } from "@/server/utils";

export const exportService = {
  async createExport(portfolioId: string, format: string) {
    const portfolio = await portfolioRepository.findById(portfolioId);
    if (!portfolio) throw new NotFoundError("Portfolio");

    const job = await exportRepository.create({
      portfolioId,
      format,
    });

    return job;
  },

  async getExport(id: string) {
    const job = await exportRepository.findById(id);
    if (!job) throw new NotFoundError("Export job");
    return job;
  },

  async count() {
    return exportRepository.count();
  },
};
