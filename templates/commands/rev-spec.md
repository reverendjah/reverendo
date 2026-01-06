# Feature Specification

Write a formal specification for: $ARGUMENTS

## Prerequisites

This command should ONLY be run AFTER completing `/rev-interview`.

If interview wasn't done, run `/rev-interview $ARGUMENTS` first.

---

## Specification Template

Write the following document based on interview answers:

```markdown
# Spec: [Feature Name]

**Date:** [Today's date]
**Status:** Draft | Approved | Implemented

## Problem Statement

[1-2 sentences describing the problem being solved, not the solution]

## Solution Overview

[High-level description of what will be built]

## Scope

### In Scope
- [Specific deliverable 1]
- [Specific deliverable 2]

### Out of Scope
- [What we explicitly won't do]
- [Related features that are separate work]

## Technical Design

### Data Model

[What data structures are involved? New fields? New types?]

### Service Changes

| Service | Changes |
|---------|---------|
| [service] | [what changes] |

### API/Interface

[Endpoints used, functions exposed]

### Error Handling

| Error Scenario | Behavior |
|----------------|----------|
| External API down | [what happens] |
| Rate limit hit | [what happens] |
| Invalid data | [what happens] |

### Dependencies

- [External services this depends on]
- [Internal services this depends on]

## Edge Cases

| Case | Handling |
|------|----------|
| [edge case] | [behavior] |

## Test Criteria

### Unit Tests
- [ ] [Functions that need unit tests]

### Must Pass
- [ ] [Specific testable requirement]

### Manual Verification
- [ ] [What to check manually]

## Tradeoffs & Decisions

| Decision | Reasoning |
|----------|-----------|
| [choice made] | [why] |

## Open Questions

- [Unresolved items to revisit]

## Assumptions

- [Things assumed true that weren't explicitly confirmed]
```

---

## After Writing Spec

1. Present spec to user
2. Ask for approval using AskUserQuestion
3. Address any feedback
4. Only proceed to `/rev-plan` after explicit approval

**The spec is the contract. Implementation must match the spec.**
