export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <div className="max-w-sm space-y-2">
        <div className="text-2xl">🎉</div>
        <h2 className="text-base font-medium text-slate-900">
          You&apos;re all caught up.
        </h2>
        <p className="text-sm text-slate-600">
          No follow-ups need your attention right now.
        </p>
      </div>
    </div>
  );
}

