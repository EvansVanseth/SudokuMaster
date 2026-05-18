# Proposal: Exhausted Numpad Numbers

## Intent

When a number 1–9 has all 9 instances placed on the board (clue + player cells), the matching Numpad button becomes disabled and greyed out. This gives the player immediate visual feedback about which numbers are fully placed, reducing useless clicks and cognitive load.

## Scope

### In Scope
- Derive a set of "exhausted" numbers from the current board state
- Disable individual Numpad buttons when their count reaches 9
- Persist disabled appearance via existing `.button:disabled` CSS
- Tests for the exhaustion computation and Numpad rendering

### Out of Scope
- Animation or flash on exhaustion transition
- Sound effects
- Borrar button behavior changes
- Domain layer changes (pure computation stays in game logic)

## Capabilities

No new or modified capabilities at the spec level. This is a UI/UX enhancement to the existing game interaction — behavior changes are entirely in the component and store layer. Neither `openspec/specs/` nor existing change specs define a "numpad" capability.

## Approach

1. **Pure function** — Add `getExhaustedNumbers(board: Board): Set<number>` in the store file (or a new `selectors.ts` in the game feature). Counts `cell.value === n` for n=1..9 across all 81 cells (clue + player). O(81) per call — negligible.
2. **Component derivation** — Numpad reads `board` via `useGameStore`, computes `exhaustedNumbers` with `useMemo`, disables each button when `exhaustedNumbers.has(num)`.
3. **No CSS changes** — `.button:disabled` already exists in `Numpad.module.css` with `opacity: 0.5; cursor: not-allowed`.
4. **Test** — Unit test for `getExhaustedNumbers` + Numpad renders disabled state correctly.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/features/game/store/gameStore.ts` | Modified | Add `getExhaustedNumbers()` pure utility |
| `src/features/game/components/Numpad.tsx` | Modified | Derive exhausted set, apply per-button `disabled` |
| `src/features/game/__tests__/Numpad.test.tsx` | New | Tests for exhaustion logic + rendering |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Re-render on every board change | Low | `useMemo` with `board` dependency; 81-cell count is sub-ms |
| Edge case: board not yet initialized (empty array) | Low | Guard with early return: `if (!board.length) return new Set()` |
| Exhaustion state not reset on new game | Low | Board reference changes on `startGame` → `useMemo` re-derives |

## Rollback Plan

Revert the 3 affected files (`gameStore.ts`, `Numpad.tsx`, and the new test file). No migration or data impact.

## Dependencies

None.

## Success Criteria

- [ ] Numpad buttons for numbers with 9 instances on the board are visually disabled (greyed out, not clickable)
- [ ] Buttons for numbers with <9 instances remain enabled
- [ ] Borrar button is unaffected by exhaustion state
- [ ] On new game, all number buttons re-enable (exhaustion resets)
- [ ] On deleting a cell, a previously exhausted number re-enables if count drops below 9
- [ ] All existing tests pass; new tests cover exhaustion computation and rendering
