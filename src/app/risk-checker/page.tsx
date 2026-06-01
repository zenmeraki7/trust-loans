import LoanAppRiskCheckerPage from "@/components/risk-checker/LoanAppRiskCheckerPage";
import { riskCheckerData } from "@/data/mockRiskChecker";

export default function Page() {
  return <LoanAppRiskCheckerPage data={riskCheckerData} />;
}
