import AdminRiskIntelligenceDashboardPage from "@/components/admin/AdminRiskIntelligenceDashboardPage";
import { riskIntelligenceDashboard } from "@/data/mockAdminRiskIntelligence";

export default function Page() {
  return <AdminRiskIntelligenceDashboardPage data={riskIntelligenceDashboard} />;
}
