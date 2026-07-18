export const incidentTypes = [
  "Threat calls",
  "Contacting relatives",
  "Office harassment",
  "Photo morphing",
  "Data misuse",
  "Fake legal notice",
  "Abusive recovery agents",
  "Payment not updated",
  "Loan not closed",
  "Impersonation",
  "Blackmail",
];

export const evidenceChecklist = [
  "Take screenshots of chats and threats",
  "Save call logs",
  "Record dates and times",
  "Save payment receipts",
  "Save loan agreement screenshots",
  "Save app name, company name, and loan ID",
  "Preserve emails and SMS",
  "Do not delete messages",
  "Do not engage in abusive replies",
  "Do not share OTPs or passwords",
  "Do not upload private documents publicly",
];

export const reportingOptions = [
  {
    title: "App Grievance Officer",
    points: [
      "Use official grievance contact if available",
      "Send written complaint",
      "Keep acknowledgement",
    ],
  },
  {
    title: "RBI CMS Complaint",
    points: [
      "Useful if lender or NBFC relationship is known",
      "Attach evidence",
      "Track complaint number",
    ],
  },
  {
    title: "National Cybercrime Portal",
    points: [
      "For threats, blackmail, photo morphing, impersonation, and online harassment",
      "Preserve screenshots and URLs",
    ],
  },
  {
    title: "Consumer Helpline",
    points: [
      "For service deficiency, unfair charges, non-closure, and payment update issues",
    ],
  },
  {
    title: "Legal Notice Through Advocate",
    points: [
      "For serious harassment, defamation, extortion-like threats, and privacy concerns",
      "Use professional legal advice",
    ],
  },
  {
    title: "Platform Review Submission",
    points: [
      "Share your experience without exposing private details",
      "Helps identify complaint patterns",
    ],
  },
];

export const timelineSteps = [
  "Stop panic and preserve evidence",
  "Identify the app, company, and claimed NBFC",
  "Send written complaint to grievance officer",
  "Report cyber harassment if threats or data misuse occurred",
  "File RBI or consumer complaint where applicable",
  "Speak to an advocate for serious threats",
  "Share a safe public review",
];

export const complaintTemplates = [
  { title: "Harassment complaint template", description: "Use factual language for repeated call pressure or threatening communication." },
  { title: "Photo morphing complaint template", description: "Document image misuse concerns with dates, URLs, and source channels." },
  { title: "Data misuse complaint template", description: "Describe alleged data access or misuse based on your records." },
  { title: "Fake legal notice complaint template", description: "Report suspected notice impersonation with supporting evidence." },
  { title: "Payment not updated complaint template", description: "Record transaction details, receipts, and follow-up timeline." },
  { title: "Loan closure complaint template", description: "Report non-closure after payment with statement and communication logs." },
];

export const whatNotToDo = [
  "Do not pay random UPI numbers without verification",
  "Do not share OTPs",
  "Do not send Aadhaar or PAN again through WhatsApp",
  "Do not respond with threats",
  "Do not post private phone numbers publicly",
  "Do not upload private photos publicly",
  "Do not ignore serious blackmail threats",
  "Do not delete evidence",
];

export const faqItems = [
  {
    q: "Is RBI registration alone enough to trust a loan app?",
    a: "RBI-related claims can be one signal, but you may consider complaint patterns, grievance channels, and user reviews before deciding.",
  },
  {
    q: "What if the app contacts my relatives?",
    a: "Preserve evidence and report to the app grievance contact and relevant authorities where needed. If threats escalate, seek legal advice.",
  },
  {
    q: "What if they morph my photo?",
    a: "You may consider filing a cybercrime complaint quickly and preserving screenshots and links. Speak to an advocate for case-specific advice.",
  },
  {
    q: "What if they threaten legal action?",
    a: "Keep records of communication and consult a qualified advocate before responding. Avoid abusive exchanges.",
  },
  {
    q: "What if payment is made but loan is not closed?",
    a: "Preserve payment proof, send a written grievance, and escalate through consumer or regulatory channels if unresolved.",
  },
  {
    q: "Can I post a review publicly?",
    a: "Yes, you may share your experience using factual and non-defamatory language without exposing private data.",
  },
  {
    q: "Should I file a cyber complaint?",
    a: "If online harassment, impersonation, blackmail, or image misuse is involved, you may consider reporting to appropriate cyber authorities.",
  },
  {
    q: "Should I talk to an advocate?",
    a: "For legal strategy and rights in your specific situation, speak to a qualified advocate.",
  },
];
