"use client";

//src/app/components/entities/CompanyNbfcProfilePage.tsx
import Link from "next/link";
import { type ChangeEvent, type ClipboardEvent, type FormEvent, useState } from "react";
import { apiClient } from "@/lib/apiClient";
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

function getEntityLogo(data: EntityProfileData) {
  return data.logoUrl ?? data.linkedApps.find((app) => app.logoUrl)?.logoUrl ?? "";
}

function hasEnrichedDetails(data: EntityProfileData) {
  return Boolean(
    getEntityLogo(data) ||
      data.details.website ||
      data.details.supportEmail ||
      data.grievance.email ||
      data.details.supportPhone ||
      data.details.registeredAddress ||
      data.details.rbiRegistrationClaim,
  );
}

export function EntityHero({ data, onOpenEnrich }: { data: EntityProfileData; onOpenEnrich: () => void }) {
  const linkedAppsHref = "#linked-apps";
  const logoUrl = getEntityLogo(data);
  const enriched = hasEnrichedDetails(data);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-3">
          {logoUrl ? <img src={logoUrl} alt={data.displayName} className="h-14 w-14 shrink-0 rounded-2xl border border-slate-200 bg-white p-1 object-contain" /> : null}
          <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">
            {data.entityType.replaceAll("_"," ")} {data.details.registrationNumber ? `/ RBI reg ${data.details.registrationNumber}` : ""}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-4xl">{data.displayName}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <RelationshipTypeBadge label={data.entityType} />
            <VerificationStatusBadge status={data.verificationStatus} />
            {enriched ? <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">Verified / Claimed</span> : null}
            <RiskBadge level={data.riskSignalLevel} />
          </div>
          {data.details.lastVerifiedAt ? <p className="mt-1 text-xs text-slate-400">Last updated: {data.details.lastVerifiedAt}</p> : null}
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
        <button type="button" onClick={onOpenEnrich} className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-[#1746A2]">{enriched ? "Edit Profile Details" : "Claim / Enrich this NBFC Profile"}</button>
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

export function NbfcOfficialDetailsCard({ data }: { data: EntityProfileData }) {
  const logoUrl = getEntityLogo(data);

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {logoUrl ? <img src={logoUrl} alt={data.displayName} className="h-12 w-12 rounded-2xl border border-slate-200 bg-white p-1 object-contain" /> : null}
          <div>
            <h2 className="mb-1.5 text-base font-semibold text-slate-800">NBFC Official Details</h2>
            <p className="text-xs text-slate-400">Official details submitted or derived from linked records.</p>
          </div>
        </div>
        {hasEnrichedDetails(data) ? <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">Verified / Claimed</span> : null}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Website</p>
          {data.details.website ? <a href={data.details.website} className="mt-1 block break-all font-medium text-[#1746A2] underline">{data.details.website}</a> : <DetailValue value="" />}
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Support email</p>
          <p className="mt-1"><DetailValue value={data.details.supportEmail} supportMissing /></p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Grievance email</p>
          <p className="mt-1"><DetailValue value={data.grievance.email} supportMissing /></p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Phone</p>
          <p className="mt-1"><DetailValue value={data.details.supportPhone || data.grievance.phone} supportMissing /></p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 md:col-span-2">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Registered address</p>
          <p className="mt-1"><DetailValue value={data.details.registeredAddress || data.grievance.address} /></p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 md:col-span-2">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Registration claim</p>
          <p className="mt-1"><DetailValue value={data.details.rbiRegistrationClaim} /></p>
        </div>
      </div>
    </section>
  );
}

export function VerifiedLenderProfileCard({ data }: { data: EntityProfileData }) {
  const metadata = data.verificationMetadata;
  const domains = metadata?.officialDomains?.length ? metadata.officialDomains : data.details.website ? [data.details.website] : [];
  const rbiStatus = metadata?.rbiRegistrationStatus ?? (data.details.rbiRegistrationClaim ? "claimed" : "pending");
  const statusLabel = { confirmed: "RBI registration confirmed", claimed: "RBI registration claimed", pending: "RBI status pending", not_found: "RBI registration not found" }[rbiStatus];
  const statusTone = rbiStatus === "confirmed" ? "bg-emerald-100 text-emerald-800" : rbiStatus === "not_found" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800";
  const handles = metadata?.claimedHandles ?? [];
  const history = metadata?.history?.length ? metadata.history : data.details.lastVerifiedAt ? [{ date: data.details.lastVerifiedAt, event: "Public profile details reviewed", status: data.verificationStatus.replaceAll("_", " "), source: data.details.sourceUrls[0] }] : [];

  return <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-sm sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-950">Verified lender profile</h2><p className="mt-1 text-xs leading-5 text-slate-600">Verification metadata helps you distinguish official details from claims. It is not an RBI endorsement.</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone}`}>{statusLabel}</span></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl bg-white/80 p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Official domains</p>{domains.length ? <ul className="mt-2 grid gap-1">{domains.map((domain) => <li key={domain}><a href={domain} target="_blank" rel="noreferrer" className="break-all text-sm font-semibold text-blue-700 underline">{domain}</a></li>)}</ul> : <DetailValue value="" />}</div>
      <div className="rounded-xl bg-white/80 p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Grievance contact</p><p className="mt-2 text-sm font-semibold text-slate-900">{data.grievance.officerName || "Grievance officer"}</p><p className="break-all text-sm text-slate-700">{data.grievance.email || data.details.supportEmail || "Not provided"}</p><p className="text-sm text-slate-700">{data.grievance.phone || data.details.supportPhone || "Not provided"}</p><Link href="/grievance-directory" className="mt-2 inline-block text-xs font-semibold text-blue-700 underline">Check grievance directory</Link></div>
      <div className="rounded-xl bg-white/80 p-3 sm:col-span-2"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Claimed account handles</p>{handles.length ? <div className="mt-2 flex flex-wrap gap-2">{handles.map((handle) => <span key={`${handle.platform}-${handle.handle}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{handle.platform}: {handle.handle} · {handle.status}</span>)}</div> : <p className="mt-2 text-sm text-slate-500">No claimed handles recorded. Treat social-media accounts as unverified until the lender confirms them through its official domain.</p>}</div>
    </div>
    <div className="mt-4 rounded-xl bg-white/80 p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Verification history</p>{history.length ? <ol className="mt-2 grid gap-2">{history.map((entry, index) => <li key={`${entry.date}-${entry.event}-${index}`} className="flex flex-wrap gap-x-2 text-sm text-slate-700"><span className="font-semibold text-slate-950">{entry.date}</span><span>{entry.event}</span><span className="text-slate-500">({entry.status})</span>{entry.source ? <a href={entry.source} target="_blank" rel="noreferrer" className="text-blue-700 underline">source</a> : null}</li>)}</ol> : <p className="mt-2 text-sm text-slate-500">No verification events recorded yet.</p>}</div>
    {metadata?.rbiSourceUrl ? <a href={metadata.rbiSourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold text-blue-700 underline">View RBI source</a> : null}
  </section>;
}

type EnrichmentForm = {
  logoUrl: string;
  officialWebsite: string;
  supportEmail: string;
  grievanceEmail: string;
  supportPhone: string;
  registeredAddress: string;
  nbfcRegistrationClaim: string;
  companyDescription: string;
};

function makeEnrichmentForm(data: EntityProfileData): EnrichmentForm {
  return {
    logoUrl: getEntityLogo(data),
    officialWebsite: data.details.website,
    supportEmail: data.details.supportEmail,
    grievanceEmail: data.grievance.email,
    supportPhone: data.details.supportPhone || data.grievance.phone,
    registeredAddress: data.details.registeredAddress || data.grievance.address,
    nbfcRegistrationClaim: data.details.rbiRegistrationClaim,
    companyDescription: "",
  };
}

function isValidOptionalUrl(value: string) {
  if (!value) return true;
  if (/^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,/.test(value)) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isValidOptionalEmail(value: string) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

function TextInput({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1746A2]" />
    </label>
  );
}

export function EntityEnrichmentModal({ data, onClose, onSaved }: { data: EntityProfileData; onClose: () => void; onSaved?: () => Promise<unknown> | unknown }) {
  const [form, setForm] = useState<EnrichmentForm>(() => makeEnrichmentForm(data));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const update = (field: keyof EnrichmentForm, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const updateLogoFile = async (file?: File) => {
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Logo file must be an image.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Logo image must be smaller than 4 MB.");
      return;
    }
    update("logoUrl", await readImageAsDataUrl(file));
  };

  const updateLogoPaste = async (event: ClipboardEvent<HTMLInputElement>) => {
    const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith("image/"));
    if (!file) return;
    event.preventDefault();
    await updateLogoFile(file);
  };

  const updateLogoChoice = async (event: ChangeEvent<HTMLInputElement>) => {
    await updateLogoFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidOptionalUrl(form.logoUrl) || !isValidOptionalUrl(form.officialWebsite)) {
      setError("Enter valid URLs for logo and website.");
      return;
    }
    if (!isValidOptionalEmail(form.supportEmail) || !isValidOptionalEmail(form.grievanceEmail)) {
      setError("Enter valid support and grievance email addresses.");
      return;
    }

    const payload = Object.fromEntries(Object.entries(form).filter(([, value]) => value.trim()));
    setIsSaving(true);
    try {
      await apiClient(`/api/companies/${data.slug}/enrich`, { method: "POST", body: payload });
      await onSaved?.();
      setSuccess("Profile details saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save profile details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/50 px-4 py-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Claim & Enrich NBFC Profile</h2>
            <p className="mt-1 text-sm text-slate-500">Add official identity, contact, and regulatory details for {data.displayName}.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Close</button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-4">
          {(error || success) ? <p className={`rounded-xl border p-3 text-sm ${error ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{error || success}</p> : null}

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Basic Info</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <span className="mb-1 block text-xs font-medium text-slate-600">Logo URL or image</span>
                <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-[#1746A2]">
                  <input
                    value={form.logoUrl}
                    onChange={(event) => update("logoUrl", event.target.value)}
                    onPaste={(event) => void updateLogoPaste(event)}
                    placeholder="Paste URL or choose image"
                    className="min-w-0 flex-1 px-3 py-2 text-sm outline-none"
                  />
                  <label className="shrink-0 cursor-pointer border-l border-slate-300 bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                    Choose image
                    <input type="file" accept="image/*" onChange={(event) => void updateLogoChoice(event)} className="sr-only" />
                  </label>
                </div>
                {form.logoUrl ? <img src={form.logoUrl} alt="Logo preview" className="mt-2 h-12 w-12 rounded-lg border border-slate-200 bg-white p-1 object-contain" /> : null}
              </div>
              <TextInput label="Official website" value={form.officialWebsite} onChange={(value) => update("officialWebsite", value)} placeholder="https://company.com" />
            </div>
            <label className="mt-3 block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Company description</span>
              <textarea value={form.companyDescription} onChange={(event) => update("companyDescription", event.target.value)} rows={3} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1746A2]" placeholder="Short about section or official profile note" />
            </label>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Contact Details</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextInput label="Support email" type="email" value={form.supportEmail} onChange={(value) => update("supportEmail", value)} placeholder="support@company.com" />
              <TextInput label="Grievance email" type="email" value={form.grievanceEmail} onChange={(value) => update("grievanceEmail", value)} placeholder="grievance@company.com" />
              <TextInput label="Support phone" value={form.supportPhone} onChange={(value) => update("supportPhone", value)} placeholder="+91 XXXXX XXXXX" />
              <TextInput label="Registered address" value={form.registeredAddress} onChange={(value) => update("registeredAddress", value)} placeholder="Registered office address" />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">Legal / Regulatory Info</h3>
            <div className="mt-3">
              <TextInput label="NBFC registration claim text" value={form.nbfcRegistrationClaim} onChange={(value) => update("nbfcRegistrationClaim", value)} placeholder="RBI registration claim or official NBFC partner name" />
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">Suggest edit is available through the correction flow for users who cannot claim this profile.</p>
            <div className="flex gap-2">
              <Link href="/corrections" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Suggest edit</Link>
              <button type="submit" disabled={isSaving} className="rounded-xl bg-[#1746A2] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Saving..." : "Save profile details"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LinkedLoanAppCard({ app }: { app: EntityProfileData["linkedApps"][number] }) {
  return (
    <article className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img src={app.logoUrl} alt={app.name} className="h-10 w-10 rounded border bg-white p-0.5 object-contain" />
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
        {!app.profileUrl.startsWith("/payday-loan-apps/") ? <Link href={`${app.profileUrl}/submit-review`} className="rounded border px-2 py-1 text-xs font-semibold">Write Review</Link> : null}
      </div>
    </article>
  );
}

export function LinkedLoanAppsSection({ apps }: { apps: EntityProfileData["linkedApps"] }) {
  return <section id="linked-apps" className="scroll-mt-24 space-y-2"><h2 className="text-lg font-semibold">Linked loan apps</h2><div className="grid grid-cols-1 gap-3 md:grid-cols-2 items-start">{apps.map((a)=><LinkedLoanAppCard key={a.id} app={a} />)}</div></section>;
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

export default function CompanyNbfcProfilePage({ data, onEnriched }: { data: EntityProfileData; onEnriched?: () => Promise<unknown> | unknown }) {
  const [showEnrichmentModal, setShowEnrichmentModal] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-10">
      <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 md:px-6 md:py-6">
        <EntityHero data={data} onOpenEnrich={() => setShowEnrichmentModal(true)} />
        <EntityDisclaimerBox />
        <VerifiedLenderProfileCard data={data} />
        <NbfcOfficialDetailsCard data={data} />
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
      {showEnrichmentModal ? <EntityEnrichmentModal data={data} onClose={() => setShowEnrichmentModal(false)} onSaved={onEnriched} /> : null}
    </main>
  );
}
