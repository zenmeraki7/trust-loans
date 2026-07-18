import AppPermissionRiskExplainerPage from "@/components/app-permissions/AppPermissionRiskExplainerPage";
import { appPermissions } from "@/data/mockAppPermissions";

export default function Page() {
  return <AppPermissionRiskExplainerPage data={appPermissions} />;
}
