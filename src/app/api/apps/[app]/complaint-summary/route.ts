import { NextResponse } from "next/server";
import { getComplaintSummary } from "@/lib/api/loanAppsStore";

type Params = {
  params: Promise<{ app: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { app: id } = await params;
  const summary = getComplaintSummary(id);
  if (!summary) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  return NextResponse.json(summary);
}

