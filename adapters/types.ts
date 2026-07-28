/**
 * Gratia Protocol — Adapter Contract
 *
 * The universal contract through which any system (CLI, Firegate,
 * Garden Core, M3) executes a verb from the Gratia ISA.
 *
 * @version @gratiaos/gratia@0.1
 *
 * ---
 * Strict Requirements:
 * 1. Does not think — receives the verb, executes the effects declared in vocabulary.json.
 * 2. Does not invent — if a verb is unsupported, returns `ok: false` with a clear message.
 * 3. Logs everything — all effects must be recorded in `effects[]` for auditing.
 * 4. Respects privacy — does not expose sensitive data in `message` or `debug`.
 */

export interface ExecuteVerbInput {
  /** Verb ID from vocabulary.json (e.g., "breathe", "orient", "cartography") */
  verbId: string;
  /** The runtime context of the actor and the system */
  context: VerbContext;
}

export interface VerbContext {
  /** Raw input from the user (what was written or detected by the system) */
  raw: string;
  /** Who the actor is (the interacting human) */
  actor?: string;
  /** The actor's current emotional state (auto-detected) */
  currentMood?: Mood;
  /** Current workspace — files, folders, local context */
  workspace?: WorkspaceContext;
  /** Recent history of executed verbs (for pattern matching) */
  recentVerbs?: string[];
  /** User preferences (locale, theme, etc.) */
  preferences?: Record<string, unknown>;
}

export interface WorkspaceContext {
  /**
   * Root folder of the workspace.
   * PRIVACY RULE: Must use aliased paths (e.g., "~/Sites/project")
   * instead of absolute system paths to prevent username leaks.
   */
  root: string;
  /** Relevant files raised in the execution context */
  files?: FileRef[];
  /** Current system state (energy, rhythm, etc.) */
  systemState?: SystemState;
}

export interface FileRef {
  /** Absolute or relative path of the file */
  path: string;
  /** The role this file plays in the verb's context (e.g., "collaboration note") */
  purpose?: string;
}

export interface SystemState {
  /** Energy mark from M3 */
  energyMark?: string;
  /** Band classification */
  band?: 'light' | 'open' | 'flow' | 'heavy';
  /** Heartware state from Garden Core */
  heartwareState?: string;
  /** Spirit mode */
  spiritMode?: 'bear' | 'wolf' | 'lion';
}

export type Mood =
  | 'contracted' // tense, defensive, fragmented
  | 'open' // open, receptive
  | 'flow' // in flow, focused
  | 'heavy' // heavy, tired, overloaded
  | 'calm'
  | 'clarity'
  | 'gratitude'
  | 'joy'
  | 'confused'
  | 'frustrated'
  | 'excited'
  | 'anxious';

export interface Effect {
  /** Type of effect produced on the system */
  type: 'state_change' | 'file_written' | 'notification' | 'signal_emitted';
  /** Human-readable description of the effect (e.g., "contracted → open") */
  description: string;
  /** Target of the effect (state, file path, channel) */
  target: string;
  /** The new value installed after the effect */
  value?: unknown;
}

export interface VerbResult {
  /** Execution success */
  ok: true;
  /** Feedback message for the user (what actually happened) */
  message: string;
  /** Produced effects (mandatory to record for M3 logging) */
  effects: Effect[];
  /** Files modified by the adapter (for auditing purposes) */
  modifiedFiles?: FileRef[];
  /** New state after execution (for tracking) */
  newState?: SystemState;
  /** Next recommended verb, if clear patterns exist */
  nextVerb?: string;
  /** Debug info (exposed only in development environments) */
  debug?: Record<string, unknown>;
}

export interface VerbError {
  /** Execution failure */
  ok: false;
  message: string;
  code: 'VERB_NOT_FOUND' | 'ADAPTER_UNAVAILABLE' | 'CONTEXT_INVALID' | 'EXECUTION_FAILED';
  effects: [];
}

/**
 * Executes a verb from the Gratia ISA.
 *
 * @param verbId - The verb identifier (e.g., 'breathe')
 * @param context - The runtime context
 * @returns A Promise resolving to a success (VerbResult) or failure (VerbError)
 *
 * @example
 * ```typescript
 * const result = await executeVerb('breathe', {
 *   raw: 'I have a tense discussion with counterpart_A about pricing, I feel contracted',
 *   actor: 'usr_8f9a2b',
 *   currentMood: 'contracted',
 *   workspace: {
 *     root: '~/Sites/gratiaos',
 *     systemState: { band: 'heavy' },
 *   },
 * });
 * // result.ok === true
 * // result.message === "We breathed together. The tension has been released."
 * ```
 */
export async function executeVerb(verbId: string, context: VerbContext): Promise<VerbResult | VerbError> {
  throw new Error('executeVerb not implemented. Provide an adapter implementation.');
}
