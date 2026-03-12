import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Reviews | Follow-Up Inbox",
};

type ReviewSource = "Google" | "Facebook" | "Website";

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  source: ReviewSource;
  date: string;
}

const mockSummary = {
  overallRating: 4.9,
  totalReviews: 138,
};

const mockSourceStats: { source: ReviewSource; rating: number; count: number }[] = [
  { source: "Google", rating: 4.9, count: 98 },
  { source: "Facebook", rating: 4.8, count: 26 },
  { source: "Website", rating: 5.0, count: 14 },
];

const mockReviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    text: "Leslie was amazing throughout the whole home buying process!",
    source: "Google",
    date: "March 2026",
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    text: "Super responsive, professional, and truly had our best interests at heart.",
    source: "Facebook",
    date: "February 2026",
  },
  {
    id: 3,
    name: "Emily Davis",
    rating: 4.8,
    text: "Made a complex sale feel simple. Highly recommend working with Leslie.",
    source: "Website",
    date: "January 2026",
  },
  {
    id: 4,
    name: "Carlos Ramirez",
    rating: 5,
    text: "Leslie went above and beyond to help us find the right home.",
    source: "Google",
    date: "December 2025",
  },
];

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

export default function ReviewsPage() {
  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-900">Client Reviews</h1>
          <p className="text-sm text-slate-600">
            Preview of your future reviews hub. This is mock data only — no live
            integrations yet.
          </p>
        </div>

        {/* Rating summary + sources */}
        <div className="grid gap-4 md:grid-cols-[2fr,3fr]">
          {/* Rating summary card */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-slate-700">
              Rating summary
            </h2>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-4xl font-semibold text-slate-900">
                  {mockSummary.overallRating.toFixed(1)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Based on {mockSummary.totalReviews} reviews
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <StarRating value={mockSummary.overallRating} />
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
                  disabled
                >
                  Send Review Request
                </button>
                <p className="text-[11px] text-slate-500">
                  Coming soon: send clients a link to leave a review on Google,
                  Facebook, or your website.
                </p>
              </div>
            </div>
          </section>

          {/* Review sources */}
          <section className="grid gap-3 sm:grid-cols-3">
            {mockSourceStats.map((source) => (
              <div
                key={source.source}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {source.source}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <StarRating value={source.rating} />
                    <span className="text-xs font-semibold text-slate-900">
                      {source.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {source.count} review{source.count === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </section>
        </div>

        {/* Review list */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-slate-700">Recent reviews</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {mockReviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start gap-3">
                  <InitialAvatar name={review.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {review.name}
                      </p>
                      <span className="shrink-0 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {review.source}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {review.date}
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
                  {review.text}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

