# Architecture

Gratia is built on a single directional principle: **no layer looks up**.

## Layers

```
Intent
  │
  ▼
Protocol (ISA)
  │
  ▼
Domain Pack
  │
  ▼
Runtime Adapter
  │
  ▼
Execution
```

Each layer consumes the one below it. No layer depends on the one above.

## Layer 1 — Protocol (ISA)

The ISA is the combination of two files:

- **`vocabulary.json`** — atomic verbs (the opcodes)
- **`gratia.manifest.json`** — protocol identity and available instructions

Together they form the ISA. Not either one alone.

```
ISA = vocabulary.json + gratia.manifest.json
```

The ISA declares:

- Which verbs exist
- What they are called
- What effects they produce

It does NOT declare:

- How they execute
- What runtime runs them
- What interface exposes them

## Layer 2 — Domain Pack

A domain pack maps ISA verbs to domain-specific artifacts.

```json
{
  "extends": "@gratiaos/gratia",
  "artifacts": ["artifacts/brd.manifest.json"],
  "verbs": {
    "define": ["brd"]
  }
}
```

The pack says: "when someone uses `define`, produce a BRD."

It does NOT say how the BRD is written. That's the adapter's job.

### Artifact manifests

Each artifact has its own manifest that describes itself:

```json
{
  "name": "brd",
  "template": "templates/brd.md",
  "guides": ["guides/garden-writing.md"]
}
```

The pack manifest **indexes** artifacts. It does not describe them.

This keeps the pack manifest small (~30 lines) and modular (add an artifact without touching the pack).

## Layer 3 — Runtime Adapter

The adapter is where intent becomes execution.

```
adapters/
├── types.ts           # ExecuteVerb() contract
├── cursor/            # Cursor adapter (future)
├── chatgpt/           # ChatGPT adapter (future)
└── cli/               # CLI adapter (future)
```

Each adapter implements the same contract:

```typescript
interface ExecuteVerbInput {
  verbId: string;
  context: VerbContext;
}

interface VerbResult {
  ok: boolean;
  effects: Effect[];
  message?: string;
}
```

The adapter decides:

- Which tool to call (if any)
- How to format the input
- What output to return

The protocol does NOT decide this.

## Data Flow

```
User says: "I'm overwhelmed"
  │
  ▼
Intent detection → verbId = "breathe"
  │
  ▼
ExecuteVerb({ verbId: "breathe", context })
  │
  ▼
Adapter reads vocabulary.json for effects
  │
  ▼
Adapter applies effects (CLI prints text, system generates response, etc.)
  │
  ▼
Returns VerbResult
```

## Key Design Decisions

### Protocol is unaware of runtime

The protocol does not know it runs on AI agents. It does not know about Cursor, ChatGPT, Claude, or any other runtime.

AI is simply the first runtime capable of executing the protocol.

This is intentional. Just as Git doesn't know GitHub, Gratia doesn't know its runtime.

### Manifests index, they don't describe

A pack manifest lists artifact paths. It does not contain artifact metadata.

Each artifact describes itself in its own manifest file.

This prevents any single file from becoming the center of the architecture.

### One schema for all manifests

The same `manifest.schema.json` validates:

- Protocol manifest (`gratia.manifest.json`)
- Domain pack manifests (`packs/*/gratia.manifest.json`)
- Artifact manifests (`artifacts/*.manifest.json`)

Consistent naming, consistent structure, recursive composition.
