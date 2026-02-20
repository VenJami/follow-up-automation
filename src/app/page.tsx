import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-900">
          Follow-Up Inbox
        </h1>
        <p className="mb-8 text-lg text-slate-600">
          A calm inbox for approving or dismissing AI-prepared follow-up messages
          from your email conversations.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
