export type WhatToDoNowData = {
  questions: Array<{
    id:
      | "threatening"
      | "contactedRelatives"
      | "photoMorphingThreat"
      | "calledOffice"
      | "personalUpiRequest"
      | "alreadyPaid"
      | "paymentNotUpdated"
      | "haveScreenshots";
    label: string;
  }>;
  cybercrimeTriggerOptions: Array<{
    id:
      | "photo_morphing_threat"
      | "blackmail"
      | "impersonation"
      | "fake_police_threat"
      | "abusive_online_messages"
      | "threat_to_send_photos_to_contacts";
    label: string;
  }>;
  regulatedIssueOptions: Array<{
    id:
      | "payment_not_updated"
      | "loan_not_closed"
      | "wrong_dues"
      | "grievance_officer_not_responding"
      | "nbfc_service_deficiency"
      | "unfair_recovery_regulated_lender";
    label: string;
  }>;
  defaultEvidenceChecklist: string[];
  defaultWhatNotToDo: string[];
};
