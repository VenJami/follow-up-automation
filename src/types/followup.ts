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
  created_at: string;
}

