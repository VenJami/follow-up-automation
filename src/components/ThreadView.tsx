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

        return (
          <div
            key={message.id}
            className={[
              "border-b border-slate-100 px-3 py-3",
              isLast ? "border-b-0" : "",
              isFromMe ? "bg-sky-50/30" : "bg-white",
            ].join(" ")}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "text-[10px] font-medium uppercase tracking-wide",
                    isFromMe ? "text-sky-700" : "text-slate-600",
                  ].join(" ")}
                >
                  {isFromMe ? "You" : message.from}
                </span>
                {isFromMe && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                    Sent
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
