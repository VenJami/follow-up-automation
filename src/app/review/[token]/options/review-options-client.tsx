"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getReviewInvite } from "@/lib/reviewInviteStore";

function BrandButton({
  label,
  sublabel,
  tone,
  onClick,
}: {
  label: string;
  sublabel: string;
  tone: "google" | "facebook";
  onClick: () => void;
}) {
  const styles =
    tone === "google"
      ? "from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600"
      : "from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl bg-gradient-to-r px-5 py-4 text-left text-white shadow-sm transition-all active:scale-[0.99]",
        styles,
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="mt-1 text-xs text-white/90">{sublabel}</p>
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
          Continue →
        </span>
      </div>
    </button>
  );
}

export function ReviewOptionsClient({ token }: { token: string }) {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);

  const contact = useMemo(() => getReviewInvite(token), [token]);

  const googleUrl = "https://www.google.com";
  const facebookUrl = "https://www.facebook.com";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Step 2 of 3
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Choose where to leave your review
            </h1>
            <p className="text-sm text-slate-600">
              {contact?.firstName
                ? `Thanks, ${contact.firstName}. We’ll guide you to the best option.`
                : "We’ll guide you to the best option."}
            </p>
          </div>

          <div className="space-y-3">
            <BrandButton
              tone="google"
              label="Review on Google"
              sublabel="Fastest option and helps the most"
              onClick={() => {
                window.location.href = googleUrl;
              }}
            />
            <BrandButton
              tone="facebook"
              label="Review on Facebook"
              sublabel="Great if you’re active on Facebook"
              onClick={() => {
                window.location.href = facebookUrl;
              }}
            />

            <button
              type="button"
              onClick={() => setShowMore((s) => !s)}
              className="mx-auto mt-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
              aria-expanded={showMore}
            >
              {showMore ? "Hide options" : "More Options"}
            </button>

            <div
              className={[
                "grid gap-2 overflow-hidden transition-all duration-300 ease-in-out",
                showMore ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => router.push(`/review/${encodeURIComponent(token)}/write`)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                I’ll review here
                <p className="mt-1 text-xs font-medium text-slate-600">
                  Leave a review on this site (no sign-in)
                </p>
              </button>

              <button
                type="button"
                onClick={() => router.push(`/review/${encodeURIComponent(token)}/video`)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Record a video review
                <p className="mt-1 text-xs font-medium text-slate-600">
                  Coming soon — record a short testimonial
                </p>
              </button>
            </div>
          </div>
        </section>

        <p className="text-center text-[11px] text-slate-500">
          Token: <span className="font-mono">{token}</span>
        </p>
      </div>
    </main>
  );
}

