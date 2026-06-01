import AdminLoanAppDatabasePage from "@/components/admin/AdminLoanAppDatabasePage";
import { adminLoanAppDatabase } from "@/data/mockAdminLoanAppDatabase";

export default function Page() {
  return <AdminLoanAppDatabasePage data={adminLoanAppDatabase} />;
}
