import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f3f7ff] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Contact Us</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">How can we help?</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          For urgent recovery threats or harassment, use Emergency Help. For a formal complaint, start the guided complaint process.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/emergency-help" className="rounded-xl bg-rose-600 px-5 py-3 text-center text-sm font-bold text-white hover:bg-rose-700">Emergency Help</Link>
          <Link href="/complaints/start" className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-bold text-slate-800 hover:bg-slate-100">Start a Complaint</Link>
        </div>
      </section>
    </main>
  );
}
