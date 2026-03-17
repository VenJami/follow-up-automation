"use client";

import { useMemo } from "react";

export function StarPicker({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md" | "lg";
}) {
  const cls = useMemo(() => {
    if (size === "sm") return "h-4 w-4";
    if (size === "lg") return "h-7 w-7";
    return "h-5 w-5";
  }, [size]);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const active = starValue <= value;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue)}
            className="rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
            aria-label={`${starValue} star${starValue === 1 ? "" : "s"}`}
          >
            <svg
              className={`${cls} ${active ? "text-amber-400" : "text-slate-200"}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

