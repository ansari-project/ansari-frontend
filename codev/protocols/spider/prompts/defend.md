# DEFEND Phase Prompt

You are executing the **DEFEND** phase of the SPIDER protocol.

## Your Goal

Write comprehensive tests that guard the implementation against regressions and verify correct behavior.

## Context

- **Project ID**: {{project_id}}
- **Project Title**: {{title}}
- **Current State**: {{current_state}}
- **Plan Phase**: {{plan_phase}} (if applicable)
- **Spec File**: `codev/specs/{{project_id}}-{{title}}.md`
- **Plan File**: `codev/plans/{{project_id}}-{{title}}.md`

## Consultation Context

**Defend is the last phase before consultation.** After tests pass:
- You will proceed to Evaluate
- Evaluate will run multi-agent consultation (GPT-5 Codex + Gemini Pro)
- Only after consultation approval will the phase be committed

Write thorough tests knowing they will be reviewed.

## Prerequisites

Before writing tests, verify:
1. Implementation phase is complete
2. Build passes
3. You understand what the code is supposed to do
4. You know the success criteria from the spec

## Process

### 1. Analyze What to Test

Review the implementation and identify:
- **Core functionality** - The main purpose of the code
- **Edge cases** - Boundary conditions, empty inputs, etc.
- **Error conditions** - Invalid inputs, failure scenarios
- **Integration points** - How components work together

### 2. Write Unit Tests

For each function/method:
- Test the happy path (normal operation)
- Test edge cases (empty, null, boundary values)
- Test error conditions (invalid input, failures)

**Unit Test Principles**:
- Test behavior, not implementation details
- One assertion focus per test (can have multiple asserts if related)
- Clear test names that describe what's being tested
- Fast execution (no external dependencies)

### 3. Write Integration Tests

For feature flows:
- Test components working together
- Test realistic usage scenarios
- Test the success criteria from the spec

**Integration Test Principles**:
- Use real implementations for internal boundaries
- Only mock external dependencies (APIs, databases, file system)
- Cover critical user paths
- Test end-to-end scenarios where possible

### 4. Avoid Overmocking

**DO**:
- Mock external APIs and services
- Mock file system for isolation
- Mock time-dependent operations
- Use real implementations for internal modules

**DON'T**:
- Mock the system under test
- Mock internal function calls
- Create mocks that mirror implementation details
- Write tests that break when you refactor

### 5. Test Environment Isolation (CRITICAL)

**NEVER touch real $HOME directories in tests.** Use XDG sandboxing:

```bash
# In test setup
export XDG_CONFIG_HOME="$TEST_PROJECT/.xdg/config"
export XDG_DATA_HOME="$TEST_PROJECT/.xdg/data"
export XDG_CACHE_HOME="$TEST_PROJECT/.xdg/cache"
export HOME="$TEST_PROJECT/.xdg/home"
```

**Test Isolation Principles**:
- Each test should be hermetic (no side effects on user environment)
- Use temporary directories that are cleaned up after tests
- Use failing shims instead of removing tools from PATH
- Never write to actual config directories (~/.config, etc.)

### 6. Run All Tests

```bash
npm test           # Run all tests
npm test -- --coverage  # With coverage report
```

Verify:
- All new tests pass
- All existing tests still pass
- Coverage hasn't decreased

### 6. Fix Failing Tests

If tests fail:
1. Determine if it's a test bug or implementation bug
2. If implementation bug → return to Implement phase
3. If test bug → fix the test
4. Re-run all tests

## Output

- Test files covering the implementation
- All tests passing
- No reduction in code coverage

## Signals

Emit appropriate signals based on your progress:

- After tests are written and passing:
  ```
  <signal>TESTS_WRITTEN</signal>
  ```

- If implementation bugs are found:
  ```
  <signal>IMPLEMENTATION_BUG:description</signal>
  ```
  (This signals return to Implement phase)

- If blocked:
  ```
  <signal>BLOCKED:reason</signal>
  ```

## Test File Organization

Follow project conventions. Common patterns:

```
src/
  auth/
    login.ts
tests/
  auth/
    login.test.ts
```

or

```
src/
  auth/
    login.ts
    login.test.ts  (co-located)
```

## Test Naming Convention

Use descriptive names that explain the scenario:

```typescript
// Good
describe('login', () => {
  it('returns user data on valid credentials', () => {...})
  it('throws AuthError on invalid password', () => {...})
  it('locks account after 5 failed attempts', () => {...})
})

// Bad
describe('login', () => {
  it('works', () => {...})
  it('test1', () => {...})
  it('should work correctly', () => {...})
})
```

## Important Notes

1. **Tests are documentation** - They show how code should be used
2. **Test behavior, not implementation** - Tests should survive refactoring
3. **Prefer integration over unit** - When testing complex flows
4. **Keep tests fast** - Slow tests get skipped
5. **One test file per source file** - Easy to find related tests

## What NOT to Do

- Don't skip edge cases ("I'll test that later")
- Don't mock everything (leads to brittle tests)
- Don't test private implementation details
- Don't write tests that pass for wrong reasons
- Don't leave commented-out tests
- Don't touch real $HOME or user config directories in tests
- Don't use `git add .` or `git add -A` when you do commit (security risk)

## Coverage Guidelines

Aim for:
- 80%+ line coverage for new code
- 100% coverage of critical paths (auth, payments, etc.)
- Every public function has at least one test
- Every error condition has a test
