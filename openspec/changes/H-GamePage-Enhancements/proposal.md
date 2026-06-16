# Proposal: GamePage Enhancements

## Problem
The GamePage feels sparse on desktop (too much whitespace), lacks engagement, and has abrasive UX when unauthenticated users try to navigate away.

## Proposed Changes
1. **Game Companion Sidebar (Desktop)**:
   - Dynamic Trivia (updates every 20s).
   - Game status (Timer, Errors, Hints).
2. **Persuasive Warning Modal**:
   - Instead of "You'll lose everything", use "Log in for free to save your progress!".
3. **User Status Footer**:
   - Clear indication of auth status (e.g., "Progress saved" / "Sign in to save").
4. **Feedback Mechanism**:
   - Gated feedback button (Auth required).
   - Supabase `feedback` table implementation.

## Affected Files
- `src/features/game/components/GameCompanion.tsx` (New)
- `src/features/game/components/GamePage.tsx` (Layout refactor)
- `src/features/auth/components/AuthStatusBanner.tsx` (New)
- `src/shared/api/supabaseClient.ts` (Feedback table)
