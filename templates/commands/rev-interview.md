# Feature Interview

Conduct a complete requirements discovery for: $ARGUMENTS

## Use AskUserQuestion Tool

You MUST use the `AskUserQuestion` tool to gather requirements. DO NOT assume or guess answers.

---

## Interview Phases

### Phase 1: Intent & Context

Ask about the underlying problem:
- What problem does this solve? (not "what feature" but "why")
- Who is affected by this problem today?
- What happens if we don't solve it?
- Is there any workaround being used?

### Phase 2: Scope & Boundaries

Clarify what's in and out:
- What's the minimum viable version?
- What explicitly should NOT be included?
- Are there related features this should NOT touch?
- Any hard constraints (time, complexity, dependencies)?

### Phase 3: Technical Deep-Dive

Non-obvious technical questions:
- Does this interact with external APIs? Which ones? Rate limits?
- What data needs to persist? Where? For how long?
- What happens when this fails? Retry? Notify? Ignore?
- Are there race conditions or concurrent access concerns?
- What existing patterns/services should this follow?

### Phase 4: Edge Cases & Error Scenarios

Probe for hidden complexity:
- What if user input is malformed?
- What if an external API is down?
- What if the operation takes longer than expected?
- What if there's partial success (3 of 5 items)?
- What data validation is needed?

### Phase 5: Tradeoffs & Concerns

Surface decisions that need explicit approval:
- Speed vs. reliability: what matters more here?
- Simple now vs. flexible later?
- Any security/privacy implications?
- Performance budget (acceptable latency)?
- What would make you reject this implementation?

### Phase 6: Testing & Validation

Define "done":
- How will you verify this works?
- What would a "bug" look like?
- Any specific scenarios to test?
- Need automated tests or manual verification ok?

---

## Interview Rules

1. **Ask 2-4 questions per AskUserQuestion call** (don't overwhelm)
2. **Keep iterating** until you have clear answers for each phase
3. **Don't skip phases** - each reveals different requirements
4. **Challenge vague answers** - "fast" means what exactly?
5. **Document assumptions** you're making even after answers

---

## Output

After complete interview, use `/rev-spec` to write the specification document.

**DO NOT proceed to planning until spec is written and approved.**
