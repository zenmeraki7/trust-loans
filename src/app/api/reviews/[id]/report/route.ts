import { NextResponse } from "next/server";
import { reportReview } from "@/lib/api/reviewsStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const reason = body?.reason ? String(body.reason) : "user_reported";

  const updated = reportReview(id, reason);
  if (!updated) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Review report submitted", review: updated });
}

