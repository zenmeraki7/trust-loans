//app/components/entities/CompanyNbfcProfileRoute.tsx
"use client";

import CompanyNbfcProfilePage from "@/components/entities/CompanyNbfcProfilePage";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";

export default function CompanyNbfcProfileRoute({ slug }: { slug: string }) {
  const profile = useCompanyProfile(slug);

  if (profile.isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          Loading company profile...
        </section>
      </main>
    );
  }

  if (profile.isError || !profile.data) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <section className="mx-auto max-w-5xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-900">
          <p>Could not load company profile. {(profile.error as Error | null)?.message}</p>
          <button onClick={() => profile.refetch()} className="mt-3 rounded-xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">
            Try again
          </button>
        </section>
      </main>
    );
  }

  return <CompanyNbfcProfilePage data={profile.data} />;
}
