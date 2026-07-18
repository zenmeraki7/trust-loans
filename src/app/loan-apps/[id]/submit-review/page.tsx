import SubmitLoanAppReviewPage from "@/components/loan-profile/SubmitLoanAppReviewPage";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <SubmitLoanAppReviewPage slug={id} />;
}
