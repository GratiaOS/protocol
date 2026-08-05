# Dev Plan: Gratia v0.3.0 — Knowledge Microkernel

## Overview

Implement the Knowledge Microkernel Architecture defined in `ARCHITECTURE.md` and `prd-v0.3.0.md`.

**Goal:** Transform Gratia from template-based document generator to knowledge transformation microkernel.

**Timeline:** 6 weeks, 5 phases

---

## Phase 1: Graph Runtime (Week 1-2)

**Goal:** Core graph operations — Layer 0 of the kernel.

### Deliverables

#### 1.1 `runtime/create_node.js`

```javascript
// CREATE_NODE(label, properties) → node_id
export function createNode(graph, label, properties) {
  const id = `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  graph.nodes.set(id, { id, label, properties, createdAt: Date.now() });
  return id;
}
```

#### 1.2 `runtime/create_edge.js`

```javascript
// CREATE_EDGE(source, target, type) → edge_id
export function createEdge(graph, sourceId, targetId, type) {
  const id = `edge_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  graph.edges.set(id, { id, source: sourceId, target: targetId, type });
  return id;
}
```

#### 1.3 `runtime/query_graph.js`

```javascript
// QUERY_GRAPH(pattern) → subgraph
export function queryGraph(graph, pattern) {
  // Match nodes by label, properties, edges
  // Return matching subgraph as { nodes: Map, edges: Map }
}
```

#### 1.4 `runtime/mutate_node.js`

```javascript
// MUTATE_NODE(node_id, properties) → updated_node
export function mutateNode(graph, nodeId, properties) {
  const node = graph.nodes.get(nodeId);
  if (!node) throw new Error(`Node ${nodeId} not found`);
  Object.assign(node.properties, properties);
  return node;
}
```

#### 1.5 `runtime/delete.js`

```javascript
// DELETE(target_id) → removed
export function deleteNode(graph, nodeId) {
  const node = graph.nodes.get(nodeId);
  if (!node) throw new Error(`Node ${nodeId} not found`);
  graph.nodes.delete(nodeId);
  // Also remove connected edges
  for (const [edgeId, edge] of graph.edges) {
    if (edge.source === nodeId || edge.target === nodeId) {
      graph.edges.delete(edgeId);
    }
  }
  return node;
}
```

#### 1.6 `runtime/graph.js` — Graph container

```javascript
// In-memory graph structure
export class KnowledgeGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  // Convenience methods that delegate to primitives
  addNode(label, properties) {
    return createNode(this, label, properties);
  }
  addEdge(sourceId, targetId, type) {
    return createEdge(this, sourceId, targetId, type);
  }
}
```

### Acceptance Criteria

- [ ] All 5 primitives work correctly in isolation
- [ ] Graph container supports basic CRUD operations
- [ ] Query returns correct subgraphs for simple patterns
- [ ] Delete removes node and connected edges

---

## Phase 2: Schema Validation (Week 3)

**Goal:** Passive validator — Layer 2 of the kernel.

### Deliverables

#### 2.1 `ontology.json`

```json
{
  "version": "0.3.0",
  "node_types": {
    "fact": {
      "properties": ["content", "certainty", "source"],
      "required": ["content"]
    },
    "decision": {
      "properties": ["choice", "rationale", "alternatives"],
      "required": ["choice", "rationale"]
    },
    "constraint": {
      "properties": ["boundary", "scope", "source"],
      "required": ["boundary"]
    },
    "question": {
      "properties": ["gap", "context", "status"],
      "required": ["gap"]
    },
    "flow": {
      "properties": ["name", "states"],
      "required": ["name"]
    },
    "actor": {
      "properties": ["name", "role"],
      "required": ["name"]
    },
    "state": {
      "properties": ["name", "conditions"],
      "required": ["name"]
    }
  }
}
```

#### 2.2 `runtime/schema.js` — Schema validator

```javascript
// Passive validator — does not transform, does not store, only checks
export function validateNode(graph, label, properties) {
  const schema = loadOntology(); // reads ontology.json
  const nodeType = schema.node_types[label];

  if (!nodeType) {
    return { valid: false, error: `Unknown node type: ${label}` };
  }

  for (const required of nodeType.required) {
    if (!properties[required]) {
      return { valid: false, error: `Missing required property: ${required}` };
    }
  }

  return { valid: true };
}
```

### Acceptance Criteria

- [ ] All 7 node types defined in ontology.json
- [ ] Schema validates nodes on CREATE_NODE (passive check)
- [ ] Invalid nodes are rejected with clear error messages
- [ ] Adding a new node type only requires updating ontology.json

---

## Phase 3: Cognitive ISA (Week 4)

**Goal:** Primitive opcodes — Layer 1 of the kernel.

### Deliverables

#### 3.1 `runtime/isa.js` — ISA opcodes

```javascript
// Layer 1: Cognitive ISA — semantically irreducible operations

export function OBSERVE(graph, input, label = 'fact') {
  // Extract fact/state from raw input
  const properties = extractProperties(input);
  const validation = validateNode(graph, label, properties);
  if (!validation.valid) throw new Error(validation.error);

  return createNode(graph, label, properties);
}

export function DECIDE(graph, choice, rationale, alternatives) {
  // Create a decision between alternatives
  return createNode(graph, 'decision', { choice, rationale, alternatives });
}

export function SYNTHESIZE(graph, nodes, concept) {
  // Group nodes into a new concept
  const id = createNode(graph, 'fact', { content: concept });
  for (const node of nodes) {
    createEdge(graph, node.id, id, 'part_of');
  }
  return id;
}

export function ASSERT(graph, boundary, scope) {
  // Impose a boundary or constraint
  return createNode(graph, 'constraint', { boundary, scope });
}

export function MUTATE(graph, nodeId, properties) {
  // Change properties on an existing node
  return mutateNode(graph, nodeId, properties);
}
```

#### 3.2 `runtime/intent.js` — Intent resolution

```javascript
// Map human/AI input to ISA opcode chains
export function resolveIntent(input) {
  const intents = {
    'write a PRD': ['discover', 'define'],
    breathe: ['mutate_open', 'observe_tension'],
    orient: ['observe_context', 'mutate_clarity'],
    jump: ['synthesize', 'mutate_flow'],
  };

  return intents[input.toLowerCase()] || [];
}
```

### Acceptance Criteria

- [ ] All 5 ISA opcodes work correctly
- [ ] Intent resolution maps human input to opcode chains
- [ ] ISA opcodes compose (SYNTHESIZE can use DECIDE output)

---

## Phase 4: Component System & Monitors (Week 5)

**Goal:** Ephemeral Presentation AST + environment displays — Layer 3 + Level -1.

### Deliverables

#### 4.1 `components/fact-card.md`

```markdown
> [!fact] {{content}}
> **Certainty:** {{certainty}}% · **Source:** {{source}}
```

#### 4.2 `components/decision-card.md`

```markdown
> [!decision] {{choice}}
> **Rationale:** {{rationale}}
> **Alternatives:** {{alternatives.join(', ')}}
```

#### 4.3 `components/timeline.md`

```markdown
## Timeline

- {{event1}} — {{date1}}
- {{event2}} — {{date2}}
```

#### 4.4 `components/graph-summary.md`

```markdown
## Graph Summary

- **Nodes:** {{nodeCount}}
- **Edges:** {{edgeCount}}
- **Types:** {{typeDistribution}}
```

#### 4.5 `runtime/components.js` — Component AST compiler

```javascript
// Compile graph query results into Presentation AST
export function compileComponents(graph, query) {
  const subgraph = queryGraph(graph, query);
  const components = [];

  for (const [id, node] of subgraph.nodes) {
    if (node.label === 'fact') components.push({ type: 'FactCard', node });
    else if (node.label === 'decision') components.push({ type: 'DecisionCard', node });
    else if (node.label === 'constraint') components.push({ type: 'ConstraintCard', node });
    else if (node.label === 'question') components.push({ type: 'QuestionCard', node });
  }

  // Add Timeline if ordered nodes exist
  const flows = subgraph.nodes.filter((n) => n.label === 'flow');
  for (const flow of flows) {
    components.push({ type: 'Timeline', node: flow });
  }

  // Always add GraphSummary
  components.push({ type: 'GraphSummary', graph: subgraph });

  return { components, ephemeral: true };
}
```

#### 4.6 `adapters/obsidian.js` — Obsidian monitor

```javascript
// Render Component AST as Obsidian Markdown callouts
export function renderObsidian(ast) {
  return ast.components
    .map((comp) => {
      if (comp.type === 'FactCard') {
        return `> [!fact] ${comp.node.properties.content}\n> **Certainty:** ${comp.node.properties.certainty}% · **Source:** ${comp.node.properties.source}`;
      }
      // ... other component types
    })
    .join('\n\n');
}
```

#### 4.7 `adapters/vscode.js` — VS Code monitor

```javascript
// Render Component AST as VS Code webview HTML
export function renderVSCode(ast) {
  // Generate interactive HTML for webview
}
```

#### 4.8 `adapters/cli.js` — CLI monitor

```javascript
// Render Component AST as ASCII boxes with emoji
export function renderCLI(ast) {
  // Generate ASCII art for terminal
}
```

### Acceptance Criteria

- [ ] Components are ephemeral (no file output)
- [ ] Same AST renders correctly in Obsidian, VS Code, CLI
- [ ] Component compilation is deterministic

---

## Phase 5: Domain Compositions (Week 6)

**Goal:** User Space — Patterns + Domain Packs.

### Deliverables

#### 5.1 `patterns.json`

```json
{
  "patterns": {
    "clarity": ["OBSERVE", "SYNTHESIZE", "ASSERT"],
    "calm": ["MUTATE(mood: open)", "OBSERVE(context)"],
    "vision": ["SYNTHESIZE", "OBSERVE", "MUTATE(band: clarity)"],
    "discover": ["OBSERVE(facts)", "OBSERVE(questions)"],
    "define": ["DECIDE(tradeoffs)", "ASSERT(constraints)"]
  }
}
```

#### 5.2 `packs/product/gratia.manifest.json` — Product Pack

```json
{
  "id": "product",
  "version": "0.3.0",
  "name": "Product Domain Pack",
  "verbs": {
    "discover": ["OBSERVE(facts)", "OBSERVE(questions)"],
    "define": ["DECIDE(tradeoffs)", "ASSERT(constraints)"]
  }
}
```

#### 5.3 `packs/garden/gratia.manifest.json` — Emotional Pack

```json
{
  "id": "garden",
  "version": "0.3.0",
  "name": "Emotional Pack (Garden)",
  "verbs": {
    "breathe": ["MUTATE(mood: open)", "OBSERVE(tension)"],
    "orient": ["OBSERVE(context)", "MUTATE(band: clarity)"],
    "jump": ["SYNTHESIZE", "MUTATE(band: flow)"]
  }
}
```

#### 5.4 `adapters/types.ts` — Monitor contract v0.2 (update existing)

```typescript
interface GraphEffect {
  type: 'NODE_CREATED' | 'EDGE_CREATED' | 'NODE_MUTATED' | 'NODE_DELETED';
  targetId: string;
  payload: unknown;
}

interface VerbResult {
  ok: true;
  message: string;
  graphEffects: GraphEffect[];
  renderedComponents?: Record<string, string>;
  modifiedFiles?: FileRef[];
}

interface VerbError {
  ok: false;
  error: string;
}

function executeVerb(verbId: string, context: VerbContext): Promise<VerbResult | VerbError>;
```

### Acceptance Criteria

- [ ] Patterns expand to ISA opcode chains
- [ ] Domain packs map human verbs to ISA opcodes
- [ ] Garden pack works (🫁 Breathe, 🧭 Orient, 🐸 Jump)
- [ ] Product pack works (Discover, Define)

---

## Heartbeat Loop Integration

All phases integrate into the 8-step Heartbeat Loop:

```
1. INPUT / EVENT          → Phase 5 (Domain Packs receive input)
2. INTENT RESOLUTION      → Phase 3 (intent.js resolves intent)
3. COGNITIVE ISA          → Phase 3 (ISA opcodes execute)
4. GRAPH MUTATION         → Phase 1 (Graph Primitives mutate graph)
5. SCHEMA VALIDATION      → Phase 2 (Schema validates nodes)
6. COMPONENT AST ASSEMBLY → Phase 4 (Components compile AST)
7. MONITOR RENDER         → Phase 4 (Monitors render environment)
8. SYSTEM STATE           → Loop back to step 1
```

---

## Testing Strategy

### Unit Tests (Phase 1-3)

- Graph primitives: CRUD operations, query patterns
- Schema validation: all 7 node types, required properties
- ISA opcodes: each opcode in isolation, composition

### Integration Tests (Phase 4)

- Heartbeat Loop: full cycle from input to monitor render
- Component compilation: graph → AST → rendered output
- Monitor rendering: same AST in 3+ environments

### E2E Tests (Phase 5)

- Human flow: 🫁 Breathe → graph mutation → Obsidian render
- AI flow: Companion transcript → ISA extraction → VS Code render
- Cross-view: same fact rendered in Obsidian + CLI + Browser

---

## Risks & Mitigations

| Risk                           | Impact | Mitigation                                   |
| ------------------------------ | ------ | -------------------------------------------- |
| Graph query performance        | High   | Start with in-memory, optimize later         |
| Schema rigidity                | Medium | Schema is passive validator — easy to extend |
| Component rendering complexity | Medium | Start with 4 monitors, add more later        |
| Domain pack adoption           | Low    | Packs are user-space — no kernel impact      |

---

## Success Metrics

- [ ] All 5 graph primitives work correctly
- [ ] Schema validates all 7 node types
- [ ] All 5 ISA opcodes compose correctly
- [ ] Components are ephemeral (verified: no file output)
- [ ] 3 monitors render correctly (Obsidian, VS Code, CLI)
- [ ] 2 domain packs work (Product, Garden)
- [ ] Heartbeat Loop runs end-to-end

---

## Authors

🐸 Gratia Team — Knowledge Microkernel Dev Plan v0.3.0
