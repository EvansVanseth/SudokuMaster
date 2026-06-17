# Design: H-AccountManagement

## Technical Approach

The implementation follows the Feature-Sliced Design (FSD) architecture. We will introduce a new feature module `src/features/account` to encapsulate account-related UI and logic. The page will utilize the existing `useAuth` hook from `src/features/auth` for session management (logout) and user profile access. Routing will be updated in `src/app/router/AppRouter.tsx` to include an `/account` route protected by the `ProtectedRoute` component.

## Architecture Decisions

### Decision: Module Placement (FSD)

**Choice**: Create `src/features/account`.
**Alternatives considered**: Place under `src/app/pages` or `src/features/auth`.
**Rationale**: FSD promotes feature isolation. Placing account management in its own feature module (`features/account`) keeps `features/auth` focused on authentication logic and `app/pages` uncluttered.

### Decision: Form State Management

**Choice**: Local `useState` for profile editing.
**Alternatives considered**: Global state (Zustand) or complex form libraries (React Hook Form).
**Rationale**: The profile form is simple (just FullName), so local `useState` is sufficient, minimizing overhead and complexity.

## Data Flow

    [Supabase Auth] ──→ [useAuth Hook] ──→ [AccountPage (Profile View)]
                                                   │
                                                   ▼
    [AccountPage (Form)] ──→ [Supabase API] ──→ [Profile Update]

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/features/account/pages/AccountPage.tsx` | Create | Main Account page UI |
| `src/features/account/components/AccountForm.tsx` | Create | Profile editing form |
| `src/app/router/AppRouter.tsx` | Modify | Add /account route (Protected) |
| `src/shared/ui/Footer.tsx` | Modify | Add link to /account |

## Interfaces / Contracts

New interface for Account form data:

```typescript
interface AccountFormData {
  fullName: string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Form validation | Jest/React Testing Library |
| Integration | Sign out functionality | Mock Supabase Auth |
| E2E | Navigation to Account page | Playwright/Cypress |

## Migration / Rollout

No migration required. The change will be deployed as part of the standard release cycle. Feature flags are not required for this simple addition.

## Open Questions

- [ ] Should the Account link in the footer only appear for logged-in users? (Yes, the current implementation should handle this).
