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

Decision needed before apply: Yes (resolved: auto-chain via feature-branch-chain)
Chained PRs recommended: Yes (resolved: PR 1 complete)
400-line budget risk: High (resolved: keep PR 1 under ~450 lines)

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

- [x] 4.1 Create `src/features/history/components/FilterBar.tsx` + `FilterBar.module.css` (difficulty `<select>` + sort toggle)
- [x] 4.2 Create `src/features/history/components/HistoryList.tsx` + `HistoryList.module.css` (desktop table, mobile stacked cards)
- [x] 4.3 Create `src/features/history/pages/HistoryPage.tsx` + `HistoryPage.module.css` (composes FilterBar + HistoryList)
- [x] 4.4 Write RTL tests for FilterBar (8), HistoryList (7), HistoryPage (6), AppRouter (1) — 22 new tests

## Phase 5: Router + Verify

- [x] 5.1 Remove inline `Dashboard` from `AppRouter.tsx`; import `DashboardPage` from `features/dashboard/`
- [x] 5.2 Import `ProtectedRoute` from `features/auth/components/` in `AppRouter.tsx`
- [x] 5.3 Add `/dashboard/history` route to `AppRouter.tsx` with `ProtectedRoute`
- [x] 5.4 Run full test suite — 91 tests passing (69 existing + 22 new)
- [x] 5.5 Post-apply: unify difficulty colors as CSS variables (--color-easy/medium/hard/global)
- [x] 5.6 Post-apply: regroup StatsCards into 4 grouped cards with colored borders
- [x] 5.7 Post-apply: color NewGameSection buttons by difficulty
- [x] 5.8 Post-apply: add difficulty-colored board border (3px)
- [x] 5.9 Post-apply: fix table header/data cell alignment (horizontal padding)
- [x] 5.10 Post-apply: add nav links between Dashboard/History, remove win rate
