# Tasks: Filter statistics by completed games

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 10-20 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | exception-ok |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Filter game stats | PR 1 | Implementation and verification. |

## Phase 1: Verification / Unit Testing

- [ ] 1.1 Create or update unit test in `src/features/game/services/__tests__/gamePersistence.test.ts` to assert `getGameStats` ignores 'in_progress' games.

## Phase 2: Implementation

- [ ] 2.1 Modify `src/features/game/services/gamePersistence.ts`: Update `getGameStats` query to include `.eq('status', 'completed')`.

## Phase 3: Verification

- [ ] 3.1 Run tests: `npm run test` to ensure unit tests pass.
- [ ] 3.2 Manual verification: Verify dashboard stats only reflect completed games.

## Phase 4: Cleanup / Documentation

- [ ] 4.1 Confirm doc comments in `gamePersistence.ts` accurately reflect the filtered behavior.
