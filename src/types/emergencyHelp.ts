export type EmergencyHelpData = {
  situations: Array<{
    id: string;
    title: string;
    summary: string;
    recommendedFirstStep: string;
  }>;
  immediateChecklist: Array<{
    id: string;
    label: string;
    critical: boolean;
  }>;
  evidenceItems: Array<{
    id: string;
    title: string;
    detail: string;
  }>;
  warnings: Array<{
    id: string;
    text: string;
  }>;
  reportingOptions: Array<{
    id: string;
    title: string;
    description: string;
    actionLabel: string;
    actionUrl: string;
  }>;
  quickTemplates: Array<{
    id: string;
    title: string;
    summary: string;
    ctaLabel: string;
    ctaUrl: string;
  }>;
};
