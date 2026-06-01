import { NextResponse } from "next/server";
import { createAdminApp, listApps } from "@/lib/api/loanAppsStore";

export async function GET() {
  return NextResponse.json({
    items: listApps(),
    count: listApps().length,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  try {
    const app = createAdminApp({
      id: body.id,
      name: body.name,
      logoUrl: body.logoUrl ?? "https://dummyimage.com/96x96/111827/ffffff.png&text=APP",
      developerName: body.developerName ?? "Under verification",
      companyName: body.companyName ?? "Under verification",
      claimedNbfcPartner: body.claimedNbfcPartner ?? "Under verification",
      trustScore: Number(body.trustScore ?? 0),
      riskLevel: body.riskLevel ?? "medium",
      status: body.status ?? "under_review",
      topComplaintTags: Array.isArray(body.topComplaintTags) ? body.topComplaintTags : [],
      summary: body.summary ?? "Public details are under verification.",
      platform: Array.isArray(body.platform) ? body.platform : ["android"],
      lastUpdated: body.lastUpdated ?? new Date().toISOString().slice(0, 10),
      complaintCounts: body.complaintCounts ?? { harassment: 0, hiddenCharges: 0, dataPrivacy: 0 },
      grievanceDetailsAvailable: Boolean(body.grievanceDetailsAvailable),
      grievanceDetails: body.grievanceDetails ?? {
        grievanceEmail: "",
        supportEmail: "",
        supportPhone: "",
        website: "",
      },
      appStore: body.appStore ?? {
        playStoreUrl: "",
        appStoreUrl: "",
      },
      lifecycleStatus: body.lifecycleStatus,
      reviewCount: Number(body.reviewCount ?? 0),
      averageRating: Number(body.averageRating ?? 0),
    });

    return NextResponse.json(app, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create app";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

