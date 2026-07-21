import Link from "next/link";

const removedFeatures = [
  "File uploads",
  "Malware scanning",
  "Evidence download URLs",
  "Document preview workers",
  "Evidence object storage",
  "Audio transcription",
  "Evidence sharing",
  "Evidence redaction",
  "Evidence-access logs",
];

export default function AdminEvidenceVaultPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Evidence storage is disabled</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Trust Loans does not collect, store, verify, certify, preview, scan, redact, transcribe, share, or provide download links for user evidence.
          Admins should review only the text, profile data, complaint summaries, moderation notes, and audit records the platform actually holds.
        </p>
      </section>
      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-xl font-bold text-amber-950">Removed evidence-storage features</h2>
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-amber-900 sm:grid-cols-2">
          {removedFeatures.map((feature) => <li key={feature} className="rounded-xl bg-white/70 p-3">{feature}</li>)}
        </ul>
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/moderation" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Review moderation queue</Link>
        <Link href="/privacy-safety" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">View privacy notices</Link>
      </div>
    </main>
  );
}
