## Exploration: H-AccountManagement

### Current State
- **Auth**: Managed by `AuthProvider` (`src/features/auth/components/AuthProvider.tsx`) and `AuthContext`.
- **User Management**: Auth happens via Supabase. Profile data (including `full_name`) is automatically synced to the `profiles` table via a database trigger `on_auth_user_created` in `CONTEXT/supabase_schema.sql` when a new user is inserted.
- **Profiles**: The `profiles` table is used for `full_name`, `username`, and `avatar_url`. Row Level Security (RLS) policies exist to allow users to update their own profiles.
- **Logout**: Handled via `supabase.auth.signOut()` within `AuthProvider`.

### Affected Areas
- `src/features/auth/` — Will likely need to expose more user profile details or a hook to fetch/update the `profiles` table.
- `src/app/pages/AccountPage.tsx` (New) — To host the layout.

### Approaches
1. **Direct `profiles` updates** — Expose a function in `AuthContext` or a new hook `useProfile` that performs `supabase.from('profiles').update(...)` for updating `full_name`.
   - Pros: Simple, leverages RLS.
   - Cons: Need to keep state synced.
   - Effort: Low.

2. **Supabase `auth.updateUser`** — If `full_name` is stored in `user_metadata`, updating it via `auth.updateUser` will trigger the sync if we adjust the trigger, but currently the trigger only runs on `INSERT`. We might need to manually update `profiles` AND potentially `user_metadata`.
   - Pros: Keeps user metadata in sync.
   - Cons: More complex sync requirements.
   - Effort: Medium.

### Recommendation
Use Approach 1: Directly update the `profiles` table for `full_name` updates, as this is already a managed table with RLS. For password changes and account deletion, use the standard Supabase Auth SDK (`supabase.auth.updateUser` for password, `supabase.auth.admin.deleteUser` or similar if permitted, but client-side deletion usually requires specific RLS or a secure RPC/Function for full user cleanup).

*Note*: For account deletion, standard client-side SDK might not allow `deleteUser` directly for security. We may need a Supabase RPC or a secure backend call to ensure `profiles` and `games` data (which has ON DELETE CASCADE) are cleaned up correctly.

### Risks
- **Account Deletion**: Requires careful handling of user deletion to ensure all `games` data (Cascade) is removed, but we must ensure we have the necessary permissions. Standard `supabase.auth.signOut` and then deletion might be restricted on the client.
- **Trigger Limitations**: The existing trigger only runs on `INSERT`. Updates to `full_name` are not reflected automatically in `profiles` if done solely through `auth.updateUser` metadata.

### Ready for Proposal
Yes. The orchestrator should tell the user that we are ready to proceed with implementing `AccountPage` using direct `profiles` updates for display name and Supabase Auth SDK for security operations.
