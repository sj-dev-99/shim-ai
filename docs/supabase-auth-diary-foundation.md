# Supabase Auth and Diary Foundation

This document covers Phase 1 for SHIM.AI account and Diary cloud storage.

Phase 1 does not replace the current SHIM Diary UI yet. It prepares the Supabase connection, database schema, RLS policies, and setup checklist so the next phases can add auth pages and migrate Diary storage safely.

## Current Project Analysis

- Framework: Next.js 12.3.4
- Router: Pages Router under `pages/`
- Language: TypeScript with `strict: true`
- Styling: global CSS in `styles/globals.css`
- Current Diary route: `pages/diary.tsx`
- Current Diary storage: browser `localStorage` key `shim_ai_diary_entries`
- Current Diary record shape: `id`, `emotion`, `text`, `comment`, `createdAt`
- Current emotion codes: `good`, `calm`, `warm`, `excited`, `okay`, `neutral`, `mixed`, `anxious`, `sad`, `angry`, `tired`, `lonely`
- Existing Supabase usage: server-side REST calls for beta/admin data only, using `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- New Supabase auth SDK: `@supabase/supabase-js`

## Added Files

- `lib/supabase/config.ts`: reads and validates Supabase environment variables.
- `lib/supabase/client.ts`: browser client using only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `lib/supabase/server.ts`: server client for authenticated user requests with an access token.
- `lib/supabase/admin.ts`: server-only service role helper for future account deletion and admin operations.
- `lib/supabase/types.ts`: shared database and Diary types for future phases.
- `supabase/migrations/202607220001_auth_diary_foundation.sql`: database tables, triggers, indexes, and RLS policies.

## Required Environment Variables

Add these values to `.env.local` for local development and to Vercel Project Settings for deployment.

```bash
NEXT_PUBLIC_SUPABASE_URL="TODO_SUPABASE_PROJECT_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="TODO_SUPABASE_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="TODO_SUPABASE_SERVICE_ROLE_KEY"
```

Existing beta/admin storage can continue to use:

```bash
SUPABASE_URL="TODO_SUPABASE_PROJECT_URL"
SUPABASE_BETA_EVENTS_TABLE="beta_events"
```

Notes:

- Never commit `.env.local`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe for browser usage only with RLS enabled.

## Supabase Dashboard Setup

1. Create or open the Supabase project.
2. Go to Project Settings > API.
3. Copy the Project URL into `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy the anon public key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Copy the service role key into `SUPABASE_SERVICE_ROLE_KEY`.
6. Go to Authentication > Providers.
7. Enable Email provider.
8. Decide whether email confirmation is required. Recommended for production: enabled.
9. Go to Authentication > URL Configuration.
10. Set Site URL:
    - Local: `http://localhost:3000`
    - Production: `https://shim-ai-rouge.vercel.app`
11. Add Redirect URLs:
    - `http://localhost:3000/auth/callback`
    - `http://localhost:3000/reset-password`
    - `https://shim-ai-rouge.vercel.app/auth/callback`
    - `https://shim-ai-rouge.vercel.app/reset-password`
12. Go to SQL Editor.
13. Run `supabase/migrations/202607220001_auth_diary_foundation.sql`.
14. Confirm RLS is enabled on `profiles`, `diary_entries`, and `user_consents`.

## Database Tables

### `profiles`

Stores a small user profile linked to `auth.users`.

- `id`: same UUID as `auth.users.id`
- `nickname`: optional nickname
- `created_at`, `updated_at`

A trigger creates the profile automatically after a new auth user is inserted.

### `diary_entries`

Stores user-owned SHIM Diary records.

- `user_id`: owner, references `auth.users.id`
- `emotion_code`: stable analysis key
- `emotion_label`: Korean label shown when saved
- `content`: Diary text
- `ai_comment`: nullable one-line SHIM comment
- `entry_date`: user-facing Diary date, defaults to Korea date
- `migration_key`: optional key for localStorage migration deduplication
- `created_at`, `updated_at`

The table allows multiple entries on the same date.

### `user_consents`

Stores terms and privacy consent history.

- `terms_version`
- `privacy_version`
- `terms_agreed_at`
- `privacy_agreed_at`
- `marketing_agreed`
- `marketing_agreed_at`

Marketing consent is optional and must not block signup.

## RLS Policy Summary

RLS is enabled for all user-owned tables.

- Users can read only their own profile.
- Users can update only their own profile.
- Users can create, read, update, and delete only their own Diary entries.
- Users can create, read, and update only their own consent records.
- Service role bypasses RLS and must only be used from server API routes.

## Diary Storage Flow for Phase 3

The next Diary migration phase should:

1. Check the Supabase auth session.
2. If unauthenticated, keep the current draft temporarily and guide the user to login.
3. Load `diary_entries` for the current `auth.uid()`.
4. Create entries with `user_id` from the current authenticated user.
5. Never trust a user ID supplied by the browser for another user.
6. Update/delete only by entry ID and current authenticated user.
7. Clear visible private data immediately on logout or user switch.

## Existing localStorage Migration Plan

Current localStorage key:

```text
shim_ai_diary_entries
```

Expected legacy item shape:

```ts
{
  id: string;
  emotion: EmotionCode;
  text: string;
  comment: string;
  createdAt: string;
}
```

Recommended migration approach:

1. Detect legacy entries after login.
2. Show a confirmation UI before upload.
3. Validate emotion code, text length, and date.
4. Insert into `diary_entries` with `migration_key = legacy.id`.
5. Use the unique `(user_id, migration_key)` index to prevent duplicates.
6. Do not automatically delete local data after upload.
7. Show a clear success or partial failure message.

## Account Deletion Flow for Phase 4

Account deletion should be implemented through a server API route.

The server route must:

1. Verify the current Supabase session.
2. Require a clear final confirmation from the user.
3. Delete user-owned app data first or rely on verified cascade rules.
4. Delete the auth user with the service role key only on the server.
5. Sign the user out and clear client state.
6. Never expose service role credentials to the browser.

## Security Checklist

- RLS enabled on all user data tables.
- No `SUPABASE_SERVICE_ROLE_KEY` in browser imports.
- No Diary content in `console.log`.
- Diary text rendered as text, not raw HTML.
- Content length limited in the database.
- Client-provided `user_id` is not trusted for access control.
- Logout clears private screen state.
- User switching does not show previous user's Diary records.

## Next Phase

Phase 2 should add:

- `/signup`
- `/login`
- `/forgot-password`
- `/reset-password`
- `/auth/callback`
- logout handling
- Korean auth error mapping
- protected route behavior for Diary save/account pages

## Phase 2 Implementation Notes

Phase 2 added the first authentication UX layer.

Implemented routes:

- `/signup`: email signup, password confirmation, optional nickname, required terms/privacy consent, optional marketing consent, email verification resend with cooldown.
- `/login`: email/password login and Korean error messages.
- `/forgot-password`: password reset email request.
- `/reset-password`: new password update for users arriving from a reset link.
- `/auth/callback`: verifies the Supabase session after an email link and attempts to store pending consent data.
- `/account`: minimal protected account page with current email and logout.
- `/terms`: draft placeholder structure for future legal terms.
- `/privacy`: draft placeholder structure for future privacy policy.

Auth state:

- `AuthProvider` is mounted in `pages/_app.tsx`.
- Session persistence uses Supabase Auth client persistence.
- `/account` redirects unauthenticated users to `/login?next=/account`.

Still intentionally deferred:

- SHIM Diary cloud storage migration.
- Diary edit/update/delete through Supabase.
- Account deletion.
- Full account settings.
- Final legal policy text.

## Phase 3 Implementation Notes

Phase 3 moved SHIM Diary records from final local browser storage to authenticated Supabase storage.

Implemented in `/diary`:

- Auth-aware Diary screen using the global `AuthProvider`.
- Unauthenticated users can still write a draft, but saving prompts login instead of creating a local final record.
- Draft text is preserved in `localStorage` under `shim_ai_diary_draft` until saved.
- Authenticated users can create Diary entries in `diary_entries`.
- Diary list loads from Supabase for the current authenticated user.
- Records are sorted by `created_at` newest first.
- Records can be edited and deleted.
- Delete uses an optimistic UI update and restores the previous list if the server request fails.
- Logout or user switch clears visible Diary entries before loading another user's data.
- Existing legacy records from `shim_ai_diary_entries` can be imported after login.

Legacy migration behavior:

- The app detects valid legacy local records.
- The user must click "기록 가져오기".
- Each legacy record is inserted with `migration_key = legacy.id`.
- Existing `migration_key` values are checked before insert to reduce duplicate uploads.
- Local legacy data is not automatically deleted.
- After migration, the current prompt is hidden for that session.

Deferred to later hardening:

- Editing the saved emotion code/label from the edit UI.
- Realtime multi-device auto-refresh.
- Explicit offline queueing.
- Detailed per-row migration partial failure display.
- Full account deletion and consent management UI.

## Phase 4 Implementation Notes

Phase 4 expanded account settings and added server-side account deletion.

Implemented in `/account`:

- Current email display.
- Nickname update through `profiles`.
- Marketing consent update or creation through `user_consents`.
- Terms and privacy links.
- Password change through Supabase Auth.
- Logout.
- Account deletion confirmation UI requiring the exact text `계정 삭제`.

Implemented API route:

- `/api/account/delete`

Deletion behavior:

- Requires `Authorization: Bearer <access_token>`.
- Verifies the current user with Supabase Auth on the server.
- Requires confirmation text.
- Deletes `diary_entries`, `user_consents`, and `profiles`.
- Deletes the Supabase auth user with the service role key.
- Never exposes the service role key to browser code.

Still deferred:

- Recent-login or password reauthentication before deletion.
- Email change.
- Full legal text finalization.
- Additional future user data tables for SHIM Report once Report storage exists.

## Phase 5 Validation Notes

Phase 5 focused on verification, documentation, and deployment readiness.

Added:

- `docs/phase-5-validation-checklist.md`

Verified by static checks:

- TypeScript build safety.
- Next.js production build.
- Service role key is separated into server helpers/API routes.
- Diary content is not logged by new Diary code.
- Local env files are ignored by `.gitignore`.

Manual verification still requires a configured Supabase project with real test users. Follow the Phase 5 checklist before production deployment.
