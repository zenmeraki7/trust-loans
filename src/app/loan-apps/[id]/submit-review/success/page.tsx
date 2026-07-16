import SubmitReviewSuccessPage from "@/components/loan-profile/SubmitReviewSuccessPage";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    reviewId?: string;
  }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { reviewId } = await searchParams;

  return <SubmitReviewSuccessPage appId={id} reviewId={reviewId} />;
}
