import type { AppPermissionsData } from "@/types/appPermissions";
import OfficialStoreReportCard from "@/components/store-report/OfficialStoreReportCard";
import { officialStoreReport } from "@/data/mockOfficialStoreReport";

export function PermissionHero() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Understand loan app permissions</h1>
      <p className="mt-1 text-sm text-slate-600">Learn why contacts, photos, SMS, location, camera, and other permissions matter before using a loan app.</p>
    </section>
  );
}

export function PermissionRiskCards({ permissions }: { permissions: AppPermissionsData["permissions"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Permission Cards</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {permissions.map((permission) => (
          <article key={permission.key} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{permission.title}</p>
            <p className="mt-1 text-xs text-slate-700"><span className="font-medium">What it does:</span> {permission.whatItDoes}</p>
            <p className="mt-1 text-xs text-slate-700"><span className="font-medium">Why requested:</span> {permission.whyRequested}</p>
            <p className="mt-1 text-xs text-slate-700"><span className="font-medium">Why it may be risky:</span> {permission.riskExplanation}</p>
            <p className="mt-1 text-xs text-slate-700"><span className="font-medium">What users should verify:</span> {permission.whatToVerify}</p>
            <p className="mt-1 text-xs font-semibold text-slate-900">Safer action: {permission.saferAction}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function NormalVsCautionTable({ rows }: { rows: AppPermissionsData["normalVsCaution"] }) {
  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Normal vs Caution Examples</h2>
      <table className="mt-3 min-w-[700px] text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-2 pr-3">Permission</th>
            <th className="py-2 pr-3">Common use</th>
            <th className="py-2 pr-3">Caution sign</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.permission} className="border-b border-slate-100">
              <td className="py-2 pr-3 font-semibold text-slate-900">{row.permission}</td>
              <td className="py-2 pr-3 text-slate-700">{row.commonUse}</td>
              <td className="py-2 pr-3 text-slate-700">{row.cautionSign}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function WhatNotToShareSection({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-amber-900">What Not To Share</h2>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-amber-900">
        {items.map((item) => (
          <li key={item} className="rounded-lg bg-white/70 p-2">{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function BeforeInstallingChecklist({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Before Installing Checklist</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function PermissionDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
      This page provides general awareness guidance about app permissions and does not replace independent verification of lender, app, or legal terms.
    </section>
  );
}

export default function AppPermissionRiskExplainerPage({ data }: { data: AppPermissionsData }) {
  const storeReportData = {
    ...officialStoreReport,
    app: {
      ...officialStoreReport.app,
      name: "Selected loan app",
      developerName: "",
    },
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1300px] space-y-4">
        <PermissionHero />
        <PermissionRiskCards permissions={data.permissions} />
        <NormalVsCautionTable rows={data.normalVsCaution} />
        <WhatNotToShareSection items={data.notToShare} />
        <BeforeInstallingChecklist items={data.beforeInstallingChecklist} />
        <OfficialStoreReportCard data={storeReportData} />
        <PermissionDisclaimerBox />
      </div>
    </main>
  );
}
