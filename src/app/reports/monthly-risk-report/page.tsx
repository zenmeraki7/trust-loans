import MonthlyRiskReportPage from "@/components/reports/MonthlyRiskReportPage";
import { monthlyRiskReport } from "@/data/mockMonthlyRiskReport";

export default function Page() {
  return <MonthlyRiskReportPage data={monthlyRiskReport} />;
}
