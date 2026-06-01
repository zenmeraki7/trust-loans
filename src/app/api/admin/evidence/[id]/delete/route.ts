import { NextResponse } from "next/server";
import { hardDeleteEvidence } from "@/lib/api/evidenceStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const evidence = hardDeleteEvidence(id, body?.reason ? String(body.reason) : "Admin deletion");

  if (!evidence) {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Evidence marked deleted", evidence });
}

