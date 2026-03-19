"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_SHARE_MESSAGE =
  "Check out these client reviews for Leslie Sullivan (Hometown Realty Group).";

function fallbackCopy(text: string) {
  // Fallback for environments where `navigator.clipboard` isn't available.
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "true");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export default function InviteShareBar({
  inviteUrl,
  shareMessage = DEFAULT_SHARE_MESSAGE,
}: {
  inviteUrl: string;
  shareMessage?: string;
}) {
  const [toast, setToast] = useState<string | null>(null);

  const whatsappUrl = useMemo(() => {
    // WhatsApp can read `text` query param.
    const text = `${shareMessage}\n${inviteUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [inviteUrl, shareMessage]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        fallbackCopy(inviteUrl);
      }
      setToast("Copied!");
    } catch {
      setToast("Copy failed");
    }
  }

  function handleShareWhatsApp() {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  async function handleWebShare() {
    try {
      if (!navigator.share) {
        // If the browser doesn't support share, fall back to WhatsApp.
        handleShareWhatsApp();
        return;
      }

      await navigator.share({
        title: "Client Reviews - Leslie Sullivan",
        text: shareMessage,
        url: inviteUrl,
      });
    } catch {
      // User cancelled or browser blocked the share intent; ignore.
    }
  }

  return (
    <div className="mt-4 space-y-2 text-xs">
      <p className="font-medium text-slate-700">
        Share invite link with friends, family and clients
      </p>

      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex-1 truncate text-[11px] text-slate-600">
          {inviteUrl}
        </span>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="inline-flex items-center justify-center rounded-md bg-white px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-100"
          >
            Copy
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center justify-center rounded-md bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 shadow-sm hover:bg-emerald-100"
          >
            WhatsApp
          </button>

          <button
            type="button"
            onClick={() => void handleWebShare()}
            className="inline-flex items-center justify-center rounded-md bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"
          >
            Share
          </button>
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg sm:bottom-6">
          {toast}
        </div>
      )}
    </div>
  );
}

