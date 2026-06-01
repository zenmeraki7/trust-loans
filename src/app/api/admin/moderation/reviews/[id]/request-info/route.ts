import { NextResponse } from "next/server";
import { requestInfoReview } from "@/lib/api/reviewsStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const note = body?.note ? String(body.note) : undefined;

  const updated = requestInfoReview(id, note);
  if (!updated) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "More information requested", review: updated });
}

