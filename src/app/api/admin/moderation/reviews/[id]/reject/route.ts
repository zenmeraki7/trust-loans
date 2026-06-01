import { NextResponse } from "next/server";
import { rejectReview } from "@/lib/api/reviewsStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const reason = body?.reason ? String(body.reason) : undefined;

  const updated = rejectReview(id, reason);
  if (!updated) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Review rejected", review: updated });
}

