"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LeadFollowupTask, FollowupCategory } from "@/types/followup";
import { InboxTabs } from "./InboxTabs";
import { Header } from "./Header";
import { FollowUpList } from "./FollowUpList";

interface DashboardContentProps {
  followups: LeadFollowupTask[];
  userEmail: string;
}

export function DashboardContent({ followups, userEmail }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<FollowupCategory>("urgent");
  const [isRefreshing, startRefreshTransition] = useTransition();
  const router = useRouter();

  function handleRefresh() {
    startRefreshTransition(() => {
      router.refresh();
    });
  }

  function getNormalizedCategory(f: LeadFollowupTask): FollowupCategory {
    return (f.category ?? "lead") as FollowupCategory;
  }

  // Filter follow-ups by active tab
  const filteredFollowups = useMemo(() => {
    return followups.filter(
      (f) => f.status === "pending" && getNormalizedCategory(f) === activeTab
    );
  }, [followups, activeTab]);

  // Calculate counts per tab
  const tabCounts = useMemo(() => {
    const pending = followups.filter((f) => f.status === "pending");
    const counts: Record<FollowupCategory, number> = {
      urgent: pending.filter((f) => getNormalizedCategory(f) === "urgent").length,
      lead: pending.filter((f) => getNormalizedCategory(f) === "lead").length,
      invoice: pending.filter((f) => getNormalizedCategory(f) === "invoice").length,
      personal: pending.filter((f) => getNormalizedCategory(f) === "personal").length,
    };
    return counts;
  }, [followups]);

  const totalPending = useMemo(
    () => followups.filter((f) => f.status === "pending").length,
    [followups]
  );

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <div className="sticky top-0 z-20 -mx-4 mb-4 bg-slate-50/95 px-4 pb-4 backdrop-blur">
          <div className="flex flex-col gap-4">
            <Header
              count={totalPending}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              userEmail={userEmail}
            />
            <InboxTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={tabCounts}
            />
          </div>
        </div>
        {isRefreshing ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="h-3 w-56 rounded bg-slate-100" />
                  </div>
                  <div className="space-y-2 rounded-lg bg-slate-50 px-3 py-2">
                    <div className="h-3 w-24 rounded bg-slate-200" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-5/6 rounded bg-slate-100" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-24 rounded bg-slate-100" />
                    <div className="h-3 w-16 rounded bg-slate-100" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <div className="h-7 w-20 rounded-md bg-slate-100" />
                    <div className="h-7 w-20 rounded-md bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <FollowUpList
            followups={filteredFollowups}
            category={activeTab}
            userEmail={userEmail}
          />
        )}
      </div>
    </main>
  );
}
