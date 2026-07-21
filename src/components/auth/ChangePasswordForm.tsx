"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ApiClientError, apiClient } from "@/lib/apiClient";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmation) {
      setError("New password confirmation does not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient("/api/auth/reauthenticate", {
        method: "POST",
        body: { password: currentPassword },
      });
      await apiClient("/api/auth/change-password", {
        method: "POST",
        body: { currentPassword, newPassword },
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setMessage("Password changed. Other devices have been signed out and this device has a fresh session.");
    } catch (submitError) {
      setError(submitError instanceof ApiClientError ? submitError.message : "Password change could not be completed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-700">Account security</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Change your password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Confirm your current password before choosing a new one. All existing sessions will be revoked and this device will receive one fresh session.
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium text-slate-700">
            Current password
            <input required maxLength={128} type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            New password
            <input required minLength={12} maxLength={128} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Confirm new password
            <input required minLength={12} maxLength={128} type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" />
          </label>

          {error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}
          {message ? <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p> : null}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? "Securing account..." : "Change password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Cannot confirm your current password? <Link href="/forgot-password" className="font-semibold text-blue-700">Use account recovery</Link>
        </p>
      </section>
    </main>
  );
}
