import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/PasswordResetForms";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-[calc(100dvh-4rem)] bg-slate-50 p-6 text-sm text-slate-600">Loading password setup...</main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
