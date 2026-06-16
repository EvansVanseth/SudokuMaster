# Specs: Landing Page Aesthetic and UX Improvements

## 1. CSS Changes
### Hero & Preview Header
- `.previewHeader`: Set `flex-direction: column`.
- `.hero`: Ensure elements are stacked and centered.
- Add `.invitationText`: Use `<p>` for inviting text under `previewHeader`.

### CTA Section
- `.cta`: `display: flex; flex-direction: column; align-items: center;`.
- `.ctaButton`: Increase `padding` to `1rem 2.5rem`, `font-size` to `1.3rem`.
- `.credits`: Add a new `<div>` under the button with `display: flex; align-items: center; justify-content: center; gap: 0.5rem;`.
  - Icon: Use an SVG of the GitHub logo.
  - Text: "Designed & Programmed by EvansVanseth ([Portfolio](...))".

## 2. Branding
- **Favicon**: Replace `public/favicon.svg` with a new square SVG featuring a number (e.g., '1').
- **Tab Title**: In `index.html`, change `<title>SudokuMaster (Beta)</title>` to `<title>SudokuMaster</title>`.

## 3. UX Text
- Add text under `previewHeader`: "Elige un nivel y comienza a entrenar tu mente."
