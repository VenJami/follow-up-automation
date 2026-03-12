"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

type PresetKey = "google" | "facebook" | "noSignIn";

const PRESET_CONTENT: Record<
  PresetKey,
  {
    label: string;
    description: string;
    subject: string;
    body: string;
  }
> = {
  google: {
    label: "Google Review",
    description: "Send clients to leave a review on your Google Business profile.",
    subject: "Quick favor — could you share a Google review?",
    body:
      "Hi {{firstName}},\n\n" +
      "It was a pleasure working with you on your recent real estate journey. " +
      "If you had a good experience, would you mind leaving a quick review on Google? " +
      "It only takes a minute and helps other families find us.\n\n" +
      "👉 Click here to leave a Google review:\n" +
      "{{googleReviewLink}}\n\n" +
      "Thank you so much,\n" +
      "{{agentSignature}}",
  },
  facebook: {
    label: "Facebook Review",
    description: "Invite clients to recommend you on your Facebook business page.",
    subject: "Would you mind leaving a quick Facebook review?",
    body:
      "Hi {{firstName}},\n\n" +
      "Thank you again for trusting me with your home purchase/sale. " +
      "If you have a moment, a short recommendation on Facebook would mean a lot.\n\n" +
      "👉 Leave a Facebook review here:\n" +
      "{{facebookReviewLink}}\n\n" +
      "Gratefully,\n" +
      "{{agentSignature}}",
  },
  noSignIn: {
    label: "Direct Review (no sign-in)",
    description: "Use a simple landing page where clients can leave a review without logging in.",
    subject: "Share your experience — no login required",
    body:
      "Hi {{firstName}},\n\n" +
      "I'm always trying to improve the way I serve my clients. " +
      "Would you be willing to share a short review about your experience? " +
      "No account or sign-in required — just a quick form.\n\n" +
      "👉 Leave your review here:\n" +
      "{{directReviewLink}}\n\n" +
      "Thank you!\n" +
      "{{agentSignature}}",
  },
};

export function CustomizeInvitationClient() {
  const [activePreset, setActivePreset] = useState<PresetKey>("google");
  const [subject, setSubject] = useState(PRESET_CONTENT.google.subject);
  const [body, setBody] = useState(PRESET_CONTENT.google.body);

  const activeMeta = useMemo(() => PRESET_CONTENT[activePreset], [activePreset]);

  function handlePresetChange(key: PresetKey) {
    setActivePreset(key);
    setSubject(PRESET_CONTENT[key].subject);
    setBody(PRESET_CONTENT[key].body);
  }

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/invitations"
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              ← Back to Invitations
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Customize Invitation
              </h1>
              <p className="text-xs text-slate-600">
                Choose a preset, tweak the copy, and preview what clients will see. UI
                only — no sending yet.
              </p>
            </div>
          </div>
        </div>

        {/* Presets + editor + preview */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Left: presets + editor */}
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Invitation presets
              </h2>
              <p className="text-xs text-slate-600">
                Start from a preset and then edit the subject and message.
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {(Object.keys(PRESET_CONTENT) as PresetKey[]).map((key) => {
                  const preset = PRESET_CONTENT[key];
                  const isActive = activePreset === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handlePresetChange(key)}
                      className={[
                        "flex h-24 flex-col items-start justify-center rounded-lg border px-3 py-2 text-left text-xs transition-all",
                        isActive
                          ? "border-sky-500 bg-sky-50 text-sky-800 shadow-sm"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      <span className="mb-1 font-semibold">{preset.label}</span>
                      <span className="line-clamp-3 text-[11px]">
                        {preset.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Email / SMS subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Message body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <p className="text-[11px] text-slate-500">
                  You can use placeholders like{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5">
                    {"{{firstName}}"}
                  </code>
                  ,{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5">
                    {"{{googleReviewLink}}"}
                  </code>
                  ,{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5">
                    {"{{facebookReviewLink}}"}
                  </code>{" "}
                  and{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5">
                    {"{{directReviewLink}}"}
                  </code>
                  .
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-70"
                >
                  Save template (coming soon)
                </button>
                <button
                  type="button"
                  disabled
                  className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
                >
                  Restore preset
                </button>
              </div>
            </div>
          </section>

          {/* Right: live preview */}
          <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-inner">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Invitation preview
            </h2>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-3 text-xs text-slate-600">
                <p>
                  <span className="font-medium">To:</span> john.doe@example.com
                </p>
                <p>
                  <span className="font-medium">Subject:</span>{" "}
                  <span className="text-slate-900">{subject || "(no subject)"}</span>
                </p>
              </div>
              <div className="px-4 py-4 text-sm text-slate-800 whitespace-pre-wrap">
                {body}
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              This is a visual preview only. In a later phase, you&apos;ll be able to send
              these invitations via email or SMS and connect the review links to Google,
              Facebook, or a no-sign-in landing page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

