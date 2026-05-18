# Proposal: H-006 — History & Dashboard

## Intent

Complete the History & Dashboard milestone. The current Dashboard is inline in `AppRouter.tsx` with only pending games and no stats. This proposal extracts it into proper FSD features, adds a stats overview, and introduces a completed-games history with filtering — all using the existing schema.

## Scope

### In Scope
- Extract Dashboard from AppRouter → `src/features/dashboard/` with CSS Module
- Stats cards: total games, completed, win rate, avg time per difficulty
- Pending games section (migrated from current inline code)
- History section in `src/features/history/` with completed games, filterable by difficulty, sortable by date
- New domain types: `GameSummary`, `GameStats`
- New persistence functions: `loadCompletedGamesForUser()`, `getGameStats()` (client-side aggregation)
- History queries select specific columns (no `board` JSONB)
- Routes: `/dashboard` (stats + pending), `/dashboard/history` (completed)

### Out of Scope
- Charts/visualizations (H-007)
- Leaderboards, streaks, gamification
- CSV export, pagination (deferred until 100+ games)
- Schema changes (none needed)

## Capabilities

### New Capabilities
- `dashboard-overview`: Stats overview (aggregations) + pending games list
- `game-history`: Completed games list with difficulty filter and date sort

### Modified Capabilities
- None (pure addition, no existing specs change)

## Approach

Extract Dashboard inline code → `features/dashboard/`. Create separate `features/history/`. Add domain types and persistence queries. No schema changes.

```
AppRouter.tsx         → /dashboard → DashboardPage, /dashboard/history → HistoryPage
features/dashboard/   → DashboardPage, StatsCards, PendingGamesList + CSS Module
features/history/     → HistoryPage, HistoryList, FilterBar + CSS Module
domain/types.ts       → + GameSummary, GameStats
gamePersistence.ts    → + loadCompletedGamesForUser(), getGameStats()
shared/ui/            → + StatCard, DifficultyBadge
```

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/router/AppRouter.tsx` | Modified | Extract Dashboard, add history route |
| `src/features/dashboard/` | **New** | DashboardPage, StatsCards, PendingGamesList |
| `src/features/history/` | **New** | HistoryPage, HistoryList, FilterBar |
| `src/domain/types.ts` | Modified | Add `GameSummary`, `GameStats` |
| `src/features/game/services/gamePersistence.ts` | Modified | 2 new query functions |
| `src/shared/ui/` | Modified | Add `StatCard`, `DifficultyBadge` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Board JSONB loaded in history queries | Med | Select specific columns, never `board` |
| Supabase free-tier limits on aggregation | Low | Client-side aggregation from filtered query |
| Dashboard extraction breaks routing | Low | Keep old inline component until new one is verified |

## Rollback Plan

**File revert**: `git checkout HEAD -- src/app/router/AppRouter.tsx`, delete `features/dashboard/` and `features/history/`, revert `domain/types.ts` and `gamePersistence.ts`.

**Commit revert**: `git revert HEAD` (single commit) or `git revert <sha>` (chain).

## Dependencies

- None (existing Supabase schema supports all queries)

## Success Criteria

- [ ] Stats cards show correct totals, win rate %, and avg times (verified against raw Supabase data)
- [ ] Pending games list renders identically to current implementation
- [ ] History page lists completed games with difficulty filter working
- [ ] History queries never select `board` column (verified via query inspection)
- [ ] All 41 existing tests pass + new tests for persistence functions
- [ ] `GameSummary` and `GameStats` are pure domain types (no React/Supabase imports)
