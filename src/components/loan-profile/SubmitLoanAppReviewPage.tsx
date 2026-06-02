"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLoanAppProfile } from "@/hooks/useLoanAppProfile";
import { useReviewSafetyScan } from "@/hooks/useReviewSafetyScan";
import { useCompleteEvidenceUpload, useCreateEvidenceUploadUrl } from "@/hooks/useEvidence";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { scanReviewTextLocally } from "@/lib/reviewSafetyScan";
import SafeReviewWriter from "@/components/tools/SafeReviewWriter";
import type { AppReviewContext, DisplayMode, ReviewSubmission, ReviewType } from "@/types/reviewSubmission";

function riskTone(risk: AppReviewContext["riskLevel"]) {
  if (risk === "low") return "text-emerald-700 bg-emerald-100";
  if (risk === "medium") return "text-amber-700 bg-amber-100";
  if (risk === "high") return "text-orange-700 bg-orange-100";
  return "text-rose-700 bg-rose-100";
}

function StarRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <span className="text-xs text-slate-500">{value}/5</span>
      </div>
      <div className="flex gap-1 text-xl">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            type="button"
            key={i}
            onClick={() => onChange(i)}
            className={i <= value ? "text-amber-500" : "text-slate-300"}
            aria-label={`${label} ${i} stars`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export function ReviewTypeSelector({
  selectedType,
  onSelect,
}: {
  selectedType: ReviewType;
  onSelect: (v: ReviewType) => void;
}) {
  const items: { key: ReviewType; label: string; icon: string }[] = [
    { key: "general_review", label: "General Review", icon: "📝" },
    { key: "harassment_recovery", label: "Harassment / Recovery Complaint", icon: "⚠" },
    { key: "hidden_charges", label: "Hidden Charges Complaint", icon: "💸" },
    { key: "data_privacy", label: "Data Privacy Concern", icon: "🔒" },
    { key: "photo_morphing_threat", label: "Photo Morphing / Threat Complaint", icon: "🛡" },
    { key: "fake_legal_notice_impersonation", label: "Fake Legal Notice / Impersonation", icon: "📄" },
    { key: "payment_issue", label: "Payment Issue", icon: "💳" },
    { key: "app_not_closing_loan", label: "App Not Closing Loan", icon: "⏳" },
    { key: "positive_experience", label: "Positive Experience", icon: "✅" },
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Review Type</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <button
            type="button"
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`rounded-2xl border p-4 text-left shadow-sm transition ${
              selectedType === item.key ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="mb-2 text-xl">{item.icon}</p>
            <p className="text-sm font-medium text-slate-800">{item.label}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function RatingInputGroup({
  rating,
  onChange,
}: {
  rating: ReviewSubmission["rating"];
  onChange: (field: keyof ReviewSubmission["rating"], value: number) => void;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Rate your experience</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <StarRow label="Overall experience" value={rating.overall} onChange={(v) => onChange("overall", v)} />
        <StarRow label="Transparency" value={rating.transparency} onChange={(v) => onChange("transparency", v)} />
        <StarRow label="Customer support" value={rating.customerSupport} onChange={(v) => onChange("customerSupport", v)} />
        <StarRow label="Recovery behaviour" value={rating.recoveryBehaviour} onChange={(v) => onChange("recoveryBehaviour", v)} />
        <StarRow label="Data privacy" value={rating.dataPrivacy} onChange={(v) => onChange("dataPrivacy", v)} />
        <StarRow label="Charges and fees" value={rating.chargesAndFees} onChange={(v) => onChange("chargesAndFees", v)} />
      </div>
    </section>
  );
}

function YesNoUnknown({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean | null) => void;
}) {
  const render = (v: boolean | null, text: string) => (
    <button
      type="button"
      onClick={() => onChange(v)}
      className={`rounded-full px-3 py-1 text-xs font-medium ${v === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
    >
      {text}
    </button>
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="mb-2 text-sm font-medium text-slate-800">{label}</p>
      <div className="flex gap-2">
        {render(true, "Yes")}
        {render(false, "No")}
        {render(null, "Prefer not to say")}
      </div>
    </div>
  );
}

type BooleanFields =
  | "repaymentDelayed"
  | "contactedRelatives"
  | "threatened"
  | "accessedContacts"
  | "misusedPhotos"
  | "claimedNbfcRepresentation"
  | "fakeLegalNotice"
  | "abusiveLanguage";

export function IncidentDetailsForm({
  submission,
  onTextChange,
  onBooleanChange,
}: {
  submission: ReviewSubmission;
  onTextChange: (field: "title" | "body" | "loanAmountRange" | "incidentDate", value: string) => void;
  onBooleanChange: (field: BooleanFields, value: boolean | null) => void;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Review details</h2>
      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <label className="text-xs font-medium uppercase text-slate-500" htmlFor="review-title">
            Review title
          </label>
          <input
            id="review-title"
            value={submission.title}
            onChange={(e) => onTextChange("title", e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Enter a short summary of your experience"
          />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <label className="text-xs font-medium uppercase text-slate-500" htmlFor="review-body">
            Detailed experience
          </label>
          <textarea
            id="review-body"
            value={submission.body}
            onChange={(e) => onTextChange("body", e.target.value)}
            rows={5}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder='Use neutral wording. Example: "I want to share my experience..."'
          />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <label className="text-xs font-medium uppercase text-slate-500" htmlFor="loan-amount">
              Loan amount range
            </label>
            <select
              id="loan-amount"
              value={submission.loanAmountRange}
              onChange={(e) => onTextChange("loanAmountRange", e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select range</option>
              <option value="below_5k">Below Rs 5,000</option>
              <option value="5k_25k">Rs 5,000 - Rs 25,000</option>
              <option value="25k_1l">Rs 25,000 - Rs 1,00,000</option>
              <option value="above_1l">Above Rs 1,00,000</option>
            </select>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <label className="text-xs font-medium uppercase text-slate-500" htmlFor="incident-date">
              Date of incident
            </label>
            <input
              id="incident-date"
              type="date"
              value={submission.incidentDate}
              onChange={(e) => onTextChange("incidentDate", e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <YesNoUnknown label="Was repayment delayed?" value={submission.repaymentDelayed} onChange={(v) => onBooleanChange("repaymentDelayed", v)} />
          <YesNoUnknown label="Did they contact your relatives?" value={submission.contactedRelatives} onChange={(v) => onBooleanChange("contactedRelatives", v)} />
          <YesNoUnknown label="Did they threaten you?" value={submission.threatened} onChange={(v) => onBooleanChange("threatened", v)} />
          <YesNoUnknown label="Did they access contacts?" value={submission.accessedContacts} onChange={(v) => onBooleanChange("accessedContacts", v)} />
          <YesNoUnknown label="Did they misuse photos?" value={submission.misusedPhotos} onChange={(v) => onBooleanChange("misusedPhotos", v)} />
          <YesNoUnknown label="Did they claim NBFC representation?" value={submission.claimedNbfcRepresentation} onChange={(v) => onBooleanChange("claimedNbfcRepresentation", v)} />
          <YesNoUnknown label="Did they send fake legal notices?" value={submission.fakeLegalNotice} onChange={(v) => onBooleanChange("fakeLegalNotice", v)} />
          <YesNoUnknown label="Did they use abusive language?" value={submission.abusiveLanguage} onChange={(v) => onBooleanChange("abusiveLanguage", v)} />
        </div>
      </div>
    </section>
  );
}

export function IssueTagSelector({
  selectedTags,
  onToggle,
}: {
  selectedTags: string[];
  onToggle: (tag: string) => void;
}) {
  const tags = [
    "Harassment",
    "Threat calls",
    "Contact list abuse",
    "Hidden charges",
    "High processing fee",
    "Data misuse",
    "Photo morphing",
    "Fake legal notice",
    "Relative calling",
    "Office calling",
    "Abusive language",
    "Blackmail",
    "Loan not closed",
    "Payment not updated",
    "Poor support",
    "Good support",
    "Fast disbursal",
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Issue tags</h2>
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4">
        {tags.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => onToggle(tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              selectedTags.includes(tag) ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}

export function EvidenceUploader({
  evidenceFiles,
  onEvidenceChange,
}: {
  evidenceFiles: string[];
  onEvidenceChange: (files: string[]) => void;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Evidence upload (optional)</h2>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="file"
          multiple
          onChange={(e) => onEvidenceChange(Array.from(e.target.files ?? []).map((f) => f.name))}
          className="mb-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white"
        />
        {evidenceFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {evidenceFiles.map((name) => (
              <span key={name} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                {name}
              </span>
            ))}
          </div>
        )}
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Do not upload Aadhaar, PAN, bank statements, private photos, OTPs, passwords, or full phone numbers of private individuals.
        </p>
        <p className="mt-2 text-xs text-slate-500">Evidence is used for moderation and verification. It may not be shown publicly.</p>
      </div>
    </section>
  );
}

export function PrivacySettingsCard({
  submission,
  onDisplayMode,
  onPrivacyText,
  onKeepEvidencePrivate,
}: {
  submission: ReviewSubmission;
  onDisplayMode: (mode: DisplayMode) => void;
  onPrivacyText: (field: "displayName" | "email" | "phone", value: string) => void;
  onKeepEvidencePrivate: (value: boolean) => void;
}) {
  const modes: { key: DisplayMode; label: string }[] = [
    { key: "first_name_only", label: "Show my first name only" },
    { key: "anonymous", label: "Show anonymous review" },
    { key: "verified_badge_only", label: "Verified borrower badge only" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Privacy controls</h2>
      <div className="mb-3 flex flex-wrap gap-2">
        {modes.map((mode) => (
          <button
            type="button"
            key={mode.key}
            onClick={() => onDisplayMode(mode.key)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              submission.privacy.displayMode === mode.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          value={submission.privacy.displayName}
          onChange={(e) => onPrivacyText("displayName", e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="Display name"
        />
        <input
          type="email"
          value={submission.privacy.email}
          onChange={(e) => onPrivacyText("email", e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="Email for verification"
        />
        <input
          value={submission.privacy.phone}
          onChange={(e) => onPrivacyText("phone", e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="Phone number (optional)"
        />
        <label className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={submission.privacy.keepEvidencePrivate}
            onChange={(e) => onKeepEvidencePrivate(e.target.checked)}
          />
          Keep evidence private
        </label>
      </div>
      <p className="mt-3 text-xs text-slate-500">Your contact details will not be publicly displayed.</p>
    </section>
  );
}

export function LegalConfirmationBox({
  confirmations,
  onToggle,
}: {
  confirmations: ReviewSubmission["confirmations"];
  onToggle: (field: keyof ReviewSubmission["confirmations"], checked: boolean) => void;
}) {
  const items: Array<{ field: keyof ReviewSubmission["confirmations"]; label: string; checked: boolean }> = [
    { field: "ownExperience", label: "I confirm this review is based on my own experience.", checked: confirmations.ownExperience },
    { field: "notLegalComplaint", label: "I understand this is a public review platform, not a legal complaint portal.", checked: confirmations.notLegalComplaint },
    { field: "noPrivateInfo", label: "I will not upload private information of other individuals.", checked: confirmations.noPrivateInfo },
    { field: "moderationAccepted", label: "I understand my review may be moderated before publication.", checked: confirmations.moderationAccepted },
    { field: "noFalseClaims", label: "I agree not to make false claims.", checked: confirmations.noFalseClaims },
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Legal safety confirmation</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item.field} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
            <input type="checkbox" checked={item.checked} onChange={(e) => onToggle(item.field, e.target.checked)} className="mt-1 h-4 w-4" />
            <span className="text-sm text-slate-700">{item.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

export function ReviewSubmitSidebar({
  canSubmit,
  onSubmit,
  onSaveDraft,
}: {
  canSubmit: boolean;
  onSubmit: () => void;
  onSaveDraft: () => void;
}) {
  return (
    <aside className="sticky top-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Submit</h3>
      <p className="text-sm text-slate-600">Your review helps identify complaint patterns and risk signals for other borrowers.</p>
      <button onClick={onSubmit} disabled={!canSubmit} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Submit Review</button>
      <button onClick={onSaveDraft} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Save Draft</button>
      <Link href="#" className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700">Back to App Profile</Link>
      <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
        After submit: "Your review has been submitted for moderation."
      </p>
    </aside>
  );
}

export function MobileSubmitBar({
  canSubmit,
  onSubmit,
  onSaveDraft,
}: {
  canSubmit: boolean;
  onSubmit: () => void;
  onSaveDraft: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-4xl gap-2">
        <button onClick={onSubmit} disabled={!canSubmit} className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Submit Review</button>
        <button onClick={onSaveDraft} className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Save Draft</button>
      </div>
    </div>
  );
}

const createInitialSubmission = (appId: string): ReviewSubmission => ({
  appId,
  reviewType: "general_review",
  rating: {
    overall: 0,
    transparency: 0,
    customerSupport: 0,
    recoveryBehaviour: 0,
    dataPrivacy: 0,
    chargesAndFees: 0,
  },
  title: "",
  body: "",
  loanAmountRange: "",
  incidentDate: "",
  repaymentDelayed: null,
  contactedRelatives: null,
  threatened: null,
  accessedContacts: null,
  misusedPhotos: null,
  claimedNbfcRepresentation: null,
  fakeLegalNotice: null,
  abusiveLanguage: null,
  tags: [],
  evidenceFiles: [],
  privacy: {
    displayMode: "anonymous",
    displayName: "",
    email: "",
    phone: "",
    keepEvidencePrivate: true,
  },
  confirmations: {
    ownExperience: false,
    notLegalComplaint: false,
    noPrivateInfo: false,
    moderationAccepted: false,
    noFalseClaims: false,
  },
});

function SubmitReviewForm({ appContext }: { appContext: AppReviewContext }) {
  const submitReview = useSubmitReview();
  const safetyScan = useReviewSafetyScan();
  const createUploadUrl = useCreateEvidenceUploadUrl();
  const completeUpload = useCompleteEvidenceUpload();
  const [submission, setSubmission] = useState<ReviewSubmission>(() => createInitialSubmission(appContext.appId));
  const [submitStatus, setSubmitStatus] = useState<string>("");
  const [evidenceStatuses, setEvidenceStatuses] = useState<Array<{ fileName: string; status: string }>>([]);
  const [localScan, setLocalScan] = useState(() => scanReviewTextLocally({ title: "", body: "" }));

  const canSubmit = useMemo(() => {
    const c = submission.confirmations;
    return Boolean(submission.rating.overall && submission.title.trim() && submission.body.trim() && c.ownExperience && c.notLegalComplaint && c.noPrivateInfo && c.moderationAccepted && c.noFalseClaims);
  }, [submission]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalScan(scanReviewTextLocally({ title: submission.title, body: submission.body }));
    }, 300);
    return () => clearTimeout(timer);
  }, [submission.title, submission.body]);

  const onSubmit = () => {
    if (!canSubmit) return;
    safetyScan.mutate(
      { title: submission.title, body: submission.body, tags: submission.tags, reviewType: "GENERAL_REVIEW" },
      {
        onSuccess: (scan) => {
          if (!scan.canSubmit) {
            setSubmitStatus("Please remove severe private data before submitting.");
            return;
          }
          submitReview.mutate(submission, {
            onSuccess: async (data) => {
              setSubmitStatus(data.message || "Your review has been submitted for moderation.");
              if (submission.evidenceFiles.length > 0) {
                setSubmitStatus("Review submitted. Uploading evidence metadata...");
                const statusRows: Array<{ fileName: string; status: string }> = [];
                for (const fileName of submission.evidenceFiles) {
                  try {
                    const upload = await createUploadUrl.mutateAsync({
                      fileName,
                      mimeType: "image/png",
                      fileSizeBytes: 1024,
                      reviewId: data.id,
                      loanAppId: appContext.appId,
                    });
                    await completeUpload.mutateAsync({
                      storageKey: upload.storageKey,
                      fileName,
                      mimeType: "image/png",
                      fileSizeBytes: 1024,
                      reviewId: data.id,
                      loanAppId: appContext.appId,
                      sensitiveFlags: [],
                    });
                    statusRows.push({ fileName, status: "SCAN_PENDING" });
                  } catch {
                    statusRows.push({ fileName, status: "FAILED" });
                  }
                }
                setEvidenceStatuses(statusRows);
                setSubmitStatus("Review submitted. Evidence metadata recorded privately.");
              }
            },
          });
        },
      },
    );
  };
  const onSaveDraft = () => setSubmitStatus("Draft saved locally.");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-24">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">User Review and Risk-Reporting Form</p>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Share your experience with this loan app</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">Help other borrowers understand what to expect. Your review helps us detect complaint patterns and risk signals.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3">
            <img src={appContext.appLogoUrl} alt={`${appContext.appName} logo`} className="h-12 w-12 rounded-xl border border-slate-200" />
            <div>
              <p className="font-semibold text-slate-900">{appContext.appName}</p>
              <p className="text-sm text-slate-600">Trust score: {appContext.trustScore}/100</p>
            </div>
            <span className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${riskTone(appContext.riskLevel)}`}>
              {appContext.riskLevel === "severe" ? "Severe Complaints" : `${appContext.riskLevel[0].toUpperCase()}${appContext.riskLevel.slice(1)} Risk`}
            </span>
            <Link href={appContext.profileUrl} className="text-sm font-medium text-slate-700 underline">Back to app profile</Link>
          </div>
          <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            This is a user review and risk-reporting form, not a police complaint portal. Use factual and respectful language. Reviews are under moderation.
          </p>
          {submitReview.isError && (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
              Could not submit review. {(submitReview.error as Error).message}
            </div>
          )}
          {submitStatus && (
            <div className="mt-3 space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              <p>{submitStatus}</p>
              {evidenceStatuses.length > 0 && (
                <div className="space-y-1 text-xs">
                  {evidenceStatuses.map((row) => (
                    <p key={row.fileName}>{row.fileName}: {row.status}</p>
                  ))}
                </div>
              )}
              <p className="text-xs">Status: submitted for moderation. It will not appear publicly until approved.</p>
              <Link href={`/loan-apps/${appContext.appId}/submit-review/success`} className="inline-block rounded-lg border border-emerald-300 bg-white px-3 py-1 text-xs font-semibold text-emerald-800">
                Open submit review success page
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <ReviewTypeSelector selectedType={submission.reviewType} onSelect={(v) => setSubmission((s) => ({ ...s, reviewType: v }))} />
            <RatingInputGroup rating={submission.rating} onChange={(field, value) => setSubmission((s) => ({ ...s, rating: { ...s.rating, [field]: value } }))} />
            <IncidentDetailsForm
              submission={submission}
              onTextChange={(field, value) => setSubmission((s) => ({ ...s, [field]: value }))}
              onBooleanChange={(field, value) => setSubmission((s) => ({ ...s, [field]: value }))}
            />
            <SafeReviewWriter
              scan={safetyScan.data ?? localScan}
              onApplySuggestion={(body) => setSubmission((s) => ({ ...s, body }))}
            />
            <IssueTagSelector
              selectedTags={submission.tags}
              onToggle={(tag) =>
                setSubmission((s) => ({
                  ...s,
                  tags: s.tags.includes(tag) ? s.tags.filter((t) => t !== tag) : [...s.tags, tag],
                }))
              }
            />
            <EvidenceUploader evidenceFiles={submission.evidenceFiles} onEvidenceChange={(files) => setSubmission((s) => ({ ...s, evidenceFiles: files }))} />
            <PrivacySettingsCard
              submission={submission}
              onDisplayMode={(mode) => setSubmission((s) => ({ ...s, privacy: { ...s.privacy, displayMode: mode } }))}
              onPrivacyText={(field, value) => setSubmission((s) => ({ ...s, privacy: { ...s.privacy, [field]: value } }))}
              onKeepEvidencePrivate={(value) => setSubmission((s) => ({ ...s, privacy: { ...s.privacy, keepEvidencePrivate: value } }))}
            />
            <LegalConfirmationBox
              confirmations={submission.confirmations}
              onToggle={(field, checked) => setSubmission((s) => ({ ...s, confirmations: { ...s.confirmations, [field]: checked } }))}
            />
          </div>
          <div className="hidden lg:block">
            <ReviewSubmitSidebar canSubmit={canSubmit && !submitReview.isPending} onSubmit={onSubmit} onSaveDraft={onSaveDraft} />
          </div>
        </div>
      </div>
      <MobileSubmitBar canSubmit={canSubmit && !submitReview.isPending} onSubmit={onSubmit} onSaveDraft={onSaveDraft} />
    </main>
  );
}

export default function SubmitLoanAppReviewPage({ slug }: { slug: string }) {
  const profileQuery = useLoanAppProfile(slug);
  const app = profileQuery.data?.app;

  if (profileQuery.isLoading) {
    return <main className="min-h-screen bg-slate-50 p-6"><section className="mx-auto max-w-5xl rounded-2xl border bg-white p-8 text-center text-sm text-slate-600">Loading review form...</section></main>;
  }

  if (profileQuery.isError || !app) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <section className="mx-auto max-w-5xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-900">
          <p>Could not load app details for this review form. {(profileQuery.error as Error | null)?.message}</p>
          <button onClick={() => profileQuery.refetch()} className="mt-3 rounded-xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white">Try again</button>
        </section>
      </main>
    );
  }

  return (
    <SubmitReviewForm
      appContext={{
        appId: app.id,
        appName: app.name,
        appLogoUrl: app.logoUrl,
        trustScore: app.trustScore,
        riskLevel: app.riskLevel,
        profileUrl: `/loan-apps/${slug}`,
      }}
    />
  );
}
