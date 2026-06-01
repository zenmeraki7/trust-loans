import { NextResponse } from "next/server";
import { completeEvidenceUpload } from "@/lib/api/evidenceStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.evidenceId) {
    return NextResponse.json({ error: "evidenceId is required" }, { status: 400 });
  }

  const metadata = completeEvidenceUpload(
    String(body.evidenceId),
    Number(body.fileSizeBytes ?? 0),
    Array.isArray(body.sensitiveDataFlags) ? body.sensitiveDataFlags : [],
  );

  if (!metadata) {
    return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Evidence upload completed",
    metadata,
  });
}

