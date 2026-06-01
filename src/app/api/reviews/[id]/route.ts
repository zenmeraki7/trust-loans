import { NextResponse } from "next/server";
import { deleteReview, findReviewById, updateReview } from "@/lib/api/reviewsStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const review = findReviewById(id);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  return NextResponse.json(review);
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const existing = findReviewById(id);
  if (!existing) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const patch = await req.json().catch(() => null);
  if (!patch || typeof patch !== "object") {
    return NextResponse.json({ error: "Invalid patch payload" }, { status: 400 });
  }

  const updated = updateReview(id, patch);
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const ok = deleteReview(id);
  if (!ok) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Review deleted" });
}

