"use client";

import { useState } from "react";
import type { AdminUserRoleManagementData } from "@/types/adminUserRoleManagement";

export function RoleBadge({ role }: { role: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{role}</span>;
}
export function AccountStatusBadge({ status }: { status: string }) {
  const cls = status === "active" ? "bg-emerald-100 text-emerald-700" : status === "suspended" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{status.replaceAll("_"," ")}</span>;
}
export function VerificationStatusBadge({ status }: { status: string }) {
  const cls = status === "verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cls}`}>{status.replaceAll("_"," ")}</span>;
}
export function PermissionBadge({ label }: { label: string }) {
  return <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{label}</span>;
}

export function UserRoleHeader() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h1 className="text-2xl font-semibold">Users & Roles</h1><p className="text-sm text-slate-600">Manage platform users, admin permissions, company representatives, verification status, and access controls.</p><div className="mt-2 flex flex-wrap gap-2">{["Invite User","Create Role","Export Access Log","Review Pending Representatives","Security Settings"].map((x)=><button key={x} className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold">{x}</button>)}</div></section>;
}
export function UserRoleStatsCards({ s }: { s: AdminUserRoleManagementData["stats"] }) {
  const items = [["Total users",s.totalUsers],["Admin users",s.adminUsers],["Moderators",s.moderators],["Company representatives",s.companyRepresentatives],["Pending invitations",s.pendingInvitations],["Suspended accounts",s.suspendedAccounts],["Elevated access users",s.elevatedAccessUsers],["Failed login alerts",s.failedLoginAlerts]];
  return <section className="grid grid-cols-2 gap-2 xl:grid-cols-4">{items.map(([k,v])=><div key={String(k)} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><p className="text-[11px] uppercase text-slate-500">{k}</p><p className="text-xl font-semibold">{v}</p></div>)}</section>;
}
export function UserSearchFilters() {
  const fields = ["Name / Email / Role / Company / App / User ID / Invite status","Role","Account status","Verification status","Last active date","Has admin access","Has evidence access","Has moderation access","Company representative","Suspended users","Pending invites"];
  return <section className="sticky top-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-6">{fields.map((f)=><input key={f} className="rounded border border-slate-300 px-2 py-2 text-xs" placeholder={f} />)}</div></section>;
}
export function BulkUserActionsBar() {
  return <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex flex-wrap gap-2">{["Change role","Suspend","Require 2FA","Revoke sessions","Export selected access logs","Assign moderator group","Remove from company profile"].map((x)=><button key={x} className="rounded border px-3 py-1 text-xs font-semibold">{x}</button>)}</div></section>;
}
export function UsersTable({ users, onSelect }: { users: AdminUserRoleManagementData["users"]; onSelect: (id: string)=>void }) {
  if (!users.length) return <EmptyUsersState />;
  return <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><table className="min-w-[1100px] text-left text-xs"><thead><tr className="border-b">{["User","Email","Role","Account type","Verification","Assigned entity","Permissions","Last active","Status","Actions"].map((h)=><th key={h} className="py-2 pr-2">{h}</th>)}</tr></thead><tbody>{users.map((u)=><tr key={u.id} className="border-b"><td className="py-2 pr-2">{u.name}</td><td className="py-2 pr-2">{u.emailMasked}</td><td className="py-2 pr-2"><RoleBadge role={u.role} /></td><td className="py-2 pr-2">{u.accountType.replaceAll("_"," ")}</td><td className="py-2 pr-2"><VerificationStatusBadge status={u.verificationStatus} /></td><td className="py-2 pr-2">{u.assignedEntityName || "-"}</td><td className="py-2 pr-2">{u.permissionsSummary.map((p)=><PermissionBadge key={p} label={p} />)}</td><td className="py-2 pr-2">{u.lastActiveAt}</td><td className="py-2 pr-2"><AccountStatusBadge status={u.status} /></td><td className="py-2 pr-2"><div className="flex gap-1"><button onClick={()=>onSelect(u.id)} className="rounded border px-2 py-1">View</button><button className="rounded border px-2 py-1">Edit Role</button><button className="rounded border px-2 py-1">Suspend</button></div></td></tr>)}</tbody></table></section>;
}
export function UserDetailDrawer({ u }: { u: AdminUserRoleManagementData["selectedUser"] }) {
  return <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="text-lg font-semibold">User detail</h3><div className="rounded bg-slate-50 p-3 text-xs"><p>{u.name} • {u.emailMasked} • {u.phoneMasked}</p><p>{u.accountType} • {u.role}</p><p>2FA: {u.security.twoFactorEnabled?"Enabled":"Disabled"} • Last login: {u.security.lastLoginAt}</p></div><AccessRestrictionsPanel data={u.accessRestrictions} /><AccountStatusManager /><UserAuditLog logs={u.auditLog} /></section>;
}
export function RoleManagementPanel({ roles }: { roles: AdminUserRoleManagementData["roles"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Role management</h3><div className="mt-2 space-y-2">{roles.map((r)=><div key={r.id} className="rounded bg-slate-50 p-2 text-xs"><p className="font-semibold">{r.name}</p><p>{r.description}</p><p>Permissions: {r.permissions.join(", ")}</p></div>)}</div></section>;
}
export function PermissionMatrix({ rows }: { rows: AdminUserRoleManagementData["permissionMatrix"] }) {
  const cols = ["superAdmin","admin","seniorModerator","moderator","dataVerifier","analyst","companyRepresentative","nbfcRepresentative"] as const;
  return <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="mb-2 font-semibold">Permission matrix</h3><table className="min-w-[1200px] text-left text-xs"><thead><tr className="border-b"><th className="py-2 pr-2">Permission</th>{cols.map((c)=><th key={c} className="py-2 pr-2">{c}</th>)}</tr></thead><tbody>{rows.map((r)=><tr key={r.permissionKey} className="border-b"><td className="py-2 pr-2">{r.label}</td>{cols.map((c)=><td key={c} className="py-2 pr-2">{r[c].replaceAll("_"," ")}</td>)}</tr>)}</tbody></table></section>;
}
export function InviteUserFlow() {
  const f = ["Full name","Email","Role","Account type","Assigned company/entity","Assigned app profiles","Access expiry date optional","Require 2FA","Internal note"];
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Invite user flow</h3><div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">{f.map((x)=><input key={x} className="rounded border border-slate-300 px-2 py-2 text-xs" placeholder={x} />)}</div><button className="mt-2 rounded border px-3 py-2 text-xs font-semibold">Send Invitation</button></section>;
}
export function RepresentativeVerificationQueue({ items }: { items: AdminUserRoleManagementData["pendingRepresentatives"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Company representative verification queue</h3><div className="mt-2 space-y-2">{items.map((i)=><div key={i.id} className="rounded bg-slate-50 p-2 text-xs"><p>{i.representativeName} • {i.businessEmailMasked}</p><p>{i.companyOrEntityName} • {i.claimedRole}</p><p>Requested: {i.requestedProfiles.join(", ")}</p><div className="mt-1 flex gap-1">{["Approve","Reject","Request docs","Assign limited access","Link claim"].map((a)=><button key={a} className="rounded border px-2 py-1">{a}</button>)}</div></div>)}</div></section>;
}
export function SecurityControlsPanel({ data }: { data: AdminUserRoleManagementData["securityControls"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Security controls</h3><div className="mt-2 grid grid-cols-1 gap-1 text-xs">{Object.entries(data).map(([k,v])=><label key={k} className="rounded bg-slate-50 p-2"><input type="checkbox" defaultChecked={Boolean(v)} className="mr-2" />{k} {typeof v==="number"?`: ${v}`:""}</label>)}</div><div className="mt-2 flex gap-1">{["Force password reset","Revoke all sessions"].map((a)=><button key={a} className="rounded border px-2 py-1 text-xs">{a}</button>)}</div></section>;
}
export function AccessRestrictionsPanel({ data }: { data: AdminUserRoleManagementData["selectedUser"]["accessRestrictions"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Access restrictions</h3><div className="mt-2 grid grid-cols-1 gap-1 text-xs md:grid-cols-2">{Object.entries(data).map(([k,v])=><label key={k} className="rounded bg-slate-50 p-2"><input type="checkbox" defaultChecked={v} className="mr-2" />{k}</label>)}</div></section>;
}
export function AccountStatusManager() {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Account status management</h3><div className="mt-2 flex flex-wrap gap-1">{["Activate","Suspend","Revoke access","Restore access","Delete/deactivate","Force logout"].map((a)=><button key={a} className={`rounded border px-2 py-1 text-xs ${a==="Suspend"||a.includes("Delete")?"border-rose-300 text-rose-700":""}`}>{a}</button>)}</div></section>;
}
export function UserAuditLog({ logs }: { logs: AdminUserRoleManagementData["selectedUser"]["auditLog"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">User audit log</h3><div className="mt-2 space-y-2">{logs.map((l,i)=><div key={i} className="rounded bg-slate-50 p-2 text-xs"><p>{l.timestamp} • {l.actor}</p><p>{l.action} → {l.target}</p><p>{l.previousValue} → {l.newValue}</p><p>{l.note}</p></div>)}</div></section>;
}
export function UserRiskAlerts({ items }: { items: AdminUserRoleManagementData["riskAlerts"] }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-semibold">Risk alerts</h3><div className="mt-2 space-y-2">{items.map((a)=><div key={a.id} className="rounded bg-rose-50 p-2 text-xs text-rose-800"><p>{a.alertType} • {a.severity}</p><p>{a.description}</p><p>{a.detectedAt} • {a.status}</p></div>)}</div></section>;
}
export function EmptyUsersState() {
  return <section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm"><p className="font-semibold">No users match your filters.</p><div className="mt-2 flex justify-center gap-2"><button className="rounded border px-3 py-2 text-xs">Clear filters</button><button className="rounded border px-3 py-2 text-xs">Invite user</button><button className="rounded border px-3 py-2 text-xs">View pending invites</button></div></section>;
}

export default function AdminUserRoleManagementPage({ data }: { data: AdminUserRoleManagementData }) {
  const [selected, setSelected] = useState(data.selectedUser.id);
  void selected;
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-[1700px] space-y-4">
        <UserRoleHeader />
        <UserRoleStatsCards s={data.stats} />
        <UserSearchFilters />
        <BulkUserActionsBar />
        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.15fr_1fr]">
          <div className="space-y-4">
            <UsersTable users={data.users} onSelect={setSelected} />
            <RoleManagementPanel roles={data.roles} />
            <PermissionMatrix rows={data.permissionMatrix} />
            <InviteUserFlow />
            <RepresentativeVerificationQueue items={data.pendingRepresentatives} />
            <SecurityControlsPanel data={data.securityControls} />
            <UserRiskAlerts items={data.riskAlerts} />
          </div>
          <UserDetailDrawer u={data.selectedUser} />
        </div>
      </div>
    </main>
  );
}
