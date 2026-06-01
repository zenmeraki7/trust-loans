import { NextResponse } from "next/server";
import { addHelpfulVote } from "@/lib/api/reviewsStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: Params) {
  const { id } = await params;
  const updated = addHelpfulVote(id);
  if (!updated) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Helpful vote recorded", review: updated });
}

