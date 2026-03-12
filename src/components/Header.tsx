"use client";

import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

interface HeaderProps {
  count: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  userEmail: string;
}

export function Header({ count, onRefresh, isRefreshing, userEmail }: HeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-slate-900">
            Follow-Ups Waiting for Approval
          </h1>
          <p className="text-sm text-slate-600">
            Prepared automatically from your email conversations.
          </p>
          {userEmail && (
            <p className="text-xs text-slate-500">
              Signed in as <span className="font-medium">{userEmail}</span>
            </p>
          )}
          <nav className="flex flex-wrap items-center gap-1 text-xs">
            <Link
              href="/dashboard"
              className="rounded-full border border-transparent px-2 py-1 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
            >
              Dashboard
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/dashboard"
              className="rounded-full border border-transparent px-2 py-1 text-slate-900 font-medium hover:border-slate-200 hover:bg-slate-50"
            >
              Follow Ups
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/dashboard/reviews"
              className="rounded-full border border-transparent px-2 py-1 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
            >
              Client Reviews
            </Link>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              disabled
              className="rounded-full border border-dashed border-slate-200 px-2 py-1 text-slate-400 cursor-not-allowed"
            >
              Settings
            </button>
          </nav>
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-sky-500" />
            {count} pending
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-transform active:scale-95 active:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </button>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

