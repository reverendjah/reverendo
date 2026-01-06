# Code Review Checklist

Review changes with a critical eye: $ARGUMENTS

**Goal:** Code your supervisor would be proud of.

---

## 1. Simplicity & Clarity

### Is it easy to understand?
- [ ] A new dev would understand this code in 5 minutes
- [ ] Function names describe WHAT they do, not HOW
- [ ] Variables tell a story (avoid `data`, `temp`, `result`, `item`)
- [ ] No clever tricks - boring code is good code
- [ ] Complex logic broken into smaller, named functions

### Is it minimal?
- [ ] No dead or commented code
- [ ] No unused imports, variables, or parameters
- [ ] No premature optimization
- [ ] Each function does ONE thing

---

## 2. DRY & Reusability

### No duplication?
- [ ] Similar code blocks extracted into helpers
- [ ] Magic numbers/strings moved to constants
- [ ] Repeated patterns abstracted appropriately
- [ ] Ask: "Did I copy and paste something?" If yes, refactor.

### Helpers created where needed?
- [ ] Reusable logic moved to `utils/` or similar
- [ ] Shared types moved to `types/`
- [ ] Helpers are generic enough to reuse, specific enough to be useful

---

## 3. Robustness

### Error handling?
- [ ] Functions handle null/undefined inputs gracefully
- [ ] Async operations have try/catch with meaningful errors
- [ ] User-facing errors are helpful, not technical
- [ ] Edge cases are handled, not ignored

### Type safety?
- [ ] No `any` types (use `unknown` if truly dynamic)
- [ ] No `@ts-ignore` or `@ts-expect-error`
- [ ] Explicit return types for public functions
- [ ] Validation for external inputs (API, user data)

---

## 4. Maintainability

### Will this age well?
- [ ] No hardcoded values that might change
- [ ] Configuration separated from logic
- [ ] Dependencies are minimal and intentional
- [ ] Code follows existing patterns in codebase

### Is it testable?
- [ ] Functions are pure where possible (same input = same output)
- [ ] Side effects are isolated and mockable
- [ ] Dependencies can be injected
- [ ] Unit tests exist for new utility functions

---

## 5. Architecture

### Right place, right abstraction?
- [ ] Files are in logical locations
- [ ] No circular dependencies
- [ ] Separation of concerns respected

### Clean boundaries?
- [ ] Data fetching separated from processing
- [ ] Validation separated from business logic
- [ ] Error handling doesn't leak implementation details

---

## 6. Quality Gates

```bash
# Run these before committing
npm run test
npm run typecheck  # or: npx tsc --noEmit
npm run build
```

- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] No new warnings

---

## 7. Final Checks

### Security
- [ ] No hardcoded API keys, tokens, or secrets
- [ ] Credentials come from environment variables
- [ ] User input is validated before use
- [ ] No sensitive data in logs

### Git hygiene
- [ ] Changes are focused (one concern per commit)
- [ ] Commit message follows: `feat|fix|refactor: description`
- [ ] `.env` is not being committed

---

## 8. Documentation

**Only after Quality Gates (step 6) pass**, update documentation:

- [ ] Run `rev-documenter` agent to document changes
- [ ] Verify CLAUDE.md is still accurate (if project config changed)
- [ ] Update README if public API changed

**Do NOT document untested or unapproved changes.**

---

## Self-Review Questions

Before committing, ask yourself:

1. **Would I be embarrassed if my supervisor reviewed this?**
2. **If I read this code in 6 months, would I understand it?**
3. **Is there anything I'm "letting slide" that I know isn't right?**

If any answer is uncomfortable, **fix it now**.
