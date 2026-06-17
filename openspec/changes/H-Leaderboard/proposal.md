# Proposal: Leaderboard

## Intent
Implement a global leaderboard system to encourage competitive engagement among users. This adds a layer of social motivation by ranking players based on their performance across different difficulty levels.

## Scope

### In Scope
- SQL view in Supabase to aggregate scores (Easy: 1pt, Medium: 3pts, Hard: 5pts).
- Filter to include only 'completed' games.
- Leaderboard page UI for display.
- Sorting logic by total score (descending).

### Out of Scope
- Real-time leaderboard updates (polling or standard fetch is sufficient).
- Social features (friends list, sharing, etc.).

## Capabilities

### New Capabilities
- `leaderboard`: Core functionality to query, calculate, and display ranked user scores.

### Modified Capabilities
- None.

## Approach
1. **Database**: Create a SQL view `user_scores` in Supabase that sums scores based on game difficulty and completion status.
2. **Backend**: Expose this view via the existing Supabase client.
3. **Frontend**: Create `LeaderboardPage` under `src/features/leaderboard/pages` and relevant components.
4. **Integration**: Add a navigation link in the `AppLayout` or `Dashboard`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `supabase/` | New | Add SQL view definition |
| `src/features/leaderboard/` | New | Feature module creation |
| `src/app/router/` | Modified | Add Leaderboard route |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Performance lag on large datasets | Low | Use SQL view indexed properly |
| Incorrect score calculation | Low | Unit test the SQL logic/mocked query |

## Rollback Plan
Remove the SQL view from Supabase and delete the new `features/leaderboard` directory.

## Dependencies
- Existing Supabase `games` and `profiles` tables.

## Success Criteria
- [ ] Leaderboard page displays ranked list of users.
- [ ] Scores accurately reflect difficulty (Easy=1, Medium=3, Hard=5).
- [ ] Only completed games are included.
