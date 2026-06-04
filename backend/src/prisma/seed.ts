import "dotenv/config";
import { seedComplaintTemplates } from "../modules/complaintTemplates/complaintTemplate.seed.js";
import { prisma } from "./client.js";

async function main() {
  await seedComplaintTemplates();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeded complaint templates.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
