import type { WhatToDoNowData } from "@/types/whatToDoNow";

export const whatToDoNow: WhatToDoNowData = {
  questions: [
    { id: "threatening", label: "Are they threatening you?" },
    { id: "contactedRelatives", label: "Did they contact relatives?" },
    { id: "photoMorphingThreat", label: "Did they threaten photo morphing?" },
    { id: "calledOffice", label: "Did they call your office?" },
    { id: "personalUpiRequest", label: "Did they ask payment to personal UPI?" },
    { id: "alreadyPaid", label: "Did you already pay?" },
    { id: "paymentNotUpdated", label: "Is the payment not updated?" },
    { id: "haveScreenshots", label: "Do you have screenshots?" },
  ],
  cybercrimeTriggerOptions: [
    { id: "photo_morphing_threat", label: "Photo morphing threat" },
    { id: "blackmail", label: "Blackmail" },
    { id: "impersonation", label: "Impersonation" },
    { id: "fake_police_threat", label: "Fake police threat" },
    { id: "abusive_online_messages", label: "Abusive online messages" },
    { id: "threat_to_send_photos_to_contacts", label: "Threat to send photos to contacts" },
  ],
  regulatedIssueOptions: [
    { id: "payment_not_updated", label: "Payment not updated" },
    { id: "loan_not_closed", label: "Loan not closed" },
    { id: "wrong_dues", label: "Wrong dues" },
    { id: "grievance_officer_not_responding", label: "Grievance officer not responding" },
    { id: "nbfc_service_deficiency", label: "NBFC/lender service deficiency" },
    { id: "unfair_recovery_regulated_lender", label: "Unfair recovery behaviour linked to regulated lender" },
  ],
  defaultEvidenceChecklist: [
    "Screenshots of chat/messages",
    "Call logs with timestamps",
    "Payment receipts and transaction ID",
    "App listing details and developer name",
    "Incident timeline with date/time",
  ],
  defaultWhatNotToDo: [
    "Do not share OTPs or passwords",
    "Do not share Aadhaar/PAN on chat",
    "Do not pay random personal UPI without verification",
    "Do not delete messages or call logs",
    "Do not threaten back",
  ],
};
