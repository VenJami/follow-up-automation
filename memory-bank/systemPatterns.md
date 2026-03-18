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

### Review funnel pattern
- **Invites**: `review_invites` keyed by `token` (stores contact + consent + selected_platform + status).
- **Reviews**: `reviews` rows reference `review_invites` via `invite_token` FK.
- **Relationship shape gotcha**:
  - `reviews -> review_invites` is many-to-one, so `review_invites(...)` comes back as a **single object** (or null), not an array.
  - Treating it like an array causes UI to show “Anonymous”.
- **Public board**:
  - `/reviews` is a server component that queries Supabase on request (`dynamic = "force-dynamic"`, `revalidate = 0`)
  - Filters to `review_invites.consent = true` and `review_invites.status = "completed"`

### UI interaction pattern
- **Approve**:
  - Copies the suggested reply to clipboard
  - Opens Gmail:
    - If `thread_id` exists, opens Gmail thread/search view
    - Otherwise opens Gmail compose with `to/subject/body`
  - Marks task as `approved` in the background via server action + revalidate
- **Dismiss**: marks `dismissed`
- **Move to**: updates `category`

