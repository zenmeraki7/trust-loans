"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AnswerValue, RiskCheckerData } from "@/types/riskChecker";

export function RiskCheckerHero() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm md:p-8">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Check a loan app before you borrow</h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Answer a few questions to understand warning signs around fees, permissions, lender transparency, repayment terms, and user-reported complaint patterns.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Start Risk Check</button>
        <Link href="/loan-apps" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Browse Loan Apps</Link>
      </div>
      <p className="mt-2 text-xs text-slate-500">This tool provides general awareness only and does not guarantee safety.</p>
    </section>
  );
}

export function AppSelectionSearch() {
  return <input className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" placeholder="Search/select loan app input" />;
}

export function SelectedAppSummary({ app }: { app: RiskCheckerData["selectedApp"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img src={app.logoUrl} alt={app.name} className="h-12 w-12 rounded-lg border border-slate-200" />
        <div>
          <p className="font-semibold text-slate-900">{app.name}</p>
          <p className="text-xs text-slate-600">{app.developerName} • {app.companyName}</p>
          <p className="text-xs text-slate-600">Claimed NBFC partner: {app.claimedNbfcPartner}</p>
          <p className="text-xs text-slate-600">Trust {app.trustScore}/100 • {app.averageRating} rating • {app.reviewCount} reviews</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">{app.topComplaintTags.map((t) => <span key={t} className="rounded-full bg-slate-100 px-2 py-1 text-xs">{t}</span>)}</div>
      <Link href={app.profileUrl} className="mt-2 inline-block text-xs font-semibold text-slate-700 underline">Open full app profile</Link>
    </section>
  );
}

export function ManualChecklistMode() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Manual checklist mode</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {["I don’t know the app details", "I want to check manually", "I only have a WhatsApp loan offer", "I only know the app name"].map((x) => (
          <span key={x} className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{x}</span>
        ))}
      </div>
    </section>
  );
}

export function RiskProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return <div><div className="mb-1 text-xs text-slate-600">Step {current} of {total}</div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-slate-900" style={{ width: `${pct}%` }} /></div></div>;
}

export function RiskAnswerOptions({
  value,
  onChange,
}: {
  value?: AnswerValue;
  onChange: (v: AnswerValue) => void;
}) {
  const opts: AnswerValue[] = ["yes", "no", "not_sure", "not_applicable"];
  return <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">{opts.map((o) => <button key={o} type="button" onClick={() => onChange(o)} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${value === o ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700"}`}>{o.replaceAll("_", " ")}</button>)}</div>;
}

export function RiskQuestionCard({
  question,
  value,
  onChange,
}: {
  question: RiskCheckerData["steps"][number]["questions"][number];
  value?: AnswerValue;
  onChange: (v: AnswerValue) => void;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-900">{question.label}</p>
      <p className="text-xs text-slate-500">Severity: {question.severity}</p>
      <RiskAnswerOptions value={value} onChange={onChange} />
    </article>
  );
}

export function RiskCheckStepper({
  data,
  stepIndex,
  answers,
  onAnswer,
}: {
  data: RiskCheckerData;
  stepIndex: number;
  answers: Record<string, AnswerValue>;
  onAnswer: (id: string, value: AnswerValue) => void;
}) {
  const step = data.steps[stepIndex];
  return (
    <section className="space-y-3">
      <RiskProgressBar current={stepIndex + 1} total={data.steps.length} />
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-900">{step.title}</h3>
        <p className="text-sm text-slate-600">{step.description}</p>
      </div>
      {step.questions.map((q) => <RiskQuestionCard key={q.id} question={q} value={answers[q.id]} onChange={(v) => onAnswer(q.id, v)} />)}
    </section>
  );
}

function computeResult(data: RiskCheckerData, answers: Record<string, AnswerValue>) {
  const warningSignals: string[] = [];
  const missingInformation: string[] = [];
  let score = 0;
  data.steps.forEach((s) => s.questions.forEach((q) => {
    const a = answers[q.id];
    if (!a || a === "not_sure") missingInformation.push(q.label);
    if (a === q.riskWhenAnswerIs) {
      score += q.riskWeight;
      warningSignals.push(q.label);
    }
  }));
  const cautionLevel = score <= 15 ? "Low caution" : score <= 35 ? "Review carefully" : score <= 60 ? "High caution" : "Serious warning signals";
  const summary = score <= 15 ? "Fewer warning signals detected from your answers." : "Based on your answers, this app shows warning signals that you should review carefully before borrowing.";
  return { score, cautionLevel, summary, warningSignals, missingInformation };
}

export function WarningSignalsList({ items }: { items: string[] }) {
  return <div className="flex flex-wrap gap-1">{items.slice(0, 8).map((i) => <span key={i} className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">{i}</span>)}</div>;
}

export function RecommendedActionsGrid({ level }: { level: string }) {
  const map: Record<string, string[]> = {
    "Low caution": ["Verify lender and grievance details", "Read recent reviews", "Save loan agreement screenshots", "Confirm total repayment amount"],
    "Review carefully": ["Review hidden charges carefully", "Check app permissions", "Verify NBFC/lender relationship", "Avoid sharing documents outside official channels"],
    "High caution": ["Do not rush", "Preserve screenshots", "Check complaint patterns", "Contact grievance officer before paying"],
    "Serious warning signals": ["Preserve evidence", "Do not share OTPs/passwords/private images", "Avoid unofficial payment channels", "Consider cybercrime complaint for threats/data misuse"],
  };
  const items = map[level] ?? map["Review carefully"];
  return <section className="grid grid-cols-1 gap-2 md:grid-cols-2">{items.map((a) => <div key={a} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">You may consider: {a}</div>)}</section>;
}

export function RiskScoreResultCard({
  result,
}: {
  result: { score: number; cautionLevel: string; summary: string; warningSignals: string[]; missingInformation: string[] };
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">Result</h3>
      <p className="text-sm text-slate-700">Caution level: <span className="font-semibold">{result.cautionLevel}</span> • Score: {result.score}</p>
      <p className="mt-1 text-sm text-slate-600">{result.summary}</p>
      <p className="mt-3 text-xs font-semibold uppercase text-slate-500">Top warning signals</p>
      <WarningSignalsList items={result.warningSignals} />
      <p className="mt-3 text-xs font-semibold uppercase text-slate-500">Missing information to verify</p>
      <WarningSignalsList items={result.missingInformation} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/loan-apps/swift-cash" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold">View app profile</Link>
        <Link href="/loan-apps/swift-cash/submit-review" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold">Submit a review</Link>
        <Link href="/legal-action-guide" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold">Open legal action guide</Link>
        <Link href="/complaint-templates" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold">Use complaint template</Link>
      </div>
    </section>
  );
}

export function SaveShareResultActions() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-slate-900">Save / Share result</h4>
      <div className="mt-2 flex flex-wrap gap-2">
        {["Download result as PDF", "Save to user dashboard", "Copy summary", "Share checklist link", "Start over"].map((x) => (
          <button key={x} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">{x}</button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">Your answers should not include Aadhaar, PAN, OTPs, passwords, or private photos.</p>
    </section>
  );
}

export function EducationalSidePanel({ tips }: { tips: RiskCheckerData["educationalTips"] }) {
  return (
    <aside className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-slate-900">Educational tips</h4>
      {tips.map((t) => (
        <Link key={t.id} href={t.href} className="block rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
          <p className="font-semibold text-slate-900">{t.title}</p>
          <p>{t.description}</p>
        </Link>
      ))}
    </aside>
  );
}

export function RiskCheckerDisclaimerBox() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700 shadow-sm">
      This risk checker is for general awareness only. It is based on your answers, public details, and user-reported patterns where available.
      It is not legal, financial, or regulatory advice and does not guarantee whether any app is safe or unsafe.
    </section>
  );
}

export function MobileRiskCheckerNav({
  onPrev,
  onNext,
  isFirst,
  isLast,
}: {
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-4xl gap-2">
        <button onClick={onPrev} disabled={isFirst} className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold disabled:opacity-50">Previous</button>
        <button onClick={onNext} className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">{isLast ? "Show Result" : "Next"}</button>
      </div>
    </div>
  );
}

export default function LoanAppRiskCheckerPage({ data }: { data: RiskCheckerData }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(data.answers);
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => computeResult(data, answers), [data, answers]);
  const isLast = stepIndex === data.steps.length - 1;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-24">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-10">
        <RiskCheckerHero />
        <AppSelectionSearch />
        <SelectedAppSummary app={data.selectedApp} />
        <ManualChecklistMode />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {!showResult ? (
              <RiskCheckStepper data={data} stepIndex={stepIndex} answers={answers} onAnswer={(id, value) => setAnswers((a) => ({ ...a, [id]: value }))} />
            ) : (
              <>
                <RiskScoreResultCard result={result} />
                <RecommendedActionsGrid level={result.cautionLevel} />
                <SaveShareResultActions />
              </>
            )}
          </div>
          <EducationalSidePanel tips={data.educationalTips} />
        </div>
        <RiskCheckerDisclaimerBox />
      </div>
      <MobileRiskCheckerNav
        isFirst={stepIndex === 0}
        isLast={isLast}
        onPrev={() => setStepIndex((s) => Math.max(0, s - 1))}
        onNext={() => {
          if (showResult) return;
          if (isLast) setShowResult(true);
          else setStepIndex((s) => s + 1);
        }}
      />
    </main>
  );
}
