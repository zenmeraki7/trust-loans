import GrievanceContactDirectoryPage from "@/components/grievance/GrievanceContactDirectoryPage";
import { grievanceDirectory } from "@/data/mockGrievanceDirectory";

export default function Page() {
  return <GrievanceContactDirectoryPage data={grievanceDirectory} />;
}
