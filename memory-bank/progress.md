## Progress

### What works
- **Public landing page** (`/`) with CTA to login
- **Google OAuth login** via Supabase (`/login`)
- **OAuth callback** exchanges code for session and sets cookies (`/auth/callback`)
- **Authorization** via allowlist table (`allowed_users`)
- **Dashboard inbox**:
  - Fetches `pending` follow-ups from Supabase
  - Tabbed category UI (Urgent / Leads / Admin / Personal)
  - Approve/Dismiss/Move-to interactions wired to server actions
  - Refresh behavior via `router.refresh()` and `revalidatePath("/dashboard")`
- **Sign out** on dashboard and forced signout for non-authorized users
- **Reviews**:
  - Internal review submissions stored in `reviews` (linked to `review_invites`)
  - Dashboard review overview at `/dashboard/reviews`
  - Public review board at `/reviews` reading from Supabase (no mock data)

### What’s missing / not in this repo (yet)
- Task ingestion/generation (rules/AI pipeline producing `lead_followup_tasks`)
- Some database migrations/schema files and RLS policy definitions (review funnel migration exists under `supabase/migrations/`)
- Observability and error reporting beyond `console.error`

### Known risks / gotchas
- Supabase cookie writes are **skipped** in server components by design; rely on the route handler and server actions for contexts that can set cookies.
- Dashboard filters by `status === "pending"` and normalizes null categories to `"lead"`; category data quality affects what users see.
- Public `/reviews` reads from Supabase using the anon server client; if RLS is enabled, you must explicitly allow public `select` (or switch `/reviews` to a server-only admin client with strict filtering).

