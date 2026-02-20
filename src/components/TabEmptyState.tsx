import type { FollowupCategory } from "@/types/followup";

interface TabEmptyStateProps {
  category: FollowupCategory;
}

const EMPTY_MESSAGES: Record<FollowupCategory, string> = {
  urgent: "No urgent follow-ups right now.",
  lead: "No lead follow-ups right now.",
  invoice: "No invoice or admin follow-ups right now.",
  personal: "No personal follow-ups right now.",
};

export function TabEmptyState({ category }: TabEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm text-slate-600">{EMPTY_MESSAGES[category]}</p>
    </div>
  );
}
