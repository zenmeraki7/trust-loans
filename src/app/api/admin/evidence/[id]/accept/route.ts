import { NextResponse } from "next/server";
import { updateEvidenceDecision } from "@/lib/api/evidenceStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const evidence = updateEvidenceDecision(
    id,
    "accepted_for_verification",
    body?.reason ? String(body.reason) : "Accepted for private verification",
    "Accepted evidence",
  );

  if (!evidence) {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Evidence accepted for private verification", evidence });
}

