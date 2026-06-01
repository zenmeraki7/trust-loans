import { NextResponse } from "next/server";
import { deleteEvidenceByUser } from "@/lib/api/evidenceStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const metadata = deleteEvidenceByUser(id);
  if (!metadata) {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Evidence scheduled for deletion",
    metadata,
  });
}

