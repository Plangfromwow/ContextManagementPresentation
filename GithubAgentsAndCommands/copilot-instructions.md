# Workspace Instructions

This workspace uses a **documentation-driven development workflow** inspired by HumanLayer. The goal is to research thoroughly, plan carefully, and implement systematically with full context preservation across sessions.

## Project Context

- **Ticket System**: Azure DevOps (the agent does NOT have direct access to the DevOps server)
- **Ticket Format**: When users reference tickets, they will provide the context manually (e.g., copy/paste from DevOps)
- **Documentation**: All plans, research, and handoffs are stored in the `docs/` directory

## Core Principles

1. **Research before planning** - Understand the codebase before proposing changes
2. **Plan before implementing** - Create detailed plans with success criteria
3. **Document everything** - Save research, plans, and handoffs for future reference
4. **Verify at each step** - Run tests and pause for manual verification

---

## Available Agents

Use these specialized agents for parallel research:

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| `codebase-locator` | Find WHERE files and components live | Starting research, finding relevant code |
| `codebase-analyzer` | Understand HOW code works | Deep-diving into implementation details |
| `codebase-pattern-finder` | Find similar implementations | Looking for examples to model after |
| `docs-locator` | Find existing documentation | Checking for prior research/plans |
| `docs-analyzer` | Extract insights from docs | Understanding past decisions |
| `web-search-researcher` | Research external info | Looking up APIs, libraries, best practices |

### Using Agents

Spawn agents using `runSubagent` for parallel research. Example:
- Use `codebase-locator` to find all files related to a feature
- Use `codebase-analyzer` to understand how a specific component works
- Run multiple agents in parallel when researching different aspects

---

## Available Prompts

Reference these prompts in `.github/prompts/` for specific workflows:

### Research & Planning
- `research_codebase.prompt.md` - Comprehensive codebase research
- `create_plan.prompt.md` - Create detailed implementation plans
- `iterate_plan.prompt.md` - Update existing plans based on feedback

### Implementation
- `implement_plan.prompt.md` - Execute a plan phase by phase
- `validate_plan.prompt.md` - Verify implementation against plan

### Session Management
- `create_handoff.prompt.md` - Create handoff document when stopping
- `resume_handoff.prompt.md` - Resume work from a handoff

### Git & PR
- `commit.prompt.md` - Create well-structured commits
- `describe_pr.prompt.md` - Generate PR descriptions

---

## Documentation Structure

All documentation lives in the `docs/` directory:

```
docs/
├── shared/                    # Team-shared documentation
│   ├── plans/                 # Implementation plans (YYYY-MM-DD-description.md)
│   ├── research/              # Research documents (YYYY-MM-DD-description.md)
│   ├── tickets/               # Ticket details and context
│   ├── prs/                   # PR descriptions ({number}_description.md)
│   └── handoffs/              # Session handoffs
│       └── ENG-XXXX/          # Per-ticket handoff folders
└── local/                     # Personal notes (not shared)
    └── notes/
```

### File Naming Conventions
- Plans: `docs/shared/plans/YYYY-MM-DD-ENG-XXXX-description.md`
- Research: `docs/shared/research/YYYY-MM-DD-description.md`
- Handoffs: `docs/shared/handoffs/ENG-XXXX/YYYY-MM-DD_HH-MM-SS_description.md`
- PR descriptions: `docs/shared/prs/{pr_number}_description.md`

---

## Workflow Guidelines

### When Asked to Research
1. Spawn parallel agents to gather context
2. Read all mentioned files completely
3. Save findings to `docs/shared/research/`
4. Present summary with file:line references

### When Asked to Plan
1. First research if not already done
2. Break work into phases with specific changes
3. Include success criteria (automated + manual)
4. Save plan to `docs/shared/plans/`
5. Get user approval before implementation

### When Asked to Implement
1. Read the plan completely
2. Implement one phase at a time
3. Run automated verification after each phase
4. Pause for manual verification before next phase
5. Check off completed items in the plan

### When Stopping Mid-Work
1. Create a handoff document
2. Include: tasks status, learnings, file references, next steps
3. Save to `docs/shared/handoffs/`

---

## Important Reminders

- **Never suggest improvements unless asked** - Document what exists, don't critique
- **Read files completely** - Don't use partial reads for important context
- **Use file:line references** - Always include specific locations
- **Save documentation** - Research and plans should persist for future sessions
- **Verify before proceeding** - Run tests and get confirmation at checkpoints
