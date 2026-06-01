import { NextResponse } from "next/server";
import { getEvidenceMetadata } from "@/lib/api/evidenceStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const metadata = getEvidenceMetadata(id);
  if (!metadata) {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  return NextResponse.json(metadata);
}

