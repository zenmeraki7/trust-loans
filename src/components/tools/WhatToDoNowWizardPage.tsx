"use client";

import { useMemo, useState } from "react";
import type { WhatToDoNowData } from "@/types/whatToDoNow";
import HarassmentEvidenceChecklist from "@/components/safety/HarassmentEvidenceChecklist";
import PanicPaymentWarningBanner from "@/components/safety/PanicPaymentWarningBanner";
import StopSharingMoreDataCard from "@/components/safety/StopSharingMoreDataCard";

type Answers = Record<WhatToDoNowData["questions"][number]["id"], boolean | null>;
type TriggerId = WhatToDoNowData["cybercrimeTriggerOptions"][number]["id"];
type RegulatedIssueId = WhatToDoNowData["regulatedIssueOptions"][number]["id"];

function buildPlan(answers: Answers) {
  const immediateSteps: string[] = [];
  const evidenceChecklist: string[] = [];
  const channels: string[] = [];
  const notToDo: string[] = [];
  let template = "/complaint-templates";

  if (answers.threatening || answers.photoMorphingThreat) {
    immediateSteps.push("Prioritize personal safety. If danger is immediate, contact local emergency services.");
    channels.push("National cybercrime portal");
    template = "/complaint-templates";
  }

  if (answers.contactedRelatives || answers.calledOffice) {
    immediateSteps.push("Collect timestamps and screenshots from affected contacts.");
    channels.push("Grievance officer + cybercrime reporting if harassment continues");
  }

  if (answers.personalUpiRequest) {
    immediateSteps.push("Pause payment and verify official repayment channel from app/website/loan agreement.");
    channels.push("App grievance officer");
  }

  if (answers.alreadyPaid && answers.paymentNotUpdated) {
    immediateSteps.push("Gather payment proof and request status update in writing.");
    channels.push("Support, grievance officer, and complaint channel if unresolved");
    template = "/before-you-pay";
  }

  if (!answers.haveScreenshots) {
    immediateSteps.push("Start preserving evidence now before messages disappear.");
  }

  evidenceChecklist.push("Screenshots of chats/messages/caller ID");
  if (answers.alreadyPaid) evidenceChecklist.push("Payment receipt, UPI/bank reference ID");
  if (answers.calledOffice || answers.contactedRelatives) evidenceChecklist.push("Contact statements from relatives/office where possible");
  if (answers.photoMorphingThreat) evidenceChecklist.push("Threat message copies and media metadata if available");

  notToDo.push("Do not share OTPs/passwords/private IDs");
  if (answers.personalUpiRequest) notToDo.push("Do not pay personal UPI unless officially verified");
  if (answers.photoMorphingThreat) notToDo.push("Do not send additional private photos");
  notToDo.push("Do not delete evidence");

  if (immediateSteps.length === 0) {
    immediateSteps.push("Use a factual written record of your issue and contact official support channels first.");
    channels.push("App support and grievance contact");
  }

  return {
    immediateSteps,
    evidenceChecklist,
    template,
    channels: Array.from(new Set(channels)),
    safeLinks: [
      { label: "Open emergency help", href: "/emergency-help" },
      { label: "Tell My Family Safely", href: "/tools/family-message-helper" },
      { label: "Open grievance directory", href: "/grievance-directory" },
      { label: "Office/HR protection note", href: "/tools/office-harassment-note" },
      { label: "Use safe review writer", href: "/tools/safe-review-writer" },
      { label: "Submit review", href: "/loan-apps" },
    ],
    notToDo,
  };
}

export default function WhatToDoNowWizardPage({ data }: { data: WhatToDoNowData }) {
  const [answers, setAnswers] = useState<Answers>({
    threatening: null,
    contactedRelatives: null,
    photoMorphingThreat: null,
    calledOffice: null,
    personalUpiRequest: null,
    alreadyPaid: null,
    paymentNotUpdated: null,
    haveScreenshots: null,
  });
  const [selectedTriggers, setSelectedTriggers] = useState<TriggerId[]>([]);
  const [selectedRegulatedIssues, setSelectedRegulatedIssues] = useState<RegulatedIssueId[]>([]);

  const result = useMemo(() => buildPlan(answers), [answers]);

  const setAnswer = (id: keyof Answers, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };
  const toggleTrigger = (id: TriggerId) => {
    setSelectedTriggers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleRegulatedIssue = (id: RegulatedIssueId) => {
    setSelectedRegulatedIssues((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const showCybercrimeShortcut = selectedTriggers.length > 0;
  const showRbiShortcut = selectedRegulatedIssues.length > 0 || answers.paymentNotUpdated === true;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-[1200px] space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">What Should I Do Now?</h1>
          <p className="mt-1 text-sm text-slate-600">Answer a few questions to get immediate steps, evidence checklist, and safer next actions.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick Situation Wizard</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
            {data.questions.map((q) => (
              <div key={q.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-800">{q.label}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setAnswer(q.id, true)} className={`rounded-full px-3 py-1 text-xs font-semibold ${answers[q.id] === true ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-300"}`}>Yes</button>
                  <button onClick={() => setAnswer(q.id, false)} className={`rounded-full px-3 py-1 text-xs font-semibold ${answers[q.id] === false ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-300"}`}>No</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-900">Select urgent threat indicators</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.cybercrimeTriggerOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleTrigger(option.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedTriggers.includes(option.id) ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-900">Select regulated lender service issues</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.regulatedIssueOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleRegulatedIssue(option.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedRegulatedIssues.includes(option.id) ? "bg-slate-900 text-white" : "border border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {showCybercrimeShortcut ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-rose-900">Report cyber harassment</h2>
            <p className="mt-1 text-sm text-rose-900">If selected threats are ongoing, you may consider using official emergency and cybercrime channels immediately.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-semibold text-white">
                Open National Cyber Crime Portal
              </a>
              <a href="tel:1930" className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-900">
                Call cybercrime helpline 1930
              </a>
              <a href="tel:112" className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-900">
                Emergency police helpline 112
              </a>
              <a href="tel:181" className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-900">
                Women helpline 181
              </a>
            </div>
          </section>
        ) : null}

        {showRbiShortcut ? (
          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-900">Complain about lender/NBFC service issue</h2>
            <p className="mt-1 text-sm text-blue-900">
              For regulated-entity service issues, you may consider filing and tracking a complaint through RBI's Complaint Management System (CMS) single-window flow.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="https://cms.rbi.org.in" target="_blank" rel="noreferrer" className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white">
                Open RBI CMS
              </a>
              <a href="/grievance-directory" className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-xs font-semibold text-blue-900">
                Check grievance contact details
              </a>
              <a href="/before-you-pay" className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-xs font-semibold text-blue-900">
                Before you pay checklist
              </a>
            </div>
            <p className="mt-2 text-xs text-blue-800">
              Use factual details, transaction references, and timeline notes while filing complaints against regulated entities.
            </p>
          </section>
        ) : null}

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Immediate Steps</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {result.immediateSteps.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Evidence Checklist</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {Array.from(new Set([...data.defaultEvidenceChecklist, ...result.evidenceChecklist])).map((e) => <li key={e}>{e}</li>)}
            </ul>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Relevant authority/channel</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{result.channels.map((c) => <li key={c}>{c}</li>)}</ul>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Correct complaint template</h3>
            <p className="mt-2 text-sm text-slate-700">Suggested route based on your answers.</p>
            <a href={result.template} className="mt-2 inline-block rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Open suggested template</a>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">What not to do</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{result.notToDo.map((n) => <li key={n}>{n}</li>)}</ul>
          </article>
        </section>

        <HarassmentEvidenceChecklist />
        <PanicPaymentWarningBanner />
        <StopSharingMoreDataCard />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Safe review/report links</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.safeLinks.map((l) => (
              <a key={l.href} href={l.href} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">{l.label}</a>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">This tool provides safety guidance only and is not legal advice.</p>
        </section>
      </div>
    </main>
  );
}








