"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import type {
  LeadFollowupTask,
  FollowupCategory,
  FollowupCategorySource,
} from "@/types/followup";
import {
  approveFollowupAction,
  dismissFollowupAction,
  moveToCategoryAction,
} from "@/app/dashboard/actions";

interface FollowUpCardProps {
  followup: LeadFollowupTask;
  userEmail?: string;
}

const CATEGORIES: { value: FollowupCategory; label: string }[] = [
  { value: "urgent", label: "Urgent" },
  { value: "lead", label: "Leads" },
  { value: "invoice", label: "Admin" },
  { value: "personal", label: "Personal / Other" },
];

function timeAgo(timestamp: string): string {
  const created = new Date(timestamp).getTime();
  const now = Date.now();
  const diffMs = now - created;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 0) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  if (diffHr > 0) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  return "Just now";
}

function formatShortDateTime(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function FollowUpCard({ followup, userEmail }: FollowUpCardProps) {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyDraft, setReplyDraft] = useState(followup.ai_suggested_message);
  const replyRef = useRef<HTMLTextAreaElement | null>(null);
  const [isProcessing, startTransition] = useTransition();
  const [showMoveTo, setShowMoveTo] = useState(false);
  const moveToRef = useRef<HTMLDivElement>(null);

  const leadLabel = followup.lead_email;
  const normalizedCategory: FollowupCategory =
    (followup.category ?? "lead") as FollowupCategory;
  const isUrgent = normalizedCategory === "urgent";

  const isLowConfidence =
    followup.category_confidence != null &&
    followup.category_confidence < 0.75;

  const categorySourceLabel: Record<FollowupCategorySource, string> = {
    rule: "Rule-based",
    ai: "Categorized by AI",
    manual: "Categorized manually",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        moveToRef.current &&
        !moveToRef.current.contains(event.target as Node)
      ) {
        setShowMoveTo(false);
      }
    }

    if (showMoveTo) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMoveTo]);

  function openGmailCompose() {
    const to = followup.lead_email;
    const subject = followup.reason
      ? `Re: ${followup.reason}`
      : "Follow-up";
    const body = replyDraft || followup.ai_suggested_message || "";

    const base =
      "https://mail.google.com/mail/?view=cm&fs=1" +
      `&to=${encodeURIComponent(to)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    // Hint Gmail which account to use, if this user is logged into multiple accounts.
    const authUserParam = userEmail
      ? `&authuser=${encodeURIComponent(userEmail)}`
      : "";

    const url = base + authUserParam;

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  function openCustomGmailCompose() {
    const to = followup.lead_email;

    const base =
      "https://mail.google.com/mail/?view=cm&fs=1" +
      `&to=${encodeURIComponent(to)}`;

    const authUserParam = userEmail
      ? `&authuser=${encodeURIComponent(userEmail)}`
      : "";

    const url = base + authUserParam;

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  function handleApprove() {
    // Open Gmail compose with the current draft, but do not auto-send.
    openGmailCompose();

    // Mark the task as approved in the background.
    startTransition(() => {
      const formData = new FormData();
      formData.append("id", followup.id);
      void approveFollowupAction(formData);
    });
  }

  function handleDismiss() {
    startTransition(() => {
      const formData = new FormData();
      formData.append("id", followup.id);
      void dismissFollowupAction(formData);
    });
  }

  function handleMoveTo(category: FollowupCategory) {
    startTransition(() => {
      const formData = new FormData();
      formData.append("id", followup.id);
      formData.append("category", category);
      void moveToCategoryAction(formData);
      setShowMoveTo(false);
    });
  }

  const disabled = isProcessing;

  // Auto-size suggested reply textarea when opened or when content changes
  useEffect(() => {
    if (!isReplyOpen || !replyRef.current) return;
    const el = replyRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [isReplyOpen, replyDraft]);

  return (
    <article
      className={[
        "rounded-xl border bg-white p-3 shadow-sm",
        isUrgent ? "border-amber-200" : "border-slate-200",
      ].join(" ")}
    >
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2
              className={[
                "flex items-center gap-2 text-sm text-slate-900",
                isUrgent ? "font-bold" : "font-semibold",
              ].join(" ")}
            >
              {isUrgent && (
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full bg-amber-400"
                />
              )}
              <span>{leadLabel}</span>
            </h2>
            <span
              className={[
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                normalizedCategory === "urgent"
                  ? "bg-amber-100 text-amber-800"
                  : normalizedCategory === "invoice"
                  ? "bg-violet-100 text-violet-800"
                  : "bg-slate-100 text-slate-700",
              ].join(" ")}
            >
              {normalizedCategory === "lead"
                ? "Leads"
                : normalizedCategory === "invoice"
                ? "Invoices / Admin"
                : normalizedCategory === "personal"
                ? "Personal / Other"
                : "Urgent"}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Reason
          </p>
          <p className="line-clamp-2 text-xs text-slate-600">
            {followup.reason}
          </p>
          {(followup.category == null || isLowConfidence) && (
            <p className="mt-0.5 text-[11px] text-amber-700">
              Low confidence — please review category
            </p>
          )}
          {followup.category_source && (
            <p className="mt-0.5 text-[10px] text-slate-500">
              {categorySourceLabel[followup.category_source]}
            </p>
          )}
        </div>

        <div className="rounded-lg bg-slate-50 px-3 py-1.5">
          <div className="mb-0.5 flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Last email
            </span>
            <span className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>{timeAgo(followup.created_at)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Client
              </span>
            </span>
          </div>
          <p className="line-clamp-2 text-xs text-slate-700">
            {followup.last_body}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            Last email: {formatShortDateTime(followup.created_at)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsReplyOpen((open) => !open)}
          className="self-start text-xs font-medium text-sky-600 hover:text-sky-700 transition-transform active:scale-95"
        >
          {isReplyOpen ? "Hide suggested reply" : "View suggested reply"}
        </button>

        {isReplyOpen && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Suggested reply (editable)
              </p>
              <button
                type="button"
                onClick={() =>
                  setReplyDraft(followup.ai_suggested_message || "")
                }
                className="text-[11px] font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
              >
                Reset
              </button>
            </div>
            <textarea
              ref={replyRef}
              value={replyDraft}
              onChange={(e) => {
                setReplyDraft(e.target.value);
                if (replyRef.current) {
                  replyRef.current.style.height = "auto";
                  replyRef.current.style.height = `${replyRef.current.scrollHeight}px`;
                }
              }}
              rows={1}
              className="w-full resize-none border-0 bg-transparent p-0 text-xs text-slate-800 outline-none focus:ring-0"
            />
          </div>
        )}

        <div className="mt-1.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500">Pending follow-up</span>
            <div className="relative" ref={moveToRef}>
              <button
                type="button"
                onClick={() => setShowMoveTo(!showMoveTo)}
                disabled={disabled}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-60 transition-transform active:scale-95 disabled:active:scale-100"
              >
                Move to →
              </button>
              {showMoveTo && (
                <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleMoveTo(cat.value)}
                      disabled={disabled}
                      className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-60 first:rounded-t-lg last:rounded-b-lg transition-transform active:scale-[0.98] disabled:active:scale-100"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-row justify-end gap-2">
            <button
              type="button"
              onClick={handleDismiss}
              disabled={disabled}
              className="min-w-[90px] rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 transition-transform active:scale-95 disabled:active:scale-100"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={openCustomGmailCompose}
              disabled={disabled}
              className="min-w-[110px] rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 transition-transform active:scale-95 disabled:active:scale-100"
            >
              Add custom email
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={disabled}
              className="min-w-[90px] rounded-md bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60 transition-transform active:scale-95 disabled:active:scale-100"
            >
              Approve &amp; Open Gmail
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

