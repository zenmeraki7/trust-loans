import { notFound } from "next/navigation";
import PaydayLoanAppProfilePage from "@/components/loan-profile/PaydayLoanAppProfilePage";
import { getPaydayLoanApp } from "@/data/paydayLoanApps";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = getPaydayLoanApp(id);
  if (!app) notFound();
  return <PaydayLoanAppProfilePage app={app} />;
}
