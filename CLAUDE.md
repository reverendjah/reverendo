# Reverendo

CLI que configura Claude Code com best practices para desenvolvedores.

## Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Language | JavaScript (vanilla) |
| Dependencies | None (zero deps) |

## Commands

```bash
# Test locally
node index.js

# Publish
npm publish
```

## Project Structure

```
reverendo/
├── index.js              # CLI entry point
├── package.json
├── README.md
└── templates/            # Copied to user's project
    ├── settings.json     # Claude Code permissions
    ├── claude.md         # Project instructions template
    ├── mcp.json          # MCP servers config
    ├── commands/         # /rev-* slash commands
    └── agents/           # Custom agents
```

## Development Guidelines

### Adding Features (MCPs, Plugins, Agents)

1. Add the config (`templates/mcp.json` or `templates/settings.json`)
2. Add conditional instruction in `templates/claude.md` (WHEN to use, when NOT)
3. Update `README.md`
4. Ask: "Does this actually help users or is it just cool?"

### Quality Check Before Commit

- Is `templates/claude.md` still coherent and scannable?
- Are all instructions actionable (clear criteria)?
- Would a new user understand what each feature does?
- Is this feature essential or bloat?

**Keep it simple. Less is more.**

## Workflow

### New Features
```
/rev-interview → /rev-spec → /rev-plan → implement → /rev-review → commit
```

### Bug Fixes / Simple Tasks
```
implement → /rev-review → commit
```

## Publishing

```bash
# 1. Update version in package.json and index.js
# 2. Commit
git add -A && git commit -m "feat: description"

# 3. Push and publish
git push origin main && npm publish
```

## Code Style

- Zero dependencies (keep it that way)
- Clear, descriptive names
- Conventional commits: `feat|fix|refactor|docs: description`
- Keep it simple
