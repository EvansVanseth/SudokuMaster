# Design: Centralize Password Validation

## Technical Approach

We will introduce a pure TypeScript module `src/domain/auth/password.ts` to centralize password validation rules, including a configurable denylist. This module will reside in the `src/domain` layer to maintain strict isolation from React and Supabase. Auth components and services will invoke this domain module to validate passwords before sending them to Supabase.

## Architecture Decisions

### Decision: Pure Domain Logic for Validation

**Choice**: Implement validation as pure functions within `src/domain/auth/password.ts`.
**Alternatives considered**:
1. Keep validation in UI components (current state): Leads to duplication and inconsistent rules.
2. Put validation logic in `src/features/auth` with Supabase dependencies: Violates the domain layer isolation goal.
**Rationale**: Keeps validation reusable, testable, and independent of framework/backend details.

### Decision: Functional Denylist Integration

**Choice**: Define a `DenylistProvider` interface that the validator can use. Default implementation will be a simple `string[]` based provider.
**Alternatives considered**: Hardcode the denylist in the validator function.
**Rationale**: Allows for future expansion (e.g., fetching a remote denylist or more complex matching) without changing the core validator logic.

## Data Flow

```
UI/Form Input ──→ App/Feature Service ──→ Domain Validator ──→ Supabase
                                             ↑
                                        Denylist Provider
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/domain/auth/password.ts` | Create | Contains validation logic, interfaces, and denylist implementation. |
| `src/domain/auth/__tests__/password.test.ts`| Create | Unit tests for password validation logic. |
| `src/features/auth/...` | Modify | Update forms/services to call `validatePassword` before submitting to Supabase. |

## Interfaces / Contracts

```typescript
// src/domain/auth/password.ts

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordValidator {
  validate(password: string): ValidationResult;
}

export type Denylist = string[];

export const createPasswordValidator = (denylist: Denylist): PasswordValidator => {
  // ... implementation
};
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `password.ts` | Test valid passwords, weak passwords (too short), and passwords present in the denylist using `vitest`. |

## Migration / Rollout

No migration required as this is a new validation layer. Existing components will be updated to use this new validator in the implementation phase.

## Open Questions

- [ ] What is the initial set of common passwords to include in the denylist?
- [ ] Should we support internationalization for error messages now, or keep them English for the MVP?
