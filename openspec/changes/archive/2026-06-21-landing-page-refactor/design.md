# Design: Landing Page Refactor

## Technical Approach

Refactor the `LandingPage` into a cleaner container component following Feature-Sliced Design principles.
Introduce a `useSudokuRotation` hook to manage the 15-second game loop, featuring a synchronized progress bar.
Implement CSS Grid/Flexbox in `LandingPage.module.css` to achieve a responsive leaderboard layout and mobile-optimized scroll indicators.

## Architecture Decisions

### Decision: Custom Hook for Game Loop

**Choice**: Create `useSudokuRotation` hook.
**Alternatives considered**: Keep `useEffect` in `LandingPage`.
**Rationale**: Enhances readability and component modularity by separating the game loop and timer logic from the view layer.

### Decision: Responsive Leaderboard Layout

**Choice**: CSS Grid with media queries for side-by-side leaderboard (desktop) vs stacked (mobile).
**Alternatives considered**: Flexbox.
**Rationale**: Grid provides better control over track sizing and alignment for side-by-side layouts compared to simple Flexbox, ensuring predictable behavior.

## Data Flow

`LandingPage` (Container)
  │
  ├── `useSudokuRotation` Hook ──→ returns { currentTrivia, progress, resetTimer }
  │
  ├── `LeaderboardSection` (Responsive component)
  │
  └── `ScrollIndicator` (Conditional rendering based on viewport)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/pages/LandingPage.tsx` | Modify | Refactor as container, implement hook usage, integrate scroll indicator |
| `src/app/pages/LandingPage.module.css` | Modify | Add grid/flexbox styles for leaderboard and scroll indicator |
| `src/app/hooks/useSudokuRotation.ts` | Create | New hook to encapsulate timer and trivia rotation logic |

## Interfaces / Contracts

```typescript
// src/app/hooks/useSudokuRotation.ts
export interface RotationHookResult {
  currentTrivia: string;
  progress: number; // 0 to 100
  resetRotation: () => void;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `useSudokuRotation` | Test hook timer intervals, progress calculation, and trivia rotation logic using `vi.useFakeTimers()`. |
| E2E | Landing Page | Verify layout responsiveness and scroll indicator appearance on small viewports. |

## Migration / Rollout

No complex data migration required. Feature is purely UI/Logic improvement.

## Open Questions

- [ ] Should we use a CSS animation or React state for the progress bar? (Proposed: CSS animation for performance).
