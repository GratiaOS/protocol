# Gratia Protocol — Vocabulary

Instruction set for human state processing.
Each verb declares the **intent** (what changes), not the implementation (how).

---

## Verb Structure

```json
{
  "id": "breathe",
  "symbol": "🫁",
  "category": "interior",
  "name": "Breathe (ES: Respira, RO: Respiră)",
  "description": "Return to the body through conscious breathing. Reduces cognitive load and brings attention back to the present.",
  "effects": [
    { "type": "state_change", "target": "mood", "from": ["contracted", "anxious", "frustrated"], "to": "open" },
    { "type": "state_change", "target": "cognitive_load", "direction": "reduce" },
    { "type": "signal_emitted", "target": "energy", "mark": "calm" }
  ],
  "adaptations": {
    "cli": { "message": "Stop everything. 3 deep breaths. In 4, hold 4, out 6.", "duration_seconds": 30 },
    "firegate": { "action": "ask_gentle_questions", "questions": ["What do you feel in your body right now?", "Where does the tension stop?"] },
    "garden": { "heartware_state": "CALM", "css_effect": "pulse-slow" },
    "m3": { "action": "log_emotion", "kind": "calm", "intensity": 0.7 }
  },
  "next_verb_suggestions": ["orient", "cartography"],
  "contraindications": ["flow"]
}
```

---

## Verb Categories

### Interior (modifies human state)

- 🫁 **breathe** — Return to the body through breathing
- 🧭 **orient** — Spatial and temporal repositioning
- 🐸 **jump** — Perspective shift (change the frame)

### Exterior (modifies workspace)

- 🗺 **cartography** — Context mapping (organizes chaos into structure)
- 🏗 **crystallize** — Solidifying the idea into a format
- 🤝 **bridge** — Connecting two entities (people, ideas, systems)

---

## Atomic Verbs

### 1. 🫁 breathe — Return to Body

**Name:** Breathe (ES: Respira, RO: Respiră)
**Category:** interior
**Purpose:** Reduce cognitive load, bring attention back to the present.

**When to use:**

- Actor is contracted, anxious, or frustrated
- Tension is rising in a discussion
- An important decision needs to be made, and emotions are surface-level

**Effects:**

- `state_change`: mood → open (from contracted/anxious/frustrated)
- `state_change`: cognitive_load → reduce
- `signal_emitted`: energy mark = calm

**When NOT to use:**

- Actor is already in flow (don't interrupt the flow)

**Suggested next verbs:** orient, cartography

---

### 2. 🧭 orient — Repositioning

**Name:** Orient (ES: Oriéntate, RO: Încotro)
**Category:** interior
**Purpose:** Spatial and temporal repositioning. Answers: where am I? when am I? what cycle am I in?

**When to use:**

- Actor is lost, doesn't know where to start
- After breathe (calm body → oriented mind)
- At the start of a work/reflection session

**Effects:**

- `state_change`: mood → clarity (from confused)
- `signal_emitted`: energy mark = clarity
- `state_change`: band → open (if it was heavy)

**When NOT to use:**

- Actor already knows where they are (orientation is redundant)

**Suggested next verbs:** cartography, crystallize

---

### 3. 🐸 jump — Perspective Shift

**Name:** Jump (ES: Salta, RO: Sari)
**Category:** interior
**Purpose:** Change the frame of reference. "Look at the situation from 3 years' perspective."

**When to use:**

- Actor is stuck in a limiting perspective
- After orient (clarity + perspective shift = vision)
- When the problem seems insurmountable in the current frame

**Effects:**

- `state_change`: mood → flow (from contracted/heavy)
- `signal_emitted`: energy mark = focus
- `state_change`: perspective → shifted

**When NOT to use:**

- Actor needs stability, not change (they're calm and want to stay there)

**Suggested next verbs:** cartography, bridge

---

## How to Read a Verb

1. **id** — Unique identifier, used in runtime execution (e.g., `executeVerb('breathe', ...)`).
2. **symbol** — Associated emoji, used in UI and CLI for quick visual recognition.
3. **effects** — What changes in the system/actor (the intent, not the execution).
4. **adaptations** — How each specific adapter implements the effects (the execution).
5. **next_verb_suggestions** — What verb organically comes next (used for building patterns).
6. **contraindications** — Strict rules on when NOT to use the verb.

---

## Rules

1. **Minimum Effects:** Each verb must have a minimum of 3 effects.
2. **Minimum Adaptations:** Each verb must have a minimum of 2 adaptations (the cli adapter is mandatory).
3. **Intent over Action:** effects declare what happens, never how.
4. **Action over Intent:** adaptations declare how it happens, never what.
5. **Always Connected:** Each verb must define next_verb_suggestions (no verb exists in isolation).
6. **Safety First:** Each verb must define contraindications (no verb is universally applicable).
7. **Always Connected:** Each verb must define next_verb_suggestions (no verb exists in isolation).
8. **Safety First:** Each verb must define contraindications (no verb is universally applicable).
