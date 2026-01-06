# Project Name

Brief description of your project.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | |
| Language | |
| Database | |
| Styling | |
| Runtime | |

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```

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

## Directory Structure

```
src/
├── ...
```

## Code Style

- Clear, descriptive names
- Explicit types, avoid `any`
- Conventional commits: `feat|fix|refactor|docs: description`
- Validate external inputs
- Keep it simple

## Library Documentation

When implementing features that use external libraries:
1. If unsure about the API → query Context7 first
2. If library version matters → verify with Context7
3. If getting errors with library calls → check current docs

Do NOT query for: native code, simple refactors, or well-known APIs.

## Security

- Credentials in `.env` (never commit)
- Validate all user inputs
- No secrets in code or logs

---

*This file evolves with your project. Update it as you learn more about your codebase.*
