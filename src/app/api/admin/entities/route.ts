import { NextResponse } from "next/server";
import { createAdminEntity, listEntities } from "@/lib/api/entitiesStore";

export async function GET() {
  const items = listEntities();
  return NextResponse.json({ items, count: items.length });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.slug || !body?.displayName) {
    return NextResponse.json({ error: "name, slug, and displayName are required" }, { status: 400 });
  }

  try {
    const entity = createAdminEntity({
      id: body.id,
      slug: String(body.slug),
      name: String(body.name),
      displayName: String(body.displayName),
      entityType: body.entityType ?? "unknown",
      verificationStatus: body.verificationStatus ?? "under_verification",
      riskSignalLevel: body.riskSignalLevel ?? "medium",
      averageLinkedAppTrustScore: Number(body.averageLinkedAppTrustScore ?? 0),
      totalLinkedApps: Number(body.totalLinkedApps ?? 0),
      totalReviewsAcrossApps: Number(body.totalReviewsAcrossApps ?? 0),
      details: body.details ?? {
        legalName: "",
        website: "",
        supportEmail: "",
        supportPhone: "",
        registeredAddress: "",
        registrationNumber: "",
        rbiRegistrationClaim: "",
        sourceUrls: [],
        lastVerifiedAt: "",
        verificationConfidence: "low",
      },
      grievance: body.grievance ?? {
        officerName: "",
        email: "",
        phone: "",
        address: "",
        sourceUrl: "",
        lastVerifiedAt: "",
      },
      linkedApps: Array.isArray(body.linkedApps) ? body.linkedApps : [],
      relationshipEvidence: Array.isArray(body.relationshipEvidence) ? body.relationshipEvidence : [],
      complaintPatterns: body.complaintPatterns ?? {
        totalReviews: 0,
        harassmentPercent: 0,
        hiddenChargesPercent: 0,
        contactListAbusePercent: 0,
        dataMisusePercent: 0,
        fakeLegalNoticePercent: 0,
        paymentNotUpdatedPercent: 0,
        loanNotClosedPercent: 0,
        positiveReviewPercent: 0,
      },
      riskDistribution: body.riskDistribution ?? { low: 0, medium: 0, high: 0, severe: 0, underReview: 0 },
      officialResponses: Array.isArray(body.officialResponses) ? body.officialResponses : [],
      relatedEntities: Array.isArray(body.relatedEntities) ? body.relatedEntities : [],
      mentionedReviews: Array.isArray(body.mentionedReviews) ? body.mentionedReviews : [],
      faq: Array.isArray(body.faq) ? body.faq : [],
    });

    return NextResponse.json(entity, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create entity";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

