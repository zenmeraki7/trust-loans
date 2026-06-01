import { NextResponse } from "next/server";
import { findAppById, updateAdminApp } from "@/lib/api/loanAppsStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const existing = findAppById(id);
  if (!existing) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  const patch = await req.json().catch(() => null);
  if (!patch || typeof patch !== "object") {
    return NextResponse.json({ error: "Invalid patch payload" }, { status: 400 });
  }

  const updated = updateAdminApp(id, patch);
  return NextResponse.json(updated);
}

