import Link from "next/link";
import type { ReviewPolicyPageData } from "@/types/reviewPolicyPage";

export function PolicyTableOfContents() {
  const items = [
    "Core Principles","What Users Can Post","What Users Cannot Post","Safer Wording Guide","Moderation Process","Evidence Handling","Company Response Policy","Removal / Rejection Reasons","Correction and Dispute","Privacy and Safety","Appeals","FAQ","Disclaimer"
  ];
  return <aside className="sticky top-4 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:block"><h3 className="mb-2 text-sm font-semibold">Contents</h3><div className="space-y-1 text-xs text-slate-600">{items.map((i)=><p key={i}>{i}</p>)}</div></aside>;
}

export function PolicyHero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm md:p-8">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Review Policy & Community Guidelines</h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Our platform helps users share loan app experiences safely while protecting privacy, preventing abuse, and allowing fair company responses.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/loan-apps/swift-cash/submit-review" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Write a Review</Link>
        <Link href="/loan-apps/swift-cash/submit-review" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Report an Issue</Link>
        <Link href="/business/claim" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Company Response Policy</Link>
        <Link href="/suggest-app" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Submit Correction</Link>
      </div>
    </section>
  );
}

export function CorePrinciplesGrid({ items }: { items: ReviewPolicyPageData["principles"] }) {
  return <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">{items.map((p)=><article key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xl">{p.icon}</p><h3 className="text-sm font-semibold">{p.title}</h3><p className="text-sm text-slate-600">{p.description}</p></article>)}</section>;
}

export function AllowedContentSection({ items }: { items: ReviewPolicyPageData["allowedContent"] }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">What users can post</h2>{items.map((a)=><div key={a.id} className="mt-3 rounded-xl bg-slate-50 p-3"><p className="font-semibold">{a.title}</p><p className="text-sm text-slate-600">{a.description}</p><div className="mt-1 space-y-1 text-sm">{a.examples.map((e)=><p key={e}>• {e}</p>)}</div></div>)}</section>;
}

export function ProhibitedContentSection({ items }: { items: ReviewPolicyPageData["prohibitedContent"] }) {
  return <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="text-lg font-semibold text-amber-900">What users cannot post</h2><div className="mt-2 grid gap-2 md:grid-cols-2">{items.map((i)=><div key={i.id} className="rounded-xl border border-amber-200 bg-white p-3"><p className="font-semibold text-amber-900">{i.title}</p><p className="text-sm text-amber-900">{i.description}</p><p className="text-xs text-amber-700">Severity: {i.severity}</p></div>)}</div></section>;
}

export function SaferWordingGuide({ items }: { items: ReviewPolicyPageData["saferWordingExamples"] }) {
  return <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-2 text-lg font-semibold">Safer wording guide</h2><table className="min-w-[700px] text-left text-sm"><thead><tr className="border-b"><th className="py-2 pr-3">Unsafe wording</th><th className="py-2 pr-3">Safer wording</th><th className="py-2">Explanation</th></tr></thead><tbody>{items.map((x)=><tr key={x.unsafe} className="border-b"><td className="py-2 pr-3 text-rose-700">{x.unsafe}</td><td className="py-2 pr-3 text-emerald-700">{x.safer}</td><td className="py-2">{x.explanation}</td></tr>)}</tbody></table></section>;
}

export function ModerationProcessTimeline({ items }: { items: ReviewPolicyPageData["moderationSteps"] }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Moderation process</h2><div className="mt-2 space-y-2">{items.map((s)=><div key={s.step} className="rounded-xl bg-slate-50 p-3 text-sm"><p className="font-semibold">Step {s.step}: {s.title}</p><p className="text-slate-600">{s.description}</p></div>)}</div></section>;
}

export function EvidenceHandlingPolicy({ data }: { data: ReviewPolicyPageData["evidencePolicy"] }) {
  return <section className="grid grid-cols-1 gap-3 md:grid-cols-2"><article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Evidence allowed privately</h3>{data.allowedPrivateEvidence.map((x)=><p key={x} className="text-sm text-slate-700">• {x}</p>)}</article><article className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><h3 className="font-semibold text-amber-900">Evidence not allowed</h3>{data.prohibitedEvidence.map((x)=><p key={x} className="text-sm text-amber-900">• {x}</p>)}</article><article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2"><h3 className="font-semibold">Privacy notes</h3>{data.privacyNotes.map((x)=><p key={x} className="text-sm text-slate-700">• {x}</p>)}</article></section>;
}

export function CompanyResponsePolicy({ data }: { data: ReviewPolicyPageData["companyPolicy"] }) {
  return <section className="grid grid-cols-1 gap-3 md:grid-cols-2"><article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><h3 className="font-semibold text-emerald-900">Companies may</h3>{data.allowedActions.map((x)=><p key={x} className="text-sm text-emerald-900">• {x}</p>)}</article><article className="rounded-2xl border border-rose-200 bg-rose-50 p-4"><h3 className="font-semibold text-rose-900">Companies may not</h3>{data.prohibitedActions.map((x)=><p key={x} className="text-sm text-rose-900">• {x}</p>)}</article></section>;
}

export function RemovalReasonsSection({ items }: { items: ReviewPolicyPageData["removalReasons"] }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Review removal / rejection reasons</h2><div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">{items.map((x)=><div key={x} className="rounded-xl bg-slate-50 p-3 text-sm">{x}</div>)}</div></section>;
}

export function CorrectionDisputeProcess({ items }: { items: ReviewPolicyPageData["correctionDisputeOptions"] }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Correction and dispute process</h2>{items.map((x)=><p key={x} className="text-sm text-slate-700">• {x}</p>)}<div className="mt-3 flex flex-wrap gap-2"><button className="rounded border px-3 py-2 text-xs font-semibold">Request Correction</button><button className="rounded border px-3 py-2 text-xs font-semibold">Report Policy Violation</button><Link href="/business/claim" className="rounded border px-3 py-2 text-xs font-semibold">Claim Company Profile</Link></div></section>;
}

export function PrivacySafetyCommitments({ items }: { items: ReviewPolicyPageData["privacyCommitments"] }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Privacy and safety commitments</h2>{items.map((x)=><p key={x} className="text-sm text-slate-700">• {x}</p>)}</section>;
}

export function AppealsSection({ data }: { data: ReviewPolicyPageData["appeals"] }) {
  return <section className="grid grid-cols-1 gap-3 md:grid-cols-2"><article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">User appeals</h3>{data.userAppeals.map((x)=><p key={x} className="text-sm text-slate-700">• {x}</p>)}</article><article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Company appeals</h3>{data.companyAppeals.map((x)=><p key={x} className="text-sm text-slate-700">• {x}</p>)}</article></section>;
}

export function PolicyFAQ({ items }: { items: ReviewPolicyPageData["faq"] }) {
  return <section className="space-y-2">{items.map((f)=><details key={f.question} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><summary className="cursor-pointer text-sm font-semibold">{f.question}</summary><p className="mt-2 text-sm text-slate-600">{f.answer}</p></details>)}</section>;
}

export function FinalPolicyDisclaimer() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">Reviews on this platform reflect user-submitted experiences and are moderated for privacy, safety, and policy compliance. We do not make final legal, regulatory, or criminal findings about any app, company, NBFC, representative, or individual.</section>;
}

export default function ReviewPolicyCommunityGuidelinesPage({ data }: { data: ReviewPolicyPageData }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:px-6 md:py-10 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <PolicyHero />
          <CorePrinciplesGrid items={data.principles} />
          <AllowedContentSection items={data.allowedContent} />
          <ProhibitedContentSection items={data.prohibitedContent} />
          <SaferWordingGuide items={data.saferWordingExamples} />
          <ModerationProcessTimeline items={data.moderationSteps} />
          <EvidenceHandlingPolicy data={data.evidencePolicy} />
          <CompanyResponsePolicy data={data.companyPolicy} />
          <RemovalReasonsSection items={data.removalReasons} />
          <CorrectionDisputeProcess items={data.correctionDisputeOptions} />
          <PrivacySafetyCommitments items={data.privacyCommitments} />
          <AppealsSection data={data.appeals} />
          <PolicyFAQ items={data.faq} />
          <FinalPolicyDisclaimer />
        </div>
        <PolicyTableOfContents />
      </div>
    </main>
  );
}
