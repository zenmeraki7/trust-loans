"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePublicDirectory } from "@/hooks/usePublicDirectory";
import type { PublicDirectoryItem } from "@/types/publicDirectory";

type Incident = "regulated" | "scheme" | "cyber-fraud" | "harassment" | "data-misuse" | "other";
type EntityKind = "loan_app" | "nbfc" | "bank" | "lender" | "recovery_agency" | "unknown";
type DraftChannel = "lender" | "nodal" | "rbi" | "sachet" | "cybercrime" | "police";
type ImmediateRisk =
  | "physical_threats"
  | "self_harm_or_harm_to_others"
  | "blackmail"
  | "sextortion"
  | "impersonation"
  | "private_images"
  | "illegal_detention_or_home_visits"
  | "immediate_danger";
type ProblemCategory =
  | "abusive_language"
  | "threats"
  | "repeated_calls"
  | "contacting_relatives_friends"
  | "contacting_employer_colleagues"
  | "loan_information_disclosure"
  | "unauthorized_contact_list_access"
  | "harassment_due_date"
  | "harassment_after_payment"
  | "hidden_charges"
  | "excessive_interest"
  | "misleading_loan_terms"
  | "fake_legal_threats"
  | "no_grievance_support"
  | "identity_unclear"
  | "other_violation";

const entityOptions: Array<{ value: EntityKind; label: string; hint: string }> = [
  { value: "loan_app", label: "Loan app", hint: "App name, package, developer, or store listing" },
  { value: "nbfc", label: "NBFC", hint: "Registered or claimed NBFC/lending partner" },
  { value: "bank", label: "Bank", hint: "Bank account, card, payment, or lending issue" },
  { value: "lender", label: "Lender", hint: "Digital lender or regulated lending business" },
  { value: "recovery_agency", label: "Recovery agency", hint: "Agent, agency, caller, field staff, or collection team" },
  { value: "unknown", label: "Unknown entity", hint: "You only know a phone number, URL, UPI ID, or partial name" },
];

const incidentOptions: { value: Incident; label: string; hint: string }[] = [
  { value: "regulated", label: "Complaint against a bank or NBFC", hint: "Service, repayment, account, or recovery-agent issue" },
  { value: "scheme", label: "Suspected illegal loan or money scheme", hint: "Unauthorized app, deposit-taking, or collection scheme" },
  { value: "cyber-fraud", label: "Online financial fraud", hint: "UPI, card, wallet, bank transfer, or payment scam" },
  { value: "harassment", label: "Threats or recovery harassment", hint: "Threats, public shaming, abusive calls, or contact-list misuse" },
  { value: "data-misuse", label: "Personal-data or identity misuse", hint: "Impersonation, leaked data, or unauthorized use of contacts/photos" },
  { value: "other", label: "Something else", hint: "Start with the lender grievance channel and review the options" },
];

const problemCategories: Array<{ value: ProblemCategory; label: string; hint: string }> = [
  { value: "abusive_language", label: "Abusive language", hint: "Insults, intimidation, humiliation, or vulgar calls/messages" },
  { value: "threats", label: "Threats", hint: "Threats of harm, arrest, public shaming, job loss, or false action" },
  { value: "repeated_calls", label: "Repeated calls", hint: "Excessive calling, robocalls, or repeated pressure after requests to stop" },
  { value: "contacting_relatives_friends", label: "Contacting relatives or friends", hint: "Calls/messages to family, contacts, references, or friends" },
  { value: "contacting_employer_colleagues", label: "Contacting employer or colleagues", hint: "Calls/messages to workplace, HR, manager, or colleagues" },
  { value: "loan_information_disclosure", label: "Disclosure of loan information", hint: "Loan amount, default, personal details, or allegations shared with others" },
  { value: "unauthorized_contact_list_access", label: "Unauthorized contact-list access", hint: "Contacts accessed or used without clear consent" },
  { value: "harassment_due_date", label: "Harassment on the due date", hint: "Threats or pressure before the due date has passed" },
  { value: "harassment_after_payment", label: "Harassment after payment", hint: "Calls/messages continue after repayment or settlement" },
  { value: "hidden_charges", label: "Hidden charges", hint: "Undisclosed platform fees, processing charges, penalties, or deductions" },
  { value: "excessive_interest", label: "Excessive interest", hint: "Interest appears much higher than advertised or disclosed" },
  { value: "misleading_loan_terms", label: "Misleading loan terms", hint: "Different tenure, repayment amount, disbursal, or closure terms" },
  { value: "fake_legal_threats", label: "Fake legal threats", hint: "Fake FIR/court notices, fake advocate/police claims, or arrest threats" },
  { value: "no_grievance_support", label: "Failure to provide grievance support", hint: "No response, no ticket, unreachable support, or refusal to escalate" },
  { value: "identity_unclear", label: "App or lender identity unclear", hint: "Cannot identify real lender, NBFC, recovery agency, domain, or company" },
  { value: "other_violation", label: "Other violation", hint: "Any other practice you want to include in the complaint" },
];

const immediateRiskOptions: Array<{ value: ImmediateRisk; label: string; action: string }> = [
  { value: "physical_threats", label: "Physical threats", action: "Move to a safe place and contact local police or emergency help if the threat may happen now." },
  { value: "self_harm_or_harm_to_others", label: "Threats of self-harm or harm to others", action: "Do not handle this alone. Contact emergency services, local police, or a trusted person immediately." },
  { value: "blackmail", label: "Blackmail", action: "Preserve messages, phone numbers, payment demands, and do not send more money without help." },
  { value: "sextortion", label: "Sextortion", action: "Preserve screenshots and report through cybercrime channels. Avoid negotiating with the caller." },
  { value: "impersonation", label: "Impersonation", action: "Capture the profile, number, URL, UPI ID, or fake official identity being used." },
  { value: "private_images", label: "Threats to publish private images", action: "Capture evidence and prioritize cybercrime/police reporting before finishing the complaint form." },
  { value: "illegal_detention_or_home_visits", label: "Illegal detention or home visits", action: "If someone is at your home or stopping you from leaving, call local police or emergency help first." },
  { value: "immediate_danger", label: "Immediate danger", action: "Leave the situation if possible and contact emergency help now." },
];

const portalByIncident: Record<Incident, { name: string; href: string; reason: string }[]> = {
  regulated: [
    { name: "Lender grievance officer", href: "/grievance-directory", reason: "Start with the bank or NBFC’s official complaint channel." },
    { name: "RBI CMS / Ombudsman", href: "https://cms.rbi.org.in/", reason: "Use when the regulated entity does not resolve the complaint." },
  ],
  scheme: [
    { name: "RBI Sachet", href: "https://sachet.rbi.org.in/", reason: "Report suspected unauthorized deposit-taking or money-collection activity." },
    { name: "National Cyber Crime Portal", href: "https://www.cybercrime.gov.in/", reason: "Use when the scheme also involves online fraud, threats, or data misuse." },
  ],
  "cyber-fraud": [
    { name: "1930 financial cyber fraud helpline", href: "tel:1930", reason: "Call immediately when money has moved through a digital channel." },
    { name: "National Cyber Crime Portal", href: "https://www.cybercrime.gov.in/", reason: "Submit the complete online complaint and evidence." },
  ],
  harassment: [
    { name: "Lender grievance officer", href: "/grievance-directory", reason: "Report the recovery-agent conduct to the lender in writing." },
    { name: "National Cyber Crime Portal", href: "https://www.cybercrime.gov.in/", reason: "Use for threats, extortion, impersonation, or online harassment." },
  ],
  "data-misuse": [
    { name: "National Cyber Crime Portal", href: "https://www.cybercrime.gov.in/", reason: "Report identity, contact-list, image, or account misuse." },
    { name: "Lender grievance officer", href: "/grievance-directory", reason: "Ask the lender to investigate and stop unauthorized processing." },
  ],
  other: [
    { name: "Lender grievance officer", href: "/grievance-directory", reason: "Use the provider’s official complaint route first." },
    { name: "RBI CMS / Ombudsman", href: "https://cms.rbi.org.in/", reason: "Consider escalation if the regulated entity does not resolve it." },
  ],
};

const evidenceByIncident: Record<Incident, string[]> = {
  regulated: ["Loan or account statement", "Your complaint and the lender’s acknowledgement", "Call logs, messages, emails, and agent details", "Payment receipts or disputed entries"],
  scheme: ["App or website URL and screenshots", "Promises, advertisements, and fee demands", "UPI IDs, bank accounts, phone numbers, and payment receipts", "Names used by the operator and dates of contact"],
  "cyber-fraud": ["Transaction ID, date, amount, and debited account or wallet", "Bank or payment-app statement", "Scam number, URL, UPI ID, profile, or message", "Screenshots and the 1930 acknowledgement"],
  harassment: ["Call logs and recordings where lawful", "Threatening messages, caller numbers, and social posts", "Names or contacts who were approached", "Loan account and recovery-agent details"],
  "data-misuse": ["Screenshots of the leaked or misused information", "Source URL, profile, phone number, or app", "Consent or permission history", "Dates, affected contacts, and any resulting harm"],
  other: ["A dated incident timeline", "Relevant account, app, or lender details", "Messages, receipts, screenshots, and contact details", "Copies of every complaint and reply"],
};

const draftChannels: Record<DraftChannel, { label: string; heading: string; requestedAction: string; useWhen: string }> = {
  lender: {
    label: "Grievance officer",
    heading: "Lender / NBFC grievance officer complaint",
    requestedAction: "Please acknowledge this complaint, investigate the conduct described, stop any improper contact or harassment, correct the account status where needed, and share a written response with the action taken.",
    useWhen: "Use this first for the lender, loan app, bank, NBFC, or listed grievance contact.",
  },
  nodal: {
    label: "Principal nodal officer",
    heading: "Escalation to principal nodal officer",
    requestedAction: "Please review this as an escalation, verify whether the earlier grievance was handled properly, arrange corrective action, and provide a written final response.",
    useWhen: "Use this when the first grievance channel does not respond or the response is not satisfactory.",
  },
  rbi: {
    label: "RBI channel",
    heading: "RBI complaint channel draft",
    requestedAction: "Please examine the complaint against the regulated entity, consider the records attached, and direct the entity to provide a written response and corrective action where appropriate.",
    useWhen: "Use when the facts involve a bank, NBFC, regulated lender, or unresolved grievance that is suitable for RBI complaint channels.",
  },
  sachet: {
    label: "Sachet / reporting",
    heading: "Sachet or financial reporting channel draft",
    requestedAction: "Please review whether the entity or activity reported here requires inquiry, warning, or further action by the appropriate authority.",
    useWhen: "Use when the entity is unknown, identity is unclear, or the facts suggest an unauthorized money collection or loan scheme.",
  },
  cybercrime: {
    label: "Cybercrime",
    heading: "Cybercrime reporting draft",
    requestedAction: "Please register and examine this report, preserve relevant digital evidence where possible, and take appropriate action regarding the threats, impersonation, data misuse, or fraud described.",
    useWhen: "Use when the facts include impersonation, threats, data misuse, contact-list misuse, online harassment, payment fraud, or account misuse.",
  },
  police: {
    label: "Police",
    heading: "Police complaint draft",
    requestedAction: "Please record this complaint, assess the immediate safety concern, and provide protection or urgent assistance as appropriate.",
    useWhen: "Use when there is an immediate safety risk, threat of harm, field-visit intimidation, extortion, stalking, or urgent danger.",
  },
};

const directoryTypeFor = (kind: EntityKind) => {
  if (kind === "loan_app") return "loan_app";
  if (kind === "nbfc") return "nbfc";
  if (kind === "bank") return "bank";
  if (kind === "lender") return "digital_lender";
  return "all";
};

function entityKindLabel(kind: EntityKind) {
  return entityOptions.find((option) => option.value === kind)?.label ?? "Entity";
}

function problemLabel(value: ProblemCategory) {
  return problemCategories.find((category) => category.value === value)?.label ?? value;
}

function immediateRiskLabel(value: ImmediateRisk) {
  return immediateRiskOptions.find((risk) => risk.value === value)?.label ?? value;
}

function shortAnswerLabel(value: string) {
  const labels: Record<string, string> = {
    yes: "Yes",
    no: "No",
    partly: "Partly",
    not_sure: "Not sure",
  };
  return labels[value] ?? value;
}

function DirectoryResultButton({
  item,
  selected,
  onSelect,
}: {
  item: PublicDirectoryItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl border p-4 text-left transition ${selected ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-200"}`}
    >
      <span className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-950">{item.name}</span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">{item.type.replaceAll("_", " ")}</span>
      </span>
      <span className="mt-1 block text-xs leading-5 text-slate-600">{item.subtitle}</span>
      {item.associatedRegulatedEntity ? <span className="mt-2 block text-xs text-slate-500">Regulated entity: {item.associatedRegulatedEntity}</span> : null}
    </button>
  );
}

export default function ComplaintPreparationWizard() {
  const [step, setStep] = useState(1);
  const [immediateRisks, setImmediateRisks] = useState<ImmediateRisk[]>([]);
  const [entityKind, setEntityKind] = useState<EntityKind>("loan_app");
  const [entitySearch, setEntitySearch] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<PublicDirectoryItem | null>(null);
  const [manualEntityName, setManualEntityName] = useState("");
  const [manualEntityDetail, setManualEntityDetail] = useState("");
  const [incident, setIncident] = useState<Incident>("regulated");
  const [selectedProblems, setSelectedProblems] = useState<ProblemCategory[]>([]);
  const [form, setForm] = useState({
    name: "",
    safeContact: "",
    loanOrAccountReference: "",
    incidentDate: "",
    approximateTime: "",
    communicationMethod: "",
    phoneOrAccountUsed: "",
    recoveryAgentIdentifiers: "",
    whatHappened: "",
    peopleContacted: "",
    detailsDisclosed: "not_sure",
    paymentAlreadyMade: "not_sure",
    loanDueDate: "",
    amountDue: "",
    currentPaymentStatus: "",
    previousLenderContact: "",
    immediateSafetyConcerns: "",
    availableEvidence: "",
  });
  const [copied, setCopied] = useState(false);
  const [selectedDraftChannel, setSelectedDraftChannel] = useState<DraftChannel>("lender");

  const directory = usePublicDirectory({
    q: entitySearch,
    type: directoryTypeFor(entityKind),
    limit: 8,
  });

  const entityName = selectedEntity?.name || manualEntityName || (entityKind === "unknown" ? "Unknown entity" : "");
  const entitySummary = selectedEntity
    ? `${selectedEntity.name} (${selectedEntity.type.replaceAll("_", " ")})`
    : manualEntityName
      ? `${manualEntityName} (${entityKindLabel(entityKind)})`
      : entityKind === "unknown"
        ? "Unknown entity"
        : "";
  const recommendation = portalByIncident[incident];
  const evidenceList = useMemo(() => {
    const userEvidence = form.availableEvidence
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
    return userEvidence.length ? userEvidence : evidenceByIncident[incident];
  }, [form.availableEvidence, incident]);
  const selectedProblemLabels = selectedProblems.map(problemLabel);
  const hasImmediateRisk = immediateRisks.length > 0;
  const hasImmediateSafetyConcern = Boolean(form.immediateSafetyConcerns.trim()) && !/^(none|no|not now|none right now)$/i.test(form.immediateSafetyConcerns.trim());
  const hasThreatOrSafetyProblem = selectedProblems.includes("threats") || selectedProblems.includes("fake_legal_threats") || hasImmediateSafetyConcern || hasImmediateRisk;
  const hasCyberFacts = incident === "cyber-fraud" || incident === "data-misuse" || selectedProblems.some((problem) => ["threats", "loan_information_disclosure", "unauthorized_contact_list_access", "fake_legal_threats"].includes(problem)) || immediateRisks.some((risk) => ["blackmail", "sextortion", "impersonation", "private_images"].includes(risk));
  const applicableDraftChannels = useMemo<DraftChannel[]>(() => {
    const channels: DraftChannel[] = ["lender", "nodal"];
    if (["regulated", "harassment", "other"].includes(incident) || ["bank", "nbfc", "lender", "loan_app"].includes(entityKind)) channels.push("rbi");
    if (incident === "scheme" || entityKind === "unknown" || selectedProblems.includes("identity_unclear")) channels.push("sachet");
    if (hasCyberFacts) channels.push("cybercrime");
    if (hasThreatOrSafetyProblem) channels.push("police");
    return channels.filter((channel, index) => channels.indexOf(channel) === index);
  }, [entityKind, hasCyberFacts, hasThreatOrSafetyProblem, incident, selectedProblems]);
  const complaintSummary = useMemo(() => `Complainant details
Name / display name: ${form.name || "[add name or preferred display name]"}
Safe contact detail: ${form.safeContact || "[add email or phone you are comfortable sharing]"}

Entity details
Entity type: ${entityKindLabel(entityKind)}
Entity / app / account: ${entityName || "[add name]"}
Additional entity details: ${selectedEntity?.href || manualEntityDetail || "[add phone number, URL, UPI ID, app-store link, address, or account reference if available]"}

Loan or account reference
Reference: ${form.loanOrAccountReference || "[add loan ID, account number, customer ID, app profile, or write Not known]"}
Loan due date: ${form.loanDueDate || "[add due date or write Not applicable]"}
Amount due: ${form.amountDue || "[add amount due or write Not applicable]"}
Current payment status: ${form.currentPaymentStatus || "[paid / partly paid / due / overdue / disputed / not sure]"}
Payment already made: ${shortAnswerLabel(form.paymentAlreadyMade)}

Incident timeline
Date and approximate time: ${form.incidentDate || "[add date]"}${form.approximateTime ? `, around ${form.approximateTime}` : " [add approximate time]"}
Communication method: ${form.communicationMethod || "[call / WhatsApp / SMS / email / app message / in person / other]"}
Phone number or account used by the other side: ${form.phoneOrAccountUsed || "[add phone number, account, UPI ID, email, app profile, or write Not known]"}
Recovery agent names or identifiers: ${form.recoveryAgentIdentifiers || "[add names, caller IDs, employee IDs, agency names, or write Not known]"}
People contacted: ${form.peopleContacted || "[add relatives, friends, employer, colleagues, references, or write No one else]"}
Personal or loan details disclosed to others: ${shortAnswerLabel(form.detailsDisclosed)}

Description of harassment or concern
Complaint subjects: ${selectedProblemLabels.length ? selectedProblemLabels.join(", ") : "[select all applicable problem categories]"}
What was said or done:
${form.whatHappened || "[Write the facts in date order. Include exact words from calls/messages where possible.]"}

Evidence list
${evidenceList.map((item) => `- ${item}`).join("\n")}

Previous grievance attempts
${form.previousLenderContact || "[add ticket numbers, emails, calls, dates, names, or write Not yet]"}

Immediate safety concerns
Immediate risk selected at start: ${immediateRisks.length ? immediateRisks.map(immediateRiskLabel).join(", ") : "No immediate-risk item selected"}
Details: ${form.immediateSafetyConcerns || "[add urgent threats, field visit risk, self-harm risk, pressure at work/home, or write None right now]"}`, [entityKind, entityName, evidenceList, form, immediateRisks, manualEntityDetail, selectedEntity?.href, selectedProblemLabels]);
  const draftVersions = useMemo(() => applicableDraftChannels.map((channel) => {
    const channelInfo = draftChannels[channel];
    return {
      channel,
      ...channelInfo,
      content: `${channelInfo.heading}

Subject: Complaint regarding ${entityName || "the incident"}

I request you to review the facts below and take appropriate action. I am sharing only the information available to me and I am not asking this website to submit the complaint automatically.

${complaintSummary}

Requested action
${channelInfo.requestedAction}

Declaration
I confirm that the information provided above is accurate to the best of my knowledge. I have not knowingly added false information. I understand that I should review this draft, correct any missing or inaccurate details, and attach only relevant evidence before submission.

Name: ${form.name || "[add name or preferred display name]"}
Date: [add submission date]`,
    };
  }), [applicableDraftChannels, complaintSummary, entityName, form.name]);
  const activeDraft = draftVersions.find((version) => version.channel === selectedDraftChannel) ?? draftVersions[0];
  const draft = activeDraft?.content ?? "";

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const toggleProblem = (problem: ProblemCategory) => {
    setSelectedProblems((current) => current.includes(problem) ? current.filter((item) => item !== problem) : [...current, problem]);
  };
  const toggleImmediateRisk = (risk: ImmediateRisk) => {
    setImmediateRisks((current) => current.includes(risk) ? current.filter((item) => item !== risk) : [...current, risk]);
  };
  const chooseKind = (kind: EntityKind) => {
    setEntityKind(kind);
    setSelectedEntity(null);
    setEntitySearch("");
    if (kind === "unknown") setManualEntityName("");
  };
  const copyDraft = async () => {
    await navigator.clipboard?.writeText(draft);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const saveDraft = () => {
    localStorage.setItem("trust-loans-complaint-wizard", JSON.stringify({ immediateRisks, entityKind, selectedEntity, manualEntityName, manualEntityDetail, incident, selectedProblems, form, draft, savedAt: new Date().toISOString() }));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Complaint preparation</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Build your complaint step by step</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">Start by identifying who the complaint is against, then describe the problem in plain language and prepare a factual draft.</p>
      </section>

      <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-slate-500" aria-label="Wizard progress">
        {["Risk check", "Entity", "Problem", "Incident details", "Draft & checklist"].map((label, index) => (
          <div key={label} className={`flex min-w-0 flex-1 items-center gap-2 ${step >= index + 1 ? "text-blue-700" : ""}`}>
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${step >= index + 1 ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-500"}`}>{index + 1}</span>
            <span className="hidden sm:block">{label}</span>
            {index < 4 && <span className="h-px flex-1 bg-slate-200" />}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-slate-950">Step 1: Immediate-risk check</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Before the complaint form, tell us if anything urgent is happening. If there is immediate danger, use emergency or law-enforcement help first.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {immediateRiskOptions.map((risk) => {
              const selected = immediateRisks.includes(risk.value);
              return (
                <button
                  key={risk.value}
                  type="button"
                  onClick={() => toggleImmediateRisk(risk.value)}
                  aria-pressed={selected}
                  className={`rounded-xl border p-4 text-left transition ${selected ? "border-rose-600 bg-rose-50 ring-2 ring-rose-100" : "border-slate-200 hover:border-rose-200"}`}
                >
                  <span className="block text-sm font-semibold text-slate-950">{risk.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">{risk.action}</span>
                </button>
              );
            })}
          </div>

          {hasImmediateRisk ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <h3 className="text-lg font-bold text-rose-950">Prioritize safety before completing the complaint</h3>
              <p className="mt-2 text-sm leading-6 text-rose-900">
                You can continue the form later. Right now, preserve evidence and contact the safest official or trusted support channel for your situation.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a href="tel:1930" className="rounded-xl bg-rose-700 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-800">Call 1930 for cyber financial fraud</a>
                <Link href="/emergency-help" className="rounded-xl border border-rose-300 bg-white px-4 py-3 text-sm font-semibold text-rose-800">Open emergency action flow</Link>
                <a href="https://www.cybercrime.gov.in/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800">Open cybercrime portal</a>
                <Link href="/evidence-upload" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800">Capture or organize evidence</Link>
              </div>
              <p className="mt-4 text-xs leading-5 text-rose-900">
                If there is immediate physical danger, contact local emergency services or police first. Do not wait to finish this form.
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
              No immediate-risk item selected. You can continue to identify the entity and prepare the complaint.
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => setImmediateRisks([])} className="min-h-11 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">Clear risk choices</button>
            <button type="button" onClick={() => {
              if (hasImmediateRisk) setSelectedDraftChannel("police");
              setStep(2);
            }} className="min-h-11 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">{hasImmediateRisk ? "I have taken safety steps; continue" : "Continue"}</button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-slate-950">Step 2: Identify the entity</h2>
          <p className="mt-1 text-sm text-slate-600">Search existing profiles or enter details manually if the entity is not listed.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entityOptions.map((option) => (
              <button key={option.value} type="button" onClick={() => chooseKind(option.value)} className={`rounded-xl border p-4 text-left transition ${entityKind === option.value ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`}>
                <span className="block text-sm font-semibold text-slate-950">{option.label}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-600">{option.hint}</span>
              </button>
            ))}
          </div>

          {entityKind !== "recovery_agency" && entityKind !== "unknown" ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="block text-sm font-semibold text-slate-900">
                Search listed profiles
                <input
                  value={entitySearch}
                  onChange={(event) => setEntitySearch(event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base"
                  placeholder="Search by app, lender, legal entity, NBFC, bank, or domain"
                />
              </label>
              <div className="mt-3 grid gap-2">
                {directory.isLoading ? <p className="rounded-xl bg-white p-3 text-sm text-slate-600">Searching profiles...</p> : null}
                {directory.isError ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">Could not load profiles. You can still use manual entry.</p> : null}
                {(directory.data?.items ?? []).map((item) => (
                  <DirectoryResultButton key={item.id} item={item} selected={selectedEntity?.id === item.id} onSelect={() => {
                    setSelectedEntity(item);
                    setManualEntityName("");
                    setManualEntityDetail("");
                  }} />
                ))}
                {!directory.isLoading && !directory.isError && directory.data?.items.length === 0 ? <p className="rounded-xl bg-white p-3 text-sm text-slate-600">No matching listed profile found. Use manual entry below.</p> : null}
              </div>
            </div>
          ) : null}

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-bold text-amber-950">Manual entry when not listed</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-amber-950">
                Entity name or identifier
                <input
                  value={manualEntityName}
                  onChange={(event) => {
                    setManualEntityName(event.target.value);
                    setSelectedEntity(null);
                  }}
                  className="mt-1 min-h-11 w-full rounded-xl border border-amber-200 bg-white px-3 text-base"
                  placeholder={entityKind === "unknown" ? "Phone number, URL, UPI ID, or partial name" : "Name shown in app, message, call, receipt, or statement"}
                />
              </label>
              <label className="text-sm font-medium text-amber-950">
                Extra details
                <input
                  value={manualEntityDetail}
                  onChange={(event) => setManualEntityDetail(event.target.value)}
                  className="mt-1 min-h-11 w-full rounded-xl border border-amber-200 bg-white px-3 text-base"
                  placeholder="Website, app-store link, agent phone, address, account, UPI ID"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">Selected: <span className="font-semibold text-slate-950">{entitySummary || "Nothing selected yet"}</span></p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setStep(1)} className="min-h-11 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">Back to risk check</button>
              <button type="button" onClick={() => setStep(3)} className="min-h-11 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Continue</button>
            </div>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Step 3: Select the problem</h2>
              <p className="mt-1 text-sm text-slate-600">Entity: <span className="font-semibold text-slate-950">{entitySummary || "Not specified"}</span></p>
            </div>
            <button type="button" onClick={() => setStep(2)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Change entity</button>
          </div>

          <h3 className="mt-5 text-base font-bold text-slate-950">What best describes the issue?</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {incidentOptions.map((option) => (
              <button key={option.value} type="button" onClick={() => setIncident(option.value)} className={`rounded-xl border p-4 text-left transition ${incident === option.value ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`}>
                <span className="block text-sm font-semibold text-slate-950">{option.label}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-600">{option.hint}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-950">Select all problem subjects</h3>
                <p className="mt-1 text-sm text-slate-600">Choose as many as apply. These will be included in the complaint draft.</p>
              </div>
              <button type="button" onClick={() => setSelectedProblems([])} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                Clear selected
              </button>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-700">{selectedProblems.length} selected</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {problemCategories.map((category) => {
                const selected = selectedProblems.includes(category.value);
                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => toggleProblem(category.value)}
                    aria-pressed={selected}
                    className={`min-h-24 rounded-xl border p-3 text-left transition ${selected ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-200"}`}
                  >
                    <span className="flex items-start gap-2">
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border text-xs font-bold ${selected ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 text-transparent"}`}>
                        ✓
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-950">{category.label}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-600">{category.hint}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => setStep(2)} className="min-h-11 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">Back</button><button type="button" onClick={() => setStep(4)} className="min-h-11 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Continue to incident details</button></div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Step 4: Incident details</h2>
              <p className="mt-1 text-sm text-slate-600">Write what happened in simple words. If you do not know something, write “Not sure” or leave it blank for now.</p>
            </div>
            <button type="button" onClick={() => setStep(3)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Edit problem</button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Your name or display name<input value={form.name} onChange={(event) => update("name", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base" placeholder="Use a privacy-safe name if needed" /></label>
            <label className="text-sm font-medium text-slate-700">Safe contact detail<input value={form.safeContact} onChange={(event) => update("safeContact", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base" placeholder="Email or phone you are comfortable sharing" /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Loan or account reference<input value={form.loanOrAccountReference} onChange={(event) => update("loanOrAccountReference", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base" placeholder="Loan ID, account number, customer ID, app profile, or write Not known" /></label>
            <label className="text-sm font-medium text-slate-700">Date it happened<input type="date" value={form.incidentDate} onChange={(event) => update("incidentDate", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base" /></label>
            <label className="text-sm font-medium text-slate-700">Approximate time<input type="time" value={form.approximateTime} onChange={(event) => update("approximateTime", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base" /></label>
            <label className="text-sm font-medium text-slate-700">How did they contact you?
              <select value={form.communicationMethod} onChange={(event) => update("communicationMethod", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base">
                <option value="">Choose one</option>
                <option>Phone call</option>
                <option>WhatsApp</option>
                <option>SMS or text message</option>
                <option>Email</option>
                <option>In-app message or notification</option>
                <option>In person or field visit</option>
                <option>Social media</option>
                <option>Other</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">Phone number or account used<input value={form.phoneOrAccountUsed} onChange={(event) => update("phoneOrAccountUsed", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base" placeholder="Caller number, WhatsApp, email, UPI ID, app profile, or account" /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Names or identifiers of recovery agents<textarea value={form.recoveryAgentIdentifiers} onChange={(event) => update("recoveryAgentIdentifiers", event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border border-slate-300 p-3 text-base" placeholder="Name used, agency, employee ID, caller ID, vehicle number, or anything they claimed" /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">What was said or done?<textarea value={form.whatHappened} onChange={(event) => update("whatHappened", event.target.value)} className="mt-1 min-h-36 w-full rounded-xl border border-slate-300 p-3 text-base" placeholder="Write the facts in date order. Use the exact words from calls or messages where you can." /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Who else did they contact?<textarea value={form.peopleContacted} onChange={(event) => update("peopleContacted", event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border border-slate-300 p-3 text-base" placeholder="Family, friends, employer, colleagues, references, or write No one else." /></label>

            <fieldset className="rounded-2xl border border-slate-200 p-4">
              <legend className="px-1 text-sm font-semibold text-slate-900">Were your personal or loan details shared with someone else?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {["yes", "no", "not_sure"].map((value) => <button key={value} type="button" onClick={() => update("detailsDisclosed", value)} className={`min-h-11 rounded-xl border px-4 text-sm font-semibold ${form.detailsDisclosed === value ? "border-blue-700 bg-blue-50 text-blue-800" : "border-slate-300 text-slate-700"}`}>{shortAnswerLabel(value)}</button>)}
              </div>
            </fieldset>
            <fieldset className="rounded-2xl border border-slate-200 p-4">
              <legend className="px-1 text-sm font-semibold text-slate-900">Was payment already made?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {["yes", "no", "partly", "not_sure"].map((value) => <button key={value} type="button" onClick={() => update("paymentAlreadyMade", value)} className={`min-h-11 rounded-xl border px-4 text-sm font-semibold ${form.paymentAlreadyMade === value ? "border-blue-700 bg-blue-50 text-blue-800" : "border-slate-300 text-slate-700"}`}>{shortAnswerLabel(value)}</button>)}
              </div>
            </fieldset>

            <label className="text-sm font-medium text-slate-700">Loan due date<input type="date" value={form.loanDueDate} onChange={(event) => update("loanDueDate", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base" /></label>
            <label className="text-sm font-medium text-slate-700">Amount due<input inputMode="decimal" value={form.amountDue} onChange={(event) => update("amountDue", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base" placeholder="₹ amount or Not applicable" /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Current payment status
              <select value={form.currentPaymentStatus} onChange={(event) => update("currentPaymentStatus", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base">
                <option value="">Choose one</option>
                <option>Not due yet</option>
                <option>Due today</option>
                <option>Overdue</option>
                <option>Paid in full</option>
                <option>Partly paid</option>
                <option>Amount is disputed</option>
                <option>Settlement discussed</option>
                <option>Not sure</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Previous attempts to contact the lender<textarea value={form.previousLenderContact} onChange={(event) => update("previousLenderContact", event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border border-slate-300 p-3 text-base" placeholder="Ticket numbers, emails, calls, dates, names, or write Not yet." /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Immediate safety concerns<textarea value={form.immediateSafetyConcerns} onChange={(event) => update("immediateSafetyConcerns", event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border border-slate-300 p-3 text-base" placeholder="Threats, field visit, self-harm risk, pressure at work/home, or write None right now." /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Evidence checklist only — do not upload files<textarea value={form.availableEvidence} onChange={(event) => update("availableEvidence", event.target.value)} className="mt-1 min-h-24 w-full rounded-xl border border-slate-300 p-3 text-base" placeholder="List evidence you will keep and submit directly if required: screenshots, call recordings, call logs, payment receipts, URLs, emails, complaint ticket numbers. Add one per line." /></label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => setStep(3)} className="min-h-11 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700">Back</button><button type="button" onClick={() => setStep(5)} className="min-h-11 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Generate draft</button></div>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-950">Structured complaint drafts</h2><p className="mt-1 text-sm text-slate-600">Choose the version that matches where you plan to file. Nothing is submitted automatically.</p></div><button type="button" onClick={() => setStep(4)} className="text-sm font-semibold text-blue-700 underline">Edit incident details</button></div>
            <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Complaint draft versions">
              {draftVersions.map((version) => (
                <button key={version.channel} type="button" onClick={() => setSelectedDraftChannel(version.channel)} className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold ${activeDraft?.channel === version.channel ? "border-blue-700 bg-blue-50 text-blue-800" : "border-slate-300 text-slate-700 hover:border-blue-300"}`}>
                  {version.label}
                </button>
              ))}
            </div>
            {activeDraft ? <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><p className="font-semibold">{activeDraft.heading}</p><p className="mt-1">{activeDraft.useWhen}</p></div> : null}
            <div className="mt-4 grid gap-3">{recommendation.map((item, index) => <a key={item.name} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50"><span className="block text-sm font-semibold text-slate-950">{index + 1}. {item.name}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{item.reason}</span></a>)}</div>
            <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={copyDraft} className="min-h-11 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">{copied ? "Copied / saved" : "Copy complaint"}</button><button type="button" onClick={saveDraft} className="min-h-11 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Save draft on this device</button></div>
            <label className="mt-5 block text-sm font-semibold text-slate-950">Ready-to-review draft<textarea readOnly value={draft} className="mt-2 min-h-96 w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm leading-6 text-slate-700" /></label>
          </article>
          <aside className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6"><h2 className="text-xl font-bold text-slate-950">Evidence checklist</h2><p className="mt-1 text-sm text-slate-600">Gather only what is relevant. Redact OTPs, passwords, and unrelated private data.</p><ul className="mt-4 grid gap-3">{evidenceByIncident[incident].map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700"><span className="mt-1 text-blue-700">□</span>{item}</li>)}</ul><Link href="/complaint-tutorials" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Watch filing tutorials</Link></aside>
        </section>
      ) : null}

      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950">
        <p><strong>Evidence disclaimer:</strong> This platform does not collect, store, verify, or certify your screenshots, recordings, call logs, messages, payment receipts, or other evidence.</p>
        <p className="mt-2">The incident summary and complaint draft are generated from the information you provide. They help you organize and present your complaint and do not independently prove that a violation occurred.</p>
        <p className="mt-2">Keep your original evidence securely and submit it directly to the lender, regulated entity, grievance officer, regulator, police, cybercrime authority, court, or other appropriate authority when required.</p>
      </section>
      <p className="mt-4 text-xs leading-5 text-slate-500">This wizard creates drafting support, not legal advice. Review every field, remove anything inaccurate, and submit only through the official portal.</p>
    </main>
  );
}
