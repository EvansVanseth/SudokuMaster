# Tasks: H-Leaderboard

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 150-200 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | Single-pr |
| Chain strategy | Pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Database and App Integration | PR 1 | Complete implementation |

## Phase 1: Database Infrastructure

- [ ] 1.1 Create `supabase/views/user_scores.sql` to aggregate scores (Easy=1, Medium=3, Hard=5).
- [ ] 1.2 Run migration to create the `user_scores` view in Supabase.

## Phase 2: Feature Implementation

- [ ] 2.1 Create `src/features/leaderboard/api/fetchLeaderboard.ts` to query `user_scores` view.
- [ ] 2.2 Create `src/features/leaderboard/pages/LeaderboardPage.tsx` with a ranking table.
- [ ] 2.3 Register the new route in `src/app/router/` to link `LeaderboardPage`.

## Phase 3: Integration & Testing

- [ ] 3.1 Write unit tests for `fetchLeaderboard` service in `src/features/leaderboard/__tests__/fetchLeaderboard.test.ts`.
- [ ] 3.2 Verify SQL view logic by running a test query on `user_scores`.
- [ ] 3.3 Ensure navigation to Leaderboard is accessible from the main dashboard.

## Phase 4: Cleanup & Documentation

- [ ] 4.1 Remove any temporary test files or comments used during development.
