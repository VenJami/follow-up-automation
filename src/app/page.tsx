import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-slate-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.1),transparent_50%)]" />
      
      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        {/* Hero card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-sm sm:p-12">
          <div className="text-center">
            {/* Icon/Logo area */}
            <div className="mb-6 flex justify-center">
              <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-4 shadow-lg">
                <svg
                  className="h-12 w-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Follow-Up Inbox
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-slate-600 sm:text-xl">
              A calm inbox for approving or dismissing AI-prepared follow-up messages
              from your email conversations.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-sky-500/30 active:scale-95"
              >
                Get Started
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm transition-all hover:border-slate-300 hover:bg-white/80">
            <div className="mb-2 text-2xl">✨</div>
            <h3 className="mb-1 text-sm font-semibold text-slate-900">AI-Powered</h3>
            <p className="text-xs text-slate-600">
              Smart suggestions for your follow-ups
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm transition-all hover:border-slate-300 hover:bg-white/80">
            <div className="mb-2 text-2xl">⚡</div>
            <h3 className="mb-1 text-sm font-semibold text-slate-900">Quick Decisions</h3>
            <p className="text-xs text-slate-600">
              Approve or dismiss in seconds
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm transition-all hover:border-slate-300 hover:bg-white/80">
            <div className="mb-2 text-2xl">🎯</div>
            <h3 className="mb-1 text-sm font-semibold text-slate-900">Organized</h3>
            <p className="text-xs text-slate-600">
              Categorized by priority and type
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
