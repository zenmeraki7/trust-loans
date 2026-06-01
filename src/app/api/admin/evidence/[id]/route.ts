import { NextResponse } from "next/server";
import { getAdminEvidence } from "@/lib/api/evidenceStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const evidence = getAdminEvidence(id);
  if (!evidence) {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  return NextResponse.json(evidence);
}

