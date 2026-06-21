## Exploration: Account Deletion Implementation

### Current State
Users currently can see an "Eliminar Cuenta" button in the `AccountPage`, but it isn't fully wired up or requires specific handling for Google-authenticated users. The database schema (PostgreSQL) is correctly set up with `ON DELETE CASCADE` constraints on `public.profiles`, `public.games`, and `public.feedback` referencing `auth.users`.

### Affected Areas
- `src/features/account/hooks/useAccount.ts` — The `deleteAccount` function logic needs to invoke `supabase.auth.deleteUser()`.
- `src/app/pages/AccountPage.tsx` — The UI triggers the modal and confirms the action.

### Approaches
1. **Client-side `deleteUser()`** — Utilize the Supabase Auth Client SDK (`supabase.auth.deleteUser()`).
   - Pros: Simple, secure (uses the current user's session), respects RLS and DB cascading rules.
   - Cons: Requires the user to have a valid active session.
   - Effort: Low.

### Recommendation
Use the standard `supabase.auth.deleteUser()` method. Since the database has `ON DELETE CASCADE` configured on all tables referencing `auth.users` (`profiles`, `games`, `feedback`), performing the delete from the client-side API is sufficient to trigger the automatic cleanup of all user-specific data.

### Risks
- Stale session: If the user's session is expired, the deletion request will fail. The `deleteAccount` hook should handle authentication errors gracefully by prompting re-authentication if necessary.
- Data recovery: Deletion is permanent. Ensure the confirmation modal (already implemented in `AccountPage.tsx`) effectively warns the user.

### Ready for Proposal
Yes. The orchestrator can propose implementing the call to `supabase.auth.deleteUser()` inside the `deleteAccount` hook.

---

## Linting Errors

The following linting errors were identified:

**`src/features/account/__tests__/useAccount.test.ts`**
- Line 47: `Unexpected any`
- Line 48: `Unexpected any`
- Line 62: `Unexpected any`

**`src/features/account/hooks/useAccount.ts`**
- Line 26: `Unexpected any`
- Line 62: `Unexpected any`
- Line 95: `Unexpected any`

**`src/features/auth/__tests__/AuthProvider.test.tsx`**
- Line 21: `Unexpected any`
- Line 29: `Unexpected any`
- Line 31: `Unexpected any`

**`supabase/functions/notify-password-change/template.ts`**
- Line 1: `'email' is defined but never used`
