import { NextResponse } from "next/server";
import { listTemplates } from "@/lib/api/templatesStore";

export async function GET() {
  const items = listTemplates();
  return NextResponse.json({ items, count: items.length });
}

