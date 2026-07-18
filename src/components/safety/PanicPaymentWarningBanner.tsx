import Link from "next/link";

export default function PanicPaymentWarningBanner() {
  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
      <p className="text-sm font-semibold text-rose-900">
        Do not panic-pay to a random UPI or personal account without verifying the official repayment channel.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/tools/repayment-channel-checker" className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-semibold text-white">
          Open repayment channel checker
        </Link>
        <Link href="/before-you-pay" className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-900">
          Before you pay checklist
        </Link>
      </div>
    </section>
  );
}
