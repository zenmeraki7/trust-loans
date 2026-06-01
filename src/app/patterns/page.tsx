import PredatoryPatternLibraryPage from "@/components/patterns/PredatoryPatternLibraryPage";
import { patternLibrary } from "@/data/mockPatternLibrary";

export default function Page() {
  return <PredatoryPatternLibraryPage data={patternLibrary} />;
}
