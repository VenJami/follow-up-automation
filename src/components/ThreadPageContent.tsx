"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LeadFollowupTask, ThreadMessage } from "@/types/followup";
import { ThreadView } from "./ThreadView";

interface ThreadPageContentProps {
  followup: LeadFollowupTask;
  threadMessages: ThreadMessage[];
  userEmail: string;
}

export function ThreadPageContent({
  followup,
  threadMessages,
  userEmail,
}: ThreadPageContentProps) {
  const router = useRouter();
  const [replyDraft, setReplyDraft] = useState(followup.ai_suggested_message || "");
  const replyRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (!replyRef.current) return;
    const el = replyRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [replyDraft]);

  const subject = followup.reason ? `Re: ${followup.reason}` : "Re: Follow-up";

  return (
    <main className="min-h-screen bg-white">
      {/* Gmail-like header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={true}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Send (Coming soon)
            </button>
          </div>
        </div>
      </div>

      {/* Main content - Gmail-like layout */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Subject line */}
        <div className="mb-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">Subject:</span>
            <span className="text-slate-900">{subject}</span>
          </div>
        </div>

        {/* Thread messages */}
        {threadMessages.length > 0 ? (
          <div className="mb-6">
            <ThreadView messages={threadMessages} leadEmail={followup.lead_email} />
          </div>
        ) : (
          <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            <p>Thread messages will appear here once loaded.</p>
            <p className="mt-1 text-xs">
              Configure n8n to populate thread messages (see documentation).
            </p>
          </div>
        )}

        {/* Compose area - Gmail-like */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          {/* To field */}
          <div className="border-b border-slate-200 px-4 py-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-12 shrink-0 font-medium text-slate-600">To</span>
              <span className="text-slate-900">{followup.lead_email}</span>
            </div>
          </div>

          {/* Reply textarea - Gmail-like */}
          <div className="px-4 py-3">
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
              placeholder="Type your reply here..."
              className="w-full resize-none border-0 bg-transparent p-0 text-sm text-slate-900 outline-none focus:ring-0"
              rows={8}
            />
          </div>

          {/* Footer actions - Gmail-like */}
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={true}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Send (Coming soon)
              </button>
              <button
                type="button"
                onClick={() => setReplyDraft(followup.ai_suggested_message || "")}
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
              >
                Reset
              </button>
            </div>
            <div className="text-xs text-slate-500">
              {replyDraft.length} characters
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
