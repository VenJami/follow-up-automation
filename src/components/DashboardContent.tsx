"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show welcome animation if coming from auth callback
  useEffect(() => {
    const fromAuth = searchParams.get("welcome");
    if (fromAuth === "true") {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

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
      {/* Welcome animation */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-gradient-to-br from-sky-500 to-blue-600 p-4">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-slate-900">
                Welcome back!
              </h2>
              <p className="text-sm text-slate-600">
                You're all set. Let's review your follow-ups.
              </p>
            </div>
          </div>
        </div>
      )}

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
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <FollowUpList
              followups={filteredFollowups}
              category={activeTab}
              userEmail={userEmail}
            />
          </div>
        )}
      </div>
    </main>
  );
}
