# Reverendo

Claude Code setup with best practices.

## Usage

```bash
# Initialize and start Claude Code
npx reverendo

# Resume previous session
npx reverendo --resume
npx reverendo -r

# Continue last session
npx reverendo --continue
```

Any CLI arguments are passed directly to Claude Code.

## What It Does

Sets up your project with:

```
.claude/
├── settings.json           # Auto-approve safe commands + plugins + hooks
├── commands/
│   ├── rev-interview.md    # Requirements discovery
│   ├── rev-spec.md         # Feature specification
│   ├── rev-plan.md         # Implementation planning
│   ├── rev-review.md       # Code review checklist
│   └── rev-test.md         # Testing checklist
├── agents/
│   └── rev-documenter.md   # Documentation agent
└── hooks/
    └── check-docs.sh       # Documentation reminder hook

CLAUDE.md                    # Project instructions (you customize this)
.mcp.json                    # MCP servers (context7, sequential-thinking, playwright)
```

## Context7 Integration

Reverendo automatically configures [Context7](https://github.com/upstash/context7), giving Claude access to up-to-date library documentation.

**How it works:**
- Claude can query current docs for any library
- No more outdated API suggestions
- Works automatically once configured

## Sequential Thinking

Reverendo configures the [sequential-thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) MCP server for structured reasoning on complex problems.

**What it does:**
- Breaks down complex problems into steps
- Allows revising previous thoughts
- Generates and verifies hypotheses before answering

## Playwright

Reverendo configures the [Playwright MCP](https://github.com/microsoft/playwright-mcp) server for browser automation and E2E testing.

**What it does:**
- Automate browser interactions
- Run E2E tests
- Take screenshots and interact with web pages

## Frontend Design Plugin

Reverendo enables the official [frontend-design](https://github.com/anthropics/claude-code-plugins) plugin, giving you access to production-grade UI generation.

**Usage:**
```
/frontend-design
```

Creates distinctive, polished frontend interfaces that avoid generic AI aesthetics.

**Requirements:** Node.js 18+

## Documentation Hook

Reverendo includes a Stop hook that reminds Claude to update documentation when code changes.

**How it works:**
- Runs automatically after Claude finishes responding
- Checks if code files changed but documentation didn't
- Forces Claude to acknowledge and consider running `rev-documenter`

This ensures documentation stays in sync with your codebase.

## Workflow

### New Features
```
/rev-interview → /rev-spec → /rev-plan → implement → /rev-review → commit
```

### Bug Fixes
```
implement → /rev-review → commit
```

### Simple Tasks
```
implement → commit
```

## Commands

| Command | Description |
|---------|-------------|
| `/rev-interview` | Ask questions to understand requirements |
| `/rev-spec` | Write formal specification |
| `/rev-plan` | Plan implementation tasks |
| `/rev-review` | Review code quality |
| `/rev-test` | Testing checklist |

## Smart Updates

Run `npx reverendo` again to update to the latest version. Your customized `CLAUDE.md` is backed up before updating.

## License

MIT
