import Link from "next/link";

export default function EvidencePreparationPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Prepare your evidence checklist</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Trust Loans does not upload, store, verify, certify, preview, scan, redact, transcribe, share, or provide download links for your evidence. Use this page to list what you have and keep originals securely with you.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/evidence" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Open evidence checklist</Link>
          <Link href="/complaints/start" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Start complaint</Link>
        </div>
      </section>
    </main>
  );
}
