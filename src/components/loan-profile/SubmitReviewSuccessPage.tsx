import Link from "next/link";
import OfficialStoreReportCard from "@/components/store-report/OfficialStoreReportCard";
import { officialStoreReport } from "@/data/mockOfficialStoreReport";

type SuccessAppContext = {
  id: string;
  name: string;
  developerName: string;
  playStoreUrl: string;
  appStoreUrl: string;
};

export default function SubmitReviewSuccessPage({ app }: { app: SuccessAppContext }) {
  const storeReportData = {
    ...officialStoreReport,
    app: {
      ...officialStoreReport.app,
      id: app.id,
      name: app.name,
      developerName: app.developerName,
      playStoreUrl: app.playStoreUrl,
      appStoreUrl: app.appStoreUrl,
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1100px] space-y-4">
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-emerald-900">Review submitted</h1>
          <p className="mt-1 text-sm text-emerald-900">Your review was submitted for moderation. Thank you for sharing a factual experience.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={`/loan-apps/${app.id}`} className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900">Back to app profile</Link>
            <Link href="/dashboard" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-900">Go to dashboard</Link>
          </div>
        </section>
        <OfficialStoreReportCard data={storeReportData} />
      </div>
    </main>
  );
}
