import type { GenerationSession, CompositionGraph, CompositionState } from "../types";
import { GenerationStateMachine } from "../state-machine";

const SESSION_STORAGE_KEY = "autoport:generation-session";
const SESSION_EXPIRY_MS = 30 * 60 * 1000;

let activeSession: GenerationSession | null = null;
let isLocked = false;
let lockPromise: Promise<boolean> | null = null;
const stateMachine = new GenerationStateMachine();

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function isSessionExpired(session: GenerationSession): boolean {
  if (!session.completedAt) return false;
  const completed = new Date(session.completedAt).getTime();
  return Date.now() - completed > SESSION_EXPIRY_MS;
}

export function createSession(prompt: string): GenerationSession {
  if (isLocked) {
    console.warn("SessionManager: Cannot create session while locked");
    return activeSession || createNewSession(prompt);
  }

  if (activeSession && activeSession.prompt === prompt && activeSession.state === "completed") {
    console.log("SessionManager: Reusing existing completed session");
    return activeSession;
  }

  activeSession = {
    id: generateSessionId(),
    prompt,
    state: "idle",
    composition: null,
    startedAt: new Date().toISOString(),
    completedAt: null,
    error: null,
    metadata: {
      totalDuration: 0,
      compositionDuration: 0,
      refinementDuration: 0,
      validationDuration: 0,
    },
  };

  stateMachine.reset();
  saveSessionToStorage(activeSession);
  console.log(`SessionManager: Created session ${activeSession.id}`);
  return activeSession;
}

function createNewSession(prompt: string): GenerationSession {
  activeSession = {
    id: generateSessionId(),
    prompt,
    state: "idle",
    composition: null,
    startedAt: new Date().toISOString(),
    completedAt: null,
    error: null,
    metadata: {
      totalDuration: 0,
      compositionDuration: 0,
      refinementDuration: 0,
      validationDuration: 0,
    },
  };
  return activeSession;
}

export function acquireLock(): Promise<boolean> {
  if (isLocked && lockPromise) {
    return lockPromise;
  }

  isLocked = true;
  lockPromise = new Promise<boolean>((resolve) => {
    resolve(true);
  });

  return lockPromise;
}

export function releaseLock(): void {
  isLocked = false;
  lockPromise = null;
  console.log("SessionManager: Lock released");
}

export function isGenerationLocked(): boolean {
  return isLocked;
}

export async function updateSessionState(
  sessionId: string,
  state: CompositionState
): Promise<void> {
  if (!activeSession || activeSession.id !== sessionId) {
    console.warn(`SessionManager: Session ${sessionId} not found`);
    return;
  }

  activeSession.state = state;
  stateMachine.forceState(state);
  saveSessionToStorage(activeSession);
}

export function updateSessionComposition(
  sessionId: string,
  composition: CompositionGraph
): void {
  if (!activeSession || activeSession.id !== sessionId) {
    console.warn(`SessionManager: Session ${sessionId} not found`);
    return;
  }

  activeSession.composition = composition;
  saveSessionToStorage(activeSession);
}

export function updateSessionMetadata(
  sessionId: string,
  metadata: Partial<GenerationSession["metadata"]>
): void {
  if (!activeSession || activeSession.id !== sessionId) return;

  activeSession.metadata = { ...activeSession.metadata, ...metadata };
  saveSessionToStorage(activeSession);
}

export function completeSession(sessionId: string): void {
  if (!activeSession || activeSession.id !== sessionId) return;

  activeSession.state = "completed";
  activeSession.completedAt = new Date().toISOString();
  activeSession.metadata.totalDuration =
    new Date(activeSession.completedAt).getTime() -
    new Date(activeSession.startedAt).getTime();

  stateMachine.forceState("completed");
  saveSessionToStorage(activeSession);
  releaseLock();
  console.log(`SessionManager: Session ${sessionId} completed in ${activeSession.metadata.totalDuration}ms`);
}

export function failSession(sessionId: string, error: string): void {
  if (!activeSession || activeSession.id !== sessionId) return;

  activeSession.state = "failed";
  activeSession.error = error;
  stateMachine.forceState("failed");
  saveSessionToStorage(activeSession);
  releaseLock();
  console.error(`SessionManager: Session ${sessionId} failed: ${error}`);
}

export function restoreSession(): GenerationSession | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored) as GenerationSession;

    if (isSessionExpired(session)) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      console.log("SessionManager: Stored session expired, removing");
      return null;
    }

    if (session.state === "completed" && session.composition) {
      activeSession = session;
      stateMachine.restoreState("completed");
      console.log(`SessionManager: Restored completed session ${session.id}`);
      return session;
    }

    if (session.state !== "completed" && session.state !== "failed") {
      activeSession = {
        ...session,
        state: "failed",
        error: "Session interrupted",
      };
      stateMachine.restoreState("failed");
      console.log(`SessionManager: Session ${session.id} was incomplete, marking as failed`);
      return activeSession;
    }

    return null;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearSession(): void {
  activeSession = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
  stateMachine.reset();
  releaseLock();
  console.log("SessionManager: Session cleared");
}

export function getActiveSession(): GenerationSession | null {
  return activeSession;
}

export function getStateMachine(): GenerationStateMachine {
  return stateMachine;
}

export function isDuplicateRequest(prompt: string): boolean {
  if (!activeSession) return false;
  if (activeSession.prompt !== prompt) return false;
  if (activeSession.state === "completed" || activeSession.state === "generating") {
    return true;
  }
  return false;
}

function saveSessionToStorage(session: GenerationSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn("SessionManager: Failed to save session to storage", e);
  }
}
