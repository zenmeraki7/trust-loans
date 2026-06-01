import CompareLoanAppsPage from "@/components/compare/CompareLoanAppsPage";
import { compareApps } from "@/data/mockCompareLoanApps";

export default function Page() {
  return <CompareLoanAppsPage apps={compareApps} />;
}
