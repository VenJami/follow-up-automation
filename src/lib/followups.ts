import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { LeadFollowupTask, FollowupCategory } from "@/types/followup";

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
