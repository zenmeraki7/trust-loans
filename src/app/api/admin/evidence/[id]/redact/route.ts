import { NextResponse } from "next/server";
import { redactEvidence } from "@/lib/api/evidenceStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const evidence = redactEvidence(id, Array.isArray(body?.reasons) ? body.reasons : []);

  if (!evidence) {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Evidence redaction recorded", evidence });
}

