import type { Metadata } from "next";
import PublicReviewDetailPage from "@/components/reviews/PublicReviewDetailPage";

type Props = { params: Promise<{ reviewId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { reviewId } = await params;
  const title = `Public Review ${reviewId} | Trust Loans`;
  const description = "User-submitted review published after moderation.";
  return {
    title,
    description,
    alternates: { canonical: `/reviews/${reviewId}` },
    openGraph: { title, description, url: `/reviews/${reviewId}` },
  };
}

export default async function Page({ params }: Props) {
  const { reviewId } = await params;
  return <PublicReviewDetailPage reviewId={reviewId} />;
}
