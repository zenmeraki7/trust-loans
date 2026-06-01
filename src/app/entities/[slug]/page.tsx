import CompanyNbfcProfilePage from "@/components/entities/CompanyNbfcProfilePage";
import { entityProfile } from "@/data/mockEntityProfile";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CompanyNbfcProfilePage data={{ ...entityProfile, slug }} />;
}
