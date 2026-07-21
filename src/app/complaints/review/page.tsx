import Link from "next/link";

const checklist = [
  "All names, phone numbers, dates, and amounts are accurate.",
  "The complaint does not include guesses as facts.",
  "OTPs, passwords, unrelated IDs, and unrelated contacts are removed.",
  "Evidence is listed and private files are not shared publicly.",
  "The requested action is clear and realistic.",
  "The destination matches the facts: lender, nodal officer, RBI, Sachet, cybercrime, or police.",
];

export default function ComplaintReviewPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Review your complaint before filing</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">Use this page as a final safety and accuracy check before copying a draft to an official portal.</p>
      <section className="mt-8 grid gap-3">
        {checklist.map((item) => (
          <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
            <span className="mt-0.5 text-blue-700">□</span>
            <p>{item}</p>
          </div>
        ))}
      </section>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/complaint-wizard" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Return to guided form</Link>
        <Link href="/complaints/export" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">Draft and export</Link>
      </div>
    </main>
  );
}
