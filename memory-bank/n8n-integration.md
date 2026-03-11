# n8n Integration Guide

## Overview

The app delegates Gmail email sending to n8n via a secure webhook. This keeps Gmail OAuth credentials centralized in n8n and avoids managing tokens in the Next.js app.

## Environment Variables

Add these to your `.env.local` (or deployment environment):

```bash
# Required: n8n webhook URL for sending replies
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/send-reply

# Optional: Secret for webhook authentication (recommended)
N8N_WEBHOOK_SECRET=your-secret-key-here
```

## n8n Webhook Payload

When a user clicks "Send Reply" in the dashboard, the app sends a POST request to your n8n webhook with this payload:

```json
{
  "followupId": "uuid-of-followup-task",
  "threadId": "gmail-thread-id",
  "replyBody": "The user's reply message text",
  "userEmail": "user@example.com",
  "senderEmail": "authenticated-user@example.com"
}
```

## n8n Workflow Requirements

Your n8n workflow should:

1. **Receive webhook** (Webhook node)
   - Accept POST requests
   - Extract: `followupId`, `threadId`, `replyBody`, `userEmail`

2. **Send email via Gmail** (Gmail node)
   - Use your configured Gmail credentials
   - Set `threadId` to maintain thread continuity
   - Include `In-Reply-To` and `References` headers (Gmail API handles this automatically when `threadId` is set)
   - Body: `{{ $json.replyBody }}`
   - To: `{{ $json.userEmail }}` (or extract from thread if needed)

3. **Update Supabase** (HTTP Request or Supabase node)
   - Update `lead_followup_tasks` table:
     - Set `has_reply = true`
     - Set `last_reply_at = NOW()`
     - Optionally set `status = 'approved'` if you want to auto-approve after sending

## Thread Messages (Future Enhancement)

Currently, the `ThreadView` component accepts `threadMessages` as a prop but they're not automatically fetched. To populate thread messages:

**Option 1: Store in Supabase**
- Have n8n store thread messages in a `thread_messages` table when creating follow-up tasks
- Query them in the dashboard and pass to `FollowUpCard`

**Option 2: n8n GET endpoint**
- Create an n8n webhook that accepts `threadId` and returns thread messages
- Call it from a server action when user opens thread view

## Security Notes

- The webhook secret (`N8N_WEBHOOK_SECRET`) is sent as `X-Webhook-Secret` header
- Validate this in your n8n webhook node
- The app already enforces authentication (`getUserOrRedirect()`) before calling the webhook
- Consider rate limiting in n8n to prevent abuse
