import { NextResponse } from "next/server";
import { findAppBySlug } from "@/lib/api/loanAppsStore";

type Params = {
  params: Promise<{ app: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { app: slug } = await params;
  const record = findAppBySlug(slug);
  if (!record) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  return NextResponse.json(record);
}

