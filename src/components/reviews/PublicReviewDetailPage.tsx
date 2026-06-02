"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicReviewDetailData } from "@/types/publicReviewDetail";
import GlobalFilterPanel from "@/components/filters/GlobalFilterPanel";
import { userDashboardFilterSchema } from "@/config/filterSchemas";
import { applyGlobalFilters } from "@/lib/filterEngine";
import { useMarkReviewHelpful, useReportReview, useReviewDetail } from "@/hooks/useReviewDetail";

export function RatingStars({ rating }: { rating: number }) {
  return <div className="flex gap-1">{[1,2,3,4,5].map((i)=><span key={i} className={i<=Math.round(rating)?"text-amber-500":"text-slate-300"}>★</span>)}</div>;
}

export function RiskBadge({ level }: { level: "low"|"medium"|"high"|"severe" }) {
  const cls = level==="low"?"bg-emerald-100 text-emerald-700":level==="medium"?"bg-amber-100 text-amber-700":level==="high"?"bg-orange-100 text-orange-700":"bg-rose-100 text-rose-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{level==="severe"?"Severe complaint pattern":level}</span>;
}

export function VerificationBadge({ badge }: { badge: PublicReviewDetailData["reviewer"]["verificationBadge"] }) {
  const map = { verified_borrower: "Verified borrower", unverified_review: "Unverified review", anonymous_reviewer: "Anonymous reviewer" };
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{map[badge]}</span>;
}

export function ReviewDetailHeader({ data, onHelpful, helpfulPending }: { data: PublicReviewDetailData; onHelpful: () => void; helpfulPending: boolean }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h1 className="text-2xl font-semibold text-slate-900">{data.title}</h1><div className="mt-2 flex flex-wrap items-center gap-2"><RatingStars rating={data.rating} /><VerificationBadge badge={data.reviewer.verificationBadge} /><span className="text-xs text-slate-500">Published: {data.metadata.publishedAt}</span><span className="text-xs text-slate-500">Experience: {data.metadata.experienceDate}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{data.metadata.reviewStatus.replaceAll("_"," ")}</span></div><div className="mt-2 flex flex-wrap gap-2"><button onClick={onHelpful} disabled={helpfulPending} className="rounded border px-2 py-1 text-xs">Helpful ({data.metadata.helpfulCount})</button><button className="rounded border px-2 py-1 text-xs">Share</button><button className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700">Report review</button></div></section>;
}

export function LinkedLoanAppSummaryCard({ app }: { app: PublicReviewDetailData["linkedApp"] }) {
  return <section className="sticky top-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><img src={app.logoUrl} alt={app.name} className="h-10 w-10 rounded border" /><div><p className="font-semibold">{app.name}</p><p className="text-xs text-slate-600">{app.developerName}</p></div></div><p className="mt-2 text-xs text-slate-600">Claimed NBFC partner: {app.claimedNbfcPartner}</p><p className="text-xs text-slate-600">Trust {app.trustScore} • {app.averageRating} rating • {app.reviewCount} reviews</p><div className="mt-2"><RiskBadge level={app.riskLevel} /></div><div className="mt-2 flex gap-2"><Link href={app.profileUrl} className="rounded border px-2 py-1 text-xs font-semibold">View App Profile</Link><Link href={`${app.profileUrl}/submit-review`} className="rounded border px-2 py-1 text-xs font-semibold">Write Review</Link></div></section>;
}

export function ComplaintTagBadges({ tags }: { tags: string[] }) {
  return <div className="mt-2 flex flex-wrap gap-1">{tags.map((t)=><span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}</div>;
}

export function ReviewContentCard({ data }: { data: PublicReviewDetailData }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold">Main review content</h2><p className="mt-2 text-sm text-slate-700">{data.body}</p><ComplaintTagBadges tags={data.incident.tags} /><p className="mt-2 text-xs text-slate-600">Loan amount range: {data.incident.loanAmountRange} • Incident category: {data.incident.category}</p>{data.metadata.redactionsApplied && <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">{data.metadata.publicModerationNote}</p>}</section>;
}

export function ReviewModerationTransparency({ data }: { data: PublicReviewDetailData }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-sm"><h3 className="font-semibold">Review verification / moderation transparency</h3><p>Reviewer verification: {data.reviewer.verificationBadge.replaceAll("_"," ")}</p><p>Evidence submitted: {data.metadata.evidenceSubmitted?"Yes":"No"}</p><p>Evidence public: {data.metadata.evidencePublic?"Yes":"No"}</p><p>Redactions applied: {data.metadata.redactionsApplied?"Yes":"No"}</p><p>Company responded: {data.companyResponse.exists?"Yes":"No"}</p><p className="mt-1 text-xs text-slate-500">Evidence, if submitted, is kept private by default and is not displayed publicly.</p></section>;
}

export function CompanyResponseCard({ data }: { data: PublicReviewDetailData["companyResponse"] }) {
  if (!data.exists) return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-sm">This company has not added a public response to this review yet.<div className="mt-2 flex gap-2"><button className="rounded border px-2 py-1 text-xs">Claim profile to respond</button><button className="rounded border px-2 py-1 text-xs">View company response policy</button></div></section>;
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-sm"><h3 className="font-semibold">Company response</h3><p>{data.companyName} {data.verifiedCompany ? "• Verified company" : ""}</p><p className="text-xs text-slate-600">{data.responseDate} • {data.responseCategory.replaceAll("_"," ")}</p><p className="mt-2">{data.body}</p><p className="mt-1 text-xs text-slate-600">Official contact: {data.officialContactChannel}</p></section>;
}

export function ReportReviewModal({
  open,
  reasons,
  selectedReason,
  isPending,
  resultMessage,
  onReasonChange,
  onSubmit,
  onClose,
}: {
  open: boolean;
  reasons: PublicReviewDetailData["reportReasons"];
  selectedReason: string;
  isPending: boolean;
  resultMessage: string;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 p-4">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <h4 className="text-sm font-semibold">Report review</h4>
        <div className="mt-2 space-y-1">
          {reasons.map((r) => <label key={r.id} className="block text-sm"><input type="radio" name="reason" value={r.id} checked={selectedReason === r.id} onChange={() => onReasonChange(r.id)} className="mr-2" />{r.label}</label>)}
        </div>
        {resultMessage && <p className="mt-2 rounded bg-slate-50 p-2 text-xs text-slate-700">{resultMessage}</p>}
        <div className="mt-3 flex gap-2">
          <button onClick={onSubmit} disabled={!selectedReason || isPending} className="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">Submit report</button>
          <button onClick={onClose} className="rounded border px-3 py-2 text-xs font-semibold">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export function ReviewActionControls({ onReport, onHelpful, helpfulPending }: { onReport: () => void; onHelpful: () => void; helpfulPending: boolean }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex flex-wrap gap-2"><button onClick={onHelpful} disabled={helpfulPending} className="rounded border px-2 py-1 text-xs">Helpful</button><button className="rounded border px-2 py-1 text-xs">Save</button><button className="rounded border px-2 py-1 text-xs">Share</button><button onClick={onReport} className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700">Report</button></div></section>;
}

export function RelatedReviewsSection({ items }: { items: PublicReviewDetailData["relatedReviews"] }) {
  return <section className="space-y-2"><h3 className="text-lg font-semibold">Related reviews</h3><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{items.map((r)=><article key={r.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><p className="font-semibold">{r.title}</p><RatingStars rating={r.rating} /><p className="text-sm text-slate-600">{r.excerpt}</p><ComplaintTagBadges tags={r.tags} /><Link href={r.reviewUrl} className="mt-1 inline-block text-xs font-semibold underline">Read Review</Link></article>)}</div></section>;
}

export function SimilarComplaintPatternCard({ items }: { items: PublicReviewDetailData["similarComplaintPatterns"] }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Similar complaint pattern</h3><p className="text-sm text-slate-600">Other users reviewing this app also mentioned:</p><div className="mt-2 flex flex-wrap gap-1">{items.map((x)=><span key={x.tag} className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">{x.tag} {x.mentionPercent}%</span>)}</div></section>;
}

export function SafetyNextStepsCard() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Safety next steps</h3><p className="text-sm text-slate-600">If you experienced something similar, you may consider these next steps.</p><div className="mt-2 flex flex-wrap gap-2">{[
    ["/loan-apps/swift-cash/submit-review","Submit your own review"],
    ["/legal-action-guide","Open legal action guide"],
    ["/complaint-templates","Use complaint template"],
    ["/loan-apps/swift-cash","Check app profile"],
    ["/compare","Compare similar apps"],
    ["/learn","Preserve evidence checklist"],
  ].map(([href,label])=><Link key={href as string} href={href as string} className="rounded border px-2 py-1 text-xs font-semibold">{label as string}</Link>)}</div></section>;
}

export function ReviewPolicyNotice() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">Reviews reflect individual user experiences and are moderated for privacy and safety. We do not make final legal findings about any app, company, or individual.</section>;
}

export function MobileReviewActionBar({ onReport, onHelpful, helpfulPending }: { onReport: () => void; onHelpful: () => void; helpfulPending: boolean }) {
  return <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden"><div className="mx-auto flex max-w-4xl gap-2"><button onClick={onHelpful} disabled={helpfulPending} className="flex-1 rounded-xl border px-3 py-2 text-sm font-semibold">Helpful</button><button className="flex-1 rounded-xl border px-3 py-2 text-sm font-semibold">Share</button><button onClick={onReport} className="flex-1 rounded-xl border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700">Report</button></div></div>;
}

export default function PublicReviewDetailPage({ reviewId }: { reviewId: string }) {
  const reviewQuery = useReviewDetail(reviewId);
  const helpful = useMarkReviewHelpful(reviewId);
  const reportReview = useReportReview(reviewId);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [filters, setFilters] = useState({});
  const data = reviewQuery.data?.data;
  const filteredRelated = useMemo(
    () => applyGlobalFilters(data?.relatedReviews ?? [], userDashboardFilterSchema, filters),
    [data?.relatedReviews, filters],
  );
  if (reviewQuery.isLoading) {
    return <main className="min-h-screen bg-slate-50 p-6"><section className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 text-center text-sm text-slate-600">Loading review...</section></main>;
  }
  if (reviewQuery.isError || !data) {
    return <main className="min-h-screen bg-slate-50 p-6"><section className="mx-auto max-w-5xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-900"><p>Could not load this review. {(reviewQuery.error as Error | null)?.message}</p><button onClick={() => reviewQuery.refetch()} className="mt-3 rounded-xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">Try again</button></section></main>;
  }
  const onHelpful = () => helpful.mutate();
  const onSubmitReport = () => {
    if (!selectedReason) return;
    reportReview.mutate(selectedReason, {
      onSuccess: (result) => {
        setReportMessage(result.message);
      },
      onError: (error) => {
        setReportMessage(error instanceof Error ? error.message : "Could not submit report.");
      },
    });
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:px-6 md:py-10 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <ReviewDetailHeader data={data} onHelpful={onHelpful} helpfulPending={helpful.isPending} />
          <ReviewContentCard data={data} />
          <ReviewModerationTransparency data={data} />
          <CompanyResponseCard data={data.companyResponse} />
          <ReviewActionControls onReport={() => setReportOpen(true)} onHelpful={onHelpful} helpfulPending={helpful.isPending} />
          <GlobalFilterPanel schema={userDashboardFilterSchema} state={filters} onChange={setFilters} />
          <RelatedReviewsSection items={filteredRelated} />
          <SimilarComplaintPatternCard items={data.similarComplaintPatterns} />
          <SafetyNextStepsCard />
          <ReviewPolicyNotice />
        </div>
        <LinkedLoanAppSummaryCard app={data.linkedApp} />
      </div>
      <ReportReviewModal
        open={reportOpen}
        reasons={data.reportReasons}
        selectedReason={selectedReason}
        isPending={reportReview.isPending}
        resultMessage={reportMessage}
        onReasonChange={setSelectedReason}
        onSubmit={onSubmitReport}
        onClose={() => setReportOpen(false)}
      />
      <MobileReviewActionBar onReport={() => setReportOpen(true)} onHelpful={onHelpful} helpfulPending={helpful.isPending} />
    </main>
  );
}
