import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { LeadFollowupTask, FollowupCategory, ThreadMessage } from "@/types/followup";

const TABLE_NAME = "lead_followup_tasks";

export async function getPendingFollowups(): Promise<LeadFollowupTask[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  // Small artificial delay in development so the loading skeleton is visible
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  if (error) {
    console.error("Supabase error loading follow-ups", error);
    // In dev, fail soft and show an empty list instead of crashing the page.
    return [];
  }

  return (data ?? []) as LeadFollowupTask[];
}

export async function approveFollowup(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    console.error("Supabase error approving follow-up", error);
  }
}

export async function dismissFollowup(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ status: "dismissed" })
    .eq("id", id);

  if (error) {
    console.error("Supabase error dismissing follow-up", error);
  }
}

export async function moveToCategory(
  id: string,
  category: FollowupCategory
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ category })
    .eq("id", id);

  if (error) {
    console.error("Supabase error moving follow-up to category", error);
  }
}

export async function markFollowupRead(
  id: string,
  isRead: boolean
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const payload =
    isRead === true
      ? { is_read: true, read_at: new Date().toISOString() }
      : { is_read: false, read_at: null };

  const { error } = await supabase.from(TABLE_NAME).update(payload).eq("id", id);

  if (error) {
    console.error("Supabase error marking follow-up read/unread", error);
  }
}

export async function bulkApproveFollowups(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ status: "approved" })
    .in("id", ids);

  if (error) {
    console.error("Supabase error bulk-approving follow-ups", error);
  }
}

export async function bulkDismissFollowups(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ status: "dismissed" })
    .in("id", ids);

  if (error) {
    console.error("Supabase error bulk-dismissing follow-ups", error);
  }
}

export async function bulkMoveToCategory(
  ids: string[],
  category: FollowupCategory
): Promise<void> {
  if (ids.length === 0) return;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ category })
    .in("id", ids);

  if (error) {
    console.error("Supabase error bulk-moving follow-ups to category", error);
  }
}

export async function bulkMarkReadState(
  ids: string[],
  isRead: boolean
): Promise<void> {
  if (ids.length === 0) return;
  const supabase = await createSupabaseServerClient();
  const payload =
    isRead === true
      ? { is_read: true, read_at: new Date().toISOString() }
      : { is_read: false, read_at: null };

  const { error } = await supabase
    .from(TABLE_NAME)
    .update(payload)
    .in("id", ids);

  if (error) {
    console.error("Supabase error bulk-updating read state", error);
  }
}

/**
 * Parses "From" header to extract sender name and email.
 * Example: "Lois de Armas <lois@finehome.pro>" → { name: "Lois de Armas", email: "lois@finehome.pro" }
 */
function parseFromHeader(fromHeader: string): {
  name: string | null;
  email: string;
} {
  if (!fromHeader) return { name: null, email: "" };

  // Try to match "Name <email@domain.com>" format
  const match = fromHeader.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return {
      name: match[1].trim() || null,
      email: match[2].trim(),
    };
  }

  // If no angle brackets, assume the whole thing is the email
  return {
    name: null,
    email: fromHeader.trim(),
  };
}

/**
 * Fetches thread messages for a specific follow-up task.
 * Maps database columns to ThreadMessage interface.
 */
export async function getThreadMessages(
  followupTaskId: string
): Promise<ThreadMessage[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("thread_messages")
    .select("*")
    .eq("followup_task_id", followupTaskId)
    .order("sent_at", { ascending: true }); // Oldest first

  if (error) {
    console.error("Supabase error loading thread messages", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Map database columns to ThreadMessage interface
  return data.map((row: any) => {
    const fromParsed = parseFromHeader(row.from_email || "");
    const sentAt = row.sent_at
      ? new Date(row.sent_at).toISOString()
      : new Date().toISOString();

    return {
      id: row.gmail_message_id || row.id,
      from: row.from_email || "", // Raw header as fallback
      to: row.to_email || "",
      subject: row.subject || "",
      body: row.body || "",
      date: sentAt,
      isFromMe: row.is_from_me ?? false,
      sender_name: fromParsed.name,
      sender_email: fromParsed.email,
      is_unread: row.is_unread ?? false,
    } as ThreadMessage;
  });
}