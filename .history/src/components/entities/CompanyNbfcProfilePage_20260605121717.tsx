//src/app/components/entities/CompanyNbfcProfilePage.tsx
import Link from "next/link";
import type { EntityProfileData } from "@/types/entityProfile";

export function RatingStars({ rating }: { rating: number }) {
  return <div className="flex gap-1">{[1,2,3,4,5].map((i)=><span key={i} className={i<=Math.round(rating)?"text-amber-500":"text-slate-300"}>★</span>)}</div>;
}

export function RiskBadge({ level }: { level: "low"|"medium"|"high"|"severe" }) {
  const cls = level==="low"?"bg-emerald-100 text-emerald-700":level==="medium"?"bg-amber-100 text-amber-700":level==="high"?"bg-orange-100 text-orange-700":"bg-rose-100 text-rose-700";
  const label = level==="severe"?"Severe Complaint Pattern":level[0].toUpperCase()+level.slice(1);
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{label}</span>;
}

export function VerificationStatusBadge({ status }: { status: EntityProfileData["verificationStatus"] }) {
  const cls = status==="verified_public_details"?"bg-emerald-100 text-emerald-700":status==="partially_verified"?"bg-amber-100 text-amber-700":status==="conflicting_information"?"bg-rose-100 text-rose-700":"bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{status.replaceAll("_"," ")}</span>;
}

export function RelationshipTypeBadge({ label }: { label: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{label.replaceAll("_"," ")}</span>;
}

export function EntityHero({ data }: { data: EntityProfileData }) {
  const linkedAppsHref = `/loan-apps?q=${encodeURIComponent(data.displayName)}`;
  const reportHref = data.linkedApps[0]?.profileUrl ? `${data.linkedApps[0].profileUrl}/submit-review` : "/loan-apps";

  return <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm md:p-8"><h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">{data.displayName}</h1><div className="mt-2 flex flex-wrap gap-2"><RelationshipTypeBadge label={data.entityType} /><VerificationStatusBadge status={data.verificationStatus} /><RiskBadge level={data.riskSignalLevel} /></div><p className="mt-2 text-sm text-slate-600">Linked-app trust score avg: {data.averageLinkedAppTrustScore} • Linked apps: {data.totalLinkedApps} • Reviews across linked apps: {data.totalReviewsAcrossApps}</p><div className="mt-3 flex flex-wrap gap-2"><Link href={linkedAppsHref} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">View Linked Apps</Link><Link href="/corrections" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Submit Correction</Link><Link href="/business/claim" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Claim This Entity</Link><Link href={reportHref} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Report Experience</Link></div></section>;
}

export function EntityDisclaimerBox() {
  return <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">This profile summarizes public details, app-provided claims, company-submitted information, and user-submitted reviews linked to this entity. Listed relationships may be claimed, verified, disputed, or under review. We do not make final legal or regulatory findings.</section>;
}
a
export function EntityDetailsCard({ data }: { data: EntityProfileData }) {
  const d = data.details;
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold">Entity details</h2><div className="grid grid-cols-1 gap-2 md:grid-cols-2 text-sm">{[
    `Entity legal name: ${d.legalName}`,`Display name: ${data.displayName}`,`Entity type: ${data.entityType}`,`Website: ${d.website}`,`Support email: ${d.supportEmail}`,`Support phone: ${d.supportPhone}`,`Registered address: ${d.registeredAddress}`,`Registration number: ${d.registrationNumber}`,`RBI registration claim: ${d.rbiRegistrationClaim}`,`Last verified: ${d.lastVerifiedAt}`,`Verification confidence: ${d.verificationConfidence}`
  ].map((x)=><div key={x} className="rounded bg-slate-50 p-2">{x}</div>)}</div><p className="mt-2 text-xs text-slate-600">Source URLs: {d.sourceUrls.join(", ")}</p></section>;
}

export function LinkedLoanAppCard({ app }: { app: EntityProfileData["linkedApps"][number] }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><img src={app.logoUrl} alt={app.name} className="h-10 w-10 rounded border" /><div className="min-w-0 flex-1"><p className="font-semibold">{app.name}</p><p className="text-xs text-slate-600">{app.developerName} • {app.companyName}</p></div><RiskBadge level={app.riskLevel} /></div><div className="mt-2 flex flex-wrap gap-1"><RelationshipTypeBadge label={app.relationshipType} /><RelationshipTypeBadge label={app.relationshipVerificationStatus} /></div><p className="mt-1 text-xs text-slate-600">Trust {app.trustScore} • {app.averageRating} rating • {app.reviewCount} reviews</p><div className="mt-1 flex flex-wrap gap-1">{app.topComplaintTags.map((t)=><span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}</div><div className="mt-2 flex gap-2"><Link href={app.profileUrl} className="rounded border px-2 py-1 text-xs font-semibold">View App Profile</Link><Link href={`${app.profileUrl}/submit-review`} className="rounded border px-2 py-1 text-xs font-semibold">Write Review</Link></div></article>;
}

export function LinkedLoanAppsSection({ apps }: { apps: EntityProfileData["linkedApps"] }) {
  return <section className="space-y-2"><h2 className="text-lg font-semibold">Linked loan apps</h2><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{apps.map((a)=><LinkedLoanAppCard key={a.id} app={a} />)}</div></section>;
}

export function RelationshipVerificationTable({ rows }: { rows: EntityProfileData["relationshipEvidence"] }) {
  return <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold">Relationship verification</h2><table className="min-w-[900px] text-left text-xs"><thead><tr className="border-b">{["App","Relationship","Verification","Source type","Source URL","Last checked","Confidence","Notes"].map((h)=><th key={h} className="py-2 pr-2">{h}</th>)}</tr></thead><tbody>{rows.map((r)=><tr key={r.appId+r.sourceUrl} className="border-b"><td className="py-2 pr-2">{r.appName}</td><td className="py-2 pr-2">{r.relationshipType}</td><td className="py-2 pr-2">{r.verificationStatus}</td><td className="py-2 pr-2">{r.sourceType}</td><td className="py-2 pr-2">{r.sourceUrl}</td><td className="py-2 pr-2">{r.lastCheckedAt}</td><td className="py-2 pr-2">{r.confidence}</td><td className="py-2 pr-2">{r.notes}</td></tr>)}</tbody></table></section>;
}

export function EntityComplaintPatternSummary({ data }: { data: EntityProfileData["complaintPatterns"] }) {
  const items = [["Total reviews", data.totalReviews],["Harassment %", data.harassmentPercent],["Hidden charges %", data.hiddenChargesPercent],["Contact list abuse %", data.contactListAbusePercent],["Data misuse %", data.dataMisusePercent],["Fake legal notice %", data.fakeLegalNoticePercent],["Payment not updated %", data.paymentNotUpdatedPercent],["Loan not closed %", data.loanNotClosedPercent],["Positive reviews %", data.positiveReviewPercent]];
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold">Complaint pattern summary across linked apps</h2><p className="mb-2 text-xs text-slate-600">Across linked apps, users reported the following complaint patterns.</p><div className="grid grid-cols-2 gap-2 md:grid-cols-3">{items.map(([k,v])=><div key={String(k)} className="rounded bg-slate-50 p-2 text-xs"><p className="text-slate-500">{k}</p><p className="font-semibold text-slate-900">{v}</p></div>)}</div></section>;
}

export function LinkedAppRiskDistribution({ data }: { data: EntityProfileData["riskDistribution"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-2 text-lg font-semibold">Linked app risk distribution</h2><div className="grid grid-cols-2 gap-2 md:grid-cols-5 text-xs">{Object.entries(data).map(([k,v])=><div key={k} className="rounded bg-slate-50 p-2"><p>{k}</p><p className="font-semibold">{v}</p></div>)}</div></section>;
}

export function EntityResponseSection({ responses }: { responses: EntityProfileData["officialResponses"] }) {
  if (!responses.length) return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-700">No verified public response has been added for this entity yet.<div className="mt-2 flex gap-2"><button className="rounded border px-2 py-1 text-xs">Claim this profile</button><button className="rounded border px-2 py-1 text-xs">Submit official response</button></div></section>;
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">{responses.map((r)=><div key={r.id} className="text-sm"><p>{r.responseBody}</p><p className="text-xs text-slate-600">{r.responseDate} • {r.verificationStatus} • {r.contactChannel}</p></div>)}</section>;
}

export function EntityGrievanceDetails({ g }: { g: EntityProfileData["grievance"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-sm"><h2 className="mb-2 text-lg font-semibold">Grievance & support details</h2><p>Officer: {g.officerName}</p><p>Email: {g.email}</p><p>Phone: {g.phone}</p><p>Address: {g.address}</p><p>Last verified: {g.lastVerifiedAt}</p><p className="mt-2 rounded bg-amber-50 p-2 text-xs text-amber-900">Always verify contact details from the official website or loan agreement before sharing personal information.</p></section>;
}

export function CorrectionDisputeCTA() {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-lg font-semibold">Correction / dispute request</h2><p className="text-sm text-slate-600">Request correction for wrong company name, wrong NBFC claim, wrong app link, outdated grievance details, or missing official source.</p><button className="mt-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Submit Correction Request</button></section>;
}

export function RelatedEntitiesSection({ items }: { items: EntityProfileData["relatedEntities"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-lg font-semibold">Similar / related entities</h2><p className="mb-2 text-xs text-slate-600">Possible related entities based on public metadata. Relationships may be unverified.</p><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{items.map((e)=><Link key={e.id} href={e.profileUrl} className="rounded-lg border border-slate-200 p-3 text-sm"><p className="font-semibold">{e.name}</p><p className="text-xs text-slate-600">{e.entityType} • {e.relationReason}</p></Link>)}</div></section>;
}

export function EntityMentionedReviews({ items }: { items: EntityProfileData["mentionedReviews"] }) {
  return <section className="space-y-2"><h2 className="text-lg font-semibold">Public reviews mentioning entity</h2><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{items.map((r)=><article key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">{r.appName} • {r.createdAt}</p><div className="flex items-center justify-between"><p className="font-semibold">{r.title}</p><RatingStars rating={r.rating} /></div><p className="text-sm text-slate-600">{r.excerpt}</p><div className="mt-1 flex flex-wrap gap-1">{r.tags.map((t)=><span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}</div><Link href={r.reviewUrl} className="mt-2 inline-block text-xs font-semibold underline">Read Full Review</Link></article>)}</div></section>;
}

export function EntityFAQ({ items }: { items: EntityProfileData["faq"] }) {
  return <section className="space-y-2">{items.map((f)=><details key={f.question} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><summary className="cursor-pointer text-sm font-semibold">{f.question}</summary><p className="mt-2 text-sm text-slate-600">{f.answer}</p></details>)}</section>;
}

export default function CompanyNbfcProfilePage({ data }: { data: EntityProfileData }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-10">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <EntityHero data={data} />
        <EntityDisclaimerBox />
        <EntityDetailsCard data={data} />
        <LinkedLoanAppsSection apps={data.linkedApps} />
        <RelationshipVerificationTable rows={data.relationshipEvidence} />
        <EntityComplaintPatternSummary data={data.complaintPatterns} />
        <LinkedAppRiskDistribution data={data.riskDistribution} />
        <EntityResponseSection responses={data.officialResponses} />
        <EntityGrievanceDetails g={data.grievance} />
        <CorrectionDisputeCTA />
        <RelatedEntitiesSection items={data.relatedEntities} />
        <EntityMentionedReviews items={data.mentionedReviews} />
        <EntityFAQ items={data.faq} />
      </div>
    </main>
  );
}
