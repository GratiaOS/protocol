# Knowledge Microkernel Architecture

Gratia is a **knowledge transformation microkernel**. It takes input, transforms it into structured knowledge, and renders that knowledge through environment-aware displays.

Two spaces, four kernel layers:

```
Kernel Space (immutable, minimal):
  Level -1 — Monitors           Environment displays — how knowledge is seen
  Layer 3  — Components         Presentation AST — ephemeral LEGO bricks (anatomy)
  Layer 2  — Schema             Passive validator — what shapes are valid (chemistry)
  Layer 1  — Cognitive ISA      Primitive opcodes: OBSERVE, DECIDE, SYNTHESIZE (biology)
  Layer 0  — Graph Primitives   Pure operations: CREATE_NODE, CREATE_EDGE (physics)

User Space (extensible, pack-defined):
  Patterns (macros) + Domain Packs (human-facing verbs)
```

The kernel has exactly 4 layers. Everything else lives in user space — outside the runtime.

---

## Level -1 — Adapters (Environment Displays)

Adapters are **monitors** — they translate knowledge components into what the user sees.

They are both the entry point (how external systems call Gratia) and the display layer (how knowledge is rendered in each environment).

Defined in `adapters/types.ts`.

### The contract

```typescript
executeVerb(verbId: string, context: VerbContext): Promise<VerbResult | VerbError>
```

### What adapters do

1. **Validate context** — `VerbContext` with actor, mood, workspace
2. **Map verbId → implementation** — which pack runs the verb (human verb → ISA opcode)
3. **Audit logging** — `GraphEffect[]` in `VerbResult` (not `Effect[]`)
4. **Privacy** — aliased paths, no username leaks
5. **Render components in environment** — calls `QUERY_GRAPH` → builds Component AST → renders for the display

### What adapters don't do

They don't execute graph operations. They delegate to Layer 0.
They don't generate documents — components do that. The adapter only persists what the component renders.

```
Adapters (Level -1)
  ↓ calls
Cognitive ISA (Layer 1) — OBSERVE, DECIDE, SYNTHESIZE, ASSERT, MUTATE
  ↓ wrap
Graph Primitives (Layer 0)

Adapters (Level -1)
  ↓ optionally calls
Components (Layer 3)
  ↓ returns Component AST to adapter
  ↓ adapter renders for environment
  ↓ writes to disk (optional)
```

### Adapters as monitors

The same Component AST renders differently in each environment:

```
Obsidian  → Markdown callouts: > [!decision] Why we chose X
VS Code   → Interactive webview inline with code
Browser   → Styled HTML cards with hover details
CLI       → ASCII boxes with emoji indicators
PDF Export→ Legacy snapshot for external auditors
```

Gratia is the knowledge OS. The adapter is the monitor.

### New contract (v0.2)

The old contract returned `Effect[]` with types like `state_change`, `file_written`.
This coupled the verb to I/O — a knowledge graph should not write files directly.

The new contract returns `GraphEffect[]`:

```typescript
interface GraphEffect {
  type: 'NODE_CREATED' | 'EDGE_CREATED' | 'NODE_MUTATED' | 'NODE_DELETED';
  targetId: string;
  payload: unknown;
}

interface VerbResult {
  ok: true;
  message: string;
  graphEffects: GraphEffect[]; // mutations on the graph
  renderedComponents?: Record<string, string>; // optional: "prd" → markdown/html/ascii
  modifiedFiles?: FileRef[]; // files the adapter chose to persist
}
```

The adapter is a **gateway**, not part of the knowledge runtime itself.

---

## Layer 0 — Graph Primitives (Physics)

These are the pure operations on a graph. They don't know about knowledge, documents, or domains.

Think of them like CPU instructions: `LOAD`, `STORE`, `ADD`. You cannot decompose them further.

| Operation     | What it does                              |
| ------------- | ----------------------------------------- |
| `CREATE_NODE` | Adds a node with a label and properties   |
| `CREATE_EDGE` | Creates a directed edge between two nodes |
| `QUERY_GRAPH` | Reads a subgraph matching a pattern       |
| `MUTATE_NODE` | Updates properties on an existing node    |
| `DELETE`      | Removes a node or edge                    |

These are the **real ISA** of Gratia. They don't change. Ever.

---

## Layer 1 — Cognitive ISA (Biology)

The Instruction Set Architecture of knowledge transformation. Five primitive opcodes.

These are not human words. They are **cognitive operations** — the atomic things a knowledge system can do.

Think of them like `ADD`, `MUL`, `JUMP` in a CPU. You don't have `calculate_taxes` or `write_prd`. You have primitives that compose.

| Opcode       | What it does                                |
| ------------ | ------------------------------------------- |
| `OBSERVE`    | Extract a fact or state from raw input      |
| `DECIDE`     | Create a choice between alternatives        |
| `SYNTHESIZE` | Group nodes into a new concept or structure |
| `ASSERT`     | Impose a boundary or constraint             |
| `MUTATE`     | Change properties on an existing node       |

These are **semantically irreducible**. If you reduce them to `CREATE_NODE` + `LINK`, you've dropped into Layer 0 (database). Keeping them in Layer 1 gives the runtime the **cognitive primitive** — it knows not just that a line was drawn, but what _thinking intention_ produced it.

---

## Layer 2 — Schema (Chemistry)

The schema is a **passive validator**. It does not transform. It does not store. It only checks.

When `CREATE_NODE` is called, the runtime looks up the label in the schema and validates properties.

```json
{
  "node_types": {
    "fact": { "properties": ["content", "certainty", "source"] },
    "decision": { "properties": ["choice", "rationale", "alternatives"] },
    "constraint": { "properties": ["boundary", "scope", "source"] },
    "question": { "properties": ["gap", "context", "status"] },
    "flow": { "properties": ["name", "states"] },
    "actor": { "properties": ["name", "role"] },
    "state": { "properties": ["name", "conditions"] }
  }
}
```

The schema evolves independently. Add a new node type? Update the JSON. The runtime does not change.

### Why this matters

Fixing 17 concepts as "primitives" mixes the **engine** with the **ontology**.

The engine (Layer 0) stays stable. The schema (Layer 2) evolves organically.

---

## Layer 3 — Components (Anatomy)

Components are the **LEGO bricks of knowledge presentation**.

The graph does not render into Markdown. The graph renders into a **Presentation AST** — an Abstract Syntax Tree of knowledge components.

### Core Components

```
FactCard        → A single fact with properties (content, certainty, source)
DecisionCard    → A decision with rationale and alternatives
ConstraintCard  → A boundary with scope and evidence
QuestionCard    → A question with status and context
Timeline        → Ordered sequence of events from the graph
ActorFlow       → Sequence of states or steps
GraphSummary    → Topology + statistics
```

### Components are ephemeral

A component is **compiled dynamically in memory**, sent to the monitor (Obsidian/CLI/IDE), and **destroyed**. What remains is only the graph.

- There is no file `PRD.md`.
- There is a query that assembles an AST of components (`FactCard` + `DecisionCard`), renders it on screen, and disappears.

### Component Composition

An "Executive Summary" is not a text — it's a matrix that says:
_Show 3 FactCards and the 2 most critical DecisionCards._

```
QUERY_GRAPH {
  match: "fact → decision → state → transition",
  build: [
    { type: "FactCard", count: 3, sort: "certainty DESC" },
    { type: "DecisionCard", count: 2, sort: "importance DESC" },
    { type: "Timeline", nodes: ["fact", "decision"] }
  ]
}
```

### Domain Compositions

Domain packs compose core components into professional views:

```
PRD (product pack):
  QUERY { fact → decision → state } → [FactCard, DecisionCard, Timeline]

ADR (engineering pack):
  QUERY { fact → decision → tradeoff } → [FactCard, DecisionCard]

RFC (engineering pack):
  QUERY { fact → problem → goal → proposal } → [FactCard, DecisionCard]

Legal Opinion (legal pack):
  QUERY { fact → constraint → evidence } → [FactCard, ConstraintCard]
```

The same components. Different compositions. All read the same graph.

---

## The Microkernel

The kernel knows only Layer 0.

It executes `CREATE_NODE`, `CREATE_EDGE`, `QUERY_GRAPH`, `MUTATE_NODE`, `DELETE`.

It reads Layer 2 (schema) for validation.
It loads Layer 1 (cognitive ISA) as opcodes.
It builds Layer 3 (components) as a Presentation AST.

```
Kernel Space:
Runtime (Layer 0)
  ↑ reads
Schema (Layer 2) — passive validator, evolves independently

Runtime (Layer 0)
  ↑ executes
Cognitive ISA (Layer 1) — OBSERVE, DECIDE, SYNTHESIZE, ASSERT, MUTATE

Runtime (Layer 0)
  ↑ queries + builds
Components (Layer 3) — ephemeral Presentation AST of knowledge bricks

Monitor (Level -1)
  ↑ renders
Environment Display — Obsidian / VS Code / Browser / CLI
```

User Space (outside kernel):
Patterns (macros) + Domain Packs (human-facing verbs)

---

## The Heartbeat Loop

Every interaction with Gratia follows the same 8-step cycle:

```
[1. Input / Event]     Text, Voice, Signal, AI Interrupt
         │
         ▼
[2. Intent Resolution]  Pack/Pattern in User Space translates to ISA opcode
         │
         ▼
[3. Cognitive ISA]      Execute: OBSERVE, DECIDE, SYNTHESIZE, ASSERT
         │
         ▼
[4. Graph Physics]      Real mutation on nodes and edges (Layer 0)
         │
         ▼
[5. Schema Validation]  Passive check: is the created node valid? (Layer 2)
         │
         ▼
[6. Component Assembly] Generate ephemeral AST of components (Layer 3)
         │
         ▼
[7. Monitor Rendering]  Display in Obsidian, VS Code, CLI (Level -1)
         │
         ▼
[8. System State]       Ready for next transition
```

This is the heartbeat of Gratia. Every button press, every AI extraction, every voice command flows through this exact loop.

---

## User Space: Patterns & Domain Packs

The kernel has exactly 4 layers. Everything else lives in user space — outside the runtime.

### Patterns are macros, not layers

Patterns are predefined ISA opcode combinations. They live in `patterns.json`.

```
clarity = OBSERVE + SYNTHESIZE + ASSERT
calm    = MUTATE(mood: "open") + OBSERVE(context)
vision  = SYNTHESIZE + OBSERVE + MUTATE(band: "clarity")
```

A pattern is a bash script — just an ordered chain of ISA commands. It does not live inside the runtime kernel. It lives in user space, defined by packs or users.

### Domain Packs define human-facing verbs

The Cognitive ISA speaks to machines. Domain packs speak to humans.

```
Emotional Pack (Garden):
  🫁 Breathe   → MUTATE(mood: "open") + OBSERVE(tension)
  🧭 Orient    → OBSERVE(context) + MUTATE(band: "clarity")
  🐸 Jump      → SYNTHESIZE + MUTATE(band: "flow")

Product Pack:
  Discover     → OBSERVE(facts) + OBSERVE(questions)
  Define       → DECIDE(tradeoffs) + ASSERT(constraints)

Engineering Pack:
  Review       → OBSERVE(decisions) + SYNTHESIZE(alternatives)
```

Each pack maps human commands to ISA opcodes. The runtime doesn't know about `breathe` or `discover`. It only knows `OBSERVE`, `DECIDE`, `SYNTHESIZE`, `ASSERT`, `MUTATE`.

### Discovery & Guidance

**New users don't need to memorize verbs.** Packs expose:

1. **Natural Language Triggers** — "I'm stuck" → auto-maps to `🧭 Orient`
2. **Affordances & UI** — Installing a pack registers contextual buttons in Obsidian/VS Code
3. **Capability Manifest** — System tells you: "You installed pack-product. You can now use: Discover, Map, Define."

**The companion can also guide you.** It runs `OBSERVE` over your context, detects state (`questions > 5 AND decisions == 0`), and triggers proactive guidance:

> "Răzvan, I see 6 open questions about Pluriva and TVA but no firm decisions. Let's do a quick 🧭 Orient: do we map old codes first or leave it for August 1?"

The companion doesn't force you to press `🧭 Orient`. It **applies the physics of the Orient verb through the questions it asks you**. You just answer, and the graph organizes itself.

---

## What This Means

A document generator produces one output per template.

A knowledge microkernel produces infinite outputs from the same graph, rendered through different monitors.

When you separate **graph operations** (Layer 0) from **cognitive opcodes** (Layer 1) from **schema validation** (Layer 2), you unlock:

1. **Stable physics** — the 5 graph operations never change
2. **Cognitive ISA** — 5 irreducible thinking primitives
3. **Evolvable schema** — new node types without kernel changes
4. **Composable opcodes** — same operations, different combinations
5. **Ephemeral components** — add a view without creating knowledge
6. **Environment-aware rendering** — same component, different displays
7. **User-space extensibility** — packs and patterns without kernel changes

This is not a writing pack. This is a knowledge microkernel.

The pipeline: **Input → Intent → ISA → Graph → Schema → Components → Monitor.**
