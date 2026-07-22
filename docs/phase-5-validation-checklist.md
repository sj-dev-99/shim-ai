# Phase 5 Validation Checklist

This checklist documents the verification work for SHIM.AI Supabase Auth, Diary storage, account settings, and account deletion.

## Automated Checks

Run before commit and deployment:

```bash
npx tsc --noEmit
npm run build
git diff --check
```

Optional if ESLint is configured:

```bash
npm run lint
```

## Code Security Review

Checked items:

- `SUPABASE_SERVICE_ROLE_KEY` is only read from server-side helpers or API routes.
- `createSupabaseAdminClient` is only used by server routes.
- `/api/account/delete` requires a Bearer access token.
- `/api/account/delete` verifies the current user on the server before deleting data.
- The account page requires password reauthentication before calling `/api/account/delete`.
- Diary text is rendered as React text content, not raw HTML.
- Diary content is not sent to external AI APIs in the current implementation.
- Diary content is not logged with `console.log`.
- `.env.local` and other local env files are ignored by `.gitignore`.
- `diary_entries`, `profiles`, and `user_consents` have RLS SQL prepared in the migration.

Known follow-up hardening:

- Add rate limiting for account deletion and auth-related API routes.
- Add a post-deletion verification query in a controlled server-side test environment.

## Supabase Dashboard Manual Setup

The app requires these values in local `.env.local` and Vercel Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL="TODO_SUPABASE_PROJECT_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="TODO_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="TODO_SUPABASE_SERVICE_ROLE_KEY"
SUPABASE_URL="TODO_SUPABASE_PROJECT_URL"
SUPABASE_BETA_EVENTS_TABLE="beta_events"
```

Run this SQL in Supabase SQL Editor:

```text
supabase/migrations/202607220001_auth_diary_foundation.sql
```

Authentication settings:

- Email provider enabled.
- Email confirmation enabled for production.
- Site URL:
  - Local: `http://localhost:3000`
  - Production: `https://shim-ai-rouge.vercel.app`
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/reset-password`
  - `https://shim-ai-rouge.vercel.app/auth/callback`
  - `https://shim-ai-rouge.vercel.app/reset-password`

## Manual Test Matrix

These tests require real Supabase environment variables and at least two test accounts.

### Auth

- Sign up with a valid email.
- Try sign up with an invalid email.
- Try sign up without terms agreement.
- Try sign up with mismatched passwords.
- Confirm email through the Supabase email link.
- Log in after email confirmation.
- Try login with a wrong password.
- Request password reset email.
- Change password from `/reset-password`.
- Refresh the page and confirm the session remains.
- Log out and confirm protected account data disappears.

### Diary

- Log in and create a Diary entry.
- Refresh `/diary` and confirm the entry remains.
- Edit a Diary entry.
- Delete a Diary entry.
- Edit a Diary entry's emotion and content.
- Create several records and confirm newest-first ordering.
- Log out and confirm entries are no longer displayed.
- Log in as another account and confirm the first user's entries are not visible.
- Add a legacy `shim_ai_diary_entries` localStorage payload and test "기록 가져오기".
- Re-run migration and confirm duplicates are not created.

### Multi-device Sync

- Log in on desktop and mobile with the same account.
- Create a Diary entry on desktop.
- Refresh mobile and confirm the entry appears.
- Edit on mobile.
- Refresh desktop and confirm the edit appears.
- Delete on desktop.
- Refresh mobile and confirm the deletion is reflected.

### RLS and Data Isolation

Use Supabase SQL Editor or API tests with two user tokens:

- User A cannot select User B's `diary_entries`.
- User A cannot update User B's `diary_entries`.
- User A cannot delete User B's `diary_entries`.
- Anonymous requests cannot read `diary_entries`.
- Supplying another `user_id` in an insert is rejected by RLS.

### Account Deletion

- Open `/account`.
- Confirm delete button is disabled until `계정 삭제` is typed and the current password is entered.
- Try deletion with a wrong password and confirm deletion is blocked.
- Delete an account with Diary records.
- Confirm the app signs out and returns home.
- Confirm deleted account cannot log in again.
- Confirm `profiles`, `diary_entries`, and `user_consents` rows for that user are gone.

## Deployment Checklist

- Add all required Supabase environment variables in Vercel.
- Run the SQL migration in Supabase before deploying auth/Diary changes.
- Confirm RLS policies are enabled.
- Confirm redirect URLs include both local and production URLs.
- Run `npm run build`.
- Deploy.
- Create a disposable test user in production.
- Verify signup, login, Diary save, logout, and account deletion.
