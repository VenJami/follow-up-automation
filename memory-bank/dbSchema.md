## Database / Schema Notes (Supabase)

### Tables used by the app

#### `allowed_users`
Used for allowlist authorization checks.

- **Required columns**
  - `email` (string, unique)

#### `lead_followup_tasks`
Displayed on `/dashboard` (only `status = "pending"` are loaded).

- **Required columns (as used by UI/types)**
  - `id` (string/uuid)
  - `lead_email` (string)
  - `reason` (string)
  - `last_body` (string)
  - `ai_suggested_message` (string)
  - `status` (enum-ish text): `pending | approved | dismissed`
  - `category` (nullable text): `urgent | lead | invoice | personal`
  - `category_confidence` (nullable number)
  - `category_source` (nullable text): `rule | ai | manual`
  - `thread_id` (nullable text)
  - `created_at` (timestamp)
  - `is_read` (boolean, default `false`) — whether the user has expanded this card
  - `read_at` (nullable timestamp) — when it was first marked read
  - `has_reply` (boolean, default `false`) — whether a reply has been sent in this thread
  - `last_reply_at` (nullable timestamp) — timestamp of the last reply considered relevant

> Supabase migration sketch:
>
> ```sql
> alter table lead_followup_tasks
>   add column if not exists is_read boolean not null default false,
>   add column if not exists read_at timestamptz null,
>   add column if not exists has_reply boolean not null default false,
>   add column if not exists last_reply_at timestamptz null;
> ```

#### `review_invites`
Stores invite recipients + their platform choice and consent.

- **Key columns (as used by app)**
  - `token` (text, primary key)
  - `first_name` (text)
  - `last_name` (text)
  - `email` (text)
  - `phone` (text, nullable)
  - `consent` (boolean)
  - `status` (text): `started | completed`
  - `selected_platform` (text, nullable): `google | facebook | internal | video`
  - `created_at` / `updated_at` / `completed_at` (timestamps)

#### `reviews`
Stores the written review body + star rating.

- **Key columns (as used by app)**
  - `id` (uuid, primary key)
  - `invite_token` (text FK → `review_invites.token`)
  - `rating` (int 1–5)
  - `body` (text)
  - `image_url` (text, nullable)
  - `created_at` (timestamp)

### RLS expectations (not defined in repo)
The app assumes the logged-in user can:
- Read pending tasks from `lead_followup_tasks`
- Update `status` and `category` for tasks
- Read `allowed_users` to validate their email

For the review funnel, decide on one of these approaches:
- Allow public/anon `select` for a **safe subset** of `reviews` (e.g. only joined invites with `consent = true` + `status = completed`), or
- Keep `reviews` locked down and serve `/reviews` via a server-only admin client with strict filters.

In practice, implement RLS so only allowlisted users can read/update tasks.

