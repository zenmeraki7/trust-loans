import { NextResponse } from "next/server";
import { linkAppToEntity } from "@/lib/api/entitiesStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);

  if (!body?.appId || !body?.relationshipType) {
    return NextResponse.json({ error: "appId and relationshipType are required" }, { status: 400 });
  }

  try {
    const updated = linkAppToEntity(id, {
      appId: String(body.appId),
      relationshipType: body.relationshipType,
      relationshipVerificationStatus: body.relationshipVerificationStatus,
    });

    if (!updated) {
      return NextResponse.json({ error: "Entity not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "App linked to entity",
      entity: updated,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to link app";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

