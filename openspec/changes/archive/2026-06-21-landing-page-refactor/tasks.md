# Tasks: Landing Page Refactor

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 200-300 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | N/A |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: N/A
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Logic & UI | PR 1 | Complete refactor and implementation. |

## Phase 1: Foundation (Hooks & Logic)

- [x] 1.1 Create `src/app/hooks/useSudokuRotation.ts` with `RotationHookResult` interface.
- [x] 1.2 Implement timer and trivia rotation logic in `useSudokuRotation.ts` using `useEffect` and `setInterval`.
- [x] 1.3 Add unit tests for `useSudokuRotation` using `vi.useFakeTimers()` to verify timing and progress accuracy.

## Phase 2: Core Implementation (Refactor & UI)

- [x] 2.1 Refactor `src/app/pages/LandingPage.tsx` to integrate `useSudokuRotation` and restructure container layout.
- [x] 2.2 Add CSS Grid/Flexbox layouts in `src/app/pages/LandingPage.module.css` for leaderboard side-by-side view.
- [x] 2.3 Implement responsive scroll indicator in `LandingPage.tsx` with conditional rendering.
- [x] 2.4 Style progress bar in `LandingPage.tsx` using CSS animation for smooth transitions.

## Phase 3: Testing & Verification

- [x] 3.1 Run unit tests for `useSudokuRotation` to ensure logic correctness.
- [x] 3.2 Verify responsive layout (desktop/mobile) using development browser tools.
- [x] 3.3 Conduct sanity check on Landing Page functionality (auth flow redirection, leaderboard data fetch).
