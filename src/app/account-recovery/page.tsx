import Link from "next/link";

export default function AccountRecoveryPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Account recovery</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">Recover access if you forgot your password or need to set a password for an older account.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/forgot-password" className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white">Send reset link</Link>
          <Link href="/login" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700">Return to login</Link>
        </div>
      </section>
    </main>
  );
}
