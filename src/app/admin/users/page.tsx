import AdminUserRoleManagementPage from "@/components/admin/AdminUserRoleManagementPage";
import { adminUserRoleManagement } from "@/data/mockAdminUserRoleManagement";

export default function Page() {
  return <AdminUserRoleManagementPage data={adminUserRoleManagement} />;
}
