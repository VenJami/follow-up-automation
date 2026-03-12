import { getUserOrRedirect } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getThreadMessages } from "@/lib/followups";
import { ThreadPageContent } from "@/components/ThreadPageContent";
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

  // Fetch thread messages from Supabase
  const threadMessages = await getThreadMessages(followup.id);

  return (
    <ThreadPageContent
      followup={followup}
      threadMessages={threadMessages}
      userEmail={user.email ?? ""}
    />
  );
}
