# Password Reset Feature

## Goal
Implement password reset flow for SudokuMaster.

## Requirements
- `ForgotPasswordPage.tsx`: Form to request reset email using `supabase.auth.resetPasswordForEmail`.
- `ResetPasswordPage.tsx`: Form to update password using `supabase.auth.updateUser`.
- `AuthForm.tsx`: Add link to `ForgotPasswordPage`.
- Update `AppRouter.tsx` with new routes.

## Design
- Use `supabase` client from `src/shared/api/supabaseClient.ts`.
- Use existing UI patterns (forms, buttons).
