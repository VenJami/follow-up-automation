"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { LeadFollowupTask, FollowupCategory } from "@/types/followup";
import {
  bulkApproveFollowupsAction,
  bulkDismissFollowupsAction,
  bulkMarkReadAction,
  bulkMarkUnreadAction,
  bulkMoveToCategoryAction,
} from "@/app/dashboard/actions";
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
  const [isBulkProcessing, startBulkTransition] = useTransition();
  const [showWelcome, setShowWelcome] = useState(false);
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
  const [hideReplied, setHideReplied] = useState(false);
  const [ageFilter, setAgeFilter] = useState<"all" | "last7" | "last30" | "older">(
    "all"
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  // Filter follow-ups by active tab + filters
  const filteredFollowups = useMemo(() => {
    const now = Date.now();

    function isWithinAge(createdAt: string): boolean {
      if (ageFilter === "all") return true;
      const created = new Date(createdAt).getTime();
      if (Number.isNaN(created)) return true;
      const diffDays = (now - created) / (1000 * 60 * 60 * 24);

      if (ageFilter === "last7") return diffDays <= 7;
      if (ageFilter === "last30") return diffDays <= 30;
      if (ageFilter === "older") return diffDays > 30;
      return true;
    }

    return followups.filter((f) => {
      if (f.status !== "pending") return false;
      if (getNormalizedCategory(f) !== activeTab) return false;

      const isRead = Boolean(f.is_read);
      if (readFilter === "unread" && isRead) return false;
      if (readFilter === "read" && !isRead) return false;

      const replied = Boolean(f.has_reply);
      if (hideReplied && replied) return false;

      if (!isWithinAge(f.created_at)) return false;

      return true;
    });
  }, [followups, activeTab, readFilter, hideReplied, ageFilter]);

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

  const allVisibleSelected =
    filteredFollowups.length > 0 &&
    filteredFollowups.every((f) => selectedIds.includes(f.id));

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]
    );
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  function selectAllVisible() {
    setSelectedIds(filteredFollowups.map((f) => f.id));
  }

  // Bulk handlers call server actions (no Gmail) and rely on revalidatePath
  async function runBulkAction(
    action: (ids: string[]) => Promise<void> | void
  ): Promise<void> {
    if (!selectedIds.length) return;
    startBulkTransition(() => {
      void action(selectedIds);
      setSelectedIds([]);
    });
  }

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
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <span className="font-medium">Read:</span>
                <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5">
                  {(["all", "unread", "read"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setReadFilter(option)}
                      className={`px-2 py-1 rounded-full capitalize transition-colors ${
                        readFilter === option
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {option === "all" ? "All" : option}
                    </button>
                  ))}
                </div>
              </div>
              <label className="inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  className="h-3 w-3 rounded border-slate-300 text-sky-600"
                  checked={hideReplied}
                  onChange={(e) => setHideReplied(e.target.checked)}
                />
                <span>Hide replied threads</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="font-medium">Age:</span>
                <select
                  value={ageFilter}
                  onChange={(e) =>
                    setAgeFilter(e.target.value as typeof ageFilter)
                  }
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
                >
                  <option value="all">All</option>
                  <option value="last7">Last 7 days</option>
                  <option value="last30">Last 30 days</option>
                  <option value="older">Older</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {/* Bulk actions bar */}
        {selectedIds.length > 0 && (
          <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 flex flex-wrap items-center gap-2">
            <span className="font-medium">
              {selectedIds.length} selected
              {isBulkProcessing && " — applying changes…"}
            </span>
            <button
              type="button"
              onClick={() => (allVisibleSelected ? clearSelection() : selectAllVisible())}
              className="rounded-full border border-slate-200 bg-white px-2 py-0.5 hover:bg-slate-100"
            >
              {allVisibleSelected ? "Clear selection" : "Select all in view"}
            </button>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-slate-400">•</span>
              <button
                type="button"
                disabled={isBulkProcessing}
                onClick={() => runBulkAction(bulkDismissFollowupsAction)}
                className="rounded-full border border-slate-200 bg-white px-2 py-0.5 hover:bg-slate-100 disabled:opacity-60"
              >
                Dismiss
              </button>
              <button
                type="button"
                disabled={isBulkProcessing}
                onClick={() => runBulkAction(bulkApproveFollowupsAction)}
                className="rounded-full border border-slate-200 bg-white px-2 py-0.5 hover:bg-slate-100 disabled:opacity-60"
              >
                Approve (no Gmail)
              </button>
              <button
                type="button"
                disabled={isBulkProcessing}
                onClick={() => runBulkAction(bulkMarkReadAction)}
                className="rounded-full border border-slate-200 bg-white px-2 py-0.5 hover:bg-slate-100 disabled:opacity-60"
              >
                Mark read
              </button>
              <button
                type="button"
                disabled={isBulkProcessing}
                onClick={() => runBulkAction(bulkMarkUnreadAction)}
                className="rounded-full border border-slate-200 bg-white px-2 py-0.5 hover:bg-slate-100 disabled:opacity-60"
              >
                Mark unread
              </button>
              <div className="relative">
                <select
                  disabled={isBulkProcessing}
                  defaultValue=""
                  onChange={(e) => {
                    const value = e.target.value as FollowupCategory | "";
                    if (!value) return;
                    void runBulkAction((ids) =>
                      bulkMoveToCategoryAction(ids, value as FollowupCategory)
                    );
                    e.target.value = "";
                  }}
                  className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 disabled:opacity-60"
                >
                  <option value="">Move to…</option>
                  <option value="urgent">Urgent</option>
                  <option value="lead">Leads</option>
                  <option value="invoice">Admin</option>
                  <option value="personal">Personal / Other</option>
                </select>
              </div>
            </div>
          </div>
        )}
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
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
            />
          </div>
        )}
      </div>
    </main>
  );
}
