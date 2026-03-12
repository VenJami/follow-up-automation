import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Review Board | Leslie Sullivan",
  description:
    "Public showcase of real client reviews for Leslie Sullivan – Hometown Realty Group.",
};

type ReviewSource = "Google" | "Facebook" | "Website";

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  source: ReviewSource;
  date: string;
  city?: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    text: "Leslie was amazing throughout the whole home buying process. She answered every question and made everything feel simple and calm.",
    source: "Google",
    date: "March 2026",
    city: "The Woodlands, TX",
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    text: "Super responsive and always one step ahead. We felt completely taken care of from first showing to closing.",
    source: "Facebook",
    date: "February 2026",
    city: "Spring, TX",
  },
  {
    id: 3,
    name: "Emily Davis",
    rating: 5,
    text: "Leslie turned a stressful sale into a smooth, organized experience. Her advice on pricing and staging was spot on.",
    source: "Website",
    date: "January 2026",
    city: "Conroe, TX",
  },
  {
    id: 4,
    name: "Carlos Ramirez",
    rating: 5,
    text: "We found our dream home thanks to Leslie. She negotiated hard for us and kept us informed the entire time.",
    source: "Google",
    date: "December 2025",
    city: "Houston, TX",
  },
  {
    id: 5,
    name: "Alicia Brown",
    rating: 4.9,
    text: "Her local knowledge and network made all the difference. Highly recommend working with Leslie and her team.",
    source: "Google",
    date: "November 2025",
    city: "Magnolia, TX",
  },
  {
    id: 6,
    name: "James Lee",
    rating: 5,
    text: "As first-time buyers we had a lot of nerves. Leslie walked us through every step and never rushed us.",
    source: "Facebook",
    date: "October 2025",
    city: "Tomball, TX",
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

export default function PublicReviewBoardPage() {
  const overallRating = 4.9;
  const totalReviews = 138;

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
                  <span className="text-3xl font-semibold">{overallRating.toFixed(1)}</span>
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
                A small sample of recent reviews. In the live version, this page will stay
                in sync with Google and Facebook.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {mockReviews.map((review) => (
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
                        {review.city && (
                          <p className="truncate text-[11px] text-slate-500">
                            {review.city}
                          </p>
                        )}
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
        </section>
      </div>
    </main>
  );
}

