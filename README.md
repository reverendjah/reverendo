# Reverendo

Claude Code setup with best practices.

## Usage

```bash
npx reverendo
```

## What It Does

Sets up your project with:

```
.claude/
├── settings.json           # Auto-approve safe commands
├── commands/
│   ├── rev-interview.md    # Requirements discovery
│   ├── rev-spec.md         # Feature specification
│   ├── rev-plan.md         # Implementation planning
│   ├── rev-review.md       # Code review checklist
│   └── rev-test.md         # Testing checklist
└── agents/
    └── rev-documenter.md   # Documentation agent

CLAUDE.md                    # Project instructions (you fill this)
.mcp.json                    # MCP servers (Context7 for up-to-date docs)
```

## Context7 Integration

Reverendo automatically configures [Context7](https://github.com/upstash/context7), giving Claude access to up-to-date library documentation.

**How it works:**
- Claude can query current docs for any library
- No more outdated API suggestions
- Works automatically once configured

**Requirements:** Node.js 18+

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

Run `npx reverendo` again to check for updates:

```
$ npx reverendo

Reverendo v1.0.0 → v1.1.0

Novidades:
  + rev-refactor.md (new)
  ~ rev-review.md (updated)

Update? [Y/n]
```

Your `CLAUDE.md` is never overwritten.

## License

MIT
