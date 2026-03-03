## Product Context

### Why this exists
Following up on email threads is important but cognitively expensive. This app provides a **single place** to review follow-ups that were prepared automatically elsewhere (rules/AI), so the user can make quick decisions without living in email.

### Problem it solves
- **Decision fatigue**: reduces “what should I reply?” by surfacing a suggested message.
- **Inbox noise**: separates “follow-up tasks” from the email inbox itself.
- **Prioritization**: simple category tabs (Urgent, Leads, Admin, Personal/Other).

### Target users
- A small, known group of users (enforced via **Supabase auth + allowlist**).

### Key UX principles
- **Calm, fast**: minimal clicks, skeleton loading, small animations.
- **Human-in-the-loop**: user controls the final email; app does not send email.
- **Safety rails**: deny non-allowlisted accounts immediately and sign them out.

### Core workflow (happy path)
- **Sign in** with Google (`/login` → Supabase OAuth)
- **Callback** (`/auth/callback`) exchanges code → session cookies → allowlist check
- **Review** pending follow-ups (`/dashboard`)
- **Approve**: copy suggested reply + open Gmail (thread or compose) + mark “approved”
- **Dismiss**: mark “dismissed”
- **Move to**: change category (manual re-triage)

