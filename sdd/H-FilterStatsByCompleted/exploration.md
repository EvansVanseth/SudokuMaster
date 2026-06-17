## Exploration: Filter statistics by completed games

### Current State
Currently, `getGameStats` fetches ALL games for a user (`select(LIST_COLUMNS).eq('user_id', userId)`), including those in progress. The statistics (`totalGames`, `avgTimeOverall`, `avgTimeByDifficulty`) are calculated using all fetched games, regardless of their status.

### Affected Areas
- `src/features/game/services/gamePersistence.ts` — This is where `getGameStats` is implemented and where the filtering logic is applied.

### Approaches
1. **Filter at the service level** — Modify `getGameStats` to filter `rows` by `status === 'completed'` at the very beginning.
   - Pros: Consistent behavior for all metrics; clean implementation.
   - Cons: Slightly changes the meaning of `totalGames` (it will equal `completedGames`). If `totalGames` is meant to show all games attempted, this might be a breaking change in expectation (though the prompt asks for statistics to be based on completed games).
   - Effort: Low.

2. **Database level filtering** — Add `.eq('status', 'completed')` to the Supabase query in `getGameStats`.
   - Pros: Efficient; retrieves only the necessary data.
   - Cons: Need to be careful if we need "total attempts" elsewhere, but `getGameStats` is specifically for stats.
   - Effort: Low.

### Recommendation
I recommend **Approach 2** (Database level filtering) because it is more efficient to fetch only completed games from Supabase. We should update the query in `getGameStats` to include `.eq('status', 'completed')`. This will automatically make `totalGames` represent total completed games, which aligns with the request to base statistics on completed games.

### Risks
- If the UI relies on `totalGames` being the count of *all* games (attempted + completed), this change will affect that count. However, the requirement is explicitly to base stats on completed games.
- I need to verify if `totalGames` is used elsewhere for non-completed game counts.

### Ready for Proposal
Yes. I have identified the location and the necessary change. The orchestrator should tell the user that the statistics calculation will now only consider completed games, and I am ready to implement this change.
