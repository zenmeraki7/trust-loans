export default function ReportEscalationModalSkeleton() {
  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Loading report options"
        aria-busy="true"
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <p className="text-sm font-semibold text-slate-900">Loading official report options…</p>
        <div className="mt-4 grid gap-2" aria-hidden="true">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-16 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </section>
    </div>
  );
}
