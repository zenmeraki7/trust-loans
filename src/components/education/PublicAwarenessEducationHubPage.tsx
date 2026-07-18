"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { EducationHubData } from "@/types/educationHub";

export function EducationHero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm md:p-8">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Learn before you borrow</h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
        Understand loan app risks, warning signs, user-reported complaint patterns, and safer steps before taking a digital loan.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/loan-apps" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Search Loan Apps</Link>
        <Link href="/learn/payday-loans" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Payday Loans Guide</Link>
        <Link href="/legal-action-guide" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Check Safety Checklist</Link>
        <Link href="/loan-apps" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Read User Reviews</Link>
        <Link href="/loan-apps" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Report Your Experience</Link>
      </div>
      <input className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" placeholder="Search a loan app before borrowing" />
      <p className="mt-2 text-xs text-slate-500">Reviews, risk signals, and public details in one place.</p>
    </section>
  );
}

export function TemplateCategoryCard({ item }: { item: EducationHubData["safetyCards"][number] }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{item.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {item.warningSigns.map((w) => <span key={w} className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">{w}</span>)}
      </div>
      <Link href={item.href} className="mt-3 inline-block rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">{item.ctaLabel}</Link>
    </article>
  );
}

export function QuickSafetyCards({ items }: { items: EducationHubData["safetyCards"] }) {
  return <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{items.map((i) => <TemplateCategoryCard key={i.id} item={i} />)}</section>;
}

export function BeforeBorrowChecklist({ items }: { items: EducationHubData["beforeBorrowChecklist"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Before you borrow checklist</h2>
      <div className="space-y-2">
        {items.map((i) => (
          <label key={i.id} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            <input type="checkbox" className="mt-0.5 h-4 w-4" />
            <span><span className="font-medium">{i.label}</span> • {i.description}</span>
          </label>
        ))}
      </div>
      <Link href="/legal-action-guide" className="mt-3 inline-block rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Open full safety checklist</Link>
    </section>
  );
}

export function RbiRegistrationAwareness() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">RBI registration alone is not enough to trust an app</h2>
      <p className="mt-2 text-sm text-slate-700">
        RBI registration can be one signal, but users should verify the full lending relationship and complaint history.
        Before borrowing, verify lender identity, grievance channels, repayment terms, and claimed NBFC relationships.
      </p>
    </section>
  );
}

export function PredatoryPatternCards({ items }: { items: EducationHubData["predatoryPatterns"] }) {
  return <section className="grid grid-cols-1 gap-3 md:grid-cols-2">{items.map((i) => <article key={i.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">Warning pattern</p><h3 className="font-semibold text-slate-900">{i.title}</h3><p className="text-sm text-slate-600">{i.description}</p></article>)}</section>;
}

export function DataPermissionAwareness({ items }: { items: EducationHubData["dataPermissions"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold text-slate-900">Data permission awareness</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {items.map((i) => (
          <div key={i.permission} className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-900">{i.permission}</p>
            <p className="text-slate-700">Why requested: {i.whyRequested}</p>
            <p className="text-slate-700">Risk: {i.riskExplanation}</p>
            <p className="text-slate-700">Tip: {i.userTip}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        Do not share OTPs, passwords, Aadhaar/PAN images, or private photos through WhatsApp or unofficial channels.
      </p>
    </section>
  );
}

export function HarassmentActionFlow() {
  const steps = [
    "Preserve evidence",
    "Stop abusive conversations",
    "Do not share OTPs or documents",
    "Contact official grievance channel",
    "Report cyber harassment if threats/data misuse occur",
    "Consider RBI/consumer complaint where applicable",
    "Seek legal advice for serious threats",
    "Share a safe review to warn others",
  ];
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-xl font-semibold">What to do if harassment starts</h2><div className="space-y-2">{steps.map((s, i) => <div key={s} className="rounded-xl bg-slate-50 p-3 text-sm">Step {i + 1}: {s}</div>)}</div><Link href="/legal-action-guide" className="mt-3 inline-block rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Open Legal Action Guide</Link></section>;
}

export function MythFactSection({ items }: { items: EducationHubData["mythFacts"] }) {
  return <section className="grid grid-cols-1 gap-3 md:grid-cols-2">{items.map((m) => <article key={m.myth} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold text-amber-700">Myth</p><p className="text-sm text-slate-700">{m.myth}</p><p className="mt-2 text-xs font-semibold text-emerald-700">Fact</p><p className="text-sm text-slate-700">{m.fact}</p></article>)}</section>;
}

export function UserStoryExamples({ items }: { items: EducationHubData["userStories"] }) {
  return <section className="space-y-2"><h2 className="text-xl font-semibold">User stories (anonymized examples)</h2><div className="grid grid-cols-1 gap-3 md:grid-cols-2">{items.map((s) => <article key={s.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">{s.category}</p><h3 className="font-semibold text-slate-900">{s.title}</h3><p className="text-sm text-slate-700">{s.scenario}</p><p className="mt-1 text-sm text-slate-600">Lesson: {s.lesson}</p></article>)}</div></section>;
}

export function ResourceLibraryGrid({ items }: { items: EducationHubData["resources"] }) {
  return <section className="space-y-2"><h2 className="text-xl font-semibold">Resource library</h2><div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{items.map((r) => <article key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">{r.category} • {r.readingTime}</p><h3 className="font-semibold text-slate-900">{r.title}</h3><p className="text-sm text-slate-700">{r.summary}</p><Link href={r.href} className="mt-2 inline-block rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">Read Guide</Link></article>)}</div></section>;
}

export function SafetyRiskChecker({ questions }: { questions: EducationHubData["riskCheckerQuestions"] }) {
  const [score, setScore] = useState(0);
  const label = useMemo(() => (score <= 2 ? "Low caution" : score <= 5 ? "Review carefully" : score <= 8 ? "High caution" : "Seek more information before borrowing"), [score]);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-semibold">Safety quiz / risk checker</h2>
      <div className="space-y-2">
        {questions.map((q) => (
          <div key={q.id} className="rounded-xl bg-slate-50 p-3 text-sm">
            <p>{q.question}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => setScore((s) => s + q.riskWeight)} className="rounded border border-slate-300 px-2 py-1 text-xs">Yes</button>
              <button className="rounded border border-slate-300 px-2 py-1 text-xs">No</button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{label}</p>
      <p className="mt-2 text-xs text-slate-500">This checker is for awareness only and does not guarantee safety.</p>
    </section>
  );
}

export function EducationDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
      This education hub provides general awareness based on public information and user-reported patterns. It is not legal, financial, or
      regulatory advice. Users should independently verify app, lender, NBFC, and repayment details before borrowing.
    </section>
  );
}

export function MobileEducationCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-4xl gap-2">
        <Link href="/loan-apps" className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white">Search App</Link>
        <Link href="/loan-apps" className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700">Report Issue</Link>
      </div>
    </div>
  );
}

export default function PublicAwarenessEducationHubPage({ data }: { data: EducationHubData }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-24">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <EducationHero />
        <QuickSafetyCards items={data.safetyCards} />
        <BeforeBorrowChecklist items={data.beforeBorrowChecklist} />
        <RbiRegistrationAwareness />
        <PredatoryPatternCards items={data.predatoryPatterns} />
        <DataPermissionAwareness items={data.dataPermissions} />
        <HarassmentActionFlow />
        <MythFactSection items={data.mythFacts} />
        <UserStoryExamples items={data.userStories} />
        <ResourceLibraryGrid items={data.resources} />
        <SafetyRiskChecker questions={data.riskCheckerQuestions} />
        <EducationDisclaimerBox />
      </div>
      <MobileEducationCTA />
    </main>
  );
}
