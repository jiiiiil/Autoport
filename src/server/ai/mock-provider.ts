import type { AIProvider } from "./provider";
import type { PortfolioData } from "@/server/types";
import { parsePrompt } from "@/lib/portfolio/parser";

export class MockAIProvider implements AIProvider {
  async generatePortfolio(prompt: string): Promise<PortfolioData> {
    await this.simulateDelay();
    return parsePrompt(prompt) as PortfolioData;
  }

  async improvePortfolio(portfolioData: PortfolioData, instruction: string): Promise<PortfolioData> {
    await this.simulateDelay();
    return {
      ...portfolioData,
      personalInfo: {
        ...(portfolioData.personalInfo as Record<string, unknown> ?? {}),
        tagline: instruction,
      },
    };
  }

  async regenerateSection(portfolioData: PortfolioData, _section: string, _instruction?: string): Promise<PortfolioData> {
    await this.simulateDelay();
    return {
      ...portfolioData,
      sections: {
        ...(portfolioData.sections as Record<string, unknown> ?? {}),
      },
    };
  }

  async generateProject(description: string): Promise<Record<string, unknown>> {
    await this.simulateDelay();
    return {
      title: description.slice(0, 50),
      description,
      tags: ["React", "TypeScript"],
    };
  }

  private simulateDelay(): Promise<void> {
    const ms = 200 + Math.floor(Math.random() * 300);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
