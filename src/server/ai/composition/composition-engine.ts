import type { AIContextObject } from "../intelligence/types";
import type {
  CompositionGraph, ValidationResult, RefinementResult,
  GenerationSession,
} from "./types";
import { buildCompositionGraph } from "./composition-graph-builder";
import { refineComposition } from "./adaptive-refinement-engine";
import { validateComposition } from "./validation-engine";
import {
  createSession, acquireLock, releaseLock, updateSessionState,
  updateSessionComposition, updateSessionMetadata, completeSession,
  failSession, isDuplicateRequest,
} from "./session";

export interface CompositionResult {
  composition: CompositionGraph;
  validation: ValidationResult;
  refinement: RefinementResult;
  session: GenerationSession;
}

export async function runCompositionPipeline(
  prompt: string,
  aiContext: AIContextObject,
  callbacks?: {
    onStateChange?: (state: string) => void;
    onProgress?: (progress: number, message: string) => void;
    onStepComplete?: (step: string) => void;
  }
): Promise<CompositionResult> {
  const pipelineStart = Date.now();

  if (isDuplicateRequest(prompt)) {
    throw new Error("Duplicate generation request detected. Please wait for the current generation to complete.");
  }

  const lockAcquired = await acquireLock();
  if (!lockAcquired) {
    throw new Error("Could not acquire generation lock. Another generation may be in progress.");
  }

  const session = createSession(prompt);

  try {
    callbacks?.onStateChange?.("validating");
    callbacks?.onProgress?.(5, "Validating prompt...");
    await updateSessionState(session.id, "validating");

    const promptValidation = validatePromptInput(prompt);
    if (!promptValidation.valid) {
      throw new Error(promptValidation.error!);
    }
    callbacks?.onStepComplete?.("validation");

    callbacks?.onStateChange?.("composing");
    callbacks?.onProgress?.(15, "Analyzing prompt intelligence...");
    await updateSessionState(session.id, "composing");

    const compositionStart = Date.now();
    callbacks?.onProgress?.(25, "Composing layout...");
    await delay(50);

    callbacks?.onProgress?.(35, "Composing sections...");
    await delay(50);

    callbacks?.onProgress?.(45, "Composing theme and navigation...");
    await delay(50);

    const composition = buildCompositionGraph(prompt, aiContext, pipelineStart);

    updateSessionMetadata(session.id, {
      compositionDuration: Date.now() - compositionStart,
    });
    callbacks?.onStepComplete?.("composition");

    callbacks?.onStateChange?.("refining");
    callbacks?.onProgress?.(60, "Running adaptive refinement...");
    await updateSessionState(session.id, "refining");

    const refinementStart = Date.now();
    const refinement = refineComposition(composition);

    updateSessionMetadata(session.id, {
      refinementDuration: Date.now() - refinementStart,
    });

    callbacks?.onProgress?.(75, "Validating composition...");
    await delay(50);

    const validationStart = Date.now();
    const validation = validateComposition(refinement.composition);

    updateSessionMetadata(session.id, {
      validationDuration: Date.now() - validationStart,
    });
    callbacks?.onStepComplete?.("refinement");

    if (!validation.valid) {
      const criticalErrors = validation.errors.filter(e => e.severity === "critical");
      if (criticalErrors.length > 0) {
        throw new Error(
          `Composition validation failed: ${criticalErrors.map(e => e.message).join("; ")}`
        );
      }
    }

    callbacks?.onStateChange?.("generating");
    callbacks?.onProgress?.(85, "Finalizing composition graph...");
    await updateSessionState(session.id, "generating");

    updateSessionComposition(session.id, refinement.composition);
    await delay(50);

    callbacks?.onProgress?.(95, "Composition complete...");
    await delay(50);

    completeSession(session.id);
    callbacks?.onStateChange?.("completed");
    callbacks?.onProgress?.(100, "Composition complete");
    callbacks?.onStepComplete?.("complete");

    return {
      composition: refinement.composition,
      validation,
      refinement,
      session: { ...session, state: "completed", completedAt: new Date().toISOString() },
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    failSession(session.id, errorMsg);
    callbacks?.onStateChange?.("failed");
    throw error;
  } finally {
    releaseLock();
  }
}

function validatePromptInput(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || typeof prompt !== "string") {
    return { valid: false, error: "Prompt is required" };
  }

  const trimmed = prompt.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Prompt cannot be empty" };
  }

  if (trimmed.length < 5) {
    return { valid: false, error: "Prompt must be at least 5 characters long" };
  }

  if (trimmed.length > 10000) {
    return { valid: false, error: "Prompt must be at most 10000 characters" };
  }

  return { valid: true };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {
  buildCompositionGraph,
  refineComposition,
  validateComposition,
};
