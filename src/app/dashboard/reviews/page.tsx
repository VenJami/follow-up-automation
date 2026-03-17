import type { Metadata } from "next";
import Link from "next/link";
import { getUserOrRedirect } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const metadata: Metadata = {
  title: "Client Reviews | Follow-Up Inbox",
};

type ReviewPlatform = "google" | "facebook" | "internal" | "video";

type ReviewRow = {
  id: string;
  rating: number;
  body: string;
  created_at: string;
  // Supabase returns nested relations as arrays by default.
  review_invites?: {
    first_name: string;
    last_name: string;
    selected_platform: ReviewPlatform | null;
  }[] | null;
};

function StarRating({ value }: { value: number }) {
  const fullStars = Math.round(value);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`h-4 w-4 ${
            index < fullStars ? "text-amber-400" : "text-slate-200"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function InitialAvatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
      {initial}
    </div>
  );
}

export default async function ReviewsPage() {
  await getUserOrRedirect();
  const supabase = await createSupabaseServerClient();

  const { data: invitePlatforms, error: invitePlatformsError } = await supabase
    .from("review_invites")
    .select("selected_platform, status")
    .limit(5000);

  if (invitePlatformsError) {
    throw new Error(invitePlatformsError.message);
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select(
      "id, rating, body, created_at, review_invites(first_name,last_name,selected_platform)"
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (reviewsError) {
    throw new Error(reviewsError.message);
  }

  const reviewRows: ReviewRow[] = (reviews ?? []) as unknown as ReviewRow[];

  const totalInternalReviews = reviewRows.length;
  const avgRating =
    totalInternalReviews > 0
      ? reviewRows.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        totalInternalReviews
      : 0;

  const completedInvites = (invitePlatforms ?? []).filter(
    (i) => i.status === "completed"
  ).length;

  const platformCounts = (invitePlatforms ?? []).reduce<Record<string, number>>(
    (acc, row) => {
      const key = row.selected_platform ?? "unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const totalPlatformSelections = Object.values(platformCounts).reduce(
    (sum, v) => sum + v,
    0
  );

  const starCounts = reviewRows.reduce<Record<number, number>>((acc, r) => {
    const s = Math.max(1, Math.min(5, Math.round(r.rating ?? 0)));
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top header + invite bar */}
        <div className="space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Client Reviews</h1>
              <p className="text-sm text-slate-600">
                Overview of your online reputation across Google, Facebook, and your
                website.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-full bg-white/80 p-1 shadow-sm ring-1 ring-slate-200 md:flex-row">
            <Link
              href="/dashboard/invitations"
              className="flex-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-center text-xs font-semibold text-white shadow-sm hover:from-sky-600 hover:to-blue-700"
            >
              Send Invite
            </Link>
            <button
              type="button"
              className="flex-1 rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-70"
              disabled
            >
              Upload Invite List
            </button>
            <button
              type="button"
              className="flex-1 rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-70"
              disabled
            >
              Manage Reviews
            </button>
          </div>
        </div>

        {/* Main stats grid (dashboard-style) */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Reviews gained / summary */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-700">Reviews Gained</h2>
              <span className="text-[11px] text-slate-500">Internal</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Reviews before system</span>
                <span className="font-semibold text-slate-900">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Current total reviews</span>
                <span className="font-semibold text-slate-900">{completedInvites}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-600">
                <span>Reviews gained with automation</span>
                <span className="font-semibold">+{completedInvites}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-600">
                <span>Increase in reviews</span>
                <span className="font-semibold">—</span>
              </div>
            </div>
          </section>

          {/* Auto-posted / total reviews */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-slate-700">
              Reviews Auto-Posted
            </h2>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-600">So far posted on social</p>
                <p className="text-3xl font-semibold text-slate-900">0</p>
                <p className="text-[11px] text-slate-500">All time</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-700">
                Logo
              </div>
            </div>
          </section>

          {/* Review platforms */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-slate-700">
              Review Platforms
            </h2>
            <div className="space-y-3 text-xs text-slate-600">
              {(
                [
                  ["google", "Google"],
                  ["facebook", "Facebook"],
                  ["internal", "Internal"],
                ] as const
              ).map(([key, label]) => {
                const count = platformCounts[key] ?? 0;
                const percent =
                  totalPlatformSelections > 0
                    ? Math.round((count / totalPlatformSelections) * 100)
                    : 0;
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium">{label}</span>
                      <span className="text-[11px] text-slate-500">
                        {count} selections
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-sky-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Invites sent */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-slate-700">Invites Sent</h2>
            <p className="mb-2 text-xs text-slate-500">
              Total started: {(invitePlatforms ?? []).length}
            </p>
            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Invite links</span>
                  <span className="font-medium">{(invitePlatforms ?? []).length}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[90%] rounded-full bg-emerald-500" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Completed</span>
                  <span className="font-medium">{completedInvites}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[10%] rounded-full bg-sky-500" />
                </div>
              </div>
            </div>
          </section>

          {/* Star distribution */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-slate-700">
              Star Distribution
            </h2>
            <p className="mb-2 text-xs text-slate-500">
              Internal reviews: {totalInternalReviews}
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="w-6 text-[11px]">{stars}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{
                        width:
                          totalInternalReviews > 0
                            ? `${Math.round(
                                ((starCounts[stars] ?? 0) / totalInternalReviews) * 100
                              )}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Leads / views placeholder */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-slate-700">Leads</h2>
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-slate-200 text-xs font-semibold text-slate-600">
                0 Leads
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                <p>Have you set up your lead capture yet?</p>
                <p className="text-[11px] text-slate-500">
                  Coming soon: automatically track leads generated from your review
                  profile.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Review list */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-slate-700">Recent reviews</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {reviewRows.map((review) => {
              const invite = review.review_invites?.[0] ?? null;
              const name = invite
                ? `${invite.first_name} ${invite.last_name}`.trim()
                : "Anonymous";
              const source =
                invite?.selected_platform === "google"
                  ? "Google"
                  : invite?.selected_platform === "facebook"
                  ? "Facebook"
                  : "Internal";

              const date = new Date(review.created_at).toLocaleString(undefined, {
                month: "short",
                year: "numeric",
              });

              return (
              <article
                key={review.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start gap-3">
                  <InitialAvatar name={name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {name}
                      </p>
                      <span className="shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {source}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {date}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <StarRating value={review.rating} />
                      <span className="text-xs font-semibold text-slate-900">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  {review.body}
                </p>
              </article>
              );
            })}
          </div>

          {reviewRows.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
              No reviews yet. The first internal review submitted will show up here.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

