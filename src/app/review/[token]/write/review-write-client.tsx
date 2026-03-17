"use client";

import { useMemo, useState } from "react";
import { StarPicker } from "@/components/StarPicker";
import { getReviewInvite } from "@/lib/reviewInviteStore";

export function ReviewWriteClient({ token }: { token: string }) {
  const contact = useMemo(() => getReviewInvite(token), [token]);

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [imageName, setImageName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = rating > 0 && text.trim().length > 10;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Step 3 of 3
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">Write your review</h1>
            <p className="text-sm text-slate-600">
              {contact?.firstName
                ? `Thank you, ${contact.firstName}. Your feedback helps a lot.`
                : "Your feedback helps a lot."}{" "}
              (UI-only for now)
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-700">Star rating</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <StarPicker value={rating} onChange={setRating} size="lg" />
                <span className="text-xs font-semibold text-slate-700">
                  {rating ? `${rating}/5` : "Select"}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Your review
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                placeholder="Share a few sentences about your experience..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <p className="text-[11px] text-slate-500">
                Tip: mention what stood out (communication, negotiation, guidance, etc.).
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-700">
                    Optional image upload
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Add a photo (closing day, new home, etc.). UI only for now.
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  Choose file
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setImageName(file ? file.name : null);
                    }}
                  />
                </label>
              </div>
              {imageName && (
                <p className="mt-2 text-[11px] text-slate-600">
                  Selected: <span className="font-medium">{imageName}</span>
                </p>
              )}
            </div>

            {submitted && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Thank you! Your review has been captured (mock). In the next phase this
                will save to the database and optionally publish to the Review Board.
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setSubmitted(true);
              }}
              disabled={!canSubmit}
              className={[
                "w-full rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all",
                canSubmit
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                  : "bg-slate-300 cursor-not-allowed",
              ].join(" ")}
            >
              Submit review
            </button>
          </div>

          <p className="mt-5 text-center text-[11px] text-slate-500">
            Token: <span className="font-mono">{token}</span>
          </p>
        </section>
      </div>
    </main>
  );
}

