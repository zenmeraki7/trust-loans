import { NextResponse } from "next/server";
import { verifyAdminEntity } from "@/lib/api/entitiesStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.verificationStatus;

  const updated = verifyAdminEntity(id, status);
  if (!updated) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Entity verification updated",
    entity: updated,
  });
}

