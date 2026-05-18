# Design: Exhausted Numpad Numbers

## Technical Approach

Derive exhausted numbers (count == 9) from board state using a pure selector function. Numpad component reads the selector via `useMemo` and applies per-button `disabled`. Zero CSS changes, zero new dependencies, three files touched.

## Architecture Decisions

### Decision: Where to put the pure counting function

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Inline in `gameStore.ts` | Convenient but bloats 257-line store | ❌ |
| **New `selectors.ts` in game feature** | ✅ Clean FSD separation, easy to test, no React dep | **Selected** |
| Custom hook `useExhaustedNumbers` | Adds React dependency to pure logic | ❌ |

**Rationale**: The function is pure TypeScript (`Board → Set<number>`). Putting it in a `selectors.ts` file alongside the store follows Zustand conventions, keeps the store focused on state+mutation, and makes the function trivially testable without React.

### Decision: Exhausted vs. solved visual style

| Option | Tradeoff | Decision |
|--------|----------|----------|
| **Reuse `.button:disabled` (opacity: 0.5)** | ✅ Consistent, zero new CSS, same visual language for "can't click" | **Selected** |
| New `.exhausted` class with distinct opacity | More visual cues but risks confusing users ("why is 7 faded differently than 3?") | ❌ |

**Rationale**: Both states mean "button is not clickable." When solved, the entire numpad + Borrar is `opacity: 0.5`. When a single number is exhausted mid-game, only that button hits `opacity: 0.5`. Same semantics, same CSS. A distinct style would imply different behavior where none exists.

## Data Flow

```
                        ┌────────────────┐
   Zustand Store        │  board: Board  │
      ────────────────► │  status, ...   │
                        └───────┬────────┘
                                │
                     ┌──────────▼──────────┐
                     │ getExhaustedNumbers  │  selectors.ts — pure fn
                     │  (board) → Set<num> │  O(81), sub-0.1ms
                     └──────────┬──────────┘
                                │
                     ┌──────────▼──────────┐
                     │ Numpad (useMemo)    │  re-derives only on
                     │ disabled={exhausted │  board reference change
                     │   .has(num)}        │  (new game, enter/delete)
                     └─────────────────────┘
```

Edge case: empty board → `getExhaustedNumbers` returns `new Set()` → all buttons enabled.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/features/game/selectors.ts` | Create | Pure `getExhaustedNumbers(board): Set<number>` — single pass over 81 cells, tally counts 1–9 |
| `src/features/game/components/Numpad.tsx` | Modify | Read `board` from store, derive exhausted set with `useMemo`, add `exhaustedNumbers.has(num)` to per-button `disabled` |
| `src/features/game/__tests__/Numpad.test.tsx` | Modify | Add exhaustion tests: full board, partial, empty, and re-enable on delete |

## Interfaces / Contracts

```typescript
// src/features/game/selectors.ts
import type { Board } from '../../domain/types';

export function getExhaustedNumbers(board: Board): Set<number>;
```

No new types needed. `Board` and `Cell` are already in `domain/types.ts`.

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Unit | `getExhaustedNumbers` — all 9 of one number placed, empty board, mixed state | Pure function, zero mocks, assert `Set` membership |
| Component | Numpad disabled state matches exhausted numbers | RTL: pre-set store board, render Numpad, assert `disabled` on correct buttons |
| Component | Numpad re-enables when count drops below 9 | Set full board → assert disabled → set one cell to null → assert enabled |
| Existing | All 41 existing tests | Must pass |

## Migration / Rollout

No migration required. Rollback: revert `Numpad.tsx`, delete `selectors.ts`, revert test additions. No data or schema impact.

## Open Questions

None.
