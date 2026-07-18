//src/app/entities/[slug]/page.tsx
import CompanyNbfcProfileRoute from "@/components/entities/CompanyNbfcProfileRoute";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CompanyNbfcProfileRoute slug={slug} />;
}
