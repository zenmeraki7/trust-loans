import ComplaintTemplateBuilder from "@/components/complaints/ComplaintTemplateBuilder";

export default async function ComplaintTemplateBuilderPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  return <ComplaintTemplateBuilder templateKey={key} />;
}
