## Project Brief — Follow-Up Inbox

### What this is
**Follow-Up Inbox** is a small web app that shows a calm, categorized inbox of **AI-prepared follow-up messages** derived from email conversations. A user reviews each item and either:

- **Approves** it (copies the suggested reply and opens Gmail), or
- **Dismisses** it (marks it not needed), or
- **Re-categorizes** it (moves it to a different tab/category).

### Primary goals
- **Fast review loop**: approve/dismiss with minimal friction.
- **Calm UI**: clear status, light animations/skeletons, simple tabbed categories.
- **Secure access**: only authenticated users on an **allowlist** can access the dashboard.

### Non-goals (currently out of scope)
- Generating follow-ups from email threads (ingestion/AI pipeline is not in this repo).
- Sending emails directly from the app (the app opens Gmail; user sends there).
- Multi-tenant org management / admin panel (allowlist is table-driven).

### Core user journey
- Visit `/` → click “Get Started”
- `/login` → Google OAuth via Supabase
- `/auth/callback` → exchange code for session, enforce allowlist
- `/dashboard` → review pending follow-ups by category

### Success criteria
- A signed-in allowlisted user can reliably see pending follow-ups.
- Approve/dismiss updates the backend and the UI reflects changes after refresh/revalidate.
- Gmail opens to the correct thread (when `thread_id` exists) or compose window.

