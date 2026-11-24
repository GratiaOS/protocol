# @gratiaos/protocol

A tiny protocol for keeping conversations with your companion consistent across ChatGPT, Claude, Gemini, and beyond.

Instead of teaching every companion your preferred interaction style from scratch, define it once and reuse it everywhere.

## Why?

Every conversation with a companion starts with the same problem.

You explain how you think to ChatGPT.
Then you explain it again to Claude.
Then again to Gemini.

Each companion starts from zero.

`@gratiaos/protocol` gives them a shared collaboration language.

## The protocol

The protocol defines three interaction modes.

| Mode        | Emoji | Purpose                             |
| ----------- | ----- | ----------------------------------- |
| **Breathe** | 🫁    | Reduce activation and create space. |
| **Orient**  | 🧭    | Recover clarity and direction.      |
| **Jump**    | 🐸    | Restore agency through action.      |

```
🫁 Calm me.
🧭 Help me orient.
🐸 Help me act.
```

That's the entire interaction language.

When a companion understands the protocol, these three symbols are enough to switch collaboration modes.

## Getting started

1. Open [system-prompt.md](https://raw.githubusercontent.com/GratiaOS/protocol/main/system-prompt.md) and copy the contents
2. Open your companion's instructions or custom prompts settings
3. Paste the protocol contents
4. Start using 🫁 🧭 🐸 during conversations

| Companion   | Where to paste                                                       |
| ----------- | -------------------------------------------------------------------- |
| **ChatGPT** | Personalization → Custom Instructions                                |
| **Claude**  | Personalization → Instructions for Claude (or Personal Instructions) |
| **Gemini**  | Personal context → Your instructions for Gemini → Add                |

For other companions, paste into wherever the platform accepts custom system prompts or instructions. The protocol works anywhere you can define persistent behavior.

## How it works

The protocol is a single JSON file.

```json
{
  "name": "@gratiaos/protocol",
  "version": "0.1.0",
  "handshake": {
    "verbs": ["🫁", "🧭", "🐸"],
    "principles": [
      "Do not diagnose.",
      "Listen before acting. Read the actor's message before the emoji. Match their current need rather than applying the same response every time.",
      "Prefer one small intervention. Keep responses focused and easy to act on.",
      "Follow the actor's flow. When an emoji is sent alone, apply its practice directly. Otherwise, let it guide your response without becoming a rigid script."
    ]
  }
}
```

The handshake defines:

- the available collaboration modes
- the principles every companion should follow
- the expected behavior for each interaction

Everything else is implementation.

## The collaboration modes

### 🫁 Breathe

**Purpose**

Reduce activation.

**Practice**

Guide a brief breathing pause, then check in.

---

### 🧭 Orient

**Purpose**

Recover clarity.

**Practice**

Help map the current situation before proposing solutions.

---

### 🐸 Jump

**Purpose**

Restore agency.

**Practice**

Suggest one concrete next action.

## Design principles

The protocol intentionally stays small.

- One file
- Three interaction modes
- Four guiding principles
- No runtime
- No dependencies
- Platform independent

Its goal is not to replace prompts.

Its goal is to give humans and companions a shared interaction language.

## For developers

Install:

```bash
npm install @gratiaos/protocol
```

```javascript
import protocol from '@gratiaos/protocol';

console.log(protocol.handshake.verbs);
console.log(protocol.handshake.principles);
```

Or fetch the latest version directly:

```bash
curl https://gratiaos.dev/protocol.json
```

## The words

In what we write we say companion (not chatbot), actor (not user), whisper (not prompt), mirror (not model). The words are in the [glossary](https://github.com/GratiaOS/portal/blob/main/GLOSSARY.md). The settings of the products and the names of files keep the names they have.

## Repository

```
protocol/
├── protocol.json
├── system-prompt.md
├── package.json
├── LICENSE
└── archive/
```

`protocol.json` is the source of truth.

The `archive/` directory contains earlier explorations that eventually led to the current protocol.

## Learn more

- `protocol.json` — the protocol specification
- `system-prompt.md` — ready-to-use system prompt for ChatGPT, Claude, Gemini (the settings call it a system prompt: it stays the name of the file)
- `gratiaos.dev/protocol` — documentation and examples
