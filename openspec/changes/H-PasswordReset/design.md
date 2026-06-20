# Design: Password Reset

## Architecture
- Two new pages in `src/app/pages/`.
- Use `supabase.auth` client for password reset.
- Minimal components needed (form, input, submit button).

## Routes
- `/forgot-password`
- `/reset-password` (with query parameters handled by Supabase)
