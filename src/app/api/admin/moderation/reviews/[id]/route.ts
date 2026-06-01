import { NextResponse } from "next/server";
import { findReviewById } from "@/lib/api/reviewsStore";

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

