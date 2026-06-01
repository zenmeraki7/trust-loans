import AdminModerationDashboardPage from "@/components/admin/AdminModerationDashboardPage";
import { moderationDashboard } from "@/data/mockAdminModeration";

export default function Page() {
  return <AdminModerationDashboardPage data={moderationDashboard} />;
}
