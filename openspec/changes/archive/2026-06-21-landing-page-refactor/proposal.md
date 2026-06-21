# Proposal: Landing Page Refactor

## Intent

The current landing page suffers from visual clutter and lacks dynamic elements to engage users immediately. We need to introduce a more interactive, focused experience that encourages immediate gameplay while providing clear navigational cues.

## Scope

### In Scope
- Single Rotating Board component for visual interest.
- 15s trivia-style linear progress bar for session pacing.
- Responsive Leaderboard: Side-by-side on desktop, stacked on mobile.
- "Bouncing arrow" visual scroll indicator for mobile.
- Refactor `LandingPage` into a container component with difficulty state management.

### Out of Scope
- Backend API changes.
- Content updates for trivia questions (static fallback used).

## Capabilities

### New Capabilities
- `landing-page-game-loop`: Manages the timer and progress bar logic for the game session.
- `scroll-indicator`: UI component for mobile navigation hints.

### Modified Capabilities
- `leaderboard`: Updated layout logic to support responsive stacking vs side-by-side.

## Approach

Refactor `LandingPage` using the Container/Presentational pattern (FSD). The container will manage state (difficulty, timer status). The UI will utilize CSS Grid/Flexbox for the leaderboard's responsive behavior. The timer component will be a standalone feature integrated into the game loop.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/features/landing-page` | Modified | Container refactor + difficulty state |
| `src/features/leaderboard` | Modified | CSS layout update |
| `src/features/game-timer` | New | Trivia-style progress bar |
| `src/shared/ui/scroll-arrow`| New | Bouncing animation component |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Mobile responsiveness issues | Medium | Testing in responsive viewports early |
| Timer state sync | Low | Use stable refs/state management |

## Rollback Plan

Revert changes to `LandingPage` components and revert CSS modifications in `leaderboard`.

## Dependencies

- None.

## Success Criteria

- [ ] Landing page UI is cleaner and responsive.
- [ ] Leaderboard adapts correctly between desktop and mobile.
- [ ] Timer and scroll indicators function as expected.
