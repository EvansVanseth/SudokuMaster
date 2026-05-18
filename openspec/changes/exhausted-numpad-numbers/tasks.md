# Tasks: Exhausted Numpad Numbers

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~152 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Delivery strategy | ask-on-risk |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Selector + unit tests + Numpad integration + component tests | Single PR | ~152 lines, fits single review |

## Phase 1: Selector — Pure Exhaustion Logic

- [x] 1.1 **Create `src/features/game/selectors.ts`** — pure function `getExhaustedNumbers(board): Set<number>` that tallies values 1–9 across all 81 cells in one pass and returns exhausted numbers (count === 9)
- [x] 1.2 **Create `src/features/game/__tests__/selectors.test.ts`** — unit tests covering all 5 spec scenarios: all nine placed, partial (8), multiple exhausted, empty board, no exhausted

## Phase 2: Numpad Integration

- [ ] 2.1 **Modify `src/features/game/components/Numpad.tsx`** — subscribe to `board` from store, derive exhausted set via `useMemo`, add `exhaustedNumbers.has(num)` to per-button `disabled` alongside existing `status === 'solved'`; Borrar remains unaffected
- [ ] 2.2 **Create `src/features/game/__tests__/Numpad.test.tsx`** — component tests covering: exhausted button disabled, non-exhausted enabled, re-enable on delete, new game reset, Borrar unaffected by exhaustion, solved still disables all

## Verification Checklist

- [ ] All 5 selector scenarios pass (full board, partial, multiple, empty, none)
- [ ] All 6 Numpad component scenarios pass
- [ ] All 41 existing tests still pass
- [ ] No CSS changes required (`.button:disabled` handles it)
- [ ] No domain-layer files touched
