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

function isMissingValue(value: unknown) {
  return value === null || value === undefined || value === "" || value === "N/A" || value === "Missing";
}

function DetailValue({ value, supportMissing = false }: { value: unknown; supportMissing?: boolean }) {
  if (isMissingValue(value)) {
    return (
      <span className={supportMissing ? "text-sm font-medium text-[#854F0B]" : "text-sm italic text-slate-400"}>
        {supportMissing ? "Missing" : "Not provided"}
      </span>
    );
  }

  return <span className="text-sm font-medium text-slate-900">{String(value)}</span>;
}

export function EntityHero({ data }: { data: EntityProfileData }) {
  const linkedAppsHref = `/loan-apps?q=${encodeURIComponent(data.displayName)}`;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">
            {data.entityType.replaceAll("_"," ")} {data.details.registrationNumber ? `/ RBI reg ${data.details.registrationNumber}` : ""}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-4xl">{data.displayName}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <RelationshipTypeBadge label={data.entityType} />
            <VerificationStatusBadge status={data.verificationStatus} />
            <RiskBadge level={data.riskSignalLevel} />
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
          <p className="text-3xl font-semibold text-[#1746A2]">{data.averageLinkedAppTrustScore}</p>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">Trust score avg</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[
          ["Linked apps", data.totalLinkedApps],
          ["Total reviews", data.totalReviewsAcrossApps],
          ["Avg rating", data.linkedApps.length ? (data.linkedApps.reduce((sum, app) => sum + app.averageRating, 0) / data.linkedApps.length).toFixed(1) : "Not provided"],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-400">{label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/grievance-directory" className="rounded-xl bg-[#1746A2] px-4 py-2 text-sm font-semibold text-white">File Grievance</Link>
        <Link href={linkedAppsHref} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">View Linked Apps</Link>
        <Link href="/corrections" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Submit Correction</Link>
        <Link href="/business/claim" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-400">Claim This Entity</Link>
      </div>
    </section>
  );
}

export function EntityDisclaimerBox() {
  return (
    <section className="flex items-start gap-2 rounded-xl border border-[#FAC775] bg-[#FAEEDA] px-4 py-3 text-xs text-[#633806]">
      <span className="font-semibold">ⓘ</span>
      <span>This profile summarizes public details, app-provided claims, company-submitted information, and user-submitted reviews linked to this entity. Listed relationships may be claimed, verified, disputed, or under review. We do not make final legal or regulatory findings.</span>
    </section>
  );
}

export function EntityDetailsCard({ data }: { data: EntityProfileData }) {
  const d = data.details;
  const rows = [
    ["Entity legal name", d.legalName],
    ["Display name", data.displayName],
    ["Entity type", data.entityType],
    ["Website", d.website],
    ["Support email", d.supportEmail, true],
    ["Support phone", d.supportPhone, true],
    ["Registered address", d.registeredAddress],
    ["Registration number", d.registrationNumber],
    ["RBI registration claim", d.rbiRegistrationClaim],
    ["Last verified", d.lastVerifiedAt],
    ["Verification confidence", d.verificationConfidence],
  ] as const;

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
      <h2 className="mb-1.5 text-base font-semibold text-slate-800">Entity details</h2>
      <div>
        {rows.map(([label, value, supportMissing]) => (
          <div key={label} className="flex justify-between gap-4 border-b border-slate-100 py-1.5 last:border-b-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="max-w-[62%] text-right"><DetailValue value={value} supportMissing={supportMissing} /></span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-slate-400">Source URLs: {d.sourceUrls.join(", ")}</p>
    </section>
  );
}

export function LinkedLoanAppCard({ app }: { app: EntityProfileData["linkedApps"][number] }) {
  return (
    <article className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img src={app.logoUrl} alt={app.name} className="h-10 w-10 rounded border" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{app.name}</p>
          <p className="text-xs text-slate-600">{app.developerName} • {app.companyName}</p>
        </div>
        <div className="ml-auto"><RiskBadge level={app.riskLevel} /></div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <RelationshipTypeBadge label={app.relationshipType} />
        <RelationshipTypeBadge label={app.relationshipVerificationStatus} />
      </div>
      <p className="mt-2 text-xs text-slate-500">Trust {app.trustScore} • {app.averageRating} rating • {app.reviewCount} reviews</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {app.topComplaintTags.map((t)=><span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{t}</span>)}
      </div>
      <div className="mt-2 flex gap-2">
        <Link href={app.profileUrl} className="rounded border px-2 py-1 text-xs font-semibold">View App Profile</Link>
        <Link href={`${app.profileUrl}/submit-review`} className="rounded border px-2 py-1 text-xs font-semibold">Write Review</Link>
      </div>
    </article>
  );
}

export function LinkedLoanAppsSection({ apps }: { apps: EntityProfileData["linkedApps"] }) {
  return <section className="space-y-2"><h2 className="text-lg font-semibold">Linked loan apps</h2><div className="grid grid-cols-1 gap-3 md:grid-cols-2 items-start">{apps.map((a)=><LinkedLoanAppCard key={a.id} app={a} />)}</div></section>;
}

export function RelationshipVerificationTable({ rows }: { rows: EntityProfileData["relationshipEvidence"] }) {
  return <section className="overflow-x-auto rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm"><h2 className="mb-1.5 text-base font-semibold text-slate-800">Relationship verification</h2><table className="min-w-[700px] text-left text-xs"><thead><tr className="border-b">{["App","Relationship","Verification","Source type","Source URL","Last checked","Confidence","Notes"].map((h)=><th key={h} className="py-2 pr-2">{h}</th>)}</tr></thead><tbody>{rows.map((r)=><tr key={r.appId+r.sourceUrl} className="border-b"><td className="py-2 pr-2">{r.appName}</td><td className="py-2 pr-2">{r.relationshipType}</td><td className="py-2 pr-2">{r.verificationStatus}</td><td className="py-2 pr-2">{r.sourceType}</td><td className="py-2 pr-2">{r.sourceUrl}</td><td className="py-2 pr-2">{r.lastCheckedAt}</td><td className="py-2 pr-2">{r.confidence}</td><td className="py-2 pr-2">{r.notes}</td></tr>)}</tbody></table></section>;
}

export function EntityComplaintPatternSummary({ data }: { data: EntityProfileData["complaintPatterns"] }) {
  const items = [["Harassment %", data.harassmentPercent, "bg-red-400"],["Hidden charges %", data.hiddenChargesPercent, "bg-red-400"],["Contact list abuse %", data.contactListAbusePercent, "bg-red-400"],["Data misuse %", data.dataMisusePercent, "bg-red-400"],["Fake legal notice %", data.fakeLegalNoticePercent, "bg-red-400"],["Payment not updated %", data.paymentNotUpdatedPercent, "bg-red-400"],["Loan not closed %", data.loanNotClosedPercent, "bg-red-400"],["Positive reviews %", data.positiveReviewPercent, "bg-emerald-400"]];
  return <section className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm"><h2 className="mb-1.5 text-base font-semibold text-slate-800">Complaint pattern summary across linked apps</h2><p className="mb-2 text-xs text-slate-600">Across {data.totalReviews} linked-app reviews, users reported the following complaint patterns.</p><div className="grid grid-cols-2 gap-2 md:grid-cols-4">{items.map(([k,v,color])=><div key={String(k)} className="rounded-xl bg-slate-50 p-2 text-xs"><p className="text-slate-500">{k}</p><p className="mt-1 font-semibold text-slate-900">{v}</p><div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{ width: `${v}` }} /></div></div>)}</div></section>;
}

export function LinkedAppRiskDistribution({ data }: { data: EntityProfileData["riskDistribution"] }) {
  return <section className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm"><h2 className="mb-1.5 text-base font-semibold text-slate-800">Linked app risk distribution</h2><div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-3">{Object.entries(data).map(([k,v])=><div key={k} className="rounded-xl bg-slate-50 p-3"><p>{k}</p><p className="font-semibold">{v}</p></div>)}</div></section>;
}

export function EntityResponseSection({ responses }: { responses: EntityProfileData["officialResponses"] }) {
  if (!responses.length) return <section className="rounded-2xl border border-slate-200/60 bg-white p-4 text-center shadow-sm"><div className="text-2xl text-slate-300">✉</div><p className="mt-2 text-sm text-slate-400">No verified public response has been added for this entity yet.</p><div className="mt-2 flex justify-center gap-2"><button className="rounded-xl bg-[#1746A2] px-3 py-1.5 text-xs font-semibold text-white">Claim & respond</button><button className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Submit official response</button></div></section>;
  return <section className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">{responses.map((r)=><div key={r.id} className="text-sm"><p>{r.responseBody}</p><p className="text-xs text-slate-600">{r.responseDate} • {r.verificationStatus} • {r.contactChannel}</p></div>)}</section>;
}

export function EntityGrievanceDetails({ g }: { g: EntityProfileData["grievance"] }) {
  const rows = [["Officer", g.officerName],["Email", g.email],["Phone", g.phone],["Address", g.address],["Last verified", g.lastVerifiedAt]] as const;
  return <section className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm text-sm"><h2 className="mb-1.5 text-base font-semibold text-slate-800">Grievance & support details</h2><div className="mb-2 flex items-start gap-2 rounded-lg bg-[#FAEEDA] px-3 py-2 text-xs text-[#633806]"><span className="font-semibold">ⓘ</span><span>Always verify contact details from the official website or loan agreement before sharing personal information.</span></div><div>{rows.map(([label, value])=><div key={label} className="flex justify-between gap-4 border-b border-slate-100 py-1.5 text-sm last:border-0"><span className="text-slate-500">{label}</span><span className="max-w-[62%] text-right"><DetailValue value={value} /></span></div>)}</div><Link href="/grievance-directory" className="mt-2 block w-full rounded-xl bg-[#FCEBEB] py-2 text-center text-sm font-semibold text-[#501313]">File Grievance with RBI</Link></section>;
}

export function CorrectionDisputeCTA() {
  return <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#B5D4F4] bg-[#E6F1FB] px-4 py-3"><div><h2 className="text-sm font-semibold text-[#042C53]">Correction / dispute request</h2><p className="mt-1 text-xs text-[#185FA5]">Request correction for wrong company name, wrong NBFC claim, wrong app link, outdated grievance details, or missing official source.</p></div><button className="whitespace-nowrap rounded-xl bg-[#1746A2] px-4 py-2 text-sm font-semibold text-white">Submit Correction Request</button></section>;
}

export function RelatedEntitiesSection({ items }: { items: EntityProfileData["relatedEntities"] }) {
  return <section className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm"><h2 className="text-base font-semibold text-slate-800">Similar / related entities</h2><p className="mb-2 text-xs text-slate-600">Possible related entities based on public metadata. Relationships may be unverified.</p><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{items.map((e)=><Link key={e.id} href={e.profileUrl} className="rounded-lg border border-slate-200 p-4 text-sm"><p className="font-semibold">{e.name}</p><p className="text-xs text-slate-600">{e.entityType} • {e.relationReason}</p></Link>)}</div></section>;
}

export function EntityMentionedReviews({ items }: { items: EntityProfileData["mentionedReviews"] }) {
  return <section className="space-y-2"><h2 className="text-lg font-semibold">Public reviews mentioning entity</h2><div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">{items.map((r)=><article key={r.id} className="rounded-2xl border border-slate-200/60 bg-white p-3 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs text-slate-500">{r.appName} • {r.createdAt}</p><p className="font-semibold">{r.title}</p></div><RatingStars rating={r.rating} /></div><p className="mt-1 text-sm text-slate-600">{r.excerpt}</p><div className="mt-1 flex flex-wrap gap-1">{r.tags.map((t)=><span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}</div><Link href={r.reviewUrl} className="mt-2 inline-block text-xs font-semibold underline">Read Full Review</Link></article>)}</div></section>;
}

export function EntityFAQ({ items }: { items: EntityProfileData["faq"] }) {
  return <section className="grid grid-cols-1 gap-2 md:grid-cols-2">{items.map((f)=><details key={f.question} className="rounded-2xl border border-slate-200/60 bg-white p-3 shadow-sm"><summary className="cursor-pointer text-sm font-semibold">{f.question}</summary><p className="mt-2 text-sm text-slate-600">{f.answer}</p></details>)}</section>;
}

export default function CompanyNbfcProfilePage({ data }: { data: EntityProfileData }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-10">
      <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 md:px-6 md:py-6">
        <EntityHero data={data} />
        <EntityDisclaimerBox />
        <EntityDetailsCard data={data} />
        <LinkedLoanAppsSection apps={data.linkedApps} />
        <RelationshipVerificationTable rows={data.relationshipEvidence} />
        <EntityComplaintPatternSummary data={data.complaintPatterns} />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 items-start">
          <EntityGrievanceDetails g={data.grievance} />
          <div className="space-y-3">
            <LinkedAppRiskDistribution data={data.riskDistribution} />
            <RelatedEntitiesSection items={data.relatedEntities} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 items-start">
          <EntityResponseSection responses={data.officialResponses} />
          <CorrectionDisputeCTA />
        </div>
        <EntityMentionedReviews items={data.mentionedReviews} />
        <EntityFAQ items={data.faq} />
      </div>
    </main>
  );
}
