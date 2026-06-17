# Design: Filter statistics by completed games

## Technical Approach

Modify the Supabase query within `getGameStats` in `src/features/game/services/gamePersistence.ts` to directly fetch only completed games from the database using `.eq('status', 'completed')`. This moves the filtering logic from the client side to the database, improving performance and simplifying the statistics calculation logic.

## Architecture Decisions

### Decision: Database-level Filtering

**Choice**: Add `.eq('status', 'completed')` to the Supabase query in `getGameStats`.
**Alternatives considered**: Keep in-memory filtering.
**Rationale**: Fetching only relevant data from the database reduces payload size and offloads filtering to the database, which is more efficient for larger datasets.

## Data Flow

    Supabase (games table) ──→ src/features/game/services/gamePersistence.ts (filtered by status) ──→ Statistics calculation ──→ UI

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/features/game/services/gamePersistence.ts` | Modify | Update `getGameStats` to filter by status 'completed' in the database query. |

## Interfaces / Contracts

No changes to external interfaces. The `GameStats` return type remains the same, but the data will now only represent completed games.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `getGameStats` | Mock `supabase` to return a mix of 'in_progress' and 'completed' games, verify that `getGameStats` only calculates stats using 'completed' games. |

## Migration / Rollout

No migration required. This is a functional change to data retrieval.

## Open Questions

- [ ] Does the UI rely on `totalGames` returning all games (even unfinished ones)? The proposal implies statistics should *only* be for completed games, so this should be fine.
