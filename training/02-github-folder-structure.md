# GitHub Folder Structure for Copilot CLI

This document explains how our `.github` folder is organized to customize and extend Copilot CLI's capabilities.

---

## Folder Overview

```
.github/
├── agents/                  # Custom subagents for specialized tasks
├── commands/                # Slash command definitions
├── prompts/                 # Reusable prompt templates
├── prompts-archive/         # Archived/deprecated prompts
├── skills/                  # Extended capabilities (docx, pdf, etc.)
└── copilot-instructions.md  # Global workspace instructions
```

---

## 1. `copilot-instructions.md` - Global Instructions

This is the **primary configuration file** that Copilot reads automatically when you launch it in the repository.

### What It Contains:
- Workspace context (what the project is, how to run it)
- Core principles and workflow guidelines
- Documentation requirements
- Available agents and when to use them
- Available prompts and their purposes

### Example Content:
```markdown
# Workspace Instructions

You are operating out of the DevOps folder. Each folder in this 
workspace has its own Git repository...

## Core Principles
1. Research before planning
2. Plan before implementing
3. Document everything
4. Verify at each step
5. Use subagents liberally
```

---

## 2. `agents/` - Custom Subagents

Subagents are **specialized AI helpers** that run in separate contexts. They keep the main conversation clean and are optimized for specific tasks.

### Our Agents:

| Agent | Purpose |
|-------|---------|
| `codebase-locator.md` | Find WHERE files and components live |
| `codebase-analyzer.md` | Understand HOW code works |
| `codebase-pattern-finder.md` | Find similar implementations |
| `database-query.md` | Query the Finys database |
| `docs-locator.md` | Find existing documentation |
| `docs-analyzer.md` | Extract insights from docs |
| `web-search-researcher.md` | Research external info |

### Agent File Structure:

```markdown
---
name: codebase-locator
description: Locates files, directories, and components...
tools:
  - search
---

You are a specialist at finding WHERE code lives...

## Core Responsibilities
1. Find Files by Topic/Feature
2. Categorize Findings
3. Return Structured Results
```

### How to Use:
In your conversation, Copilot will automatically spawn these agents:
```
Use codebase-locator: "Find all files related to payment processing"
Use database-query: "What tables store claim data?"
```

---

## 3. `prompts/` - Reusable Prompt Templates

Prompts are **predefined workflows** you can invoke to perform common tasks consistently.

### Our Prompts:

| Category | Prompt | Purpose |
|----------|--------|---------|
| **Research** | `research_codebase.prompt.md` | Comprehensive codebase research |
| **Planning** | `create_plan.prompt.md` | Create detailed implementation plans |
| | `iterate_plan.prompt.md` | Update existing plans |
| | `validate_plan.prompt.md` | Verify implementation against plan |
| **Implementation** | `implement_plan.prompt.md` | Execute a plan phase by phase |
| **Session** | `create_handoff.prompt.md` | Create handoff when stopping work |
| | `resume_handoff.prompt.md` | Resume from a handoff |
| **Git** | `commit.prompt.md` | Create well-structured commits |
| | `describe_pr.prompt.md` | Generate PR descriptions |

### Prompt File Structure:

```markdown
---
description: Create detailed implementation plans...
model: Claude Opus 4.5 (copilot)
---

# Implementation Plan

You are tasked with creating detailed implementation plans...

## Process Steps
### Step 1: Context Gathering
...
```

### How to Use:
Reference prompts directly in your conversation or use the command versions in `commands/`.

---

## 4. `commands/` - Slash Commands

Commands are **interactive slash commands** that execute specific workflows.

### Our Commands:

| Command | Purpose |
|---------|---------|
| `/commit` | Create git commits with proper messages |
| `/create_plan` | Start the planning workflow |
| `/iterate_plan` | Update an existing plan |
| `/implement_plan` | Execute a plan step by step |
| `/research_codebase` | Research a topic in the codebase |
| `/create_handoff` | Create a handoff document |
| `/resume_handoff` | Resume from a handoff |
| `/describe_pr` | Generate a PR description |

### Command File Structure:

```markdown
---
description: Create git commits with user approval...
---

# Commit Changes

You are tasked with creating git commits...

## Process:
1. Think about what changed
2. Plan your commit(s)
3. Present your plan to the user
4. Execute upon confirmation
```

### How to Use:
Type the command directly in Copilot CLI:
```
/create_plan docs/shared/tickets/ticket_1234.md
/commit
/describe_pr
```

---

## 5. `skills/` - Extended Capabilities

Skills provide **specialized knowledge and tools** for specific file types or tasks.

### Our Skills:

| Skill | Purpose |
|-------|---------|
| `docx/` | Create and edit Word documents |
| `pdf/` | Create and manipulate PDFs |
| `xlsx/` | Create and edit spreadsheets |
| `pptx/` | Create presentations |
| `frontend-design/` | Build web interfaces |
| `doc-coauthoring/` | Collaborative document writing |
| `theme-factory/` | Apply styling themes |
| `slack-gif-creator/` | Create animated GIFs |
| `skill-creator/` | Create new skills |

### How Skills Work:
Skills are automatically invoked when relevant. For example, if you ask Copilot to "create a PDF report", it will automatically use the `pdf` skill.

---

## Workflow: How It All Fits Together

```
┌─────────────────────────────────────────────────────────────┐
│  copilot-instructions.md                                    │
│  (Global context, principles, agent/prompt documentation)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  commands/                                                  │
│  User invokes: /create_plan                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  prompts/                                                   │
│  Command uses: create_plan.prompt.md template               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  agents/                                                    │
│  Prompt spawns: codebase-locator, codebase-analyzer         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  skills/ (if needed)                                        │
│  For specialized output: docx, pdf, pptx                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Takeaways

1. **`copilot-instructions.md`** = Global context and guidelines
2. **`agents/`** = Specialized AI helpers for parallel research
3. **`commands/`** = Slash commands for interactive workflows  
4. **`prompts/`** = Reusable templates for consistent processes
5. **`skills/`** = Extended capabilities for specific file types

---

## Best Practices

- **Use subagents liberally** - They keep main context clean
- **Document everything** - Research, plans, and handoffs persist
- **Follow the workflow** - Research → Plan → Implement → Verify
- **Use file:line references** - Always include specific locations
- **Create handoffs** - When stopping work, document status for resumption
