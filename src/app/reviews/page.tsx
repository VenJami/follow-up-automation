import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const metadata: Metadata = {
  title: "Client Review Board | Leslie Sullivan",
  description:
    "Public showcase of real client reviews for Leslie Sullivan – Hometown Realty Group.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ReviewSource = "Google" | "Facebook" | "Internal" | "Video" | "Unknown";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  source: ReviewSource;
  date: string;
}

type ReviewRow = {
  id: string;
  rating: number;
  body: string;
  created_at: string;
  review_invites?: {
    first_name: string;
    last_name: string;
    consent: boolean;
    status: "started" | "completed";
    selected_platform: "google" | "facebook" | "internal" | "video" | null;
  } | null;
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

function toSource(platform: ReviewRow["review_invites"] extends infer T
  ? T extends { selected_platform: infer P }
    ? P
    : never
  : never): ReviewSource {
  switch (platform) {
    case "google":
      return "Google";
    case "facebook":
      return "Facebook";
    case "internal":
      return "Internal";
    case "video":
      return "Video";
    default:
      return "Unknown";
  }
}

export default async function PublicReviewBoardPage() {
  const supabase = await createSupabaseServerClient();

  const { data: reviews, error: reviewsError, count } = await supabase
    .from("reviews")
    .select(
      "id, rating, body, created_at, review_invites!inner(first_name,last_name,consent,status,selected_platform)",
      { count: "exact" }
    )
    .eq("review_invites.consent", true)
    .eq("review_invites.status", "completed")
    .order("created_at", { ascending: false })
    .limit(12);

  if (reviewsError) {
    throw new Error(reviewsError.message);
  }

  const rows: ReviewRow[] = (reviews ?? []) as unknown as ReviewRow[];
  const pageReviews: Review[] = rows.map((r) => {
    const invite = r.review_invites ?? null;
    const name = invite
      ? `${invite.first_name} ${invite.last_name}`.trim() || "Anonymous"
      : "Anonymous";

    const date = new Date(r.created_at).toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });

    return {
      id: r.id,
      name,
      rating: Number(r.rating ?? 0),
      text: r.body,
      source: toSource(invite?.selected_platform ?? null),
      date,
    };
  });

  const totalReviews = count ?? pageReviews.length;
  const overallRating =
    pageReviews.length > 0
      ? pageReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        pageReviews.length
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Hero */}
        <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 shadow-lg text-white md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
                Client Review Board
              </p>
              <h1 className="text-2xl font-semibold md:text-3xl">
                What clients are saying about Leslie Sullivan
              </h1>
              <p className="max-w-xl text-sm text-sky-100/90">
                Real reviews from buyers and sellers across the North Houston area. Every
                review represents a real family helped into or out of a home.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-semibold">
                    {overallRating.toFixed(1)}
                  </span>
                  <div>
                    <StarRating value={overallRating} />
                    <p className="text-xs text-sky-100/80">
                      Based on {totalReviews}+ verified reviews
                    </p>
                  </div>
                </div>
                <div className="h-8 w-px bg-sky-300/40" />
                <div className="space-y-1 text-xs text-sky-100/90">
                  <p>Broker, CRS, CLHMS, CFSP – REMAX Partners</p>
                  <p>Serving The Woodlands, Spring, Conroe &amp; surrounding areas</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white/10 p-4 text-sm shadow-sm backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-sky-100/90">
                Thinking about buying or selling?
              </p>
              <p className="mt-2 text-sm text-sky-50">
                Use these reviews as a starting point. Every story here began with a quick
                conversation.
              </p>
              <p className="mt-3 text-xs text-sky-100/90">
                Call or text:{" "}
                <span className="font-semibold tracking-wide">281-639-8669</span>
              </p>
            </div>
          </div>
        </section>

        {/* Review cards */}
        <section className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Featured client stories
              </h2>
              <p className="text-xs text-slate-600">
                A small sample of recent reviews pulled from the invite system.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {pageReviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start gap-3">
                  <InitialAvatar name={review.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {review.name}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {review.source}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">{review.date}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <StarRating value={review.rating} />
                      <span className="text-xs font-semibold text-slate-900">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-700">{review.text}</p>
              </article>
            ))}
          </div>

          {pageReviews.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 shadow-sm">
              No public reviews yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

