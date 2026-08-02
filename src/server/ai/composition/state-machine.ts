import type { CompositionState } from "./types";

interface StateTransition {
  from: CompositionState;
  to: CompositionState;
  guard?: () => boolean;
}

const VALID_TRANSITIONS: StateTransition[] = [
  { from: "idle", to: "validating" },
  { from: "validating", to: "composing" },
  { from: "validating", to: "failed" },
  { from: "composing", to: "refining" },
  { from: "composing", to: "failed" },
  { from: "refining", to: "generating" },
  { from: "refining", to: "failed" },
  { from: "generating", to: "completed" },
  { from: "generating", to: "failed" },
  { from: "failed", to: "idle" },
  { from: "completed", to: "idle" },
  { from: "restored", to: "idle" },
];

const STATE_ORDER: CompositionState[] = [
  "idle", "validating", "composing", "refining", "generating", "completed",
];

export class GenerationStateMachine {
  private state: CompositionState = "idle";
  private history: { state: CompositionState; timestamp: string }[] = [];
  private listeners: ((state: CompositionState) => void)[] = [];

  getState(): CompositionState {
    return this.state;
  }

  canTransition(to: CompositionState): boolean {
    return VALID_TRANSITIONS.some(t => t.from === this.state && t.to === to);
  }

  transition(to: CompositionState): boolean {
    if (!this.canTransition(to)) {
      console.warn(
        `StateMachine: Invalid transition from "${this.state}" to "${to}". ` +
        `Valid transitions: ${VALID_TRANSITIONS.filter(t => t.from === this.state).map(t => t.to).join(", ")}`
      );
      return false;
    }

    const previous = this.state;
    this.state = to;
    this.history.push({ state: to, timestamp: new Date().toISOString() });

    if (this.history.length > 50) {
      this.history = this.history.slice(-50);
    }

    this.notifyListeners();

    console.log(`StateMachine: ${previous} → ${to}`);
    return true;
  }

  forceState(state: CompositionState): void {
    const previous = this.state;
    this.state = state;
    this.history.push({ state, timestamp: new Date().toISOString() });
    this.notifyListeners();
    console.log(`StateMachine: Force ${previous} → ${state}`);
  }

  reset(): void {
    this.state = "idle";
    this.history.push({ state: "idle", timestamp: new Date().toISOString() });
    this.notifyListeners();
    console.log("StateMachine: Reset to idle");
  }

  restoreState(state: CompositionState): void {
    this.state = state;
    this.history.push({ state, timestamp: new Date().toISOString() });
    this.notifyListeners();
    console.log(`StateMachine: Restored to ${state}`);
  }

  onStateChange(listener: (state: CompositionState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx > -1) this.listeners.splice(idx, 1);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (e) {
        console.error("StateMachine: Listener error", e);
      }
    }
  }

  getHistory(): { state: CompositionState; timestamp: string }[] {
    return [...this.history];
  }

  getProgress(): number {
    const idx = STATE_ORDER.indexOf(this.state);
    if (idx < 0) return 0;
    return Math.round((idx / (STATE_ORDER.length - 1)) * 100);
  }
}
