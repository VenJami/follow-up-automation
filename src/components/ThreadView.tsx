"use client";

import { useState } from "react";
import type { ThreadMessage } from "@/types/followup";
import { MessageAvatar } from "./MessageAvatar";

interface ThreadViewProps {
  messages: ThreadMessage[];
  leadEmail: string;
  messagesPerPage?: number;
}

function formatMessageDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Normalizes line breaks: \r\n → \n
 */
function normalizeLineBreaks(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/**
 * Detects Gmail reply header patterns like:
 * "On Wed, Mar 11, 2026 at 3:51 PM Lois de Armas wrote:"
 */
function isGmailReplyHeader(line: string): boolean {
  return /^On\s+\w+,\s+\w+\s+\d+,\s+\d{4}\s+at\s+\d+:\d+\s+(AM|PM)\s+.+\s+wrote:?$/i.test(
    line.trim()
  );
}

/**
 * Formats message body with Gmail-like styling:
 * - Quoted text (lines starting with >) gets styled
 * - Gmail reply headers get meta styling
 * - Line breaks are preserved
 */
function formatMessageBody(body: string): React.ReactNode {
  const normalized = normalizeLineBreaks(body);
  const lines = normalized.split("\n");
  
  const elements: React.ReactNode[] = [];
  let currentQuoteBlock: string[] = [];
  let inQuoteBlock = false;

  function flushQuoteBlock() {
    if (currentQuoteBlock.length > 0) {
      elements.push(
        <div
          key={`quote-${elements.length}`}
          className="my-2 border-l-4 border-slate-300 pl-4 text-sm text-slate-600 italic"
        >
          {currentQuoteBlock.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              {line.replace(/^>\s?/, "")}
            </div>
          ))}
        </div>
      );
      currentQuoteBlock = [];
    }
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const isQuoted = trimmed.startsWith(">");
    const isReplyHeader = isGmailReplyHeader(trimmed);

    if (isReplyHeader) {
      flushQuoteBlock();
      inQuoteBlock = false;
      elements.push(
        <div
          key={`header-${index}`}
          className="my-3 text-xs text-slate-500 border-b border-slate-200 pb-2"
        >
          {line}
        </div>
      );
    } else if (isQuoted) {
      if (!inQuoteBlock) {
        flushQuoteBlock();
        inQuoteBlock = true;
      }
      currentQuoteBlock.push(line);
    } else {
      flushQuoteBlock();
      inQuoteBlock = false;
      if (trimmed || index === 0) {
        // Preserve empty lines for spacing, but skip trailing empty lines
        elements.push(
          <div key={`line-${index}`} className="whitespace-pre-wrap text-sm text-slate-900 leading-relaxed">
            {line || "\u00A0"} {/* Non-breaking space for empty lines */}
          </div>
        );
      }
    }
  });

  flushQuoteBlock();

  return <div className="space-y-1">{elements}</div>;
}

export function ThreadView({ messages, leadEmail, messagesPerPage = 50 }: ThreadViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(messages.length / messagesPerPage);
  const startIndex = (currentPage - 1) * messagesPerPage;
  const endIndex = startIndex + messagesPerPage;
  const displayedMessages = messages.slice(startIndex, endIndex);

  if (!messages || messages.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
        No thread messages available. Thread messages will appear here once loaded.
      </div>
    );
  }

  return (
    <div className="space-y-0 border border-slate-200 rounded-lg bg-white overflow-hidden">
      {displayedMessages.map((message, index) => {
        const isFromMe = message.isFromMe ?? false;
        const isUnread = message.is_unread ?? false;
        const displayName = message.sender_name || message.sender_email || message.from;
        const displayEmail = message.sender_email || message.from;
        const isLast = index === displayedMessages.length - 1;

        return (
          <div
            key={message.id}
            className={[
              "px-4 py-4 border-b border-slate-100",
              isLast ? "border-b-0" : "",
              isFromMe ? "bg-sky-50/20" : "bg-white",
              isUnread && !isFromMe ? "bg-blue-50/30" : "",
            ].join(" ")}
          >
            {/* Gmail-like header with avatar */}
            <div className="flex items-start gap-3 mb-3">
              <MessageAvatar
                name={message.sender_name}
                email={message.sender_email}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={[
                      "text-sm font-medium text-slate-900",
                      isUnread && !isFromMe ? "font-semibold" : "",
                    ].join(" ")}
                  >
                    {isFromMe ? "You" : displayName}
                  </span>
                  {isFromMe && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      Sent
                    </span>
                  )}
                  {isUnread && !isFromMe && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Unread
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                  <span>{displayEmail}</span>
                  <span>•</span>
                  <span>{formatMessageDate(message.date)}</span>
                </div>
              </div>
            </div>

            {/* Message body with Gmail-like formatting */}
            <div className="ml-[52px] pl-0">
              {formatMessageBody(message.body)}
            </div>
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Showing {startIndex + 1}-{Math.min(endIndex, messages.length)} of {messages.length} messages
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-xs text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
