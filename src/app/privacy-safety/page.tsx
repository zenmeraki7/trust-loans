const notices = [
  "This platform does not collect, store, verify, or certify your screenshots, recordings, call logs, messages, payment receipts, or other evidence.",
  "The incident summary and complaint draft are generated from the information you provide. They help you organize and present your complaint and do not independently prove that a violation occurred.",
  "Keep your original evidence securely and submit it directly to the lender, regulated entity, grievance officer, regulator, police, cybercrime authority, court, or other appropriate authority when required.",
  "Do not enter OTPs, passwords, full Aadhaar/PAN numbers, card PINs, or unrelated private records into summaries, reviews, or complaint drafts.",
  "Complaint drafts are preparation tools, not automatic submissions to external authorities.",
  "Emergency safety concerns should be handled through trusted contacts and official emergency, police, or cybercrime channels before completing ordinary forms.",
];

export default function PrivacyAndSafetyNoticesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Privacy and safety notices</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">Use these notices before writing reviews, preparing evidence lists, or drafting complaints.</p>
      <section className="mt-8 grid gap-3">
        {notices.map((notice) => (
          <article key={notice} className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm">{notice}</article>
        ))}
      </section>
    </main>
  );
}
