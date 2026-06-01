import { NextResponse } from "next/server";
import { secureOpenEvidence } from "@/lib/api/evidenceStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const preview = secureOpenEvidence(id, body?.accessReason ? String(body.accessReason) : "Moderator secure preview");

  if (!preview) {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  return NextResponse.json(preview);
}

