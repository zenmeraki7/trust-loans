import { NextResponse } from "next/server";
import { mergeAdminApps } from "@/lib/api/loanAppsStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const targetId = body?.targetId;

  if (!targetId || typeof targetId !== "string") {
    return NextResponse.json({ error: "targetId is required" }, { status: 400 });
  }

  try {
    const result = mergeAdminApps(id, targetId);
    if (!result) {
      return NextResponse.json({ error: "Source or target app not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Apps merged",
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Merge failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

