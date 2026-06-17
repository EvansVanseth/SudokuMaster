# Tasks: H-AppVersionFooter

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 150-200 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | exception-ok |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Entire change set | PR 1 | Single PR containing all tasks |

## Phase 1: Foundation

- [x] 1.1 Update `vite.config.ts` to define `__APP_VERSION__` constant.

## Phase 2: Core Implementation

- [x] 2.1 Create `src/shared/ui/Footer.tsx` with version display.
- [x] 2.2 Create `src/app/layouts/AppLayout.tsx` as a wrapper.

## Phase 3: Integration

- [x] 3.1 Modify `src/App.tsx` to wrap `AppRouter` with `AppLayout`.
- [x] 3.2 Update `src/features/feedback/FeedbackModal.tsx` to import and display `__APP_VERSION__`.

## Phase 4: Testing

- [x] 4.1 Create `src/shared/ui/__tests__/Footer.test.tsx` verifying version render.
- [x] 4.2 Create `src/app/layouts/__tests__/AppLayout.test.tsx` verifying content rendering.
