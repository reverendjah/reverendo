# Testing Checklist

Generate test checklist for: $ARGUMENTS

## Unit Tests (FIRST)

- [ ] Run tests - all pass
- [ ] If new utility functions added, verify tests exist
- [ ] If tests missing, create: `*.test.ts` next to source file

## Setup for Manual Testing

- [ ] Environment variables configured
- [ ] Test data prepared
- [ ] External services accessible (if needed)

## Feature-Specific Tests

### If API Changes:
- [ ] Endpoint responds correctly
- [ ] Error responses are meaningful
- [ ] Rate limiting considered
- [ ] Authentication/authorization works

### If UI Changes:
- [ ] Component renders correctly
- [ ] User interactions work as expected
- [ ] Loading states display properly
- [ ] Error states handled gracefully
- [ ] Responsive on different screen sizes

### If Database Changes:
- [ ] Migrations run successfully
- [ ] Data integrity maintained
- [ ] Queries perform acceptably
- [ ] Rollback works if needed

### If Integration:
- [ ] External API calls work
- [ ] Timeouts handled
- [ ] Retries work when appropriate
- [ ] Rate limits respected

## Error Scenarios

- [ ] What happens if external service is down?
- [ ] What happens with invalid data?
- [ ] What happens if rate limit is hit?
- [ ] Are error logs useful for debugging?

## Integration Test

- [ ] Full flow works end-to-end
- [ ] All pieces work together
- [ ] No regressions in related features

## Post-Test

- [ ] Document any issues found
- [ ] Fix issues before committing
- [ ] Re-run quality gates after fixes
- [ ] Clean up test data (if needed)

---

**All checks must pass before committing.**

## Useful Commands

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Check types
npm run typecheck

# Build
npm run build
```
