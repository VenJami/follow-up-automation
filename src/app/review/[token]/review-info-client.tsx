"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { saveReviewInvite } from "@/lib/reviewInviteStore";
import { upsertReviewInviteAction } from "./actions";

function Input({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-700">
        {label} {required ? <span className="text-rose-600">*</span> : null}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
      />
    </div>
  );
}

export function ReviewInfoClient({ token }: { token: string }) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    if (!firstName.trim()) return false;
    if (!lastName.trim()) return false;
    if (!email.trim()) return false;
    if (!consent) return false;
    return true;
  }, [firstName, lastName, email, consent]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitted(true);

    if (!isValid) {
      setError("Please complete the required fields and accept consent.");
      return;
    }

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      consent,
    };

    // Phase 2: store in Supabase (server action)
    try {
      await upsertReviewInviteAction({ token, ...payload });
    } catch (err) {
      console.error(err);
      setError("Something went wrong saving your info. Please try again.");
      return;
    }

    // Keep local mock store for now (handy in dev and as a fallback)
    saveReviewInvite(token, payload);

    router.push(`/review/${encodeURIComponent(token)}/options`);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Leave a review
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Share your experience with Leslie
            </h1>
            <p className="text-sm text-slate-600">
              This quick form helps us personalize your review options. (UI-only for now)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="First name"
                required
                value={firstName}
                onChange={setFirstName}
                placeholder="John"
              />
              <Input
                label="Last name"
                required
                value={lastName}
                onChange={setLastName}
                placeholder="Doe"
              />
            </div>

            <Input
              label="Email"
              required
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="john.doe@gmail.com"
            />

            <Input
              label="Phone (optional)"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="(555) 555-5555"
            />

            <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>
                I confirm this is my honest experience and I consent to share this review
                publicly.
              </span>
            </label>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={[
                "w-full rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all",
                isValid
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                  : "bg-slate-300 cursor-not-allowed",
                submitted && !isValid ? "animate-[shake_250ms_ease-in-out_1]" : "",
              ].join(" ")}
            >
              Continue
            </button>

            <p className="text-center text-[11px] text-slate-500">
              Token: <span className="font-mono">{token}</span>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

