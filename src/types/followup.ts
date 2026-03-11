export type FollowupStatus = "pending" | "approved" | "dismissed";

export type FollowupCategory = "urgent" | "lead" | "invoice" | "personal";

export type FollowupCategorySource = "rule" | "ai" | "manual";

export interface LeadFollowupTask {
  id: string;
  lead_email: string;
  reason: string;
  last_body: string;
  ai_suggested_message: string;
  status: FollowupStatus;
  category?: FollowupCategory | null;
  category_confidence?: number | null;
  category_source?: FollowupCategorySource | null;
  thread_id?: string | null;
  created_at: string;
  // Inbox enrichment fields (optional/nullable on older rows)
  is_read?: boolean | null;
  read_at?: string | null;
  has_reply?: boolean | null;
  last_reply_at?: string | null;
}

// Thread message structure (for displaying email thread history)
export interface ThreadMessage {
  id: string;
  from: string; // Raw "From" header (fallback if sender_name/sender_email not available)
  to: string;
  subject: string;
  body: string;
  date: string; // ISO 8601 timestamp (converted from Gmail's internalDate milliseconds)
  isFromMe?: boolean; // Derived from Gmail SENT label (more reliable than email comparison)
  sender_name?: string; // Extracted from "From" header (e.g., "Lois de Armas")
  sender_email?: string; // Clean email from "From" header (e.g., "lois@finehome.pro")
  is_unread?: boolean; // Derived from Gmail UNREAD label
}
