export type OfficialStoreReportData = {
  app: {
    id: string;
    name: string;
    developerName: string;
    playStoreUrl: string;
    appStoreUrl: string;
    packageName: string;
    appStoreId: string;
  };
  reportReasons: Array<{
    id: string;
    label: string;
  }>;
  summaryBuilder: {
    issueType: string;
    incidentDate: string;
    factualSummary: string;
    evidencePreserved: string[];
  };
  officialLinks: {
    googlePlayHelp: string;
    appleReportProblem: string;
  };
};
