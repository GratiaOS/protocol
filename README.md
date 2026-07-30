# Gratia 🐸

An instruction set architecture for structured knowledge work.

## Quick Start

### 1. Install the vocabulary

```bash
npm install @gratiaos/gratia
```

### 2. Read a verb

```javascript
import vocabulary from '@gratiaos/gratia/vocabulary.json';

const breathe = vocabulary.verbs.find((v) => v.id === 'breathe');
console.log(breathe.description);
// → "Return to the body through conscious breathing. Reduces cognitive load and brings attention back to the present."
```

### 3. Implement an adapter

```typescript
import type { ExecuteVerbInput } from '@gratiaos/gratia/adapters/types';

async function executeVerb(input: ExecuteVerbInput) {
  const verb = vocabulary.verbs.find((v) => v.id === input.verbId);
  if (!verb) throw new Error(`Unknown verb: ${input.verbId}`);

  for (const effect of verb.effects) {
    console.log(`[${effect.type}] ${effect.target} → ${effect.direction || effect.to}`);
  }

  return { ok: true, effects: verb.effects };
}
```

## Core Concepts

| Concept         | What it is                       | Where                          |
| --------------- | -------------------------------- | ------------------------------ |
| **Vocabulary**  | Atomic verbs (ISA)               | `vocabulary.json`              |
| **Manifest**    | Protocol identity + domain packs | `gratia.manifest.json`         |
| **Domain Pack** | Verbs mapped to artifacts        | `packs/*/gratia.manifest.json` |
| **Adapter**     | Runtime execution contract       | `adapters/`                    |

## Repository Structure

```
gratia/
├── vocabulary.json              # ISA — atomic verbs
├── gratia.manifest.json         # Protocol identity
├── manifest.schema.json         # Schema for all manifests
├── adapters/                    # Runtime execution contracts
│   └── types.ts                 # ExecuteVerb() interface
├── packs/                       # Domain packs
│   └── product/                 # Product documentation pack
├── WHY.md                       # Why this exists
├── ARCHITECTURE.md              # How it's built
└── PHILOSOPHY.md                # Design principles
```

## Links

- [WHY](./WHY.md) — Why Gratia exists
- [ARCHITECTURE](./ARCHITECTURE.md) — Layer separation and data flow
- [PHILOSOPHY](./PHILOSOPHY.md) — Design principles and tradeoffs
- [Vocabulary Reference](./vocabulary.json.md) — Human-readable verb definitions

## Contributing

New verbs are welcome. Each proposal should include:

- Semantic intent
- Expected state transition
- Effects
- Contraindications
- Possible adapters
- Recommended follow-up verbs

The goal is to evolve the language carefully while keeping the protocol small, composable, and implementation-independent.

## Vision

Computers standardized computation.  
Networks standardized communication.  
Git standardized collaboration.  
Gratia aims to standardize structured knowledge work.
