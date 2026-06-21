# Design: fix-landing-regressions

## Goal
Fix landing page regressions by unifying trivia logic and separating progress tracking.

## Architecture Approach
- **Trivia**: Unify logic in `useSudokuRotation`.
- **Progress Tracking**: Separate state for trivia and board in `LandingPage`.

## Implementation Details
1. Refactor `useSudokuRotation` to be the single source of truth for trivia.
2. In `LandingPage`, maintain distinct state hooks for board progress and trivia progress.
3. Update rendering logic in `LandingPage` to consume these hooks and display components accordingly.
