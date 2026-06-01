import { NextResponse } from "next/server";
import { findEntityById, updateAdminEntity } from "@/lib/api/entitiesStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const existing = findEntityById(id);
  if (!existing) {
    return NextResponse.json({ error: "Entity not found" }, { status: 404 });
  }

  const patch = await req.json().catch(() => null);
  if (!patch || typeof patch !== "object") {
    return NextResponse.json({ error: "Invalid patch payload" }, { status: 400 });
  }

  const updated = updateAdminEntity(id, patch);
  return NextResponse.json(updated);
}

