/**
 * Gratia Protocol — Adapter Contract
 *
 * The universal contract through which any system (CLI, Firegate,
 * Garden Core, M3) executes a verb from the Gratia ISA.
 *
 * @version @gratiaos/gratia@0.2
 *
 * ---
 * Strict Requirements:
 * 1. Does not think — receives the verb, executes it against the knowledge graph.
 * 2. Does not invent — if a verb is unsupported, returns `ok: false` with a clear message.
 * 3. Decouples I/O from cognition — verbs mutate the graph; projections render documents.
 * 4. Logs everything — all graph mutations are recorded in `graphEffects[]` for auditing.
 * 5. Respects privacy — does not expose sensitive data in `message` or `debug`.
 */

export interface ExecuteVerbInput {
  /** Verb ID from vocabulary.json (e.g., "discover", "define", "map") */
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

/** Graph mutations produced by a verb execution. */
export interface GraphEffect {
  /** Type of graph mutation */
  type: 'NODE_CREATED' | 'EDGE_CREATED' | 'NODE_MUTATED' | 'NODE_DELETED';
  /** ID of the affected node or edge */
  targetId: string;
  /** The payload that was created, updated, or deleted */
  payload: unknown;
}

/** Result of a successful verb execution. */
export interface VerbResult {
  /** Execution success */
  ok: true;
  /** Feedback message for the user (what actually happened) */
  message: string;
  /** Graph mutations produced by the verb (mandatory for auditing) */
  graphEffects: GraphEffect[];
  /** Rendered projections, if requested by the external system.
   * Key is projection name (e.g., "prd.md"), value is the rendered markdown.
   * The adapter generates these by calling QUERY_GRAPH + renderer on behalf of the caller. */
  renderedProjections?: Record<string, string>;
  /** Files written to disk by the adapter (separate from graph mutations) */
  modifiedFiles?: FileRef[];
  /** New system state after execution (for tracking) */
  newState?: SystemState;
  /** Next recommended verb, if clear patterns exist */
  nextVerb?: string;
  /** Debug info (exposed only in development environments) */
  debug?: Record<string, unknown>;
}

/** Result of a failed verb execution. */
export interface VerbError {
  /** Execution failure */
  ok: false;
  message: string;
  code: 'VERB_NOT_FOUND' | 'ADAPTER_UNAVAILABLE' | 'CONTEXT_INVALID' | 'EXECUTION_FAILED';
  effects: [];
}

/**
 * Executes a verb from the Gratia ISA against the knowledge graph.
 *
 * The verb produces graph mutations (nodes, edges). It does not write files.
 * File writing is handled separately by the adapter via projections.
 *
 * @param verbId - The verb identifier (e.g., 'discover', 'define')
 * @param context - The runtime context
 * @returns A Promise resolving to a success (VerbResult) or failure (VerbError)
 *
 * @example
 * ```typescript
 * const result = await executeVerb('discover', {
 *   raw: 'The platform obtained an EMI license last week',
 *   actor: 'usr_8f9a2b',
 * });
 * // result.ok === true
 * // result.graphEffects = [
 * //   { type: 'NODE_CREATED', targetId: 'fact_001', payload: { label: 'fact', properties: {...} } },
 * //   { type: 'NODE_CREATED', targetId: 'question_001', payload: { label: 'question', properties: {...} } }
 * // ]
 * ```
 */
export async function executeVerb(verbId: string, context: VerbContext): Promise<VerbResult | VerbError> {
  throw new Error('executeVerb not implemented. Provide an adapter implementation.');
}
