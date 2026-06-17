# Design: H-Leaderboard

## Technical Approach

Implement a global leaderboard ranking users by their total score, calculated from completed games based on difficulty (Easy: 1, Medium: 3, Hard: 5). We will create a PostgreSQL view `top_players_view` in Supabase to perform server-side aggregation. The frontend will consume this via the existing Supabase client, presented in a new `LeaderboardPage` component.

## Architecture Decisions

### Decision: Database View for Aggregation

**Choice**: Use a PostgreSQL view (`public.top_players_view`) in Supabase.
**Alternatives considered**:
1. Client-side aggregation of all game records.
2. Separate `scores` table updated via triggers.
**Rationale**: Client-side aggregation does not scale. Separate tables require triggers/maintenance. A view is performant, simplifies the query, and centralizes scoring logic.

### Decision: Feature Module

**Choice**: Create `src/features/leaderboard` module.
**Rationale**: FSD standard: `leaderboard` is a functional module with its own logic and UI.

## Data Flow

    Supabase (View: top_players_view) ──→ Supabase Client ──→ LeaderboardPage (UI)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `supabase/views/top_players_view.sql` | Create | SQL view definition with score calculation |
| `src/features/leaderboard/pages/LeaderboardPage.tsx` | Create | Page component |
| `src/features/leaderboard/api/fetchLeaderboard.ts` | Create | Service to fetch view data |

## Interfaces / Contracts

```typescript
// SQL Calculation Logic
CASE difficulty
  WHEN 'easy' THEN 1
  WHEN 'medium' THEN 3
  WHEN 'hard' THEN 5
  ELSE 0
END

// Frontend Type
export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  total_score: number;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `fetchLeaderboard` | Mock Supabase client. |
| Integration | SQL View | Query `top_players_view` and verify score sums. |

## Migration / Rollout

Run `supabase/views/top_players_view.sql`.

## Open Questions

- None.
