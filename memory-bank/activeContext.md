## Active Context

### Current focus
- Establish a reliable **Memory Bank** so future sessions can immediately understand:
  - Auth + allowlist enforcement
  - Follow-up task lifecycle and categories
  - Supabase/Next.js integration constraints (cookies + server actions)

### What’s true in the codebase today
- **OAuth login** via Supabase Google provider (`/login` → `/auth/callback`)
- **Allowlist gate** using `allowed_users.email`
- **Dashboard** is protected server-side and fetches pending tasks from `lead_followup_tasks`
- Mutations happen through **server actions** and call `revalidatePath("/dashboard")`
- Approve flow is “copy + open Gmail” (email sending is not handled by app)

### Open questions / likely external dependencies
- How follow-up tasks are **generated** and inserted into `lead_followup_tasks` (pipeline not present here).
- Exact Supabase RLS policies and indexes (not included in repo).

### Suggested next steps (optional enhancements)
- Add a project-specific `README.md` section documenting required Supabase tables/RLS and `.env.local`.
- Add a `memory-bank/deployment.md` describing Vercel/Supabase deployment setup.
- Consider removing debug `console.log` statements in `FollowUpCard` once Gmail thread linking is stable.

