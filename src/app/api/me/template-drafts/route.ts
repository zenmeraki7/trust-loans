import { NextResponse } from "next/server";
import { listMyTemplateDrafts } from "@/lib/api/templatesStore";

export async function GET() {
  const items = listMyTemplateDrafts();
  return NextResponse.json({ items, count: items.length });
}

