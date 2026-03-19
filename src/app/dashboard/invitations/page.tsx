import type { Metadata } from "next";
import Link from "next/link";
import InviteShareBar from "./InviteShareBar";

export const metadata: Metadata = {
  title: "Invitations | Follow-Up Inbox",
};

const mockInvites = [
  {
    id: 1,
    name: "Andy Oxford",
    contact: "oxfords@bcglobal.net\n(281) 723-0879",
    date: "11 months ago",
    sentBy: "Public link",
    status: "No communication",
  },
  {
    id: 2,
    name: "Denise Chuick",
    contact: "trainerct1@gmail.com\n(832) 563-0822",
    date: "11 months ago",
    sentBy: "Public link",
    status: "No communication",
  },
  {
    id: 3,
    name: "Stephen Wilson",
    contact: "wilsonsally2@yahoo.com\n(281) 893-9891",
    date: "11 months ago",
    sentBy: "Public link",
    status: "No communication",
  },
];

export default function InvitationsPage() {
  const publicInviteUrl =
    "https://follow-up-automation.vercel.app/review-leslie-sullivan-hometown-realty-group";

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/reviews"
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              ← Back
            </Link>
            <h1 className="text-xl font-semibold text-slate-900">Invitations</h1>
          </div>
          <button
            type="button"
            disabled
            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
          >
            Settings (coming soon)
          </button>
        </div>

        {/* Top grid: form + quick actions */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Send invite form */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">
              Send an Invite
            </h2>
            <div className="space-y-3 text-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Mobile</label>
                <div className="flex gap-2">
                  <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-600">
                    +1
                  </div>
                  <input
                    type="tel"
                    placeholder="(555) 555-5555"
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  placeholder="john.doe@gmail.com"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center rounded-full bg-sky-500 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-70"
                >
                  Send Invite (UI only)
                </button>
                <button
                  type="button"
                  disabled
                  className="ml-3 text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline"
                >
                  Advanced ▸
                </button>
              </div>
            </div>
          </section>

          {/* Quick actions + stats */}
          <section className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-slate-900">
                Quick Actions
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  disabled
                  className="flex h-20 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-70"
                >
                  Send Multiple Invites
                </button>
                <button
                  type="button"
                  disabled
                  className="flex h-20 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-70"
                >
                  Download QR Code
                </button>
                <button
                  type="button"
                  disabled
                  className="flex h-20 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-70"
                >
                  User Invite Links
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-2 rounded-lg border border-sky-200 bg-sky-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-sky-800">
                    Customize invitation content
                  </p>
                  <p className="text-[11px] text-sky-700">
                    Choose presets for Google, Facebook, or a no-sign-in review page and
                    tweak the message before sending.
                  </p>
                </div>
                <Link
                  href="/dashboard/invitations/customize"
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-600"
                >
                  Customize Invitation
                </Link>
              </div>

              <InviteShareBar inviteUrl={publicInviteUrl} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-700">
                  Invites left this month
                </p>
                <p className="mt-2 text-4xl font-semibold text-emerald-600">250</p>
                <p className="text-[11px] text-slate-500">
                  out of 250 invites left
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-700">
                  Scheduled invites by month
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  No scheduled invites set.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sent invitations table */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Sent Invitations
              </h2>
              <p className="text-xs text-slate-500">
                Mock data for layout only. No live sending yet.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by any field"
                className="w-48 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">
                    Actions
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">
                    Contact
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">
                    Sent By
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">
                    Communications
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockInvites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-slate-50/80">
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        disabled
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-sm disabled:opacity-60"
                      >
                        Actions ▾
                      </button>
                    </td>
                    <td className="px-3 py-2 text-slate-800">{invite.name}</td>
                    <td className="whitespace-pre-line px-3 py-2 text-slate-600">
                      {invite.contact}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{invite.date}</td>
                    <td className="px-3 py-2 text-slate-600">{invite.sentBy}</td>
                    <td className="px-3 py-2 text-slate-600">{invite.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

