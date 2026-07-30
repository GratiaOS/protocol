# Philosophy

## Protocols outlive runtimes

Gratia is not an AI framework.

AI (ChatGPT, Cursor, Claude) is simply the first runtime capable of executing the protocol.

The protocol is intentionally unaware of its execution environment.

Just as Git doesn't know GitHub, Gratia doesn't know Cursor, ChatGPT or Claude.

Today the runtime is an AI model. Tomorrow it will be something else. The protocol remains.

## Intent ≠ Implementation

Gratia separates what from how.

The vocabulary declares intent: "breathe", "orient", "jump".
It does not declare how these are executed.

An adapter reads the intent and applies the effects in its own way.
The same verb can produce different outputs in different runtimes.

This is not a feature. It is the foundation.

## Manifests index, they don't describe

A pack manifest lists artifact paths. It does not contain artifact metadata.

Each artifact describes itself in its own manifest file.

This keeps the pack manifest small and modular. Add an artifact without touching the pack. Prevents any single file from becoming the center of the architecture.

## Few concepts, reused consistently

Gratia does not invent new concepts for every layer.

Everything is a manifest:

- Protocol manifest (`gratia.manifest.json`)
- Domain pack manifest (`packs/*/gratia.manifest.json`)
- Artifact manifest (`artifacts/*.manifest.json`)

One format. One schema. Recursive composition.

## No layer looks up

Each layer consumes the one below it.
No layer depends on the one above.

```
Intent → Protocol → Domain → Adapter → Execution
```

This is rare in software architecture. It is also what makes the system extensible without modification.

## ISA over framework

Gratia is an instruction set, not a framework.

A framework provides structure and makes decisions for you.
An ISA provides instructions and lets the runtime decide.

Gratia is closer to x86 than to React.
It defines what operations exist, not how they compose.

## Domain packs are semantic, not technical

A "pack" is not a plugin mechanism.
It is a semantic grouping of verbs and artifacts for a domain.

"Plugin" describes a technical loading mechanism.
"Pack" describes what the content means.

This is intentional. The name reflects purpose, not implementation.

## Knowledge work over state transitions

At first, Gratia was about human state transitions.
It grew beyond that.

Verbs like `discover`, `map`, `define`, `design` do not just change human state.
They produce artifacts, coordinate teams, build knowledge.

The protocol is general enough for any structured knowledge work.
Human state transitions are one application, not the definition.
