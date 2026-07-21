"use client";

import { type ChangeEvent, type ClipboardEvent, FormEvent, useState } from "react";
import type { CreateAdminLoanAppInput } from "@/hooks/useAdminDashboards";
import type {
  AdminLoanAppDatabase,
  ClaimStatus,
  VerificationStatus,
} from "@/types/adminLoanAppDatabase";
import type { RiskLevel } from "@/types/loanAppProfile";
import { useMemo } from "react";
import GlobalFilterPanel from "@/components/filters/GlobalFilterPanel";
import { adminAppDbFilterSchema } from "@/config/filterSchemas";
import { applyGlobalFilters } from "@/lib/filterEngine";
import { safeImageUrl } from "@/lib/publicContent";

export function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  const tone: Record<RiskLevel, string> = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-orange-100 text-orange-700",
    severe: "bg-rose-100 text-rose-700",
  };
  const label = riskLevel === "severe" ? "Severe Complaints" : `${riskLevel[0].toUpperCase()}${riskLevel.slice(1)}`;
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone[riskLevel]}`}>{label}</span>;
}

export function VerificationStatusBadge({ status }: { status: VerificationStatus }) {
  const cls =
    status === "verified"
      ? "bg-emerald-100 text-emerald-700"
      : status === "partially_verified"
      ? "bg-amber-100 text-amber-700"
      : status === "conflicting_information"
      ? "bg-rose-100 text-rose-700"
      : "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{status.replaceAll("_", " ")}</span>;
}

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const cls =
    status === "claimed"
      ? "bg-emerald-100 text-emerald-700"
      : status === "claim_pending"
      ? "bg-amber-100 text-amber-700"
      : status === "disputed_claim"
      ? "bg-rose-100 text-rose-700"
      : "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{status.replaceAll("_", " ")}</span>;
}

export function AdminAppsHeader({ stats, onAdd, onImport }: { stats: AdminLoanAppDatabase["stats"]; onAdd?: () => void; onImport?: () => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Loan App Database</h1>
      <p className="mt-1 text-sm text-slate-600">
        Manage app profiles, company records, claimed NBFC links, public details, aliases, and verification status.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={onAdd} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Add New App</button>
        <button type="button" onClick={onImport} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold">Import Apps</button>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold">Export Database</button>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold">Review Duplicate Records</button>
      </div>
      <AdminAppStatsCards stats={stats} />
    </section>
  );
}

const defaultCreateForm = {
  name: "",
  slug: "",
  logoUrl: "",
  playStoreUrl: "",
  claimedNbfcPartner: "",
  grievanceEmail: "",
  supportEmail: "",
  supportPhone: "",
};

function slugFromName(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isPlayStoreUrl(value: string) {
  try {
    return new URL(value).hostname.toLowerCase().includes("play.google.com");
  } catch {
    return false;
  }
}

function getApiValidationMessage(error: unknown) {
  const details = (error as { details?: { issues?: Array<{ path?: Array<string | number>; message?: string }> } })?.details;
  const issue = details?.issues?.[0];
  if (issue?.message) {
    const field = issue.path?.slice(1).join(".");
    return field ? `${field}: ${issue.message}` : issue.message;
  }
  return error instanceof Error ? error.message : "Could not create loan app.";
}

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

function CreateLoanAppPanel({
  error,
  isCreating,
  onCancel,
  onCreate,
}: {
  error?: string;
  isCreating?: boolean;
  onCancel: () => void;
  onCreate: (input: CreateAdminLoanAppInput) => Promise<unknown>;
}) {
  const [form, setForm] = useState(defaultCreateForm);
  const [localError, setLocalError] = useState("");
  const [createdSlug, setCreatedSlug] = useState("");

  const update = (field: keyof typeof defaultCreateForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "name" ? { slug: slugFromName(value) } : {}),
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");
    const generatedSlug = slugFromName(form.name);
    if (!form.name) {
      setLocalError("App name is required.");
      return;
    }
    if (generatedSlug.length < 2) {
      setLocalError("App name must generate a slug with at least 2 characters.");
      return;
    }
    if (!form.playStoreUrl) {
      setLocalError("Play Store or website URL is required.");
      return;
    }
    const appUrl = normalizeUrl(form.playStoreUrl);
    if (!appUrl) {
      setLocalError("Play Store or website URL is required.");
      return;
    }
    try {
      await onCreate({
        slug: generatedSlug,
        name: form.name.trim(),
        ...(form.logoUrl.trim() ? { logoUrl: form.logoUrl.trim() } : {}),
        ...(isPlayStoreUrl(appUrl) ? { playStoreUrl: appUrl } : { websiteUrl: appUrl }),
        ...(form.claimedNbfcPartner.trim() ? { claimedNbfcPartner: form.claimedNbfcPartner.trim() } : {}),
        ...(form.grievanceEmail.trim() ? { grievanceEmail: form.grievanceEmail.trim() } : {}),
        ...(form.supportEmail.trim() ? { supportEmail: form.supportEmail.trim() } : {}),
        ...(form.supportPhone.trim() ? { supportPhone: form.supportPhone.trim() } : {}),
        status: "PUBLISHED",
        verificationStatus: "UNDER_VERIFICATION",
        claimStatus: "UNCLAIMED",
        riskLevel: "UNDER_REVIEW",
        trustScore: 50,
        averageRating: 0,
        reviewCount: 0,
      });
      setCreatedSlug(generatedSlug);
      setForm(defaultCreateForm);
    } catch (createError) {
      setLocalError(getApiValidationMessage(createError));
    }
  };

  const updateLogoFile = async (file?: File) => {
    setLocalError("");
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
      setLocalError("Logo must be a PNG, JPEG, WebP, or GIF image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLocalError("Logo image must be smaller than 2 MB.");
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

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Add loan app</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Enter the 5 key details. Slug is auto-generated from the app name.
          </p>
        </div>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold">
          Cancel
        </button>
      </div>

      {(localError || error) && (
        <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-2 text-sm text-rose-800">
          {localError || error}
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              App name <span className="text-rose-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="e.g. Swift Cash"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Play Store or website URL <span className="text-rose-500">*</span>
            </label>
            <input
              value={form.playStoreUrl}
              onChange={(e) => update("playStoreUrl", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="https://play.google.com/... or https://appwebsite.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Logo URL or image</label>
            <div className="flex overflow-hidden rounded-lg border border-slate-300 bg-white">
              <input
                value={form.logoUrl}
                onChange={(e) => update("logoUrl", e.target.value)}
                onPaste={(e) => void updateLogoPaste(e)}
                className="min-w-0 flex-1 px-3 py-2 text-sm outline-none"
                placeholder="Paste URL or choose image"
              />
              <label className="shrink-0 cursor-pointer border-l border-slate-300 bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                Choose image
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => void updateLogoChoice(e)} className="sr-only" />
              </label>
            </div>
            {safeImageUrl(form.logoUrl) ? <img src={safeImageUrl(form.logoUrl)!} alt="Logo preview" className="mt-2 h-12 w-12 rounded-lg border border-slate-200 bg-white p-1 object-contain" /> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Claimed NBFC partner</label>
            <input
              value={form.claimedNbfcPartner}
              onChange={(e) => update("claimedNbfcPartner", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="e.g. ABC Finance Ltd"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Grievance email</label>
            <input
              type="email"
              value={form.grievanceEmail}
              onChange={(e) => update("grievanceEmail", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="grievance@company.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Support email</label>
            <input
              type="email"
              value={form.supportEmail}
              onChange={(e) => update("supportEmail", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="support@company.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Support phone</label>
            <input
              type="tel"
              value={form.supportPhone}
              onChange={(e) => update("supportPhone", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

        {/* Auto-generated slug preview */}
        {form.name && (
          <p className="text-xs text-slate-400 md:col-span-2">
            Slug: <span className="font-mono text-slate-600">{form.slug || slugFromName(form.name)}</span>
            <span className="ml-2 text-slate-400">(auto-generated, edit if needed)</span>
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={isCreating}
          className="rounded-lg bg-[#1746A2] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating ? "Creating..." : "Create app"}
        </button>
        <p className="text-xs text-slate-400">
          Developer name, logo, permissions, and other details can be filled in after creation.
        </p>
      </div>

      {createdSlug && (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          <p className="font-semibold">App created successfully.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <a href={`/loan-apps/${createdSlug}`} className="rounded border border-emerald-300 bg-white px-3 py-1 text-xs font-semibold text-emerald-800">
              Open profile
            </a>
            <a href={`/loan-apps/${createdSlug}/submit-review`} className="rounded border border-emerald-300 bg-white px-3 py-1 text-xs font-semibold text-emerald-800">
              Open review form
            </a>
          </div>
        </div>
      )}
    </form>
  );
}

export function AdminAppStatsCards({ stats }: { stats: AdminLoanAppDatabase["stats"] }) {
  const items = [
    ["Total apps listed", stats.totalApps],
    ["Apps under review", stats.underReview],
    ["Verified public details", stats.verifiedPublicDetails],
    ["Claimed profiles", stats.claimedProfiles],
    ["Duplicate candidates", stats.duplicateCandidates],
    ["Missing grievance details", stats.missingGrievanceDetails],
    ["Missing company details", stats.missingCompanyDetails],
    ["High-risk complaint patterns", stats.highRiskComplaintPatterns],
  ];
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-4">
      {items.map(([k, v]) => (
        <div key={k} className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">{k}</p>
          <p className="text-xl font-semibold text-slate-900">{v}</p>
        </div>
      ))}
    </div>
  );
}

export function AdminAppSearchFilters() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-5">
        {[
          "Search: app, developer, company, NBFC, URL, package, app ID, alias",
          "Status",
          "Verification status",
          "Claim status",
          "Risk level",
          "Missing NBFC Partner",
          "Missing Company Name",
          "Missing Grievance Officer",
          "Missing Website",
          "Missing App Store Link",
          "Missing Registered Address",
        ].map((x) => (
          <input key={x} className="rounded-lg border border-slate-300 px-3 py-2 text-xs" placeholder={x} />
        ))}
      </div>
    </section>
  );
}

export function AdminAppRecordsTable({
  apps,
  onSelect,
}: {
  apps: AdminLoanAppDatabase["apps"];
  onSelect: (id: string) => void;
}) {
  if (apps.length === 0) return <EmptyState />;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="grid gap-3 lg:hidden">
        {apps.map((a) => (
          <article key={a.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-100">
            <div className="flex items-start gap-3">
              <img src={a.logoUrl} alt={a.name} className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 bg-white p-1 object-contain" />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-950">{a.name}</h3>
                <p className="mt-0.5 font-mono text-[11px] text-slate-500">{a.slug}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-semibold text-slate-950">{a.trustScore}</p>
                <p className="text-[10px] uppercase tracking-wide text-slate-500">Trust</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <RiskBadge riskLevel={a.riskLevel} />
              <VerificationStatusBadge status={a.verificationStatus} />
              <ClaimStatusBadge status={a.claimStatus} />
            </div>

            <dl className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-700 sm:grid-cols-2">
              {[
                ["Package", a.packageName],
                ["Developer", a.developerName],
                ["Company", a.companyName],
                ["Claimed NBFC", a.claimedNbfcPartner],
                ["Reviews", a.reviewCount],
                ["Last updated", a.lastUpdated],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0 rounded-lg bg-slate-50 p-2">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                  <dd className="mt-0.5 break-words text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button type="button" onClick={() => onSelect(a.id)} className="min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                View
              </button>
              <a href={`/loan-apps/${a.slug}/submit-review`} className="flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                Review form
              </a>
              <button type="button" className="min-h-11 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
                Verify
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-[1200px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              {["App", "Slug", "Package", "Developer", "Company", "Claimed NBFC partner", "Trust score", "Risk", "Reviews", "Verification", "Claim", "Last updated", "Actions"].map((h) => (
                <th key={h} className="py-2 pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {apps.map((a) => (
              <tr key={a.id} className="border-b border-slate-100">
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <img src={a.logoUrl} alt={a.name} className="h-8 w-8 rounded border border-slate-200 bg-white p-0.5 object-contain" />
                    <span className="font-medium text-slate-900">{a.name}</span>
                  </div>
                </td>
                <td className="py-2 pr-3 font-mono text-[11px] text-slate-600">{a.slug}</td>
                <td className="py-2 pr-3">{a.packageName}</td>
                <td className="py-2 pr-3">{a.developerName}</td>
                <td className="py-2 pr-3">{a.companyName}</td>
                <td className="py-2 pr-3">{a.claimedNbfcPartner}</td>
                <td className="py-2 pr-3">{a.trustScore}</td>
                <td className="py-2 pr-3"><RiskBadge riskLevel={a.riskLevel} /></td>
                <td className="py-2 pr-3">{a.reviewCount}</td>
                <td className="py-2 pr-3"><VerificationStatusBadge status={a.verificationStatus} /></td>
                <td className="py-2 pr-3"><ClaimStatusBadge status={a.claimStatus} /></td>
                <td className="py-2 pr-3">{a.lastUpdated}</td>
                <td className="py-2 pr-3">
                  <div className="flex gap-1">
                    <button onClick={() => onSelect(a.id)} className="rounded border border-slate-300 px-2 py-1">View</button>
                    <a href={`/loan-apps/${a.slug}/submit-review`} className="rounded border border-slate-300 px-2 py-1">Review form</a>
                    <button className="rounded border border-slate-300 px-2 py-1">Verify</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BaseInput({ placeholder, value }: { placeholder: string; value?: string }) {
  return <input defaultValue={value} placeholder={placeholder} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />;
}

export function BasicAppIdentityForm({ data }: { data: AdminLoanAppDatabase["selectedApp"]["basicIdentity"] }) {
  return (
    <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Basic app identity</h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <BaseInput placeholder="App name" value={data.name} />
        <BaseInput placeholder="App slug" value={data.slug} />
        <BaseInput placeholder="App logo URL" value={data.logoUrl} />
        <BaseInput placeholder="Package name" value={data.packageName} />
        <BaseInput placeholder="Platform" value={data.platform.join(", ")} />
        <BaseInput placeholder="Public profile status" value={data.profileStatus} />
      </div>
      <textarea defaultValue={data.shortDescription} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" rows={3} />
    </section>
  );
}

export function CompanyDetailsForm({ data }: { data: AdminLoanAppDatabase["selectedApp"]["companyDetails"] }) {
  return (
    <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Developer / company details</h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <BaseInput placeholder="Developer name" value={data.developerName} />
        <BaseInput placeholder="Company legal name" value={data.legalCompanyName} />
        <BaseInput placeholder="CIN / registration number" value={data.registrationNumber} />
        <BaseInput placeholder="Website" value={data.website} />
        <BaseInput placeholder="Support email" value={data.supportEmail} />
        <BaseInput placeholder="Support phone" value={data.supportPhone} />
        <BaseInput placeholder="Registered address" value={data.registeredAddress} />
        <BaseInput placeholder="Source URL" value={data.sourceUrl} />
      </div>
    </section>
  );
}

export function AppStoreLinksForm({ data }: { data: AdminLoanAppDatabase["selectedApp"]["appStoreLinks"] }) {
  return (
    <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">App store links</h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <BaseInput placeholder="Play Store URL" value={data.playStoreUrl} />
        <BaseInput placeholder="App Store URL" value={data.appStoreUrl} />
        <BaseInput placeholder="Website app URL" value={data.websiteAppUrl} />
        <BaseInput placeholder="Last checked date" value={data.lastCheckedAt} />
        <BaseInput placeholder="Store availability status" value={data.storeAvailabilityStatus} />
      </div>
    </section>
  );
}

export function NbfcPartnerForm({ data }: { data: AdminLoanAppDatabase["selectedApp"]["nbfcPartner"] }) {
  return (
    <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Claimed NBFC partner</h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <BaseInput placeholder="NBFC name" value={data.name} />
        <BaseInput placeholder="NBFC website" value={data.website} />
        <BaseInput placeholder="RBI registration claim" value={data.rbiRegistrationClaim} />
        <BaseInput placeholder="Relationship type" value={data.relationshipType} />
        <BaseInput placeholder="Verification status" value={data.verificationStatus} />
        <BaseInput placeholder="Source/proof URL" value={data.sourceUrl} />
        <BaseInput placeholder="Last verified date" value={data.lastVerifiedAt} />
      </div>
    </section>
  );
}

export function GrievanceOfficerForm({ data }: { data: AdminLoanAppDatabase["selectedApp"]["grievanceOfficer"] }) {
  return (
    <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">Grievance officer details</h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <BaseInput placeholder="Officer name" value={data.name} />
        <BaseInput placeholder="Grievance email" value={data.email} />
        <BaseInput placeholder="Phone" value={data.phone} />
        <BaseInput placeholder="Address" value={data.address} />
        <BaseInput placeholder="Source URL" value={data.sourceUrl} />
        <BaseInput placeholder="Verified date" value={data.verifiedAt} />
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" defaultChecked={data.publicVisible} />
        Public visibility toggle
      </label>
    </section>
  );
}

export function AliasDuplicateManager({ aliases, duplicates }: { aliases: string[]; duplicates: string[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Alias and duplicate management</h3>
      <p className="text-xs text-slate-600">Alternate names, old names, package aliases, rebranded names, and duplicate candidates.</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {aliases.map((a) => <span key={a} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{a}</span>)}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {duplicates.map((d) => <span key={d} className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">{d}</span>)}
      </div>
      <div className="mt-2 flex gap-2">
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Merge records</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Mark not duplicate</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Link related app</button>
      </div>
    </section>
  );
}

export function VerificationSourcesPanel({ sources }: { sources: AdminLoanAppDatabase["selectedApp"]["verificationSources"] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Verification sources</h3>
      <div className="space-y-2 text-xs">
        {sources.map((s, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-2">
            <p>{s.sourceType} • {s.sourceDate} • confidence {s.confidence}</p>
            <p>{s.sourceUrl}</p>
            <p>Verified by {s.verifiedBy}</p>
            <p>{s.notes}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RiskMetadataPanel({ data }: { data: AdminLoanAppDatabase["selectedApp"]["riskMetadata"] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Risk metadata</h3>
      <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
        <div className="rounded bg-slate-50 p-2">Risk level: {data.riskLevel}</div>
        <div className="rounded bg-slate-50 p-2">Trust score: {data.trustScore}</div>
        <div className="rounded bg-slate-50 p-2">Complaint volume: {data.complaintVolume}</div>
        <div className="rounded bg-slate-50 p-2">Review count: {data.reviewCount}</div>
        <div className="rounded bg-slate-50 p-2">Harassment: {data.harassmentPercent}%</div>
        <div className="rounded bg-slate-50 p-2">Hidden charges: {data.hiddenChargesPercent}%</div>
        <div className="rounded bg-slate-50 p-2">Data privacy: {data.dataPrivacyPercent}%</div>
        <div className="rounded bg-slate-50 p-2">Recovery abuse: {data.recoveryAbusePercent}%</div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {data.topComplaintTags.map((t) => <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}
      </div>
      <textarea defaultValue={data.manualRiskNote} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" rows={3} />
    </section>
  );
}

export function PublicProfilePreview({ appName }: { appName: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Public profile preview</h3>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        Preview block: hero header, trust score, risk badge, claimed company details, claimed NBFC partner, grievance details, disclaimer, and top complaint patterns.
      </div>
      <div className="mt-2 flex gap-2">
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Preview public page</button>
        <button className="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white">Publish changes</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Save draft</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Request senior review</button>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">App: {appName}</p>
    </section>
  );
}

export function AppAuditLog({ items }: { items: AdminLoanAppDatabase["selectedApp"]["auditLog"] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Change history / audit log</h3>
      <div className="space-y-2 text-xs">
        {items.map((x, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-2">
            <p>{x.adminUser} • {x.timestamp}</p>
            <p>{x.action} • {x.fieldChanged}</p>
            <p>{x.previousValue} → {x.newValue}</p>
            <p>{x.reason}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">View full history</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Restore previous value</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Export audit log</button>
      </div>
    </section>
  );
}

export function BulkImportAppsPanel() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">Import apps (CSV)</h3>
      <p className="text-xs text-slate-600">Fields: app name, package, developer, company, Play Store URL, website, claimed NBFC partner, grievance email, support email, status.</p>
      <input type="file" accept=".csv" className="mt-2 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white" />
      <div className="mt-2 flex gap-2">
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Preview rows</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Detect duplicates</button>
        <button className="rounded border border-slate-300 px-2 py-1 text-xs">Validate required fields</button>
        <button className="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white">Confirm import</button>
      </div>
    </section>
  );
}

export function AdminPermissionNotice() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700 shadow-sm">
      Roles and permissions: Admin can create, edit, merge, archive, publish. Senior Moderator can verify and edit selected fields. Data Verifier can update sources and verification status. Read-only Analyst can view only.
    </section>
  );
}

export function EmptyState() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <p className="font-semibold text-slate-900">No app records found.</p>
      <div className="mt-2 flex justify-center gap-2">
        <button className="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Add New App</button>
        <button className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold">Import Apps</button>
        <button className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold">Clear Filters</button>
      </div>
    </section>
  );
}

type AppEditorTab = "basic" | "company" | "grievance" | "risk" | "audit";

export function AppDetailEditorDrawer({ data, onClose }: { data: AdminLoanAppDatabase["selectedApp"]; onClose: () => void }) {
  const [tab, setTab] = useState<AppEditorTab>("basic");
  const tabs: Array<{ id: AppEditorTab; label: string }> = [
    { id: "basic", label: "Basic details" },
    { id: "company", label: "Company & NBFC" },
    { id: "grievance", label: "Grievance officer" },
    { id: "risk", label: "Risk & complaints" },
    { id: "audit", label: "Audit log" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40">
      <section className="ml-auto flex h-full w-full max-w-5xl flex-col overflow-hidden bg-slate-100 shadow-2xl">
        <div className="border-b border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Edit loan app</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">{data.basicIdentity.name}</h2>
              <p className="mt-1 text-xs text-slate-500">{data.basicIdentity.slug}</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
              Close
            </button>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${tab === item.id ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "basic" ? (
            <div className="space-y-3">
              <BasicAppIdentityForm data={data.basicIdentity} />
              <AppStoreLinksForm data={data.appStoreLinks} />
              {(data.aliases.length > 0 || data.duplicateCandidates.length > 0) ? <AliasDuplicateManager aliases={data.aliases} duplicates={data.duplicateCandidates} /> : null}
            </div>
          ) : null}

          {tab === "company" ? (
            <div className="space-y-3">
              <CompanyDetailsForm data={data.companyDetails} />
              <NbfcPartnerForm data={data.nbfcPartner} />
            </div>
          ) : null}

          {tab === "grievance" ? <GrievanceOfficerForm data={data.grievanceOfficer} /> : null}

          {tab === "risk" ? <RiskMetadataPanel data={data.riskMetadata} /> : null}

          {tab === "audit" ? (
            <div className="space-y-3">
              <AppAuditLog items={data.auditLog} />
              <details className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">Verification sources</summary>
                <div className="mt-3">
                  <VerificationSourcesPanel sources={data.verificationSources} />
                </div>
              </details>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function mergeSelectedAppDetail(data: AdminLoanAppDatabase, selectedId: string) {
  const selected = data.apps.find((app) => app.id === selectedId);
  if (!selected) return data.selectedApp;

  return {
    ...data.selectedApp,
    id: selected.id,
    basicIdentity: {
      ...data.selectedApp.basicIdentity,
      name: selected.name,
      slug: selected.slug,
      logoUrl: selected.logoUrl,
      packageName: selected.packageName,
      platform: selected.platform,
      shortDescription: selected.summaryNote || "Public details are maintained from database records.",
      profileStatus: selected.profileStatus,
    },
    companyDetails: {
      ...data.selectedApp.companyDetails,
      developerName: selected.developerName,
      legalCompanyName: selected.companyName,
      website: selected.websiteUrl ?? "",
      supportEmail: selected.supportEmail ?? "",
      supportPhone: selected.supportPhone ?? "",
      registeredAddress: selected.registeredAddress ?? "",
      sourceUrl: selected.websiteUrl ?? "",
    },
    appStoreLinks: {
      ...data.selectedApp.appStoreLinks,
      playStoreUrl: selected.playStoreUrl ?? "",
      appStoreUrl: selected.appStoreUrl ?? "",
      websiteAppUrl: selected.websiteUrl ?? "",
      lastCheckedAt: selected.lastUpdated,
    },
    nbfcPartner: {
      ...data.selectedApp.nbfcPartner,
      name: selected.claimedNbfcPartner,
      sourceUrl: selected.websiteUrl || selected.playStoreUrl || selected.appStoreUrl || "",
      lastVerifiedAt: selected.lastUpdated,
    },
    grievanceOfficer: {
      ...data.selectedApp.grievanceOfficer,
      email: selected.grievanceEmail || selected.supportEmail || "",
      phone: selected.supportPhone ?? "",
      address: selected.registeredAddress ?? "",
      sourceUrl: selected.websiteUrl ?? "",
      verifiedAt: selected.lastUpdated,
      publicVisible: Boolean(selected.grievanceEmail || selected.supportEmail),
    },
    riskMetadata: {
      ...data.selectedApp.riskMetadata,
      riskLevel: selected.riskLevel,
      trustScore: selected.trustScore,
      reviewCount: selected.reviewCount,
      complaintVolume: selected.complaintVolume ?? 0,
      topComplaintTags: selected.topComplaintTags ?? [],
      manualRiskNote: selected.publicSafetyNote ?? "",
    },
  };
}

export default function AdminLoanAppDatabasePage({
  data,
  createError = "",
  isCreating = false,
  onCreateApp,
}: {
  data: AdminLoanAppDatabase;
  createError?: string;
  isCreating?: boolean;
  onCreateApp?: (input: CreateAdminLoanAppInput) => Promise<unknown>;
}) {
  const [selectedId, setSelectedId] = useState("");
  const [filters, setFilters] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const filteredApps = useMemo(() => applyGlobalFilters(data.apps, adminAppDbFilterSchema, filters), [data.apps, filters]);
  const selectedDetail = selectedId ? mergeSelectedAppDetail(data, selectedId) : null;
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-[1700px] space-y-4">
        <AdminAppsHeader stats={data.stats} onAdd={() => setShowCreate(true)} onImport={() => setShowImport((value) => !value)} />
        {showCreate && onCreateApp && (
          <CreateLoanAppPanel
            error={createError}
            isCreating={isCreating}
            onCancel={() => setShowCreate(false)}
            onCreate={onCreateApp}
          />
        )}
        {showImport ? <BulkImportAppsPanel /> : null}
        <GlobalFilterPanel schema={adminAppDbFilterSchema} state={filters} onChange={setFilters} />
        <AdminAppSearchFilters />
        <AdminAppRecordsTable apps={filteredApps} onSelect={setSelectedId} />
        {selectedDetail ? <AppDetailEditorDrawer data={selectedDetail} onClose={() => setSelectedId("")} /> : null}
      </div>
    </main>
  );
}
