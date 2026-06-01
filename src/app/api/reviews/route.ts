import { NextResponse } from "next/server";
import { createReview, listReviews } from "@/lib/api/reviewsStore";
import type { ReviewSubmission } from "@/types/reviewSubmission";

export async function GET() {
  const items = listReviews();
  return NextResponse.json({ items, count: items.length });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as ReviewSubmission | null;
  if (!body?.appId || !body?.title || !body?.body) {
    return NextResponse.json({ error: "appId, title, and body are required" }, { status: 400 });
  }

  const review = createReview(body);
  return NextResponse.json(
    {
      message: "Review submitted and sent for moderation",
      review,
    },
    { status: 201 },
  );
}

