// Phase 10: AI Project Generation & Assembly Engine

import { ProjectGenerationOrchestrator } from "./project-generator";
import type { AIContextObject } from "../intelligence/types"; // Assuming AIContextObject type is available

/**
 * This is the main entry point for Phase 10.
 * It orchestrates the project generation process by leveraging the ProjectGenerationOrchestrator.
 * It ensures that the Execution Manifest is available, either by generating it internally
 * through the pipeline (9A -> 9B -> 9C) or by using an already existing manifest.
 *
 * The ProjectGenerationOrchestrator handles the detailed steps of project generation,
 * configuration, dependency management, code assembly, validation, and final build.
 *
 * This API layer serves as the interface to trigger the project generation process.
 */

export class ProjectGenerationApi {
  private readonly orchestrator: ProjectGenerationOrchestrator;

  // We inject dependencies that might be available from other parts of the system.
  // If AIContextObject is available (e.g., from a previous step), it can be passed.
  // If not, a user prompt can be provided to initiate the pipeline from Phase 9A.
  constructor(userPrompt?: string, aiContext?: AIContextObject) {
    this.orchestrator = new ProjectGenerationOrchestrator(userPrompt, aiContext);
  }

  /**
   * Initiates the project generation process.
   * This method will ensure the Execution Manifest is available and then
   * proceeds with generating the complete project based on the manifest.
   *
   * @returns {Promise<void>} A promise that resolves when the project generation is complete.
   * @throws {Error} If the Execution Manifest cannot be resolved or if project generation fails.
   */
  async generateProject(): Promise<void> {
    console.log("API Layer: Received request to generate project.");
    await this.orchestrator.generateProject();
    console.log("API Layer: Project generation process completed.");
  }

  // Additional API methods could be added here, e.g., to get project status,
  // retrieve generated files, etc., if needed in a more complex system.
}

// Example of how this API might be used:
//
// Import and instantiate:
// import { ProjectGenerationApi } from './path/to/api';
//
// const api = new ProjectGenerationApi("Create a portfolio for a web developer using React and Tailwind.");
//
// Call the generation method:
// try {
//   await api.generateProject();
//   console.log("Project generated successfully!");
// } catch (error) {
//   console.error("Project generation failed:", error);
// }
//
// Or if AIContext is available:
// const existingAIContext = getAIContextFromSomewhere(); // Replace with actual function
// const apiWithContext = new ProjectGenerationApi(undefined, existingAIContext);
// await apiWithContext.generateProject();
