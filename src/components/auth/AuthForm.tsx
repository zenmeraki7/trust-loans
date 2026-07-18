"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("trust-loans-auth", JSON.stringify({
      name: mode === "signup" ? name.trim() : email.split("@")[0],
      email: email.trim().toLowerCase(),
      signedInAt: new Date().toISOString(),
    }));
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next?.startsWith("/") ? next : "/dashboard");
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
          <label className="block text-sm font-medium text-slate-700">Password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" /></label>
          <button type="submit" className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">{mode === "login" ? "Log in" : "Create account"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">{mode === "login" ? "New to Trust Loans?" : "Already have an account?"} <Link href={mode === "login" ? "/signup" : "/login"} className="font-semibold text-blue-700">{mode === "login" ? "Sign up" : "Log in"}</Link></p>
      </section>
    </main>
  );
}
