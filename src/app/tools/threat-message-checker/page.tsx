import ThreatMessageCheckerPage from "@/components/tools/ThreatMessageCheckerPage";
import { threatMessageChecker } from "@/data/mockThreatMessageChecker";

export default function Page() {
  return <ThreatMessageCheckerPage data={threatMessageChecker} />;
}
