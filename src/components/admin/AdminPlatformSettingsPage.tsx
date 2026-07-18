"use client";

import type { AdminPlatformSettingsData } from "@/types/adminPlatformSettings";

export function VersionBadge({ v }: { v: string }) { return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{v}</span>; }
export function RiskLabelBadge({ label }: { label: string }) { return <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">{label}</span>; }
export function SettingToggle({ label, checked }: { label: string; checked: boolean }) { return <label className="rounded bg-slate-50 p-2 text-xs"><input type="checkbox" defaultChecked={checked} className="mr-2" />{label}</label>; }
export function WeightSlider({ label, value }: { label: string; value: number }) { return <div className="rounded bg-slate-50 p-2 text-xs"><p>{label}: {value}%</p><input type="range" min={0} max={100} defaultValue={value} className="w-full" /></div>; }

export function PlatformSettingsHeader({ s }: { s: AdminPlatformSettingsData["status"] }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h1 className="text-2xl font-semibold">Platform Settings</h1><p className="text-sm text-slate-600">Configure trust scoring, risk signals, moderation policy, privacy protections, evidence handling, and company response rules.</p><div className="mt-2 flex flex-wrap gap-2">{["Save Changes","Publish Configuration","Preview Impact","Export Settings","View Change History","Restore Previous Version"].map((x)=><button key={x} className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold">{x}</button>)}</div><div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4"><div className="rounded bg-slate-50 p-2">Active: <VersionBadge v={s.activeScoringVersion} /></div><div className="rounded bg-slate-50 p-2">Draft: <VersionBadge v={s.draftConfigurationVersion} /></div><div className="rounded bg-slate-50 p-2">Last published: {s.lastPublishedAt}</div><div className="rounded bg-slate-50 p-2">By: {s.lastPublishedBy}</div><div className="rounded bg-slate-50 p-2">Pending changes: {s.pendingChanges}</div><div className="rounded bg-slate-50 p-2">Rules review: {s.rulesRequiringReview}</div><div className="rounded bg-slate-50 p-2">Privacy rules: {s.privacyRulesEnabled?"Enabled":"Disabled"}</div><div className="rounded bg-slate-50 p-2">Audit logging: {s.auditLoggingEnabled?"Enabled":"Disabled"}</div></div></section>;
}

export function SettingsNavigation() {
  const tabs = ["Trust Score","Risk Labels","Complaint Weights","Review Moderation","Privacy Redaction","Evidence Handling","Company Responses","User Verification","Review Integrity","Notifications","Public Display","Audit & Versioning"];
  return <aside className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><div className="space-y-1 text-xs">{tabs.map((t)=><p key={t} className="rounded px-2 py-1 hover:bg-slate-50">{t}</p>)}</div></aside>;
}

export function TrustScoreConfiguration({ t }: { t: AdminPlatformSettingsData["trustScore"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Trust score configuration</h3><div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">{Object.entries(t).map(([k,v])=><WeightSlider key={k} label={k} value={v} />)}</div><p className="mt-2 text-xs text-slate-600">Formula preview: weighted combination of rating, complaint severity, verification, response, and integrity signals.</p></section>;
}
export function RiskLabelConfiguration({ items }: { items: AdminPlatformSettingsData["riskLabels"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Risk label configuration</h3><div className="mt-2 space-y-2">{items.map((r)=><div key={r.key} className="rounded bg-slate-50 p-2 text-xs"><RiskLabelBadge label={r.label} /><p>{r.minScore}-{r.maxScore} • {r.displayColor}</p><p>{r.publicExplanation}</p></div>)}</div></section>;
}
export function ComplaintWeightSettings({ items }: { items: AdminPlatformSettingsData["complaintWeights"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Complaint category weighting</h3><div className="grid grid-cols-1 gap-2 md:grid-cols-2">{items.map((c)=><div key={c.key} className="rounded bg-slate-50 p-2 text-xs"><p className="font-semibold">{c.label}</p><p>Severity: {c.severity} • Weight: {c.weightPoints}</p><p>{c.moderatorGuidance}</p></div>)}</div></section>;
}
export function ReviewModerationSettings({ data }: { data: AdminPlatformSettingsData["reviewModeration"] }) { return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Review moderation settings</h3><div className="mt-2 grid grid-cols-1 gap-1 md:grid-cols-2">{Object.entries(data).map(([k,v])=><SettingToggle key={k} label={k} checked={v} />)}</div></section>; }
export function PrivacyRedactionSettings({ data }: { data: AdminPlatformSettingsData["privacyRedaction"] }) { return <section className="rounded-xl border border-rose-200 bg-rose-50 p-4"><h3 className="font-semibold text-rose-900">Privacy redaction settings</h3><div className="mt-2 grid grid-cols-1 gap-1 md:grid-cols-2">{Object.entries(data).map(([k,v])=><SettingToggle key={k} label={k} checked={v} />)}</div></section>; }
export function EvidenceHandlingSettings({ data }: { data: AdminPlatformSettingsData["evidenceHandling"] }) { return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs"><h3 className="font-semibold">Evidence handling settings</h3><p>Allowed file types: {data.allowedFileTypes.join(", ")} • Max size: {data.maxFileSizeMb}MB • Retention: {data.retentionDays} days</p><div className="mt-2 grid grid-cols-1 gap-1 md:grid-cols-2">{Object.entries(data).filter(([,v])=>typeof v==="boolean").map(([k,v])=><SettingToggle key={k} label={k} checked={Boolean(v)} />)}</div></section>; }
export function CompanyResponseSettings({ data }: { data: AdminPlatformSettingsData["companyResponses"] }) { return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs"><h3 className="font-semibold">Company response settings</h3><div className="mt-2 grid grid-cols-1 gap-1 md:grid-cols-2">{Object.entries(data).filter(([,v])=>typeof v==="boolean").map(([k,v])=><SettingToggle key={k} label={k} checked={Boolean(v)} />)}</div><p className="mt-2">Allowed categories: {data.allowedResponseCategories.join(", ")}</p></section>; }
export function UserVerificationSettings({ data }: { data: AdminPlatformSettingsData["userVerification"] }) { return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">User verification settings</h3><div className="mt-2 grid grid-cols-1 gap-1 md:grid-cols-2">{Object.entries(data).map(([k,v])=>typeof v==="boolean"?<SettingToggle key={k} label={k} checked={v} />:<div key={k} className="rounded bg-slate-50 p-2 text-xs">{k}: {v}</div>)}</div></section>; }
export function ReviewIntegritySettings({ data }: { data: AdminPlatformSettingsData["reviewIntegrity"] }) { return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Review integrity settings</h3><div className="mt-2 grid grid-cols-1 gap-1 md:grid-cols-2">{Object.entries(data).filter(([,v])=>typeof v==="boolean").map(([k,v])=><SettingToggle key={k} label={k} checked={Boolean(v)} />)}</div><p className="mt-2 text-xs">Actions: {data.integrityFlagActions.join(", ")}</p></section>; }
export function PublicDisplaySettings({ data }: { data: AdminPlatformSettingsData["publicDisplay"] }) { return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Public display settings</h3><div className="mt-2 grid grid-cols-1 gap-1 md:grid-cols-2">{Object.entries(data).map(([k,v])=>typeof v==="boolean"?<SettingToggle key={k} label={k} checked={v} />:<div key={k} className="rounded bg-slate-50 p-2 text-xs">{k}: {v}</div>)}</div></section>; }
export function NotificationSettings({ data }: { data: AdminPlatformSettingsData["notifications"] }) { return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs"><h3 className="font-semibold">Notification settings</h3><p>User events: {data.userEvents.join(", ")}</p><p>Admin events: {data.adminEvents.join(", ")}</p><p>Channels: {data.channels.join(", ")}</p></section>; }
export function AuditVersioningPanel({ items }: { items: AdminPlatformSettingsData["auditVersions"] }) { return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Audit & versioning</h3><div className="mt-2 space-y-2">{items.map((v)=><div key={v.version} className="rounded bg-slate-50 p-2 text-xs"><p><VersionBadge v={v.version} /> • {v.changedBy} • {v.changedAt}</p><p>{v.changeSummary}</p><p>{v.approvalStatus} • {v.publishedStatus}</p></div>)}</div><div className="mt-2 flex gap-2">{["Preview impact","Publish settings","Rollback","Export settings JSON","View full history"].map((x)=><button key={x} className="rounded border px-2 py-1 text-xs">{x}</button>)}</div></section>; }
export function ConfigurationImpactPreview({ data }: { data: AdminPlatformSettingsData["impactPreview"] }) { return <section className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h3 className="font-semibold text-amber-900">Configuration impact preview</h3><div className="mt-2 grid grid-cols-2 gap-2 text-xs md:grid-cols-3"><div className="rounded bg-white p-2">Apps affected: {data.appsAffected}</div><div className="rounded bg-white p-2">Risk labels changed: {data.riskLabelsChanged}</div><div className="rounded bg-white p-2">Trust scores changed: {data.trustScoresChanged}</div><div className="rounded bg-white p-2">Reviews reprocessing: {data.reviewsRequiringReprocessing}</div><div className="rounded bg-white p-2">Public pages affected: {data.publicPagesAffected}</div><div className="rounded bg-white p-2">{data.moderationWorkloadImpact}</div></div><div className="mt-2 space-y-1 text-xs text-amber-900">{data.warnings.map((w)=><p key={w}>• {w}</p>)}</div></section>; }
export function PermissionNotice() { return <section className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700 shadow-sm">Only authorized admins can change scoring, moderation, privacy, and evidence settings. All changes are logged and may require senior approval.</section>; }
export function SettingsErrorState() { return <section className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">Platform settings could not be loaded.<div className="mt-2 flex gap-2"><button className="rounded border border-rose-300 bg-white px-2 py-1 text-xs">Retry</button><button className="rounded border border-rose-300 bg-white px-2 py-1 text-xs">View last published version</button><button className="rounded border border-rose-300 bg-white px-2 py-1 text-xs">Contact system admin</button></div></section>; }

export default function AdminPlatformSettingsPage({ data }: { data: AdminPlatformSettingsData }) {
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-[1700px] space-y-4">
        <PlatformSettingsHeader s={data.status} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[260px_1fr]">
          <SettingsNavigation />
          <div className="space-y-4">
            <TrustScoreConfiguration t={data.trustScore} />
            <RiskLabelConfiguration items={data.riskLabels} />
            <ComplaintWeightSettings items={data.complaintWeights} />
            <ReviewModerationSettings data={data.reviewModeration} />
            <PrivacyRedactionSettings data={data.privacyRedaction} />
            <EvidenceHandlingSettings data={data.evidenceHandling} />
            <CompanyResponseSettings data={data.companyResponses} />
            <UserVerificationSettings data={data.userVerification} />
            <ReviewIntegritySettings data={data.reviewIntegrity} />
            <PublicDisplaySettings data={data.publicDisplay} />
            <NotificationSettings data={data.notifications} />
            <AuditVersioningPanel items={data.auditVersions} />
            <ConfigurationImpactPreview data={data.impactPreview} />
            <PermissionNotice />
          </div>
        </div>
      </div>
    </main>
  );
}
