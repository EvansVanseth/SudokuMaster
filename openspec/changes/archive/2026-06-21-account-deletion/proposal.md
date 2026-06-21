# Proposal: Account Deletion

## Intent

Implement account deletion functionality to give users control over their data, ensuring compliance with data privacy standards and improving UX by allowing users to remove their accounts permanently.

## Scope

### In Scope
- Create UI component for account deletion confirmation (requiring email input).
- Integrate `supabase.auth.deleteUser()` to remove the authenticated user.
- Configure DB `ON DELETE CASCADE` on foreign key relationships (e.g., `profiles`, `game_history`) to ensure complete cleanup.
- Refactor existing code to fix linting errors (remove `any` types and unused variables).
- Redirect user to home page on success.

### Out of Scope
- Data archival (deletion is permanent).
- Email notification of deletion (can be added later).

## Capabilities

### New Capabilities
- `account-deletion`: Full lifecycle of user account removal including UI confirmation and Auth SDK integration.

### Modified Capabilities
- `AccountManagement`: Update UI to include "Delete Account" action.

## Approach

1. **Database**: Apply `ON DELETE CASCADE` to relevant tables linked to `auth.users`.
2. **Backend/Logic**: Implement the deletion logic in the `account` feature.
3. **UI**: Add a modal component that validates the input email matches the registered user email before triggering the deletion.
4. **Cleanup**: Address specified linting errors in `src/features/account` and `supabase/functions` to ensure codebase health.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/features/account/` | Modified | New UI, logic, and linting fixes |
| `src/features/auth/` | Modified | Linting fixes in tests |
| `supabase/functions/` | Modified | Linting fix in template |
| `supabase_schema.sql` | Modified | Update foreign keys to `ON DELETE CASCADE` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Accidental deletion | Low | Require explicit email verification in UI |
| Data loss (orphan records) | Medium | Enforce `ON DELETE CASCADE` in Postgres |

## Rollback Plan

- Revert the PR and perform a manual DB verification to ensure no orphan records exist.

## Dependencies

- None

## Success Criteria

- [ ] User can delete their account only after confirming via email input.
- [ ] Account record in `auth.users` is removed.
- [ ] Related data in `profiles` and `game_history` is removed via cascade.
- [ ] No `any` types or unused variables remaining in specified files.
