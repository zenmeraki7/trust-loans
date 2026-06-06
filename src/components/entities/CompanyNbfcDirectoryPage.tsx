//src/app/components/entities/CompanyNbfcDirectoryPage.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type ClipboardEvent, type FormEvent, useMemo, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useCompanies, type CompanyDirectoryItem } from "@/hooks/useCompanies";
import type { EntityProfileData } from "@/types/entityProfile";

function RiskBadge({ level }: { level: CompanyDirectoryItem["riskSignalLevel"] }) {
  const tone = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-orange-100 text-orange-700",
    severe: "bg-rose-100 text-rose-700",
  }[level];
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{level === "severe" ? "Severe" : level}</span>;
}

function VerificationBadge({ status }: { status: CompanyDirectoryItem["verificationStatus"] }) {
  const tone =
    status === "verified_public_details"
      ? "bg-emerald-100 text-emerald-700"
      : status === "conflicting_information"
      ? "bg-rose-100 text-rose-700"
      : status === "partially_verified"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-700";

  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{status.replaceAll("_", " ")}</span>;
}

const defaultCompanyForm = {
  name: "",
  slug: "",
  logoUrl: "",
  officialWebsite: "",
  supportEmail: "",
  grievanceEmail: "",
  supportPhone: "",
  registeredAddress: "",
  nbfcRegistrationClaim: "",
};

function slugFromName(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

function AddNbfcCompanyForm({ onCancel, onCreated }: { onCancel: () => void; onCreated: (profile: EntityProfileData) => void }) {
  const [form, setForm] = useState(defaultCompanyForm);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const update = (field: keyof typeof defaultCompanyForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "name" && !current.slug ? { slug: slugFromName(value) } : {}),
    }));
  };

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
    if (!form.name.trim()) {
      setError("NBFC/company name is required.");
      return;
    }
    setIsSaving(true);
    try {
      const profile = await apiClient<EntityProfileData>("/api/companies", {
        method: "POST",
        body: {
          ...form,
          slug: form.slug || slugFromName(form.name),
        },
      });
      onCreated(profile);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Could not add NBFC company.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Add NBFC company</h2>
          <p className="mt-1 text-sm text-slate-500">Create a standalone NBFC/company profile, then enrich it with official details.</p>
        </div>
        <button type="button" onClick={onCancel} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
      </div>

      {error ? <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">NBFC / company name <span className="text-rose-500">*</span></label>
          <input value={form.name} onChange={(event) => update("name", event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1746A2]" placeholder="e.g. ABC Finance Ltd" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Slug</label>
          <input value={form.slug} onChange={(event) => update("slug", event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1746A2]" placeholder="auto-generated-from-name" />
        </div>
        <div>
          <span className="mb-1 block text-xs font-medium text-slate-600">Logo URL or image</span>
          <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-[#1746A2]">
            <input value={form.logoUrl} onChange={(event) => update("logoUrl", event.target.value)} onPaste={(event) => void updateLogoPaste(event)} className="min-w-0 flex-1 px-3 py-2 text-sm outline-none" placeholder="Paste URL or choose image" />
            <label className="shrink-0 cursor-pointer border-l border-slate-300 bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
              Choose image
              <input type="file" accept="image/*" onChange={(event) => void updateLogoChoice(event)} className="sr-only" />
            </label>
          </div>
          {form.logoUrl ? <img src={form.logoUrl} alt="Logo preview" className="mt-2 h-12 w-12 rounded-lg border border-slate-200 bg-white p-1 object-contain" /> : null}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Official website</label>
          <input value={form.officialWebsite} onChange={(event) => update("officialWebsite", event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1746A2]" placeholder="https://company.com" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Support email</label>
          <input type="email" value={form.supportEmail} onChange={(event) => update("supportEmail", event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1746A2]" placeholder="support@company.com" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Grievance email</label>
          <input type="email" value={form.grievanceEmail} onChange={(event) => update("grievanceEmail", event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1746A2]" placeholder="grievance@company.com" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Support phone</label>
          <input value={form.supportPhone} onChange={(event) => update("supportPhone", event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1746A2]" placeholder="+91 XXXXX XXXXX" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Registered address</label>
          <input value={form.registeredAddress} onChange={(event) => update("registeredAddress", event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1746A2]" placeholder="Registered office address" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-600">NBFC registration claim</label>
          <input value={form.nbfcRegistrationClaim} onChange={(event) => update("nbfcRegistrationClaim", event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1746A2]" placeholder="RBI registration claim or NBFC partner text" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-400">This creates an NBFC/company profile even before loan apps are linked.</p>
        <button disabled={isSaving} className="rounded-xl bg-[#1746A2] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Adding..." : "Add NBFC company"}</button>
      </div>
    </form>
  );
}

export default function CompanyNbfcDirectoryPage() {
  const router = useRouter();
  const companies = useCompanies();
  const [query, setQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredItems = useMemo(() => {
    const items = companies.data?.items ?? [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) =>
      [item.displayName, item.name, item.slug, item.entityType].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [companies.data?.items, query]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Companies and NBFCs</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 md:text-4xl">Company / NBFC Profiles</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Browse company, developer, and claimed NBFC partner profiles generated from linked loan app records.
          </p>
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1746A2]"
              placeholder="Search company, NBFC, developer, or slug"
            />
            <Link href="/loan-apps" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700">
              View loan apps
            </Link>
            <button type="button" onClick={() => setShowAddForm((value) => !value)} className="rounded-xl bg-[#1746A2] px-4 py-2 text-center text-sm font-semibold text-white">
              Add NBFC company
            </button>
          </div>
        </section>

        {showAddForm ? (
          <AddNbfcCompanyForm
            onCancel={() => setShowAddForm(false)}
            onCreated={(profile) => {
              void companies.refetch();
              router.push(`/entities/${profile.slug}`);
            }}
          />
        ) : null}

        {companies.isLoading && <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading company profiles...</section>}

        {companies.isError && (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">
            Could not load company profiles. {(companies.error as Error).message}
          </section>
        )}

        {!companies.isLoading && !companies.isError && filteredItems.length === 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No company or NBFC profiles match this search. Add loan app company/NBFC details in Admin Apps to create profile links.
          </section>
        )}

        {filteredItems.length > 0 && (
          <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{item.displayName}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{item.entityType.replaceAll("_", " ")}</p>
                  </div>
                  <RiskBadge level={item.riskSignalLevel} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <VerificationBadge status={item.verificationStatus} />
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{item.totalLinkedApps} linked apps</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{item.totalReviewsAcrossApps} reviews</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    ["Linked apps", item.totalLinkedApps],
                    ["Reviews", item.totalReviewsAcrossApps],
                    ["Trust avg", (item as CompanyDirectoryItem & { averageLinkedAppTrustScore?: number }).averageLinkedAppTrustScore ?? "N/A"],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-xl bg-slate-50 p-2 text-center">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400">{label}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/entities/${item.slug}`} className="rounded-xl bg-[#1746A2] px-4 py-2 text-sm font-semibold text-white">
                    View NBFC / Company Profile
                  </Link>
                  <Link href={`/loan-apps?q=${encodeURIComponent(item.displayName)}`} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                    Linked loan apps
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
