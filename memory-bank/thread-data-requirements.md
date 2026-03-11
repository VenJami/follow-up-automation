# Thread Data Requirements

## Overview

To display email threads in the dashboard and thread page, we need thread message data. This document outlines what data is required per thread.

## Required Thread Message Structure

Each thread message should include:

```typescript
interface ThreadMessage {
  id: string;              // Unique message ID (Gmail message ID or internal ID)
  from: string;            // Raw "From" header (fallback if sender_name/sender_email not available)
  to: string;              // Recipient email address
  subject: string;         // Email subject line
  body: string;            // Email body text (plain text or HTML stripped)
  date: string;            // ISO 8601 timestamp (e.g., "2024-01-15T10:30:00Z")
  isFromMe?: boolean;      // Derived from Gmail SENT label (more reliable than email comparison)
  sender_name?: string;    // Extracted from "From" header (e.g., "Lois de Armas")
  sender_email?: string;   // Clean email from "From" header (e.g., "lois@finehome.pro")
  is_unread?: boolean;     // Derived from Gmail UNREAD label
}
```

## Data Source Options

### Option 1: Store in Supabase (Recommended)

**Table: `thread_messages`**

```sql
create table thread_messages (
  id uuid primary key default gen_random_uuid(),
  followup_task_id uuid not null references lead_followup_tasks(id) on delete cascade,
  gmail_message_id text not null,
  from_header text not null,           -- Raw "From" header (fallback)
  from_email text,                     -- Clean email extracted from "From" header
  from_name text,                      -- Name extracted from "From" header (e.g., "Lois de Armas")
  to_email text not null,
  subject text not null,
  body text not null,
  sent_at timestamptz not null,        -- Converted from Gmail's internalDate (milliseconds → ISO)
  is_from_me boolean not null default false,  -- Derived from Gmail SENT label
  is_unread boolean not null default false,   -- Derived from Gmail UNREAD label
  created_at timestamptz not null default now(),
  unique(followup_task_id, gmail_message_id)
);

create index idx_thread_messages_followup on thread_messages(followup_task_id);
```

**When to populate:**
- When n8n creates a follow-up task, also fetch and store thread messages
- Or have a separate n8n workflow that syncs thread messages periodically

### Option 2: Fetch on Demand via n8n

**n8n Webhook Endpoint:**
- GET `/webhook/get-thread-messages?threadId={threadId}`
- Returns array of `ThreadMessage` objects

**When to call:**
- When user opens thread view in dashboard
- When user navigates to thread page

## Example Thread Message Data

```json
[
  {
    "id": "msg-001",
    "from": "Lois de Armas <lois@finehome.pro>",
    "to": "you@example.com",
    "subject": "Question about pricing",
    "body": "Hi, I'm interested in your services. Can you provide pricing?",
    "date": "2024-01-15T10:00:00Z",
    "isFromMe": false,
    "sender_name": "Lois de Armas",
    "sender_email": "lois@finehome.pro",
    "is_unread": false
  },
  {
    "id": "msg-002",
    "from": "you@example.com",
    "to": "lois@finehome.pro",
    "subject": "Re: Question about pricing",
    "body": "Thanks for reaching out! Here's our pricing...",
    "date": "2024-01-15T11:00:00Z",
    "isFromMe": true,
    "sender_name": null,
    "sender_email": "you@example.com",
    "is_unread": false
  },
  {
    "id": "msg-003",
    "from": "Lois de Armas <lois@finehome.pro>",
    "to": "you@example.com",
    "subject": "Re: Question about pricing",
    "body": "Great, I'd like to proceed. What's the next step?",
    "date": "2024-01-16T09:00:00Z",
    "isFromMe": false,
    "sender_name": "Lois de Armas",
    "sender_email": "lois@finehome.pro",
    "is_unread": true
  }
]
```

## Implementation Notes

1. **Ordering:** Messages should be ordered chronologically (oldest first)
2. **Body Format:** Plain text preferred; strip HTML if needed
3. **Subject:** Usually all messages in a thread share the same subject (with "Re:" prefix)
4. **isFromMe Detection:** Use Gmail's `SENT` label (more reliable than email comparison)
   - Check if message labels include `"SENT"` → `is_from_me = true`
5. **Date Conversion:** Gmail's `internalDate` is in milliseconds
   - Convert: `new Date(Number(internalDate)).toISOString()`
6. **From Header Parsing:** Extract name and email from "From" header
   - Example: `"Lois de Armas <lois@finehome.pro>"`
   - Parse: `sender_name = "Lois de Armas"`, `sender_email = "lois@finehome.pro"`
   - If no name: `sender_name = null`, `sender_email = "lois@finehome.pro"`
7. **Unread Detection:** Check if message labels include `"UNREAD"` → `is_unread = true`

## n8n Integration

If using n8n to populate thread messages:

1. **Gmail Node:** Use "Get Thread" or "List Messages in Thread"
2. **Parse Messages:**
   - Extract `from` header (raw)
   - Parse `sender_name` and `sender_email` from "From" header
   - Extract `to`, `subject`, `body`
   - Convert `internalDate` (milliseconds) → ISO string: `new Date(Number(internalDate)).toISOString()`
   - Check labels: `is_from_me = labels.includes("SENT")`, `is_unread = labels.includes("UNREAD")`
3. **Store in Supabase:** Use Supabase node or HTTP Request node to insert into `thread_messages` table
4. **From Header Parsing Example (n8n Code/Function node):**
   ```javascript
   const fromHeader = $json.from; // e.g., "Lois de Armas <lois@finehome.pro>"
   const nameMatch = fromHeader.match(/^(.+?)\s*<(.+?)>$/);
   const sender_name = nameMatch ? nameMatch[1].trim() : null;
   const sender_email = nameMatch ? nameMatch[2].trim() : fromHeader.trim();
   ```

## Current Status

- ✅ UI components ready (`ThreadView`, `ThreadPageContent`)
- ✅ Types defined (`ThreadMessage` interface)
- ⏳ Thread messages not yet populated (empty array passed to components)
- ⏳ Need to implement data fetching (Supabase query or n8n webhook)
