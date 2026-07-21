"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ApiClientError, apiClient } from "@/lib/apiClient";
import { safeInternalRedirect } from "@/lib/safeRedirect";

const AdaptiveBotChallenge = dynamic(() => import("@/components/auth/AdaptiveBotChallenge"), {
  loading: () => <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Loading security check…</p>,
});

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

type SignupResponse = {
  message: string;
};

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotPasswordHref, setForgotPasswordHref] = useState("/forgot-password");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [challengeRequired, setChallengeRequired] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");
  const [challengeAttempt, setChallengeAttempt] = useState(0);
  const receiveChallengeToken = useCallback((token: string) => setChallengeToken(token), []);

  useEffect(() => {
    const next = safeInternalRedirect(new URLSearchParams(window.location.search).get("next"));
    setForgotPasswordHref(next === "/dashboard" ? "/forgot-password" : `/forgot-password?next=${encodeURIComponent(next)}`);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (mode === "login" && challengeRequired && !challengeToken) {
      setError("Complete the security check before trying again.");
      return;
    }
    setIsSubmitting(true);

    try {
      const result = await apiClient<AuthResponse | SignupResponse>(`/api/auth/${mode === "signup" ? "signup" : "login"}`, {
        method: "POST",
        body: {
          ...(mode === "signup" ? { name: name.trim() } : {}),
          email: email.trim(),
          password,
        },
        headers: challengeToken ? { "x-turnstile-token": challengeToken } : undefined,
      });

      const next = new URLSearchParams(window.location.search).get("next");
      if (mode === "signup") {
        router.push(`/verify-email?sent=1&email=${encodeURIComponent(email.trim())}&next=${encodeURIComponent(safeInternalRedirect(next))}`);
      } else {
        router.push(safeInternalRedirect(next));
      }
    } catch (submitError) {
      const message = submitError instanceof ApiClientError ? submitError.message : "Authentication failed. Please try again.";
      const details = submitError instanceof ApiClientError ? submitError.details as { challengeRequired?: boolean } | undefined : undefined;
      setChallengeRequired(Boolean(details?.challengeRequired));
      setChallengeToken("");
      setChallengeAttempt((attempt) => attempt + 1);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-700">Trust Loans</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {mode === "login" ? "Sign in to manage reviews, evidence, and case folders." : "Create an account to save reviews, evidence, and case folders."}
        </p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          {mode === "signup" && <label className="block text-sm font-medium text-slate-700">Name<input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>}
          <label className="block text-sm font-medium text-slate-700">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" inputMode="email" className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>
          <label className="block text-sm font-medium text-slate-700">Password<input required minLength={mode === "signup" ? 12 : 1} maxLength={128} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>
          {mode === "login" && challengeRequired ? <AdaptiveBotChallenge key={challengeAttempt} onToken={receiveChallengeToken} /> : null}
          {error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}</button>
        </form>
        {mode === "login" ? <p className="mt-4 text-center text-sm"><Link href={forgotPasswordHref} className="font-semibold text-blue-700">Forgot or need to set up your password?</Link></p> : null}
        {mode === "login" ? <p className="mt-2 text-center text-sm"><Link href="/verify-email" className="font-semibold text-blue-700">Need a new verification email?</Link></p> : null}
        <p className="mt-6 text-center text-sm text-slate-600">{mode === "login" ? "New to Trust Loans?" : "Already have an account?"} <Link href={mode === "login" ? "/signup" : "/login"} className="font-semibold text-blue-700">{mode === "login" ? "Sign up" : "Log in"}</Link></p>
      </section>
    </main>
  );
}
