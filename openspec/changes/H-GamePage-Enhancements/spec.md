# Specs: GamePage Enhancements (V2)

## 1. Game Companion
- Structure: `GameCompanionSection` component.
- Mobile: Below keypad, above controls.
- Desktop: Sidebar alongside the board.
- Dynamic Content: Trivia (memoized).
- Game Status: Time, Errors, Hints.

## 2. Feedback System
- Database: Supabase `feedback` table (`id`, `user_id`, `message`, `app_version`, `created_at`).
- Notification: Supabase Edge Function to send email on insert.
- UI: Feedback button triggers modal -> captures message + `app_version` + `user_id`.

## 3. UX Enhancements
- Warning Modal: Persuasive copy ("Log in to save").
- Auth Banner: Clear indication at footer.

## 4. App Version
- Fetch `version` from `package.json` and include in feedback payload.
