"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ApiClientError, apiClient } from "@/lib/apiClient";
import { safeInternalRedirect } from "@/lib/safeRedirect";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [message, setMessage] = useState(searchParams.get("sent") ? "Check your email for a verification link." : "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function verify() {
    setError("");
    setIsSubmitting(true);
    try {
      await apiClient("/api/auth/verify-email", { method: "POST", body: { token } });
      router.replace(safeInternalRedirect(searchParams.get("next")));
    } catch (submitError) {
      setError(submitError instanceof ApiClientError ? submitError.message : "Could not verify this email.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const result = await apiClient<{ message: string }>("/api/auth/resend-verification", {
        method: "POST",
        body: { email },
      });
      setMessage(result.message);
    } catch (submitError) {
      setError(submitError instanceof ApiClientError ? submitError.message : "Could not request another link.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-700">BorrowScope</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Verify your email</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Email verification protects your account and is required before sign-in.</p>
        {error ? <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
        {message ? <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p> : null}
        {token ? (
          <button type="button" onClick={verify} disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {isSubmitting ? "Verifying…" : "Verify email"}
          </button>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={resend}>
            <label className="block text-sm font-medium text-slate-700">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>
            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{isSubmitting ? "Sending…" : "Send a new link"}</button>
          </form>
        )}
        <p className="mt-6 text-center text-sm"><Link href="/login" className="font-semibold text-blue-700">Back to login</Link></p>
      </section>
    </main>
  );
}
