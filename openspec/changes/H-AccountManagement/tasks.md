# Tasks: H-AccountManagement

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~150-200 |
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
| 1 | Account Management Implementation | PR #1 | Single PR for feature completion |

## Phase 1: Foundation / Database

- [ ] 1.1 Check `profiles` table existence in Supabase; create if missing to store `full_name`.

## Phase 2: Core Implementation

- [ ] 2.1 Create `src/app/pages/AccountPage.tsx` with layout: Profile Display, Logout Button, and placeholders.
- [ ] 2.2 Implement `AccountPage` logic using `useAuth` hook for `signOut` functionality.

## Phase 3: Integration

- [ ] 3.1 Update `src/app/router/AppRouter.tsx` to add protected `/account` route.
- [ ] 3.2 Add 'Mi cuenta' navigation link to `src/shared/ui/Footer.tsx` (auth-visible only).

## Phase 4: Testing

- [ ] 4.1 Add unit tests for `AccountPage` component using `vitest` and `testing-library`.
- [ ] 4.2 Verify Logout flow functionality (redirect to landing, session clear).

## Phase 5: Cleanup

- [ ] 5.1 Final review of accessibility on `AccountPage` and footer links.
