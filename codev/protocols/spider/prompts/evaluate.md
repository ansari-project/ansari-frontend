# EVALUATE Phase Prompt

You are executing the **EVALUATE** phase of the SPIDER protocol.

## Your Goal

Verify the implementation fully satisfies the phase requirements, run mandatory multi-agent consultation, and then commit the completed phase.

## CRITICAL: Multi-Agent Consultation is MANDATORY

**DO NOT COMMIT without consultation approval.** This is a BLOCKING requirement.

The evaluation process is:
1. Verify implementation and tests
2. Run multi-agent consultation (GPT-5 Codex + Gemini Pro)
3. Address any feedback
4. Get human approval
5. ONLY THEN commit

## Context

- **Project ID**: {{project_id}}
- **Project Title**: {{title}}
- **Current State**: {{current_state}}
- **Plan Phase**: {{plan_phase}} (if applicable)
- **Spec File**: `codev/specs/{{project_id}}-{{title}}.md`
- **Plan File**: `codev/plans/{{project_id}}-{{title}}.md`

## Prerequisites

Before evaluating, verify:
1. Implementation is complete
2. Tests are written and passing
3. Build passes
4. Lint passes (if configured)

## Process

### 1. Functional Evaluation

Check against the spec's success criteria:

- [ ] All acceptance criteria met?
- [ ] User scenarios work as expected?
- [ ] Edge cases handled properly?
- [ ] Error messages are helpful?

### 2. Non-Functional Evaluation

Assess quality attributes:

- [ ] Performance acceptable?
- [ ] Security standards maintained?
- [ ] Code is maintainable?
- [ ] No unnecessary complexity?

### 3. Spec Compliance Check

Compare implementation to specification:

- [ ] Does exactly what spec says (no more, no less)?
- [ ] Handles all scenarios mentioned in spec?
- [ ] Matches the expected behavior described?

### 4. Test Quality Check

Verify test coverage:

- [ ] All new code has tests?
- [ ] Tests cover happy path AND error cases?
- [ ] No overmocking (tests use real implementations where possible)?
- [ ] Tests would catch regressions?

### 5. Deviation Analysis

If implementation differs from plan:

- Document what changed and why
- Assess impact on other phases
- Update plan if needed

### 6. MANDATORY: Multi-Agent Consultation

**Before committing, run consultation:**

```bash
# Run consultations in parallel (REQUIRED)
consult --model gemini --type impl-review spec {{project_id}} &
consult --model codex --type impl-review spec {{project_id}} &
wait
```

- Review ALL feedback from both models
- Address any issues raised
- Document feedback in the phase evaluation notes

**If consultants identify issues:**
- Return to Implement or Defend as needed
- Fix the issues
- Re-run consultation
- Do NOT commit until consultation passes

### 7. Human Review

After consultation feedback is incorporated:
- Present evaluation summary for human review
- Wait for approval to commit
- If changes requested, address them and re-consult if significant

### 8. Phase Commit (After Approval Only)

**CRITICAL**: Only commit after consultation and human approval.

```bash
# Stage all changes for this phase - NEVER use git add . or git add -A
git add <specific-files>

# Commit with proper format
git commit -m "[Spec {{project_id}}][Phase: {{plan_phase}}] feat: <description>"
```

Commit message format:
- `[Spec XXXX][Phase: name] feat:` for new features
- `[Spec XXXX][Phase: name] fix:` for bug fixes
- `[Spec XXXX][Phase: name] refactor:` for refactoring

### 9. Update Plan Status

Mark this phase as complete in the plan document.

## Output

- Completed evaluation checklist
- Phase committed to git
- Plan updated with phase status

## Signals

Emit appropriate signals based on your progress:

- After initial evaluation passes (before consultation):
  ```
  <signal>EVALUATION_PASSED</signal>
  ```

- After consultation feedback is incorporated:
  ```
  <signal>CONSULTATION_INCORPORATED</signal>
  ```

- After human approves and commit is complete:
  ```
  <signal>EVALUATION_COMPLETE</signal>
  ```

- If evaluation reveals spec non-compliance:
  ```
  <signal>SPEC_VIOLATION:description</signal>
  ```
  (Signals return to Implement)

- If tests reveal bugs:
  ```
  <signal>IMPLEMENTATION_BUG:description</signal>
  ```
  (Signals return to Implement)

- If consultation identifies issues:
  ```
  <signal>CONSULTATION_ISSUES:description</signal>
  ```
  (Signals return to Implement or Defend)

- If all plan phases are complete:
  ```
  <signal>ALL_PHASES_COMPLETE</signal>
  ```
  (Signals transition to Review)

## Evaluation Checklist Template

```markdown
## Phase Evaluation: {{plan_phase}}

### Functional
- [ ] Acceptance criteria 1: [status]
- [ ] Acceptance criteria 2: [status]
- [ ] Edge cases handled: [status]

### Non-Functional
- [ ] Performance: [acceptable/needs work]
- [ ] Security: [reviewed/concerns]
- [ ] Maintainability: [good/needs refactor]

### Tests
- [ ] Coverage: [X%]
- [ ] All tests passing: [yes/no]
- [ ] Overmocking check: [passed/failed]

### Spec Compliance
- [ ] Matches spec requirements: [yes/no]
- [ ] Deviations: [none/list them]

### Commit
- [ ] Changes staged
- [ ] Commit created: [hash]
- [ ] Plan updated
```

## Important Notes

1. **Consultation is MANDATORY** - Cannot skip GPT-5 + Gemini reviews
2. **Be honest** - If something isn't right, fix it before committing
3. **Don't skip the checklist** - It catches issues before they compound
4. **Atomic commits** - One commit per phase, not multiple
5. **Update the plan** - Mark phase status after commit
6. **Verify the commit** - `git log --oneline -1` should show your commit

## What NOT to Do

- Don't commit without consultation approval (BLOCKING)
- Don't commit if tests are failing
- Don't commit if build is broken
- Don't skip the spec compliance check
- Don't commit multiple phases together
- Don't proceed to next phase without committing
- Don't use `git add .` or `git add -A` (security risk)

## Handling Failures

**If spec compliance fails**:
Return to Implement, fix the issue, re-run Defend, then Evaluate again.

**If tests fail**:
Return to Implement to fix bugs, or Defend to fix tests.

**If build fails**:
Return to Implement to fix build errors.

**If you discover a spec problem**:
Signal `BLOCKED` and describe the spec issue. The Architect may need to update the spec.
