# Design: Add Board Timer

## Technical Approach

We will introduce a progress timer mechanism to the `useSudokuRotation` hook to track the rotation cycle (15s). The timer state (`progress` 0-100%) will be exposed to the `SudokuPreviewCard` component, which will render a CSS-based progress bar. To optimize performance and ensure smooth 60fps animations, we will utilize `requestAnimationFrame` within the hook.

## Architecture Decisions

### Decision: Timer Implementation in Hook

**Choice**: Implement timer logic within `useSudokuRotation` using `requestAnimationFrame`.
**Alternatives considered**: Using `setInterval` with 100ms updates.
**Rationale**: `requestAnimationFrame` aligns with browser refresh cycles, preventing unnecessary updates during background tab transitions and ensuring smoother progress bar transitions (60fps) as per the "Render Optimization" requirement in the spec.

### Decision: Progress Representation

**Choice**: Expose a single `progress` (0-1) float value from the hook.
**Alternatives considered**: Exposing `timeLeft` (ms).
**Rationale**: Exposing a normalized 0-1 float directly maps to CSS `width` percentages, simplifying the view layer (`SudokuPreviewCard`) logic.

## Data Flow

`useSudokuRotation` (updates `progress`) ──→ `LandingPage` (consumes `progress`) ──→ `SudokuPreviewCard` (renders progress bar via props)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/hooks/useSudokuRotation.ts` | Modify | Add `progress` state, implement `requestAnimationFrame` loop. |
| `src/shared/ui/SudokuPreviewCard.tsx` | Modify | Add `progress` prop, render `<div className={styles.progressBar} />`. |
| `src/shared/ui/SudokuPreviewCard.module.css` | Modify | Add styles for absolute/integrated progress bar. |

## Interfaces / Contracts

```typescript
// src/app/hooks/useSudokuRotation.ts
export interface RotationHookResult {
  currentTrivia: string;
  currentDifficulty: Difficulty;
  rotateDifficulty: () => void;
  progress: number; // 0 to 1
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `useSudokuRotation` | Mock `requestAnimationFrame`, verify `progress` state updates correctly over time. |
| Integration | `SudokuPreviewCard` | Verify `progress` prop updates render correct CSS width. |

## Migration / Rollout

No data migration required. The feature is purely UI-based.

## Open Questions

- [ ] Should the timer pause when the user hovers over the card? (Spec doesn't specify, currently assumes continuous rotation).
