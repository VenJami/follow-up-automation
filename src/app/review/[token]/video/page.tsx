import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Video Review | Leslie Sullivan",
};

export default async function ReviewVideoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Coming soon
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Record a video review
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            This page is a placeholder for the future video testimonial flow.
          </p>

          <div className="mt-5 flex gap-2">
            <Link
              href={`/review/${encodeURIComponent(token)}/options`}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back
            </Link>
            <Link
              href={`/review/${encodeURIComponent(token)}/write`}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-sky-600 hover:to-blue-700"
            >
              Write a review instead
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

