import { NextResponse } from "next/server";
import { createUploadUrl } from "@/lib/api/evidenceStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.fileName || !body?.fileType || !body?.mimeType || !body?.linkedItem || !body?.appOrEntityName) {
    return NextResponse.json(
      { error: "fileName, fileType, mimeType, linkedItem, and appOrEntityName are required" },
      { status: 400 },
    );
  }

  const upload = createUploadUrl({
    fileName: String(body.fileName),
    fileType: body.fileType,
    mimeType: String(body.mimeType),
    linkedItem: body.linkedItem,
    appOrEntityName: String(body.appOrEntityName),
    uploaderDisplayNameMasked: body.uploaderDisplayNameMasked,
    uploaderEmailMasked: body.uploaderEmailMasked,
  });

  return NextResponse.json(upload, { status: 201 });
}

