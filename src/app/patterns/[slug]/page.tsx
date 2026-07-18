import { notFound } from "next/navigation";
import PatternDetailPage from "@/components/pattern-detail/PatternDetailPage";
import { patternDetails } from "@/data/mockPatternDetail";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return patternDetails.map((pattern) => ({ slug: pattern.slug }));
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const pattern = patternDetails.find((item) => item.slug === slug);
  if (!pattern) {
    notFound();
  }
  return <PatternDetailPage pattern={pattern} />;
}
