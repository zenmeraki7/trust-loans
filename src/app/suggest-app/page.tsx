import SubmitMissingLoanAppPage from "@/components/suggest-app/SubmitMissingLoanAppPage";
import { missingLoanAppSubmission } from "@/data/mockMissingLoanAppSubmission";

export default function Page() {
  return <SubmitMissingLoanAppPage initial={missingLoanAppSubmission} />;
}
