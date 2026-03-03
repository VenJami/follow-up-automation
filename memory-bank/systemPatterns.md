## System Patterns

### High-level architecture
- **Next.js App Router** under `src/app/`
- **Server components** for pages that fetch data (`/dashboard`)
- **Server Actions** for mutations (`src/app/dashboard/actions.ts`)
- **Route Handler** for OAuth callback (`src/app/auth/callback/route.ts`)
- **Supabase** used for auth + Postgres tables (via `@supabase/ssr` + `@supabase/supabase-js`)

### Auth & authorization pattern (important)
- **Authentication**: Supabase OAuth (Google)
- **Authorization**: allowlist check against `allowed_users` table
- **Gate helper**: `getUserOrRedirect()` in `src/lib/auth.ts`
  - Redirects to `/login` if unauthenticated
  - Redirects to `/not-authorized` if not on allowlist
- **Enforcement points**:
  - Dashboard page server component calls `getUserOrRedirect()`
  - All server actions call `getUserOrRedirect()` before mutating data
  - OAuth callback route handler does an immediate allowlist check post-login

### Supabase client split
- **Browser client** (`src/lib/supabaseClient.ts`): used in client components for login/signout.
- **Server client** (`src/lib/supabaseServer.ts`): used in server components/actions for DB reads/writes.
- **Cookie behavior**:
  - In `createSupabaseServerClient()`, cookie writes are intentionally **NO-OP** in server components to avoid Next.js runtime errors.
  - Cookie writes are allowed/used in the **route handler** (`/auth/callback`) where Next permits setting cookies.

### Data model pattern (app-facing)
- Follow-ups live in a single table: `lead_followup_tasks`.
- The dashboard only shows tasks with `status = "pending"`.
- Categories drive tabs: `urgent | lead | invoice | personal`.
- Category normalization: if `category` is null, the UI treats it as `"lead"` for tab grouping.

### UI interaction pattern
- **Approve**:
  - Copies the suggested reply to clipboard
  - Opens Gmail:
    - If `thread_id` exists, opens Gmail thread/search view
    - Otherwise opens Gmail compose with `to/subject/body`
  - Marks task as `approved` in the background via server action + revalidate
- **Dismiss**: marks `dismissed`
- **Move to**: updates `category`

