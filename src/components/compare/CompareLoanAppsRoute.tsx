"use client";

import CompareLoanAppsPage from "@/components/compare/CompareLoanAppsPage";
import { useCompareLoanApps } from "@/hooks/useCompareLoanApps";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CompareLoanAppsRoute() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = {
    q: searchParams.get("q") ?? "",
    legalEntity: searchParams.get("legalEntity") ?? "",
    nbfc: searchParams.get("nbfc") ?? "",
    interestRate: searchParams.get("interestRate") ?? "",
    processingFee: searchParams.get("processingFee") ?? "",
    loanTenure: searchParams.get("loanTenure") ?? "",
    complaintVolume: searchParams.get("complaintVolume") ?? "any",
    minComplaintVolume: searchParams.get("minComplaintVolume") ?? "",
    complaintCategory: searchParams.get("complaintCategory") ?? "",
    recoveryConcern: searchParams.get("recoveryConcern") ?? "",
    regulatoryStatus: searchParams.get("regulatoryStatus") ?? "all",
    appStoreAvailability: searchParams.get("appStoreAvailability") ?? "any",
    safetyLevel: searchParams.get("safetyLevel") ?? "all",
  };
  const compare = useCompareLoanApps([], filters);
  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === "all" || value === "any") next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}${next.toString() ? `?${next.toString()}` : ""}`);
  };
  const clearFilters = () => router.push(pathname);

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

  return <CompareLoanAppsPage apps={compare.data?.items ?? []} filters={filters} onFilterChange={updateFilter} onClearFilters={clearFilters} />;
}
