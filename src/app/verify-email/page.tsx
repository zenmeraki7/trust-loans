import { Suspense } from "react";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

export default function VerifyEmailPage() {
  return <Suspense fallback={<main className="min-h-[60dvh] p-8 text-center text-sm text-slate-600">Loading verification…</main>}><VerifyEmailForm /></Suspense>;
}
