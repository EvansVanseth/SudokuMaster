# Proposal: Filter statistics by completed games

## Intent

Users need to view statistics specifically for completed games to accurately track their performance, ensuring that active or abandoned games do not skew their win/loss ratios and average times.

## Scope

### In Scope
- Update `src/features/game/services/gamePersistence.ts` to filter statistics by `status === 'completed'`.

### Out of Scope
- Implementation of a UI-level filter toggle (user-side filtering).
- Persistent user preference for stats filtering.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `game-stats`: Filter statistics to only include games with `status === 'completed'`.

## Approach

Modify the Supabase query within the `getStatistics` method in `src/features/game/services/gamePersistence.ts`. We will append a `.eq('status', 'completed')` filter to the database request.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/features/game/services/gamePersistence.ts` | Modified | Update data fetching logic. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Missing status field in existing records | Low | Ensure data migration or fallback logic if `status` is null/missing. |

## Rollback Plan

Revert the changes in `src/features/game/services/gamePersistence.ts` to the previous version and deploy.

## Dependencies

- None.

## Success Criteria

- [ ] Statistics endpoint returns only games with `status = 'completed'`.
- [ ] No regression on game loading or saving functionality.
