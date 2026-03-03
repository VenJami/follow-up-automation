import type { LeadFollowupTask, FollowupCategory } from "@/types/followup";
import { TabEmptyState } from "./TabEmptyState";
import { FollowUpCard } from "./FollowUpCard";

interface FollowUpListProps {
  followups: LeadFollowupTask[];
  category: FollowupCategory;
  userEmail?: string;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
}

export function FollowUpList({
  followups,
  category,
  userEmail,
  selectedIds = [],
  onToggleSelect,
}: FollowUpListProps) {
  if (!followups.length) {
    return <TabEmptyState category={category} />;
  }

  return (
    <section className="space-y-3">
      {followups.map((followup, index) => (
        <div
          key={followup.id}
          className="animate-in fade-in slide-in-from-bottom-2"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: "both",
          }}
        >
          <FollowUpCard
            followup={followup}
            userEmail={userEmail}
            selected={selectedIds.includes(followup.id)}
            onToggleSelected={
              onToggleSelect ? () => onToggleSelect(followup.id) : undefined
            }
          />
        </div>
      ))}
    </section>
  );
}

