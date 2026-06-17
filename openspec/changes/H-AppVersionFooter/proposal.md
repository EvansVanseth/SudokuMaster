# Proposal: H-AppVersionFooter

## Intent
Improve user support and application clarity by surfacing the current application version (derived from `package.json`) and implementing a persistent footer across the application layout.

## Scope
### In Scope
- Inject `__APP_VERSION__` globally using `vite.config.ts` (using `package.json` version).
- Create a `Footer` component in `src/shared/components/Footer/`.
- Integrate `Footer` into the global `Layout` component.
- Update `FeedbackModal` to reference `__APP_VERSION__`.

### Out of Scope
- Automated deployment version tagging in CI/CD pipeline.
- Dynamic navigation links in the footer.

## Capabilities

### New Capabilities
- `app-versioning`: Global constant `__APP_VERSION__` available at build time.
- `footer-ui`: Standardized footer component across application screens.

### Modified Capabilities
- `feedback-modal`: Updated to display application version for bug tracking.

## Approach
1. **Config**: Use `define` in `vite.config.ts` to expose the package version.
2. **Components**: Create `src/shared/components/Footer/Footer.tsx`.
3. **Layout**: Update the main layout wrapper to include the `Footer`.
4. **Integration**: Import `__APP_VERSION__` into `FeedbackModal`.

## Affected Areas
| Area | Impact | Description |
|------|--------|-------------|
| `vite.config.ts` | Modified | Add `define` for `__APP_VERSION__` |
| `src/shared/components/Layout/Layout.tsx` | Modified | Add `Footer` component |
| `src/features/feedback/FeedbackModal.tsx` | Modified | Display version string |

## Risks
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Build version mismatch | Low | Use `package.json` dynamically |
| Footer UI overlap | Medium | Apply responsive CSS (Flexbox/Grid) |

## Rollback Plan
Revert changes to `vite.config.ts`, remove `Footer` component imports from `Layout`, and revert `FeedbackModal` string interpolation.

## Dependencies
- None.

## Success Criteria
- [ ] Version number visible in the footer of all main pages.
- [ ] Version number visible within the `FeedbackModal`.
- [ ] Footer does not break existing page layout.
