export { runCompositionPipeline, buildCompositionGraph, refineComposition, validateComposition } from "./composition-engine";
export type { CompositionResult } from "./composition-engine";

export type {
  CompositionGraph,
  CompositionState,
  ComposedLayout,
  ComposedSection,
  ComposedNavigation,
  ComposedTheme,
  ComposedMotion,
  ComposedComponent,
  ComposedResponsive,
  ComposedAccessibility,
  CompositionMetadata,
  LayoutStyle,
  NavigationStyle,
  MotionStyle,
  StorytellingFlow,
  ResponsiveStrategy,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  RefinementResult,
  RefinementChange,
  GenerationSession,
  PromptConstraints,
} from "./types";

export {
  createSession,
  acquireLock,
  releaseLock,
  isGenerationLocked,
  updateSessionState,
  updateSessionComposition,
  completeSession,
  failSession,
  restoreSession,
  clearSession,
  getActiveSession,
  getStateMachine,
  isDuplicateRequest,
} from "./session";

export { GenerationStateMachine } from "./state-machine";
export { resolveConstraints, getPromptHash } from "./constraint-resolver";
