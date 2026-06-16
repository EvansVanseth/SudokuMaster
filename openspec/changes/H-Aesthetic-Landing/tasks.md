# Tasks: Landing Page Aesthetic Improvements

## Implementation Steps
1. **Branding Updates (Low Risk)**:
   - Update `index.html` title (remove "(Beta)").
   - Update `public/favicon.svg` (simple square with '1').
2. **Layout & Styling (Medium Risk)**:
   - Modify `src/app/pages/LandingPage.module.css` for vertical stacking in `.previewHeader`.
   - Update `.cta` section for centering and spacing.
   - Refine `.ctaButton` styles.
3. **Component Creation (Low Risk)**:
   - Create `src/features/dashboard/components/CreditsSection.tsx` (using GitHub icon and links).
4. **Integration (Medium Risk)**:
   - Integrate `CreditsSection` into `src/app/pages/LandingPage.tsx`.
   - Add invitation text below `.previewHeader`.

## Workload Forecast
- Estimated changed lines: < 150
- Risk: Low
- Review: Standard (400-line budget applies)
