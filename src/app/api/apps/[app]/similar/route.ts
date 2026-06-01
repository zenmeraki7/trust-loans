import { NextResponse } from "next/server";
import { findAppById, listSimilarApps } from "@/lib/api/loanAppsStore";

type Params = {
  params: Promise<{ app: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { app: id } = await params;
  const app = findAppById(id);
  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  const similar = listSimilarApps(id);
  return NextResponse.json({
    appId: id,
    count: similar.length,
    items: similar,
  });
}

