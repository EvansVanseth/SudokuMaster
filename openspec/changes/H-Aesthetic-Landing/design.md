# Design: Landing Page Aesthetic Improvements

## 1. CSS Architecture & Layout
- **Vertical Stacking (.previewHeader)**: Use `display: flex; flex-direction: column; align-items: center; gap: 1rem;` for the container.
- **CTA Section**: Apply `display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem;` to the `.cta` container.

## 2. Component Structure (Credits)
- New component: `CreditsSection.tsx`.
- Structure:
  ```tsx
  <div className={styles.credits}>
    <span>Designed & Programmed by</span>
    <a href="https://github.com/EvansVanseth" target="_blank" rel="noopener noreferrer">
      <GithubIcon /> EvansVanseth
    </a>
    <a href="https://portfolio-juanalonso.vercel.app/" target="_blank" rel="noopener noreferrer">
      (Visita mi Portfolio)
    </a>
  </div>
  ```
- CSS: `display: flex; align-items: center; gap: 0.5rem; justify-content: center;`.

## 3. CTA Styling
- Enhance `.ctaButton` with: `background-color: var(--color-primary); color: white; padding: 1rem 2.5rem; font-size: 1.3rem; border-radius: 8px; border: none; cursor: pointer;`.

## 4. Branding Assets
- **Favicon**: Create a 32x32 SVG. Simple black/white square with number '1' inside. Save as `public/favicon.svg`.
