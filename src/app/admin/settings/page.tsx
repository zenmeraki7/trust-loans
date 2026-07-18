import AdminPlatformSettingsPage from "@/components/admin/AdminPlatformSettingsPage";
import { adminPlatformSettings } from "@/data/mockAdminPlatformSettings";

export default function Page() {
  return <AdminPlatformSettingsPage data={adminPlatformSettings} />;
}
