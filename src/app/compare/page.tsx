import { Suspense } from "react";
import CompareLoanAppsRoute from "@/components/compare/CompareLoanAppsRoute";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50 p-6 text-sm text-slate-600">Loading comparison filters...</main>}>
      <CompareLoanAppsRoute />
    </Suspense>
  );
}
