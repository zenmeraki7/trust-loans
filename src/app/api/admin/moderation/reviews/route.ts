import { NextResponse } from "next/server";
import { listModerationQueue } from "@/lib/api/reviewsStore";

export async function GET() {
  const items = listModerationQueue();
  return NextResponse.json({ items, count: items.length });
}

