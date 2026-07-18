import type { PatternDetailData } from "@/types/patternDetail";

export const patternDetails: PatternDetailData[] = [
  {
    id: "pd-1",
    slug: "contact-list-abuse",
    title: "Contact list abuse",
    category: "Data/privacy issue",
    cautionLevel: "high",
    summary: "Users report that contacts saved in their phone may receive pressure calls or messages.",
    meaning:
      "This user-reported pattern may indicate privacy and recovery-risk concerns. It does not by itself prove wrongdoing by any specific app or company, but it is a warning sign users should handle carefully.",
    warningSigns: [
      "Calls/messages to relatives without borrower consent",
      "Repeated contact pressure using personal relationship details",
      "Requests to pay quickly to stop third-party calls",
      "Unclear explanation about why contacts were used",
    ],
    evidenceChecklist: [
      "Screenshots of chats and messages",
      "Call logs with date/time",
      "Payment proof and transaction references",
      "App profile and permissions screenshots",
      "Message URLs or sender details",
      "A timeline of events with dates/times",
    ],
    whatNotToDo: [
      "Do not share OTPs",
      "Do not upload private documents publicly",
      "Do not post private phone numbers online",
      "Do not threaten back",
      "Do not delete evidence",
    ],
    nextActions: [
      {
        id: "a1",
        title: "Contact grievance officer",
        description: "Submit a factual grievance with timestamps and evidence summary.",
        ctaLabel: "Open grievance directory",
        ctaUrl: "/grievance-directory",
      },
      {
        id: "a2",
        title: "File cybercrime complaint if threats or data misuse",
        description: "You may consider reporting serious online harassment or misuse.",
        ctaLabel: "Open emergency help",
        ctaUrl: "/emergency-help",
      },
      {
        id: "a3",
        title: "Use complaint template",
        description: "Start with a structured template to avoid missing details.",
        ctaLabel: "Use template",
        ctaUrl: "/complaint-templates",
      },
      {
        id: "a4",
        title: "Submit a review",
        description: "Share your experience to help other users identify warning signs.",
        ctaLabel: "Write review",
        ctaUrl: "/loan-apps/app-cashnest/submit-review",
      },
      {
        id: "a5",
        title: "Speak to advocate for serious threats",
        description: "For legal advice specific to your case, consult a qualified advocate.",
        ctaLabel: "Open legal action guide",
        ctaUrl: "/legal-action-guide",
      },
    ],
    relatedApps: [
      { id: "app-cashnest", name: "CashNest", logoUrl: "https://dummyimage.com/56x56/e2e8f0/0f172a.png&text=CN", trustScore: 36, profileUrl: "/loan-apps/app-cashnest" },
      { id: "app-quickrupee", name: "QuickRupee", logoUrl: "https://dummyimage.com/56x56/e2e8f0/0f172a.png&text=QR", trustScore: 31, profileUrl: "/loan-apps/app-quickrupee" },
    ],
    relatedReviews: [
      {
        id: "rev-1021",
        appName: "CashNest",
        excerpt: "User reported repeated calls to contacts after a repayment delay and requested support verification.",
        rating: 1,
        reviewUrl: "/reviews/rev-1021",
      },
      {
        id: "rev-1044",
        appName: "QuickRupee",
        excerpt: "User reported that relatives received payment pressure messages.",
        rating: 2,
        reviewUrl: "/reviews/rev-1044",
      },
    ],
    relatedTemplates: [
      { id: "tpl-1", title: "Relative calling complaint", summary: "Template for third-party contact pressure reports.", url: "/complaint-templates" },
      { id: "tpl-2", title: "Data misuse complaint", summary: "Template for reported contact/privacy concerns.", url: "/complaint-templates" },
    ],
  },
  {
    id: "pd-2",
    slug: "photo-morphing-threats",
    title: "Photo morphing threats",
    category: "Harassment issue",
    cautionLevel: "high",
    summary: "Users report threats involving edited images and blackmail-style pressure.",
    meaning:
      "This user-reported pattern may indicate serious risk and requires fast evidence preservation and safety-first actions. It does not make final legal findings about any app or company.",
    warningSigns: [
      "Threat messages mentioning edited images",
      "Demands for urgent payment to stop image sharing",
      "Messages sent to contacts with intimidation language",
    ],
    evidenceChecklist: [
      "Full screenshots including sender details",
      "Call logs and message timestamps",
      "Payment request screenshots",
      "Any linked profile/account details",
      "Chronological notes of incidents",
    ],
    whatNotToDo: [
      "Do not share additional private images",
      "Do not pay unknown personal UPI accounts without verification",
      "Do not delete threatening messages",
    ],
    nextActions: [
      { id: "a1", title: "Use emergency checklist", description: "Follow urgent safety steps and preserve records.", ctaLabel: "Open emergency help", ctaUrl: "/emergency-help" },
      { id: "a2", title: "Use complaint template", description: "Document facts clearly before reporting.", ctaLabel: "Open template", ctaUrl: "/complaint-templates" },
    ],
    relatedApps: [
      { id: "app-lendly", name: "LendlyNow", logoUrl: "https://dummyimage.com/56x56/e2e8f0/0f172a.png&text=LN", trustScore: 40, profileUrl: "/loan-apps/app-lendly" },
    ],
    relatedReviews: [
      { id: "rev-2220", appName: "LendlyNow", excerpt: "User reported image-based pressure messages and requested immediate support guidance.", rating: 1, reviewUrl: "/reviews/rev-2220" },
    ],
    relatedTemplates: [
      { id: "tpl-3", title: "Photo morphing threat complaint", summary: "Structured template for image-threat reporting.", url: "/complaint-templates" },
    ],
  },
];
