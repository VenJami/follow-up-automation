import type { LeadFollowupTask, FollowupCategory } from "@/types/followup";
import { TabEmptyState } from "./TabEmptyState";
import { FollowUpCard } from "./FollowUpCard";

interface FollowUpListProps {
  followups: LeadFollowupTask[];
  category: FollowupCategory;
  userEmail?: string;
}

export function FollowUpList({ followups, category, userEmail }: FollowUpListProps) {
  if (!followups.length) {
    return <TabEmptyState category={category} />;
  }

  return (
    <section className="space-y-3">
      {followups.map((followup) => (
        <FollowUpCard key={followup.id} followup={followup} userEmail={userEmail} />
      ))}
    </section>
  );
}

