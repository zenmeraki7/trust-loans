import { Suspense } from "react";
import PublicDirectoryPage from "@/components/directory/PublicDirectoryPage";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50 p-6 text-sm text-slate-600">Loading directory...</main>}>
      <PublicDirectoryPage />
    </Suspense>
  );
}
