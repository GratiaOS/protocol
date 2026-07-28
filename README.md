# Gratia 🐸

Gratia is an open protocol for human state transitions.

It defines a small vocabulary of semantic verbs that can be shared across humans, AI systems, applications, and other software.

The protocol separates **intent** from **implementation**.

## Why

Every system invents its own language for human states.

One says "calm".  
Another says "grounded".  
Another says "regulated".  
Another says "safe".

Although the words differ, the underlying intention is often the same.

Gratia standardizes the intention instead of the wording.

## Core Principle

```
Intent ≠ Implementation
```

A CPU doesn't know what a web browser is. It only understands instructions like:

```
ADD
MOV
JMP
```

Likewise, Gratia doesn't know what an LLM, terminal, browser, notebook, robot, or human facilitator is. It only understands semantic instructions such as:

```
🫁 breathe
🧭 orient
🐸 jump
```

How those instructions are executed depends entirely on the adapter.

## Mental Model

```
Human → Intent → Verb → Adapter → Transition
```

Gratia standardizes **the transition**, not the implementation.

## Repository Structure

```
gratia/
├── vocabulary.json          # Atomic verbs
├── vocabulary.json.md       # Human-readable documentation
├── patterns.json            # Verb compositions
├── grammars/
│   └── syntax.json          # Parsing rules
├── adapters/
│   └── types.ts             # executeVerb() contract
├── rfc/                     # Protocol evolution (RFCs)
└── README.md
```

## Getting Started

Because Gratia is an abstract instruction set, you don't need a heavy framework to start using it. You just need the vocabulary and a way to execute it.

### 1. Fetch the Vocabulary

```bash
npm install @gratiaos/gratia
```

Or pull the latest standard directly into your project:

```bash
curl -O https://raw.githubusercontent.com/gratiaos/gratia/main/vocabulary.json
```

### 2. Create a Simple Adapter

Here is how you might implement Gratia in a basic Node.js script:

```javascript
const vocabulary = require('./vocabulary.json');

// 1. Define your Adapter
async function executeVerb(verbId, context) {
  const verb = vocabulary.verbs.find((v) => v.id === verbId);
  if (!verb) throw new Error(`Verb ${verbId} not recognized.`);

  console.log(`\n[Intent]: ${verb.description}`);

  // 2. Implement the effects (this is where your app's logic lives)
  verb.effects.forEach((effect) => {
    console.log(`[Executing]: ${effect.target} → ${effect.direction || effect.to || effect.mark}`);
  });

  return { ok: true, state: 'transitioned' };
}

// 3. Run it
executeVerb('breathe', { raw: 'I feel completely overwhelmed right now.' });
```

### 3. TypeScript Adapter

For TypeScript projects, import the contract directly:

```typescript
import type { ExecuteVerbInput, VerbResult } from '@gratiaos/gratia/adapters/types';
import vocabulary from '@gratiaos/gratia/vocabulary.json';

async function executeVerb(verbId: string, context: ExecuteVerbInput['context']): Promise<VerbResult> {
  const verb = vocabulary.verbs.find((v) => v.id === verbId);
  if (!verb) throw new Error(`Verb ${verbId} not recognized.`);

  return {
    ok: true,
    message: `Executed ${verbId}`,
    effects: verb.effects.map((e) => ({ type: e.type, target: e.target, description: e.description })),
    newState: { band: 'open', spiritMode: 'bear' },
    nextVerb: verb.next_verb_suggestions?.[0],
  };
}
```

## How It Works

### 1. Parse

Human language is translated into semantic intent via Gratia's grammar.

```
Input: "[raw] I feel completely overwhelmed."
↓
Grammar: raw → breathe
```

### 2. Execute

Every implementation exposes the same interface, but the protocol never specifies _how_ the verb is implemented.

A CLI may print text.  
An LLM may generate a reflection.  
A mobile app may start a breathing exercise.  
A robot may dim the lights.

All are valid implementations.

### 3. Transition

Execution produces a new state based on the verb's declared effects.

```
Current State → Verb → Effects → Next State
```

## Atomic Verbs (v0.1)

| Verb    | Symbol | Purpose           | Category |
| ------- | ------ | ----------------- | -------- |
| breathe | 🫁     | Reduce activation | interior |
| orient  | 🧭     | Recover direction | interior |
| jump    | 🐸     | Restore agency    | interior |

Future versions will introduce additional verbs such as: 🗺 cartography, 📚 crystallize, 🤝 bridge.

## Adapters

Any system implementing the basic execution contract can become a Gratia adapter.

```
CLI
↓
🫁 breathe
↓
print("Take one slow breath.")
```

```
LLM
↓
🫁 breathe
↓
generate calming response
```

```
Robot
↓
🫁 breathe
↓
lower lights
```

Examples include:

- CLI tools
- AI assistants
- Mobile & web applications
- IDE companions
- Voice interfaces
- Robotics

The protocol remains identical across all implementations.

## Design Principles

The protocol follows a few simple, unbreakable rules.

### Intent before implementation

Verbs describe _what should happen_, never _how_.

### Small vocabulary

The protocol prefers a few composable verbs over hundreds of specialized commands.

### Portable semantics

The same verb should carry the same meaning across every adapter.

### Deterministic meaning

A verb should always express the same semantic intention, regardless of the adapter executing it.

### State, not judgment

The protocol never classifies states as good or bad. It only describes movement.

```
Current State
↓
Desired State
↓
Transition
```

## Versioning

| Version | Description             |
| ------- | ----------------------- |
| v0.1    | breathe · orient · jump |
| v0.2    | composition patterns    |
| v1.0    | stable instruction set  |

## License

Licensed under the **Mozilla Public License 2.0 (MPL-2.0).**

The protocol remains open. Implementations may be open-source or proprietary. Changes to the core protocol definitions must remain open.

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
Gratia aims to standardize human state transitions.
