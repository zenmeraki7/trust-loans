export type ThreatMessageCheckerData = {
  inputPlaceholder: string;
  categories: Array<{
    id:
      | "threat_language"
      | "photo_morphing_threat"
      | "family_contact_threat"
      | "fake_legal_police_language"
      | "payment_pressure"
      | "abusive_language"
      | "personal_data_exposure";
    label: string;
    keywords: string[];
  }>;
  defaultActions: string[];
};
