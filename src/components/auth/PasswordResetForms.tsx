"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ApiClientError, apiClient } from "@/lib/apiClient";
import { safeInternalRedirect } from "@/lib/safeRedirect";

type AuthResponse = {
  expiresAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    status: string;
    emailVerified: boolean;
  };
};

type ForgotPasswordResponse = {
  message: string;
};

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const result = await apiClient<ForgotPasswordResponse>("/api/auth/forgot-password", {
        method: "POST",
        body: { email },
      });
      setMessage(result.message);
    } catch (submitError) {
      setError(submitError instanceof ApiClientError ? submitError.message : "Could not prepare password setup.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-700">Trust Loans</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Set up or reset password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Use this if your account was created before passwords were added, or if you forgot your password.</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium text-slate-700">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" inputMode="email" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>
          {error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
          {message ? <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p> : null}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Sending..." : "Send reset instructions"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600"><Link href="/login" className="font-semibold text-blue-700">Back to login</Link></p>
      </section>
    </main>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const next = safeInternalRedirect(searchParams.get("next"));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await apiClient<AuthResponse>("/api/auth/reset-password", {
        method: "POST",
        body: { token, password },
      });
      router.push(next);
    } catch (submitError) {
      setError(submitError instanceof ApiClientError ? submitError.message : "Could not reset password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-700">Trust Loans</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">After this, you can log in normally with your email and password.</p>
        {!token ? (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">This reset link is missing a token. Start again from forgot password.</div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block text-sm font-medium text-slate-700">New password<input required minLength={12} maxLength={128} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>
            {error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Saving..." : "Save password"}</button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-slate-600"><Link href="/forgot-password" className="font-semibold text-blue-700">Request a new link</Link></p>
      </section>
    </main>
  );
}
