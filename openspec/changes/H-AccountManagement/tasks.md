# Tasks: H-AccountManagement

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 150-250 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full implementation | PR 1 | Includes all UI, routing, and logic |

## Phase 1: Foundation / Infrastructure

- [ ] 1.1 Create `src/features/account/components/AccountForm.tsx` with `fullName` state and basic validation.
- [ ] 1.2 Create `src/features/account/pages/AccountPage.tsx` with layout, user data display (using `useAuth`), and placeholder buttons.

## Phase 2: Integration / Wiring

- [ ] 2.1 Update `src/app/router/AppRouter.tsx` to add `/account` route protected by `ProtectedRoute`.
- [ ] 2.2 Update `src/shared/ui/Footer.tsx` to conditionally render the "Account" link for logged-in users.
- [ ] 2.3 Integrate `useAuth` hook into `AccountPage.tsx` to implement the logout logic.

## Phase 3: Testing / Verification

- [ ] 3.1 Write unit tests for `AccountForm` to verify input handling.
- [ ] 3.2 Verify logout functionality (ensure redirection and session clearing).
- [ ] 3.3 Verify routing and Footer link accessibility for authenticated users.

## Phase 4: Cleanup

- [ ] 4.1 Apply 1.1rem font size to profile data in `AccountPage` as per design requirements.
- [ ] 4.2 Verify error alert component usage for profile update failures (if applicable).
