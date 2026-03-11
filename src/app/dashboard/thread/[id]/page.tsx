import { getUserOrRedirect } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { ThreadPageContent } from "@/components/ThreadPageContent";
import type { ThreadMessage } from "@/types/followup";
import { notFound } from "next/navigation";

interface ThreadPageProps {
  params: Promise<{ id: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { id } = await params;
  const user = await getUserOrRedirect();

  // Fetch the follow-up task
  const supabase = await createSupabaseServerClient();
  const { data: followup, error } = await supabase
    .from("lead_followup_tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !followup) {
    notFound();
  }

  // TODO: Fetch thread messages from Supabase or n8n
  // For now, we'll pass empty array and document what's needed
  // See memory-bank/thread-data-requirements.md for data structure
  const threadMessages: ThreadMessage[] = [];

  return (
    <ThreadPageContent
      followup={followup}
      threadMessages={threadMessages}
      userEmail={user.email ?? ""}
    />
  );
}
