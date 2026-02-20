"use client";

import type { FollowupCategory } from "@/types/followup";

interface InboxTabsProps {
  activeTab: FollowupCategory;
  onTabChange: (tab: FollowupCategory) => void;
  counts: Record<FollowupCategory, number>;
}

const TAB_ORDER: FollowupCategory[] = ["urgent", "lead", "invoice", "personal"];

const TAB_CONFIG: Record<
  FollowupCategory,
  { label: string; badge?: boolean }
> = {
  urgent: { label: "Urgent", badge: true },
  lead: { label: "Leads" },
  invoice: { label: "Admin" },
  personal: { label: "Personal / Other" },
};

export function InboxTabs({
  activeTab,
  onTabChange,
  counts,
}: InboxTabsProps) {
  return (
    <div className="border-b border-slate-200">
      <nav
        className="-mb-px flex gap-1 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TAB_ORDER.map((tab) => {
          const config = TAB_CONFIG[tab];
          const count = counts[tab] || 0;
          const isActive = activeTab === tab;
          const isUrgent = tab === "urgent";

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`
                relative flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors transition-transform active:scale-95
                ${
                  isActive
                    ? isUrgent
                      ? "border-amber-500 text-amber-700"
                      : "border-sky-500 text-sky-600"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }
              `}
            >
              <span>{config.label}</span>
              {count > 0 && (
                <span
                  className={`
                    inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
                    ${
                      isUrgent
                        ? "bg-amber-100 text-amber-700"
                        : isActive
                          ? "bg-sky-100 text-sky-700"
                          : "bg-slate-100 text-slate-600"
                    }
                  `}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
