import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f3f7ff] px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">About Trust Loans</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Helping borrowers make safer decisions.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Trust Loans is a borrower safety platform that helps people understand loan apps, identify lenders, recognize unfair recovery practices, and find the right complaint or support channel.
        </p>
        <Link href="/directory" className="mt-8 inline-flex rounded-xl bg-[#070b14] px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">
          Explore the directory
        </Link>
      </section>
    </main>
  );
}
