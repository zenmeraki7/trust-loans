import { NextResponse } from "next/server";
import { listEvidence } from "@/lib/api/evidenceStore";

export async function GET() {
  const items = listEvidence();
  return NextResponse.json({ items, count: items.length });
}

