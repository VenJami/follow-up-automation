export default function DashboardLoading() {
  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Card skeletons (keep header/tabs out of the loading UI so it feels fast) */}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-slate-200" />
                  <div className="h-3 w-56 rounded bg-slate-100" />
                </div>
                <div className="space-y-2 rounded-lg bg-slate-50 px-3 py-2">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-5/6 rounded bg-slate-100" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-3 w-24 rounded bg-slate-100" />
                  <div className="h-3 w-16 rounded bg-slate-100" />
                </div>
                <div className="flex justify-end gap-2">
                  <div className="h-7 w-20 rounded-md bg-slate-100" />
                  <div className="h-7 w-20 rounded-md bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

