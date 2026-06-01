import { NextResponse } from "next/server";
import { listEntityLinkedApps } from "@/lib/api/entitiesStore";

type Params = {
  params: Promise<{ entity: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { entity: id } = await params;
  const linkedApps = listEntityLinkedApps(id);
  if (!linkedApps) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  return NextResponse.json({
    entityId: id,
    count: linkedApps.length,
    items: linkedApps,
  });
}

