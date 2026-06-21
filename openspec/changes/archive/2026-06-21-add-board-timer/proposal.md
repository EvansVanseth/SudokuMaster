# Proposal: Add Board Rotation Progress Timer

## Intent

The current board rotation logic in the landing page automatically rotates every 15 seconds, but users have no visual feedback on when this will occur. This makes the interface feel unresponsive or unpredictable. We need to add a progress indicator to provide clear visual cues for the upcoming rotation.

## Scope

### In Scope
- Update `useSudokuRotation.ts` hook to calculate and expose rotation progress percentage.
- Update `LandingPage.tsx` to integrate the timer state.
- Update `SudokuPreviewCard.tsx` to render a smooth progress bar.

### Out of Scope
- Changing the rotation duration (fixed at 15s).
- Adding "pause" or "stop" functionality to the rotation.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `game-rotation`: Added requirement for visual progress indication to improve UX.

## Approach

We will modify the `useSudokuRotation` hook to track the elapsed time, calculating the normalized percentage (0-100%). This value will be passed down to the `SudokuPreviewCard` component, which will render a CSS transition-based progress bar overlay.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/features/game/hooks/useSudokuRotation.ts` | Modified | Export `progress` percentage |
| `src/features/game/components/SudokuPreviewCard.tsx` | Modified | Render progress UI |
| `src/app/pages/LandingPage.tsx` | Modified | Plumbing for progress state |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Performance overhead of frequent re-renders | Low | Use `requestAnimationFrame` or optimized state updates for smooth progress |

## Rollback Plan

Revert changes to `useSudokuRotation.ts`, `LandingPage.tsx`, and `SudokuPreviewCard.tsx`.

## Dependencies

- None

## Success Criteria

- [ ] Progress bar fills smoothly over 15 seconds.
- [ ] Board rotation triggers precisely when progress reaches 100%.
- [ ] Trivia text remains visible and unaffected by progress bar overlay.
