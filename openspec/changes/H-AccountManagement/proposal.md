# Proposal: H-AccountManagement

## Intent

Users need basic account management (profile editing, logout) to own their data and security. This change introduces an Account page where users can manage their profile information and session state.

## Scope

### In Scope
- AccountPage component (Profile view, FullName edit functionality).
- Logout action integration with Supabase Auth.
- Placeholder UI components for 'Change Password' and 'Delete Account'.
- Footer link integration to access the Account page.

### Out of Scope
- Password reset logic implementation (deferred).
- Account deletion logic implementation (deferred).
- Avatar upload support (deferred).

## Capabilities

### New Capabilities
- `account-management`: UI for profile management and session control.

### Modified Capabilities
- `auth-system`: Extend to support logout and navigation to account settings.

## Approach

- Create a new feature `src/features/account` containing the `AccountPage` component.
- Utilize existing Supabase Auth client for `signOut` logic.
- Use local state for form management on profile editing.
- Update `src/app/router.tsx` to include the `/account` route.
- Add "Account" link in `src/shared/ui/Footer.tsx`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/features/account` | New | Create AccountPage UI and logic |
| `src/app/router.tsx` | Modified | Add /account route |
| `src/shared/ui/Footer.tsx` | Modified | Integrate Account link |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Auth session persistence | Low | Use Supabase Auth provider context |
| Profile update latency | Low | Optimistic UI updates |

## Rollback Plan

1. Revert `router.tsx` changes.
2. Remove `src/features/account` folder.
3. Remove footer link from `Footer.tsx`.

## Dependencies

- Supabase Auth SDK

## Success Criteria

- [ ] Logout action redirects to landing page and clears session.
- [ ] User can view and update their full name.
- [ ] Placeholder buttons are visible on the Account page.
- [ ] Account link is present and functional in the Footer.
