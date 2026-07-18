import GrievanceContactDirectoryPage from "@/components/grievance/GrievanceContactDirectoryPage";
import type { ApiLoanApp, PaginatedResponse } from "@/types/apiDtos";
import type { GrievanceDirectoryData, VerificationStatus } from "@/types/grievanceDirectory";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const dynamic = "force-dynamic";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "APP";
}

function mapVerificationStatus(status?: string): VerificationStatus {
  if (status === "VERIFIED") return "verified_public_details";
  if (status === "PARTIALLY_VERIFIED") return "partially_verified";
  if (status === "CONFLICTING_INFORMATION") return "conflicting_information";
  if (status === "UNDER_VERIFICATION" || status === "NEEDS_MANUAL_REVIEW") return "under_verification";
  return "user_submitted";
}

function mapAppToContact(app: ApiLoanApp): GrievanceDirectoryData["contacts"][number] {
  const slug = app.slug ?? app.id;
  return {
    id: app.id,
    appName: app.name,
    logoUrl: app.logoUrl ?? `https://dummyimage.com/72x72/e2e8f0/0f172a.png&text=${encodeURIComponent(initials(app.name))}`,
    companyName: app.companyName ?? "Company details under verification",
    developerName: app.developerName ?? "Developer details under verification",
    claimedNbfcPartner: app.claimedNbfcPartner ?? "",
    grievanceEmail: app.grievanceEmail ?? "",
    supportEmail: app.supportEmail ?? "",
    supportPhone: app.supportPhone ?? "",
    officialWebsite: app.websiteUrl ?? "",
    verificationStatus: mapVerificationStatus(app.verificationStatus),
    lastVerifiedAt: String(app.updatedAt ?? "").slice(0, 10) || "Not verified",
    profileUrl: `/loan-apps/${slug}`,
  };
}

async function getGrievanceDirectory(): Promise<GrievanceDirectoryData> {
  const response = await fetch(`${API_BASE_URL}/api/apps?limit=100`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not load loan apps for grievance directory.");
  }
  const apps = (await response.json()) as PaginatedResponse<ApiLoanApp>;

  return {
    search: { query: "" },
    filters: {
      verificationStatus: [],
      claimedNbfcPartner: "",
      missingDetailsOnly: false,
    },
    contacts: apps.items.map(mapAppToContact),
  };
}

export default async function Page() {
  const data = await getGrievanceDirectory();
  return <GrievanceContactDirectoryPage data={data} />;
}
