# Tasks: Add Board Timer

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~80 lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full implementation of timer and UI | PR 1 | Includes hook, components, and tests |

## Phase 1: Foundation (Hook Update)

- [x] 1.1 Update `src/app/hooks/useSudokuRotation.ts` to implement `progress` state using `requestAnimationFrame`.
- [x] 1.2 Expose `progress` in `RotationHookResult`.

## Phase 2: UI Implementation

- [x] 2.1 Update `src/shared/ui/SudokuPreviewCard.module.css` with progress bar styles.
- [x] 2.2 Update `src/shared/ui/SudokuPreviewCard.tsx` to accept `progress` prop and render the bar.

## Phase 3: Integration

- [x] 3.1 Update `src/app/pages/LandingPage.tsx` to pass `progress` from the hook to `SudokuPreviewCard`.

## Phase 4: Testing & Verification

- [ ] 4.1 Write unit tests for `useSudokuRotation` in `src/app/hooks/__tests__/useSudokuRotation.test.ts` (mocking raf).
- [ ] 4.2 Verify visual rendering of the progress bar in `SudokuPreviewCard`.

## Phase 5: Cleanup

- [ ] 5.1 Final code review and polish of CSS animations.
