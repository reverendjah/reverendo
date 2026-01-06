# Implementation Planning

Plan implementation for: $ARGUMENTS

## Prerequisites Checklist

Before planning, verify:

1. **Interview complete?** - Was `/rev-interview` run for this feature?
2. **Spec approved?** - Is there an approved spec from `/rev-spec`?

If NO to either:
- Run `/rev-interview $ARGUMENTS` first
- Then `/rev-spec $ARGUMENTS`
- Return here only after spec approval

**Planning without spec leads to rework. Don't skip discovery.**

---

## Planning Steps

### 1. Reference the Spec

Extract key constraints from approved spec:
- Scope boundaries
- Technical decisions already made
- Edge cases to handle
- Test criteria

### 2. Codebase Research

Explore existing code:
- What patterns exist for similar features?
- What services will be touched?
- Are there reusable utilities?
- What's the test coverage like?

### 3. Implementation Breakdown

Create ordered task list:

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1 | [task] | [files] | - |
| 2 | [task] | [files] | 1 |

Rules:
- Tasks should be small (< 30 min of work)
- One responsibility per task
- Clear dependencies
- Independently testable where possible

### 4. Risk Assessment

| Risk | Probability | Mitigation |
|------|-------------|------------|
| External API down | Low | Retry with backoff |
| [other risk] | High/Medium/Low | [how to reduce] |

### 5. File Summary

**Create:**
- [new files]

**Modify:**
- [existing files]

**Delete:**
- [files to remove]

### 6. Quality Gates

After implementation:
- [ ] Tests pass
- [ ] TypeScript compiles (if applicable)
- [ ] Build succeeds
- [ ] `/rev-test` checklist completed

---

## Approval Request

Use AskUserQuestion to confirm:
- Does this plan match your expectations from the spec?
- Any concerns about the approach?
- Ready to proceed with implementation?

**Wait for explicit approval before writing any code.**
