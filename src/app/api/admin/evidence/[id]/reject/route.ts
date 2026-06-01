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
    "rejected_for_safety",
    body?.reason ? String(body.reason) : "Rejected for privacy or safety reasons",
    "Rejected evidence",
  );

  if (!evidence) {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Evidence rejected for safety", evidence });
}

