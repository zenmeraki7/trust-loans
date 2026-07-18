export type PaydayLoanApp = {
  id: string;
  name: string;
  nbfcName: string | null;
};

const paydayLoanAppRows: Array<readonly [string, string, string | null]> = [
  ["fastpaise", "FASTPAISE", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["snappaise", "SNAPPAISE", "AMPIRE FINANCE PRIVATE LIMITED"],
  ["salary-setu", "SALARY SETU", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["fastsalary", "FASTSALARY", null],
  ["f1speed-loan", "F1SPEED LOAN", "AMPIRE FINANCE PRIVATE LIMITED"],
  ["duniya-finance", "DUNIYA FINANCE", "AMAN FINCAP PRIVATE LIMITED"],
  ["speedo-loan", "SPEEDO LOAN", "AGRIM FINCAP PRIVATE LIMITED"],
  ["tejas-loan", "TEJAS LOAN", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["qua-loans", "QUA LOANS", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["toofan-loans", "TOOFAN LOANS", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["zaylo-loans", "ZAYLO LOANS", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["minutes-loan", "MINUTES LOAN", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["aayushman-loans", "AAYUSHMAN LOANS", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["mysalary", "MYSALARY", null],
  ["salaryadda", "SALARYADDA", "AMPIRE FINANCE PRIVATE LIMITED"],
  ["crednidhi", "CREDNIDHI", null],
  ["jhatpat-cash", "JHATPAT CASH", null],
  ["zapcash", "ZAPCASH", null],
  ["sabka-loan", "SABKA LOAN", null],
  ["creditt-plus", "CREDITT+", null],
  ["shubhlakshmi", "SHUBHLAKSHMI", "AMPIRE FINANCE PRIVATE LIMITED"],
  ["udhaar-portal", "UDHAAR PORTAL", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["loanwalle", "LOANWALLE", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["cashwalle", "CASHWALLE", null],
  ["cashvia", "CASHVIA", null],
  ["fundsbull", "FUNDSBULL", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["fundobaba", "FUNDOBABA", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["salarywalle", "SALARYWALLE", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["b4salary", "B4SALARY", null],
  ["zapploans", "ZAPPLOANS", null],
  ["zepto-finance", "ZEPTO FINANCE", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["salarybolt", "SALARYBOLT", "NAMAN FINLEASE PRIVATE LIMITED"],
  ["dhanvarshaa", "DHANVARSHAA", "NAMAN FINLEASE PRIVATE LIMITED"],
];

export const paydayLoanApps: PaydayLoanApp[] = paydayLoanAppRows.map(([id, name, nbfcName]) => ({ id, name, nbfcName }));

export const getPaydayLoanApp = (id: string) => paydayLoanApps.find((app) => app.id === id);

const highRiskNbfcNames = new Set([
  "NAMAN FINLEASE PRIVATE LIMITED",
  "AMPIRE FINANCE PRIVATE LIMITED",
]);

export const isHighRiskPaydayApp = (app: PaydayLoanApp) => Boolean(app.nbfcName && highRiskNbfcNames.has(app.nbfcName));
