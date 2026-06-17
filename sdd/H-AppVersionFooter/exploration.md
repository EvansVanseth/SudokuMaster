## Exploration: App Version & Global Footer

### Current State
The application version is currently hardcoded as `'1.0.0'` inside `src/features/game/components/FeedbackModal.tsx`. There is no global footer, and the version is not exposed dynamically.

### Affected Areas
- `src/features/game/components/FeedbackModal.tsx` — currently hardcoded, needs to be updated to use the dynamic version.
- `src/app/router/AppRouter.tsx` — needs a new global layout or Footer component wrapper.
- `package.json` — contains the source of truth for the version.
- `vite.config.ts` — (optional) could be used to inject the version.

### Approaches

1. **Option A: Vite JSON Import** — Import `package.json` directly in components.
   - Pros: Simple, no build config changes.
   - Cons: Potential to import more than just version if tree-shaking isn't perfectly configured; requires `resolveJsonModule: true`.
   - Effort: Low

2. **Option B: Vite Define (Recommended)** — Define `__APP_VERSION__` in `vite.config.ts` using `define`.
   - Pros: Clean separation, compile-time constant injection, standard Vite pattern.
   - Cons: Requires config update.
   - Effort: Low

3. **Option C: Environment Variable** — Use `VITE_APP_VERSION`.
   - Pros: Easy to override in CI/CD.
   - Cons: Requires explicit `.env` management.
   - Effort: Low

### Recommendation
Use **Option B (Vite Define)**. It is the cleanest architectural approach for injecting version constants in a Vite application, avoiding runtime imports of `package.json` in every file. For the footer, create a shared `Footer` component and wrap the `Routes` in `AppRouter` with a `Layout` component that includes it.

### Risks
- Circular dependencies if `vite.config.ts` logic is complex (unlikely).
- Footer positioning on different screen sizes (CSS effort).

### Ready for Proposal
Yes.
