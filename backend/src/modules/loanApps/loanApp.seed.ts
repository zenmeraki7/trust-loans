import { ClaimStatus, ProfileStatus, RiskLevel, VerificationStatus } from "@prisma/client";
import { prisma } from "../../prisma/client.js";

const PLACEHOLDER_APP_COUNT = 70;
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

const placeholderLogo = (_index: number) => "/images/default-app-logo.svg";

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
