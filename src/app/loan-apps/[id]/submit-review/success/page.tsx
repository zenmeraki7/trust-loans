import SubmitReviewSuccessPage from "@/components/loan-profile/SubmitReviewSuccessPage";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const app = {
    id,
    name: "Selected loan app",
    developerName: "Under verification",
    playStoreUrl: "",
    appStoreUrl: "",
  };

  return <SubmitReviewSuccessPage app={app} />;
}
