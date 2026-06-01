import { Suspense } from "react";
import LoanAppsDirectoryPage from "@/components/loan-directory/LoanAppsDirectoryPage";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50 p-6 text-sm text-slate-600">Loading loan apps...</main>}>
      <LoanAppsDirectoryPage />
    </Suspense>
  );
}
