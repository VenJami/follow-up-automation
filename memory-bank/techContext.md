## Tech Context

### Stack
- **Next.js 16 (App Router)** + **TypeScript**
- **React 19**
- **Tailwind CSS v4** (via `@import "tailwindcss";` in `src/app/globals.css`)
- **Supabase**:
  - `@supabase/ssr` for Next-compatible browser/server clients
  - `@supabase/supabase-js` for underlying API

### Key directories
- `src/app/`: routes, pages, route handlers, server actions
- `src/components/`: UI components (client-heavy dashboard)
- `src/lib/`: auth gate + supabase clients + follow-up queries
- `src/types/`: shared types (follow-up task shape)

### Environment variables
Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional:
- `NEXT_PUBLIC_SITE_URL` (used to build OAuth redirect URL on login)

### Local development
- Install: `npm install`
- Run dev: `npm run dev` (Next dev server)
- Lint: `npm run lint`

### Supabase tables (expected)
- `allowed_users`
  - At minimum: `email` (used for allowlist checks)
- `lead_followup_tasks`
  - Used by dashboard inbox (see `memory-bank/dbSchema.md` for fields used by UI)

