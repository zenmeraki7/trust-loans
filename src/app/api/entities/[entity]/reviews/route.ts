import { NextResponse } from "next/server";
import { listEntityReviews } from "@/lib/api/entitiesStore";

type Params = {
  params: Promise<{ entity: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { entity: id } = await params;
  const reviews = listEntityReviews(id);
  if (!reviews) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  return NextResponse.json({
    entityId: id,
    count: reviews.length,
    reviews,
  });
}

