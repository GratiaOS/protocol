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

## The Fundamental Principle

Documents are not knowledge.

Documents are **rendered components over knowledge**.

Knowledge is created once. It can be rendered infinitely — in Obsidian, VS Code, a browser, a terminal, or a PDF export.

---

## The Test

If deleting a PRD causes knowledge loss, the architecture is wrong.

Deleting any view should never delete understanding.

---

## The Architecture

```
                Intent (human or AI)
                  │
                  ▼
        Cognitive ISA (Layer 1)
         OBSERVE · DECIDE · SYNTHESIZE
                  │
                  ▼
        Graph Primitives (Layer 0)
         CREATE_NODE · CREATE_EDGE · QUERY
                  │
          ┌───────┴────────┐
          ▼                ▼
     Schema (Layer 2)   Components (Layer 3)
    passive validator   Presentation AST
          │                │
          └───────┬────────┘
                  ▼
            Monitors (Level -1)
         displays: Obsidian · VS Code · CLI
```

Each layer has exactly one responsibility. No layer looks up.

The pipeline is simple: **Transform → Graph → Components → Monitor.**

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

The Instruction Set Architecture of knowledge transformation.

Five primitive opcodes — the only things the runtime understands:

```
OBSERVE     → Extract a fact or state from raw input
DECIDE      → Create a choice between alternatives
SYNTHESIZE  → Group nodes into a new concept or structure
ASSERT      → Impose a boundary or constraint
MUTATE      → Change properties on an existing node
```

These are not human words. They are **cognitive operations** — the atomic things a knowledge system can do.

Think of them like `ADD`, `MUL`, `JUMP` in a CPU. You don't have `calculate_taxes` or `write_prd`. You have primitives that compose.

**What the Cognitive ISA is:** The set of possible knowledge transformations.

**What the Cognitive ISA is not:** Human-facing commands. Document templates. Workflow definitions.

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

**What the Schema is:** A dictionary of valid shapes. A type checker for knowledge.

**What the Schema is not:** A hard-coded ontology. A fixed set of types. Business logic.

---

## Layer 3 — Components (Anatomy)

Components are the **LEGO bricks of knowledge presentation**.

The graph does not render into Markdown. The graph renders into a **Presentation AST** — an Abstract Syntax Tree of knowledge components.

```
FactCard        → A single fact with properties
DecisionCard    → A decision with rationale and alternatives
ConstraintCard  → A boundary with scope and evidence
QuestionCard    → A question with status and context
Timeline        → Ordered sequence of events
ActorFlow       → Sequence of states or steps
GraphSummary    → Topology + statistics
```

An "Executive Summary" is not a text — it's a matrix that says: _Show 3 FactCards and the 2 most critical DecisionCards._

**What Components are:** Composable presentation units. Knowledge rendered as LEGO bricks.

**What Components are not:** Documents. Templates. Static pages. Fixed layouts.

---

## The Heartbeat Loop

This is the deterministic cycle that runs on every input — human or AI:

```
┌──────────────────────────────────────────────────────────────┐
│  1. INPUT / EVENT                                            │
│     User types "write a PRD" or Companion reads transcript   │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  2. INTENT RESOLUTION                                        │
│     "write a PRD" → create_prd                               │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  3. COGNITIVE ISA EXECUTION                                  │
│     OBSERVE → DECIDE → ASSERT → SYNTHESIZE (opcode chain)    │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  4. GRAPH MUTATION                                           │
│     CREATE_NODE × N, CREATE_EDGE × M → graph updated         │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  5. SCHEMA VALIDATION                                        │
│     Every node checked against ontology.json (passive)       │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  6. COMPONENT AST ASSEMBLY                                   │
│     QUERY_GRAPH → compile FactCard + DecisionCard + ...      │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  7. MONITOR RENDER                                           │
│     AST → Obsidian callouts / VS Code webview / CLI boxes    │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  8. SYSTEM STATE → NEXT LOOP                                 │
│     Components destroyed. Graph remains.                     │
└──────────────────────────────────────────────────────────────┘
```

**Components are ephemeral.** The AST is compiled, rendered, and destroyed. What remains is only the graph.

---

## Level -1 — Monitors (Environment Displays)

Monitors are **displays** — they translate knowledge components into what the user sees.

```
CLI          → ASCII colors in terminal
VS Code      → Interactive webview or JSDoc comments
Obsidian     → Markdown callouts (> [!decision])
Browser/React→ Styled HTML cards
MCP          → Structured tool responses
Firegate     → Companion protocol messages
PDF Export   → Legacy snapshot for external auditors
```

The same component renders differently in each environment:

```
DecisionCard in Obsidian  → > [!decision] Why we chose X
DecisionCard in VS Code   → Interactive webview inline with code
DecisionCard in Browser   → Styled card with hover details
DecisionCard in CLI       → ASCII box with emoji indicators
```

Monitors never contain business logic. They are translation layers between the protocol and external systems.

**What Monitors are:** Translation layers. Displays for the knowledge OS.

**What Monitors are not:** Logic containers. Document generators. Business rule engines.

---

## User Space: Patterns & Domain Packs

The core runtime has exactly 4 layers (0–3). Everything else lives in **user space** — outside the kernel.

### Patterns are macros, not layers

Patterns are predefined ISA opcode combinations. They live in `patterns.json`.

```
clarity = OBSERVE + SYNTHESIZE + ASSERT
calm    = MUTATE(mood: "open") + OBSERVE(context)
vision  = SYNTHESIZE + OBSERVE + MUTATE(band: "clarity")
```

A pattern is a bash script — just an ordered chain of ISA opcodes. It does not live inside the runtime kernel. It lives in user space, defined by packs or users.

**What Patterns are:** Cognitive recipes. Macro expansions.

**What Patterns are not:** A layer. A runtime component. A fixed workflow.

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

The kernel doesn't know what a PRD is. But it can discover intent from natural language:

```
User types: "write a PRD for X"
  → Intent detected: create_prd
  → Affordance shown: [Discover] [Define] [Draft]
  → Companion guidance: "Let's start by discovering the problem space"
```

Affordances are contextual suggestions. When you have a FactCard, the monitor suggests: "Create Decision? Add Constraint? Ask Question?"

The companion guides through ISA opcodes, not document templates.

---

## How It Works Together

### Human flow (🫁 Breathe)

```
User presses 🫁 in Obsidian
  │
  ▼
Pack macro expands: MUTATE(mood: "open") + OBSERVE(tension)
  │
  ▼
Cognitive ISA executes:
  MUTATE { node_id: "actor_1", properties: { mood: "open" } }
  OBSERVE { input: "tension reading", label: "fact" }
    → CREATE_NODE { label: "fact", properties: {...} }
  │
  ▼
Schema validates: fact has required properties [content, certainty, source] ✓
  │
  ▼
Components built from graph: [FactCard, ActorStateCard]
  │
  ▼
Adapter renders in Obsidian: > [!fact] + styled mood indicator
```

### AI flow (Companion extracts from call transcript)

```
Companion reads meeting transcript
  │
  ▼
Direct ISA calls (no human verbs):
  OBSERVE { "billing runs hourly", label: "fact" }
  OBSERVE { "payment timeout is 30s", label: "constraint" }
  DECIDE { "choose Stripe over PayPal", rationale: "...", alternatives: [...] }
  │
  ▼
CREATE_NODE × 3 → graph updated
  │
  ▼
Components: [FactCard, FactCard, ConstraintCard, DecisionCard]
  │
  ▼
Adapter renders in VS Code: inline webview with extracted knowledge
```

Both flows use the same runtime. Same graph. Same components. Different entry points.

---

## Why This Architecture Exists

Traditional systems couple three concerns:

```
Thinking + Storage + Presentation = Document
```

Every document is a silo. Every document duplicates knowledge. Every document is a source of truth — which means there are many truths, and they contradict each other.

Gratia separates them:

```
Transformation → Cognitive ISA (verbs)
Storage        → Knowledge Graph (nodes)
Presentation   → Components + Adapters (monitors)
```

One graph. Many views. No duplication.

---

## The Evolution Test

A good architecture survives its own success.

If adding a new view requires:

- New ISA opcodes → ❌ Layer 1 is too coupled
- New node types → ❌ Schema (Layer 2) is too rigid
- New patterns → ✅ This is fine, patterns live in user space
- New components → ✅ This is the point

If the answer is "yes" to the last two and "no" to the first two, the architecture is working.

---

## Files

```
gratia/
├── gratia.manifest.json         # Protocol identity
├── ontology.json                # Schema (Layer 2) — passive validator
├── runtime/                     # Graph Primitives (Layer 0)
│   ├── create_node.js
│   ├── create_edge.js
│   ├── query_graph.js
│   ├── mutate_node.js
│   └── delete.js
├── components/                  # Core Components (Layer 3) — ephemeral bricks
│   ├── fact-card.md
│   ├── decision-card.md
│   ├── timeline.md
│   └── graph-summary.md
├── adapters/                    # Monitors (Level -1) — environment displays
│   └── types.ts                 # executeVerb contract
├── patterns.json                # Patterns (user space) — ISA macros
├── packs/                       # Domain Packs (user space) — human verbs
│   ├── product/                 # Discover, Define → ISA opcodes
│   ├── legal/                   # Legal Opinion composition
│   ├── engineering/             # Review, ADR, RFC compositions
│   └── garden/                  # Emotional Pack: 🫁🧭🐸
└── ARCHITECTURE.md              # You are here
```

Core components ship with Gratia. Patterns and domain packs live in user space.

The files are implementation details. The architecture is the model.
