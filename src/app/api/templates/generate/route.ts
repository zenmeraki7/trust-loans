import { NextResponse } from "next/server";
import { generateTemplateDraft } from "@/lib/api/templatesStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.templateId) {
    return NextResponse.json({ error: "templateId is required" }, { status: 400 });
  }

  const draft = generateTemplateDraft({
    templateId: String(body.templateId),
    outputType: body.outputType,
    fields: body.fields,
  });

  if (!draft) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Complaint draft generated",
    draft,
  });
}

