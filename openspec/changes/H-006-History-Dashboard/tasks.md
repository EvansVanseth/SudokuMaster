# Tasks: H-006 — History & Dashboard

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 600–900 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Foundation + Shared UI + Dashboard (~450) → PR 2: History + Tests (~350) |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation + Shared UI + Dashboard | PR 1 | Types, persistence, ProtectedRoute, StatCard, DifficultyBadge, DashboardPage, stats, pending list, new-game section, dashboard routes |
| 2 | History + Tests + Verify | PR 2 | HistoryPage, HistoryList, FilterBar, history route, all new tests, final verify pass |

## Phase 1: Foundation — Types + Persistence + ProtectedRoute

- [x] 1.1 Add `GameSummary` and `GameStats` to `src/domain/types.ts` (pure types, zero deps)
- [x] 1.2 Update `loadPendingGamesForUser()` to explicit column select (omit `board`)
- [x] 1.3 Add `loadCompletedGamesForUser()` with column-specific select + filter/sort params to `gamePersistence.ts`
- [x] 1.4 Add `getGameStats()` (client-side aggregation from all user rows, no board) to `gamePersistence.ts`
- [x] 1.5 Extract `ProtectedRoute` to `src/features/auth/components/ProtectedRoute.tsx`
- [x] 1.6 Write tests for new persistence functions (column select verified, aggregation scenarios)

## Phase 2: Shared UI Components

- [x] 2.1 Create `src/shared/ui/StatCard.tsx` + `StatCard.module.css` (label, value, optional icon prop)
- [x] 2.2 Create `src/shared/ui/DifficultyBadge.tsx` + `DifficultyBadge.module.css` (color-coded by difficulty)
- [x] 2.3 Write RTL tests for StatCard renders value and DifficultyBadge shows correct color per difficulty

## Phase 3: Dashboard Feature

- [x] 3.1 Create `src/features/dashboard/NewGameSection.tsx` (3 buttons extracted from inline `AppRouter.tsx`)
- [x] 3.2 Create `src/features/dashboard/StatsCards.tsx` (4× StatCard: total, completed, win rate, avg times)
- [x] 3.3 Create `src/features/dashboard/PendingGamesList.tsx` (table, resume/delete + Modal confirmation)
- [x] 3.4 Create `src/features/dashboard/DashboardPage.tsx` + `DashboardPage.module.css` (composes NewGameSection, StatsCards, PendingGamesList)
- [x] 3.5 Write RTL tests for DashboardPage (stats render, empty state, resume navigates, delete confirms)

## Phase 4: History Feature

- [ ] 4.1 Create `src/features/history/FilterBar.tsx` (difficulty `<select>` + sort toggle, no `board` in select)
- [ ] 4.2 Create `src/features/history/HistoryList.tsx` (desktop table, mobile stacked cards)
- [ ] 4.3 Create `src/features/history/HistoryPage.tsx` + `HistoryPage.module.css` (composes FilterBar + HistoryList)
- [ ] 4.4 Write RTL tests for HistoryPage (filter by difficulty, sort toggle, empty state, column-exclusion verified)

## Phase 5: Router + Verify

- [x] 5.1 Remove inline `Dashboard` from `AppRouter.tsx`; import `DashboardPage` from `features/dashboard/`
- [x] 5.2 Import `ProtectedRoute` from `features/auth/components/` in `AppRouter.tsx`
- [ ] 5.3 Add `/dashboard/history` route to `AppRouter.tsx` with `ProtectedRoute` (PR 2)
- [x] 5.4 Run full test suite — confirm all existing tests pass + new persistence and RTL tests pass
