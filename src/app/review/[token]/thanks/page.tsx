import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You | Leslie Sullivan",
};

export default async function ReviewThanksPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Thank you!</h1>
              <p className="mt-1 text-sm text-slate-600">
                Your review has been submitted successfully.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
            <p className="font-medium">What happens next</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-600">
              <li>Leslie’s team will review and publish it to the Review Board.</li>
              <li>Thank you for helping future buyers and sellers feel confident.</li>
            </ul>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/reviews"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-sky-600 hover:to-blue-700"
            >
              View Review Board
            </Link>
            <Link
              href={`/review/${encodeURIComponent(token)}/options`}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to options
            </Link>
          </div>

          <p className="mt-5 text-center text-[11px] text-slate-500">
            Token: <span className="font-mono">{token}</span>
          </p>
        </section>
      </div>
    </main>
  );
}

