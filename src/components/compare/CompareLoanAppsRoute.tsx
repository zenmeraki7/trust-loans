"use client";

import CompareLoanAppsPage from "@/components/compare/CompareLoanAppsPage";
import { useCompareLoanApps } from "@/hooks/useCompareLoanApps";

export default function CompareLoanAppsRoute() {
  const compare = useCompareLoanApps();

  if (compare.isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          Loading comparison data...
        </section>
      </main>
    );
  }

  if (compare.isError) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <section className="mx-auto max-w-5xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-900">
          <p>Could not load comparison data. {(compare.error as Error).message}</p>
          <button onClick={() => compare.refetch()} className="mt-3 rounded-xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">
            Try again
          </button>
        </section>
      </main>
    );
  }

  return <CompareLoanAppsPage apps={compare.data?.items ?? []} />;
}
