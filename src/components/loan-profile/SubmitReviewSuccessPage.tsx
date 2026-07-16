"use client";

import Link from "next/link";
import { useLoanAppProfile } from "@/hooks/useLoanAppProfile";

export default function SubmitReviewSuccessPage({ appId, reviewId }: { appId: string; reviewId?: string }) {
  const profileQuery = useLoanAppProfile(appId);
  const app = profileQuery.data?.app;

  if (profileQuery.isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          Loading submitted review context...
        </section>
      </main>
    );
  }

  if (profileQuery.isError || !app) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <section className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-900">
          <p>Could not load the loan app for this submitted review. {(profileQuery.error as Error | null)?.message}</p>
          <button onClick={() => profileQuery.refetch()} className="mt-3 rounded-xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">Try again</button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-emerald-900">Review submitted</h1>
          <p className="mt-1 text-sm text-emerald-900">
            Your review for {app.name} was saved and submitted for moderation. It will not appear publicly until approved.
          </p>
          {reviewId && <p className="mt-3 text-xs font-medium text-emerald-800">Review ID: {reviewId}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/loan-apps/${app.id}`} className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900">Back to app profile</Link>
            <Link href="/dashboard" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900">Go to dashboard</Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <img src={app.logoUrl} alt={`${app.name} logo`} className="h-14 w-14 rounded-xl border border-slate-200 bg-white p-1 object-contain" />
            <div>
              <h2 className="font-semibold text-slate-950">{app.name}</h2>
              <p className="text-sm text-slate-600">{app.companyName || app.developerName}</p>
            </div>
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase text-slate-500">Reviews</dt>
              <dd className="mt-1 font-semibold text-slate-950">{app.reviewCount.toLocaleString()}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase text-slate-500">Average rating</dt>
              <dd className="mt-1 font-semibold text-slate-950">{app.averageRating.toFixed(1)}</dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <dt className="text-xs font-semibold uppercase text-slate-500">Trust score</dt>
              <dd className="mt-1 font-semibold text-slate-950">{app.trustScore}/100</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
