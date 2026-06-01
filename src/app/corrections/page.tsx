import CorrectionDisputeRequestPage from "@/components/corrections/CorrectionDisputeRequestPage";
import { correctionDisputeRequest } from "@/data/mockCorrectionDisputeRequest";

export default function Page() {
  return <CorrectionDisputeRequestPage initial={correctionDisputeRequest} />;
}
