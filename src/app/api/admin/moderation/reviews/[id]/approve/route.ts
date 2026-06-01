import { NextResponse } from "next/server";
import { approveReview } from "@/lib/api/reviewsStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: Params) {
  const { id } = await params;
  const updated = approveReview(id);
  if (!updated) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Review approved", review: updated });
}

