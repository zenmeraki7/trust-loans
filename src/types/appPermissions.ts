export type AppPermissionsData = {
  permissions: Array<{
    key: string;
    title: string;
    whatItDoes: string;
    whyRequested: string;
    riskExplanation: string;
    whatToVerify: string;
    saferAction: string;
  }>;
  normalVsCaution: Array<{
    permission: string;
    commonUse: string;
    cautionSign: string;
  }>;
  notToShare: string[];
  beforeInstallingChecklist: string[];
};
