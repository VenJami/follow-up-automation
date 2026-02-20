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
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyDraft, setReplyDraft] = useState(followup.ai_suggested_message);
  const [copySuccess, setCopySuccess] = useState(false);
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
    // If we have a thread_id, link directly to the Gmail thread
    if (followup.thread_id) {
      const threadId = followup.thread_id;
      
      // Log the thread_id format for debugging
      console.log("Thread ID format:", threadId);
      
      // Gmail thread URLs - try using search which is more reliable
      // Search for the thread ID (Gmail will find it if it's in the thread)
      // Format: https://mail.google.com/mail/u/0/#search/{threadId}
      const searchQuery = encodeURIComponent(threadId);
      let threadUrl = `https://mail.google.com/mail/u/0/#search/${searchQuery}`;
      
      // Alternative: Try direct thread link if threadId looks like a Gmail thread ID
      // Gmail thread IDs are usually numeric or alphanumeric without special chars
      if (/^[a-zA-Z0-9]+$/.test(threadId)) {
        // Try direct thread view format
        threadUrl = `https://mail.google.com/mail/u/0/#all/${threadId}`;
      }
      
      // Hint Gmail which account to use
      const authUserParam = userEmail
        ? `?authuser=${encodeURIComponent(userEmail)}`
        : "";
      
      const finalUrl = threadUrl + authUserParam;
      
      console.log("Opening Gmail URL:", finalUrl);
      
      if (typeof window !== "undefined") {
        window.open(finalUrl, "_blank", "noopener,noreferrer");
      }
      return;
    }

    // Fallback: Open new compose window if no thread_id
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

  async function handleCopyReply() {
    const replyText = replyDraft || followup.ai_suggested_message || "";
    try {
      await navigator.clipboard.writeText(replyText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  }

  async function handleApprove() {
    // Copy the suggested reply to clipboard
    const replyText = replyDraft || followup.ai_suggested_message || "";
    try {
      await navigator.clipboard.writeText(replyText);
      // Show a brief visual feedback
      const button = document.activeElement as HTMLElement;
      const originalText = button.textContent;
      button.textContent = "Copied! Opening Gmail...";
      setTimeout(() => {
        if (button) button.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }

    // Open Gmail thread (if thread_id exists) or compose window
    // The suggested reply is already copied to clipboard, so user can paste it into the thread
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
        "group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200",
        isUrgent ? "border-amber-200 shadow-amber-50/50" : "border-slate-200",
        "hover:shadow-md hover:border-slate-300",
      ].join(" ")}
    >
      {/* Collapsed view - Email + Reason */}
      <div
        className={[
          "p-4 transition-all duration-300",
          isExpanded ? "opacity-0 max-h-0 overflow-hidden" : "opacity-100",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isUrgent && (
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full bg-amber-400 animate-pulse"
                />
              )}
              <h2
                className={[
                  "text-sm text-slate-900 truncate",
                  isUrgent ? "font-bold" : "font-semibold",
                ].join(" ")}
              >
                {leadLabel}
              </h2>
              <span
                className={[
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize shrink-0",
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
                  ? "Admin"
                  : normalizedCategory === "personal"
                  ? "Personal / Other"
                  : "Urgent"}
              </span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">
              {followup.reason}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-95"
            aria-label="Expand details"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded view - Full details */}
      <div
        className={[
          "transition-all duration-300 ease-in-out",
          isExpanded ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0 overflow-hidden",
        ].join(" ")}
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {isUrgent && (
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full bg-amber-400"
                  />
                )}
                <h2
                  className={[
                    "text-sm text-slate-900",
                    isUrgent ? "font-bold" : "font-semibold",
                  ].join(" ")}
                >
                  {leadLabel}
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
                    ? "Admin"
                    : normalizedCategory === "personal"
                    ? "Personal / Other"
                    : "Urgent"}
                </span>
              </div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 mb-0.5">
                Reason
              </p>
              <p className="text-xs text-slate-600">
                {followup.reason}
              </p>
              {(followup.category == null || isLowConfidence) && (
                <p className="mt-1 text-[11px] text-amber-700">
                  Low confidence — please review category
                </p>
              )}
              {followup.category_source && (
                <p className="mt-0.5 text-[10px] text-slate-500">
                  {categorySourceLabel[followup.category_source]}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-95"
              aria-label="Collapse details"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          </div>

          {/* Last email section */}
          <div className="rounded-lg bg-slate-50 px-3 py-2 border border-slate-100">
            <div className="mb-1 flex items-center justify-between gap-2">
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
            <p className="text-xs text-slate-700 line-clamp-2">
              {followup.last_body}
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              Last email: {formatShortDateTime(followup.created_at)}
            </p>
          </div>

          {/* Suggested reply toggle */}
          <button
            type="button"
            onClick={() => setIsReplyOpen((open) => !open)}
            className="flex items-center gap-2 text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors active:scale-95"
          >
            <svg
              className={`h-4 w-4 transition-transform ${isReplyOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {isReplyOpen ? "Hide suggested reply" : "View suggested reply"}
          </button>

          {/* Suggested reply section */}
          <div
            className={[
              "overflow-hidden transition-all duration-300 ease-in-out",
              isReplyOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Suggested reply (editable)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyReply}
                    className={[
                      "flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-all active:scale-95",
                      copySuccess
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-white text-slate-600 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    {copySuccess ? (
                      <>
                        <svg
                          className="h-3 w-3"
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
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setReplyDraft(followup.ai_suggested_message || "")
                    }
                    className="text-[11px] font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline transition-colors"
                  >
                    Reset
                  </button>
                </div>
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
                className="w-full resize-none border-0 bg-transparent p-0 text-xs text-slate-800 outline-none focus:ring-0 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500">Pending follow-up</span>
              <div className="relative" ref={moveToRef}>
                <button
                  type="button"
                  onClick={() => setShowMoveTo(!showMoveTo)}
                  disabled={disabled}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-60 transition-all active:scale-95"
                >
                  Move to →
                </button>
                {showMoveTo && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleMoveTo(cat.value)}
                        disabled={disabled}
                        className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-60 first:rounded-t-lg last:rounded-b-lg transition-all active:scale-[0.98]"
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDismiss}
                disabled={disabled}
                className="flex-1 min-w-[90px] rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 transition-all hover:shadow-sm active:scale-95"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={openCustomGmailCompose}
                disabled={disabled}
                className="flex-1 min-w-[110px] rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 transition-all hover:shadow-sm active:scale-95"
              >
                Add custom email
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={disabled}
                data-approve-id={followup.id}
                className="flex-1 min-w-[140px] rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md hover:from-sky-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition-all active:scale-95"
              >
                Approve &amp; Open Gmail
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

