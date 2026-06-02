import HarassmentCaseDetailPage from "@/components/cases/HarassmentCaseDetailPage";

export default async function Page({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  return <HarassmentCaseDetailPage caseId={caseId} />;
}
