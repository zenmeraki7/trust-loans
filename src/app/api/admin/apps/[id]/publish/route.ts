import { NextResponse } from "next/server";
import { publishAdminApp } from "@/lib/api/loanAppsStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: Params) {
  const { id } = await params;
  const updated = publishAdminApp(id);
  if (!updated) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: "App published",
    app: updated,
  });
}

