"use client";

import type { ThreadMessage } from "@/types/followup";

interface ThreadViewProps {
  messages: ThreadMessage[];
  leadEmail: string;
}

function formatMessageDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ThreadView({ messages, leadEmail }: ThreadViewProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
        No thread messages available. Thread messages will appear here once loaded.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white">
      {messages.map((message, index) => {
        const isFromMe = message.isFromMe ?? false;
        const isLast = index === messages.length - 1;
        const isUnread = message.is_unread ?? false;
        // Use sender_name if available, otherwise fall back to sender_email or raw from
        const displayName = message.sender_name || message.sender_email || message.from;

        return (
          <div
            key={message.id}
            className={[
              "border-b border-slate-100 px-3 py-3",
              isLast ? "border-b-0" : "",
              isFromMe ? "bg-sky-50/30" : "bg-white",
              isUnread && !isFromMe ? "bg-blue-50/50" : "",
            ].join(" ")}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {isUnread && !isFromMe && (
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full bg-blue-500"
                  />
                )}
                <span
                  className={[
                    "text-[10px] font-medium uppercase tracking-wide",
                    isFromMe ? "text-sky-700" : isUnread ? "text-blue-700 font-semibold" : "text-slate-600",
                  ].join(" ")}
                >
                  {isFromMe ? "You" : displayName}
                </span>
                {isFromMe && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                    Sent
                  </span>
                )}
                {isUnread && !isFromMe && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    Unread
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500">
                {formatMessageDate(message.date)}
              </span>
            </div>
            {message.subject && index === 0 && (
              <p className="mb-1 text-[11px] font-semibold text-slate-900">
                {message.subject}
              </p>
            )}
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-xs text-slate-700 leading-relaxed">
                {message.body}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
