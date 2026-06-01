import { NextResponse } from "next/server";
import { createEntityCorrection, findEntityById } from "@/lib/api/entitiesStore";

type Params = {
  params: Promise<{ entity: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { entity: id } = await params;
  const entity = findEntityById(id);
  if (!entity) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.issueType || !body?.note) {
    return NextResponse.json({ error: "issueType and note are required" }, { status: 400 });
  }

  const correction = createEntityCorrection(id, {
    issueType: String(body.issueType),
    note: String(body.note),
    sourceUrl: body.sourceUrl ? String(body.sourceUrl) : undefined,
  });

  return NextResponse.json(
    {
      message: "Correction request submitted",
      correction,
    },
    { status: 201 },
  );
}

