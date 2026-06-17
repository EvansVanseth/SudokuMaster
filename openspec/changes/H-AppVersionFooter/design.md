# Design: App Version and Footer Implementation

## Technical Approach

Introduce a global `AppLayout` component to wrap the application router, providing a consistent structure for the application. Inject the current application version from `package.json` into the build process as a global constant using Vite's `define` configuration. The footer will be a discreet component placed within this layout.

## Architecture Decisions

### Decision: AppLayout Structure

**Choice**: Introduce `AppLayout` in `src/app/layouts/AppLayout.tsx`.
**Alternatives considered**: Add footer directly to `AppRouter` or `App.tsx`.
**Rationale**: Using a dedicated layout component separates concerns and allows for future expansion (e.g., adding a header/navbar) without modifying the router definition or the entry component.

### Decision: Version Injection

**Choice**: Use `vite.config.ts` to `define` a global `__APP_VERSION__` constant.
**Alternatives considered**: Reading `package.json` at runtime in the component.
**Rationale**: `define` allows for static injection during build time, which is cleaner and safer than runtime file reading.

## Data Flow

`App.tsx` (Root) ──→ `AppLayout` ──→ `AppRouter` (Routes)
                                    │
                                    └── `Footer` (via Layout)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/layouts/AppLayout.tsx` | Create | New layout component with footer. |
| `src/shared/ui/Footer.tsx` | Create | Discreet footer component. |
| `src/App.tsx` | Modify | Wrap `AppRouter` with `AppLayout`. |
| `vite.config.ts` | Modify | Inject `__APP_VERSION__`. |

## Interfaces / Contracts

```typescript
// Footer.tsx
export const Footer: React.FC;

// vite.config.ts
declare const __APP_VERSION__: string;
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `Footer` | Verify version is displayed. |
| Integration | `AppLayout` | Ensure `AppRouter` content is rendered within `AppLayout`. |

## Migration / Rollout

No migration required.

## Open Questions

- [ ] None.
