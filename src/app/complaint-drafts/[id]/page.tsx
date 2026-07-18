import ComplaintDraftEditorPage from "@/components/complaints/ComplaintDraftEditorPage";

export default async function ComplaintDraftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ComplaintDraftEditorPage draftId={id} />;
}
