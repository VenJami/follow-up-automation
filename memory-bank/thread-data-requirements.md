# Thread Data Requirements

## Overview

To display email threads in the dashboard and thread page, we need thread message data. This document outlines what data is required per thread.

## Required Thread Message Structure

Each thread message should include:

```typescript
interface ThreadMessage {
  id: string;              // Unique message ID (Gmail message ID or internal ID)
  from: string;           // Sender email address (e.g., "client@example.com" or "you@example.com")
  to: string;             // Recipient email address
  subject: string;        // Email subject line
  body: string;           // Email body text (plain text or HTML stripped)
  date: string;           // ISO 8601 timestamp (e.g., "2024-01-15T10:30:00Z")
  isFromMe?: boolean;     // true if sent by the authenticated user, false if from client
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
  from_email text not null,
  to_email text not null,
  subject text not null,
  body text not null,
  sent_at timestamptz not null,
  is_from_me boolean not null default false,
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
    "from": "client@example.com",
    "to": "you@example.com",
    "subject": "Question about pricing",
    "body": "Hi, I'm interested in your services. Can you provide pricing?",
    "date": "2024-01-15T10:00:00Z",
    "isFromMe": false
  },
  {
    "id": "msg-002",
    "from": "you@example.com",
    "to": "client@example.com",
    "subject": "Re: Question about pricing",
    "body": "Thanks for reaching out! Here's our pricing...",
    "date": "2024-01-15T11:00:00Z",
    "isFromMe": true
  },
  {
    "id": "msg-003",
    "from": "client@example.com",
    "to": "you@example.com",
    "subject": "Re: Question about pricing",
    "body": "Great, I'd like to proceed. What's the next step?",
    "date": "2024-01-16T09:00:00Z",
    "isFromMe": false
  }
]
```

## Implementation Notes

1. **Ordering:** Messages should be ordered chronologically (oldest first)
2. **Body Format:** Plain text preferred; strip HTML if needed
3. **Subject:** Usually all messages in a thread share the same subject (with "Re:" prefix)
4. **isFromMe Detection:** Compare `from` email with authenticated user's email, or use Gmail API's `from` field which includes the authenticated account

## n8n Integration

If using n8n to populate thread messages:

1. **Gmail Node:** Use "Get Thread" or "List Messages in Thread"
2. **Parse Messages:** Extract `from`, `to`, `subject`, `body`, `date`
3. **Store in Supabase:** Use Supabase node or HTTP Request node to insert into `thread_messages` table
4. **Set isFromMe:** Compare sender email with your Gmail account email

## Current Status

- ✅ UI components ready (`ThreadView`, `ThreadPageContent`)
- ✅ Types defined (`ThreadMessage` interface)
- ⏳ Thread messages not yet populated (empty array passed to components)
- ⏳ Need to implement data fetching (Supabase query or n8n webhook)
