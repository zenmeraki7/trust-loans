import type { ThreatMessageCheckerData } from "@/types/threatMessageChecker";

export const threatMessageChecker: ThreatMessageCheckerData = {
  inputPlaceholder: "Paste suspicious message text here",
  categories: [
    { id: "threat_language", label: "Threat language", keywords: ["threat", "final warning", "consequence", "ruin", "serious action"] },
    { id: "photo_morphing_threat", label: "Photo morphing threat", keywords: ["edited photo", "morph", "image leak", "photo send", "viral photo"] },
    { id: "family_contact_threat", label: "Family-contact threat", keywords: ["family", "relative", "contact list", "parents", "friends"] },
    { id: "fake_legal_police_language", label: "Fake legal/police language", keywords: ["legal notice", "police case", "fir", "court", "warrant"] },
    { id: "payment_pressure", label: "Payment pressure", keywords: ["pay now", "immediately", "upi", "settle now", "urgent payment"] },
    { id: "abusive_language", label: "Abusive language", keywords: ["abuse", "idiot", "stupid", "shame", "insult"] },
    { id: "personal_data_exposure", label: "Personal-data exposure", keywords: ["aadhaar", "pan", "bank", "otp", "password", "account number"] },
  ],
  defaultActions: [
    "Do not reply abusively",
    "Take screenshot",
    "Save sender number privately",
    "Use this complaint template",
    "Report to cybercrime if blackmail/photo threat exists",
    "Submit review safely",
  ],
};
