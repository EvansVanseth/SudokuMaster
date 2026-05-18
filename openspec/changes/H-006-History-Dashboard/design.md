# Design: H-006 — History & Dashboard

## Technical Approach

Extract inline Dashboard from `AppRouter.tsx` into `features/dashboard/` (stats + pending games) and `features/history/` (completed games + filter). Add pure domain types, column-specific persistence queries. No schema changes, no new dependencies.

---

## Architecture Decisions

### Extraction — New files first, then swap

| Option | Tradeoff |
|--------|----------|
| Cut/paste inline → new files | Breaks AppRouter during extraction |
| **Create new files, then swap imports** | ✅ Zero downtime, clean diff |
| Refactor inline + create at once | Messy commit |

**Rationale**: New `DashboardPage` wraps old inline component behind an import swap. Verified → delete inline definition.

### Routes — Flat under `/dashboard`

| Option | Tradeoff |
|--------|----------|
| **`/dashboard` + `/dashboard/history`** | ✅ Simple, no Outlet bloat |
| Nested `<Outlet>` | Layout overhead for 2 routes |

**Rationale**: Both share only `ProtectedRoute`. Nest when third route appears.

### Data Flow — Custom hooks per feature

| Option | Tradeoff |
|--------|----------|
| **Custom hooks** | ✅ Encapsulated, testable |
| `useEffect` inline | Mixes concerns |
| Zustand store | Overkill — data is page-scoped |

### Stats — Client-side aggregation

| Option | Tradeoff |
|--------|----------|
| **Client JS `reduce()`** | ✅ Simple, testable, no DB changes |
| Supabase `rpc()` | SQL migration burden |

**Rationale**: Free-tier row counts are low. Switch to RPC at ~10K games.

### Column selection — Explicit list

| Option | Tradeoff |
|--------|----------|
| **Explicit `.select('id, difficulty, ...')`** | ✅ No board JSONB payload |
| `.select('*')` | Wastes bandwidth on board data |

### Domain types — Pure in `domain/types.ts`

| Option | Tradeoff |
|--------|----------|
| **`GameSummary` + `GameStats` in domain** | ✅ Follows pattern, zero deps |
| Inline in features | Violates FSD isolation |

---

## Data Flow

```
AppRouter.tsx
├─ /dashboard ──── DashboardPage
│                   ├─ StatsCards (4× StatCard)
│                   └─ PendingGamesList (resume/delete + Modal)
└─ /dashboard/history ── HistoryPage
                          ├─ FilterBar (difficulty + sort)
                          └─ HistoryList (completed games table)
```

Fetching:
- `DashboardPage` → `useDashboardStats()` → `getGameStats()` (all user games, no board, client aggregate)
- `DashboardPage` → `usePendingGames()` → existing `loadPendingGamesForUser()`
- `HistoryPage` → `useHistoryGames()` → `loadCompletedGamesForUser()` (explicit columns, server filter/order)

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/domain/types.ts` | Modify | Add `GameSummary`, `GameStats` |
| `src/features/game/services/gamePersistence.ts` | Modify | Add `loadCompletedGamesForUser()`, `getGameStats()` |
| `src/features/dashboard/DashboardPage.tsx` | Create | Stats + pending + new-game buttons |
| `src/features/dashboard/StatsCards.tsx` | Create | 4 stat cards |
| `src/features/dashboard/PendingGamesList.tsx` | Create | Migrated from inline + Modal |
| `src/features/dashboard/DashboardPage.module.css` | Create | Layout, stat grid, responsive |
| `src/features/history/HistoryPage.tsx` | Create | FilterBar + HistoryList wrapper |
| `src/features/history/HistoryList.tsx` | Create | Desktop table / mobile stacked cards |
| `src/features/history/FilterBar.tsx` | Create | Difficulty + sort controls |
| `src/features/history/HistoryPage.module.css` | Create | Filter bar, cards layout |
| `src/shared/ui/StatCard.tsx` + `.module.css` | Create | Label + value + optional icon |
| `src/shared/ui/DifficultyBadge.tsx` + `.module.css` | Create | Color-coded badge |
| `src/app/router/AppRouter.tsx` | Modify | Inline `Dashboard` → import `DashboardPage`; add `/dashboard/history` route |

---

## Interfaces / Contracts

```typescript
// domain/types.ts — pure, zero deps
export interface GameSummary { id: string; difficulty: Difficulty; timeSpent: number; isWinner: boolean; completedAt: string }
export interface GameStats { totalGames: number; completedGames: number; winRate: number; avgTimeOverall: number; avgTimeByDifficulty: Record<Difficulty, number> }

// gamePersistence.ts
function loadCompletedGamesForUser(userId: string, filters?: { difficulty?: Difficulty; sortOrder?: 'asc' | 'desc' }): Promise<GameSummary[] | { error: Error }>
function getGameStats(userId: string): Promise<GameStats | { error: Error }>

// shared/ui
interface StatCardProps { label: string; value: string | number; icon?: ReactNode }
interface DifficultyBadgeProps { difficulty: Difficulty }

// Custom hooks — all return { data, isLoading, error }
function useDashboardStats(userId: string): { stats: GameStats | null; isLoading: boolean; error: string | null }
function usePendingGames(userId: string): { games: RemoteGameRecord[]; isLoading: boolean; error: string | null; deleteGame: (id: string) => Promise<void> }
function useHistoryGames(userId: string, difficulty: Difficulty | 'all', sortOrder: 'asc' | 'desc'): { games: GameSummary[]; isLoading: boolean; error: string | null }
```

---

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Unit | Stats aggregation, GameSummary mapping | Pure functions, zero mocks |
| Unit | Column selection (no board) | Mock `supabase.from().select()` chain |
| Integration | Dashboard/History pages, FilterBar | RTL with mock hooks |
| Integration | StatCard, DifficultyBadge | RTL, assert CSS classes |
| Existing | All 41 current tests | Must pass |

---

## Migration / Rollout

No migration needed. Rollback: `git revert HEAD`, delete new folders, revert `domain/types.ts` and `gamePersistence.ts`, restore `AppRouter.tsx`.

---

## Open Questions

- [ ] Update `loadPendingGamesForUser()` to explicit column select? Currently `*` with board.
- [ ] Extract "New game" buttons into `NewGameSection.tsx`? Spec doesn't mention them.
- [ ] Extract `ProtectedRoute` to `features/auth/components/`? Current inline is simpler.
