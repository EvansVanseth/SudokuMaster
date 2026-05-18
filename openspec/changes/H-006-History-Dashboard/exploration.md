## Exploration: H-006 — History & Dashboard

### Current State

The current Dashboard is an **inline component inside `AppRouter.tsx`** at the route `/dashboard`. It is a minimal MVP that:

1. **Shows pending games only** — Uses `loadPendingGamesForUser()`, which filters for `status === 'in_progress'`. No completed games are ever loaded.
2. **Has no statistics** — No aggregation of total games, win rate, average time, or any metrics.
3. **Has no history tab/page** — Everything is in one flat view with no sub-navigation.
4. **Uses inline styles** — No CSS Module. Relies on global `.glass-card`, `.btn-primary`, `.btn-secondary`, `.btn-danger` classes.
5. **Is not extracted** — The component lives inside `AppRouter.tsx`, not as a standalone file in the feature structure.

#### What exists today

| Feature | Status | Details |
|---------|--------|---------|
| Pending games list | ✅ Done | Table with difficulty, time, updated_at. Reanudar/Eliminar actions |
| New game buttons | ✅ Done | Easy/Medium/Hard buttons that call store.startGame() |
| Delete confirmation | ✅ Done | Modal with "no se puede deshacer" warning |
| Auth guard | ✅ Done | Protected by ProtectedRoute wrapper |
| Responsive table | ✅ Done | CSS media queries in global index.css for mobile |
| User info display | ✅ Done | Shows display_name/full_name/email from user_metadata |

#### Persistence layer (gamePersistence.ts)

Exported functions:
- `saveGameStateToSupabase(userId, gameState, savedGameId?)` — Upserts game state
- `loadPendingGamesForUser(userId)` — Only `in_progress` games, ordered by `updated_at DESC`
- `loadSavedGameById(savedGameId)` — Single game by ID
- `remoteGameRecordToPersistedState(record)` — Converts DB record → store state
- `completeSavedGameIfNeeded(savedGameId, isWinner)` — Marks completed + winner flag
- `deleteSavedGame(savedGameId)` — Deletes with RLS guard (checks data returned)

**Missing**: No function for loading completed games. No function for computing statistics.

#### Database schema

```sql
games (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  board       JSONB NOT NULL,
  difficulty  TEXT CHECK (difficulty IN ('easy','medium','hard')),
  status      TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  time_spent  INTEGER DEFAULT 0, -- seconds
  is_winner   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ,
  updated_at  TIMESTAMPTZ
)
```

The schema **already supports** history and stats — we just need to query `status = 'completed'` and aggregate.

#### Game store (gameStore.ts)

- State: `board`, `initialBoard`, `selectedCell`, `status`, `timer`, `difficulty`, `savedGameId`, `isConfirmingExit`
- Status values: `'playing' | 'paused' | 'solved' | 'initial'`
- When solved: auto-saves to Supabase and marks as completed via `completeSavedGameIfNeeded()`
- Session persistence: Serializes to `sessionStorage` (not Supabase) per user session

#### Design system (index.css)

- **Colors**: Dark theme (`--bg-color: #0f172a`), blue primary (`--primary: #38bdf8`), indigo accent (`--accent: #818cf8`)
- **Cards**: `.glass-card` — glassmorphism with `backdrop-filter: blur(12px)`, rounded `24px`, shadow
- **Buttons**: `.btn-primary` (blue→indigo gradient), `.btn-secondary` (transparent + border), `.btn-danger` (red gradient)
- **Typography**: Outfit font, h1 with gradient text (white→blue)
- **Responsive**: Already has mobile table patterns (`thead hidden`, `td::before` for data-label)

#### Domain types

- `Difficulty`: `'easy' | 'medium' | 'hard'`
- `Cell`: `{ value, isClue, isError }`
- `Board`: `Cell[][]` (9x9)
- `Grid`: `number[][]` (flat numeric, 0 = empty)

**No domain types exist for statistics, history entries, or game summaries.** These would need to be added.

### Affected Areas

- `src/app/router/AppRouter.tsx` — Extract inline Dashboard, add History route
- `src/features/dashboard/` — **New feature folder**: DashboardComponent, HistoryComponent, StatsCards
- `src/features/history/` — **Possible new feature folder** (or part of dashboard feature)
- `src/features/game/services/gamePersistence.ts` — Add `loadCompletedGamesForUser()`, `getGameStats()`, client-side aggregation
- `src/domain/types.ts` — Add `GameSummary`, `GameStats` types (pure, no React/Supabase deps)
- `src/shared/ui/` — Possibly new shared UI: `StatCard`, `DifficultyBadge`, `FilterBar`
- `src/app/styles/index.css` — Add any new global styles if needed
- `src/features/game/__tests__/` — Existing tests pass, new tests needed for persistence functions
- `CONTEXT/supabase_schema.sql` — No schema changes needed (existing table supports everything)
- **New CSS modules** for dashboard, history, stats components

### Approaches

#### Approach 1: Enhance Inline Dashboard + Add Completed Games Query

**Description**: Keep the Dashboard inline in AppRouter, add a new persistence function `loadCompletedGamesForUser()`, and expand the existing section to show completed games below pending games. Add basic stats at the top (total games, games won).

| Pros | Cons | Effort |
|------|------|--------|
| Minimal files changed | Keeps Dashboard inline (bad practice, violates FSD) | **Low** |
| Fastest to implement | No sub-navigation, no filtering, cramped UI | |
| Only adds what's strictly needed | No dedicated history page | |
| Tests easily added | Hard to extend later | |

#### Approach 2: Extract Dashboard + Create History Feature Folder (Recommended)

**Description**: Extract Dashboard to `src/features/dashboard/` as a proper FSD feature. Add:
- Dashboard page with stats cards top section (total games, completed, win rate, avg time by difficulty)
- Pending games section (already exists, migrated)
- History section with completed games, filterable by difficulty, sortable by date/time
- New persistence functions: `loadCompletedGamesForUser()`, `getGameStats()`
- New domain types: `GameSummary`, `GameStats`
- New routes: `/dashboard` stays, maybe `/dashboard/history` sub-route
- Search/filter bar for history

| Pros | Cons | Effort |
|------|------|--------|
| Proper FSD architecture | More files to create | **Medium** |
| Scalable for future features | More complex routing | |
| Clean separation of concerns | | |
| Dashboard is reusable | | |

#### Approach 3: Full Dashboard Redesign with Charts + Analytics

**Description**: Everything in Approach 2, plus:
- Add a charting library (recharts, chart.js) for visual stats
- Time-trend charts (games per day, solving time trends)
- Per-difficulty breakdown with visual cards
- Leaderboard/self-competition (best times, streaks)
- Export history as CSV

| Pros | Cons | Effort |
|------|------|--------|
| Rich user experience | Heavy dependency addition | **High** |
| Competitive/gamification aspect | Complex implementation | |
| Differentiator for the app | May exceed 400-line PR budget — would need chained PRs | |

### Recommendation

**Approach 2** — Extract Dashboard to `src/features/dashboard/` and create a proper History section. This balances architecture quality with implementation effort. It follows FSD conventions, keeps the codebase clean, and doesn't add heavy dependencies.

**Why not Approach 1**: Keeping the Dashboard inline in AppRouter is a shortcut that will make the file grow unmanageably. The Dashboard is already ~200 lines; adding history and stats would push it past 500+ lines in one file.

**Why not Approach 3 now**: Charts are nice but not essential for H-006. The app should first have the data visible before adding visualization. Charts can be added in a subsequent milestone (H-007 maybe). Also, the current test count is 41 — no need to add heavy dependencies yet.

### Sub-approach: Where to place history

**Option A**: History under `features/dashboard/` — keeps user-facing dashboard as single feature
**Option B**: Separate `features/history/` feature folder — cleaner separation, follows FSD single-responsibility

**Recommendation**: Option B — `features/history/` for the history list + filter, `features/dashboard/` for the overview/stats + pending games.

### Risks

1. **Board data size**: `board` is stored as JSONB. Loading many completed games with full board state could be slow. For history listing, we should select specific columns (`id, difficulty, time_spent, is_winner, created_at, updated_at`) NOT the full board. The current `loadPendingGamesForUser` selects `*` which includes board data — this is fine for pending (few games) but would be problematic for hundreds of completed games.
2. **Supabase row count**: The free tier has limits. Aggregation queries should be done client-side or with Supabase views/RPC calls.
3. **Pagination**: If a user has many completed games, we need pagination. The current implementation doesn't paginate.
4. **Time zone**: The schema uses `TIMEZONE('utc'::text, NOW())` for timestamps. Display needs `toLocaleString()` — already done in Dashboard.
5. **No migrations**: The schema is in `CONTEXT/supabase_schema.sql` but there's no migration tooling. Schema additions (if needed) must be SQL scripts.
6. **`is_winner` vs `status`**: Both columns exist. `status='completed'` means finished regardless of outcome. `is_winner=true` means the puzzle was solved correctly. This distinction must be clear in the UI.
7. **Historical games from before `is_winner`**: If any games exist where `is_winner` was false but were actually solved (pre-database trigger), they'd appear as losses. This is an edge case that's likely irrelevant for a new app but worth noting.

### Ready for Proposal

**Yes** — ready for proposal. The existing schema fully supports history and stats. The Dashboard needs extraction and extension with:
1. Stats overview (total, win rate, avg time)
2. Completed games history with filtering
3. Proper FSD feature folders

The primary decision for the proposal phase: **where to place history** (under `features/dashboard/` vs separate `features/history/` feature).
