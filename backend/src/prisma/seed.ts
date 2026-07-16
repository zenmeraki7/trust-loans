import "dotenv/config";
import { seedComplaintTemplates } from "../modules/complaintTemplates/complaintTemplate.seed.js";
import { seedPlaceholderLoanApps } from "../modules/loanApps/loanApp.seed.js";
import { prisma } from "./client.js";

async function main() {
  await Promise.all([seedComplaintTemplates(), seedPlaceholderLoanApps()]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeded complaint templates and 70 placeholder loan apps.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
