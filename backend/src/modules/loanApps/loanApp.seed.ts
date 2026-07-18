import { ClaimStatus, ProfileStatus, RiskLevel, VerificationStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";

const PLACEHOLDER_APP_COUNT = 70;
const logoColors = ["#1d4ed8", "#0f766e", "#7c3aed", "#be123c", "#b45309", "#0369a1", "#4338ca"];
const suppliedLoanAppNames = [
  "Moneyview",
  "Bajaj Finserv",
  "Buddy Loan",
  "LazyPay",
  "Piramal Finance",
  "Zype",
  "Kissht",
  "True Balance",
  "Tata Capital",
  "KreditBee",
  "Fibe (EarlySalary)",
  "MoneyTap",
  "mPokket",
  "PaySense",
  "Pocketly",
  "FlexSalary",
  "Lenditt",
  "PayMe",
  "Hero Digital",
  "DMI Finance",
  "Olyv",
  "mPokket",
  "PayRupik",
  "NIRA",
  "Stashfin",
  "CASHe",
  "ZestMoney",
  "TrueMoney",
  "RupeeRedee",
  "IndiaLends",
  "PayMe India",
  "DigiMoney",
  "PhonePe Loan",
  "SmartCoin",
  "Lendingplate",
  "Finnable",
  "Dhani",
  "Freo",
  "Slice",
  "SmartCoin",
  "Kreditzy",
  "Rupeek",
  "CrediFiable",
  "Bajaj Finance",
  "CASHe",
  "Capital Float",
  "Aditya Birla",
  "Clix Capital",
  "PayRupik",
];

const placeholderLogo = (index: number) => {
  const label = `LA${String(index).padStart(2, "0")}`;
  const background = logoColors[(index - 1) % logoColors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="20" fill="${background}"/><text x="48" y="55" fill="white" font-family="Arial,sans-serif" font-size="25" font-weight="700" text-anchor="middle">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export async function seedPlaceholderLoanApps() {
  const apps = Array.from({ length: PLACEHOLDER_APP_COUNT }, (_, offset) => {
    const index = offset + 1;
    const paddedIndex = String(index).padStart(2, "0");

    return {
      slug: `loan-app-${paddedIndex}`,
      name: suppliedLoanAppNames[offset] ?? `Loan App ${paddedIndex}`,
      logoUrl: placeholderLogo(index),
      developerName: null,
      companyName: null,
      status: ProfileStatus.PUBLISHED,
      verificationStatus: VerificationStatus.UNDER_VERIFICATION,
      claimStatus: ClaimStatus.UNCLAIMED,
      riskLevel: RiskLevel.INSUFFICIENT_DATA,
      trustScore: 0,
      averageRating: 0,
      reviewCount: 0,
    };
  });

  await prisma.$transaction(
    apps.map((app) =>
      prisma.loanApp.upsert({
        where: { slug: app.slug },
        update: {},
        create: app,
      }),
    ),
  );

  await prisma.$transaction(
    suppliedLoanAppNames.map((name, offset) => {
      const paddedIndex = String(offset + 1).padStart(2, "0");
      return prisma.loanApp.updateMany({
        where: {
          slug: `loan-app-${paddedIndex}`,
          name: `Loan App ${paddedIndex}`,
        },
        data: { name, developerName: null, companyName: null },
      });
    }),
  );
}
