# Proposal: fix-landing-regressions

## Problem
Landing page is experiencing regressions. Need to unify trivia logic and separate progress tracking.

## Proposed Changes
1. Unify trivia logic in `useSudokuRotation`.
2. Separate progress logic (trivia vs board).
3. Ensure `LandingPage.tsx` renders both elements (trivia with its progress, board with its progress).
