import { NextResponse } from "next/server";
import { findEntityBySlug } from "@/lib/api/entitiesStore";

type Params = {
  params: Promise<{ entity: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { entity: slug } = await params;
  const record = findEntityBySlug(slug);
  if (!record) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}

