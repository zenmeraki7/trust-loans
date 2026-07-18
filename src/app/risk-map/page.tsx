import ComplaintHeatmapPage from "@/components/risk-map/ComplaintHeatmapPage";
import { complaintHeatmap } from "@/data/mockComplaintHeatmap";

export default function Page() {
  return <ComplaintHeatmapPage data={complaintHeatmap} />;
}
