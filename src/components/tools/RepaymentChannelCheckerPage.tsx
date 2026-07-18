"use client";

import { useState } from "react";

export default function RepaymentChannelCheckerPage() {
  const [appName, setAppName] = useState("");
  const [channelType, setChannelType] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [hasWrittenDue, setHasWrittenDue] = useState(false);

  const riskFlags = [
    !hasWrittenDue ? "No written due details available" : "",
    channelType === "personal_upi" ? "Payment requested to personal UPI" : "",
    !payeeName ? "Payee name not confirmed" : "",
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1000px] space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Repayment Channel Checker</h1>
          <p className="mt-1 text-sm text-slate-600">Verify repayment details before paying, especially during pressure calls.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Verify repayment request</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
            <input value={appName} onChange={(e) => setAppName(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="App name" />
            <select value={channelType} onChange={(e) => setChannelType(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="">Repayment channel type</option>
              <option value="official_app">Official app flow</option>
              <option value="official_bank">Official bank account</option>
              <option value="personal_upi">Personal UPI request</option>
            </select>
            <input value={payeeName} onChange={(e) => setPayeeName(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Payee/account name shown" />
            <input value={upiId} onChange={(e) => setUpiId(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="UPI ID or reference" />
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 md:col-span-2">
              <input type="checkbox" checked={hasWrittenDue} onChange={(e) => setHasWrittenDue(e.target.checked)} />
              I have written due details (loan ID, amount, date)
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Safety result</h2>
          {riskFlags.length ? (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
              <p className="font-semibold">Caution before payment</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {riskFlags.map((flag) => <li key={flag}>{flag}</li>)}
              </ul>
              <p className="mt-2">Pause payment and verify with official app website/grievance contacts first.</p>
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              Details appear more complete. Still preserve proof and verify final closure after payment.
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="/before-you-pay" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Open before-you-pay checklist</a>
            <a href="/grievance-directory" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Verify grievance contacts</a>
          </div>
        </section>
      </div>
    </main>
  );
}
